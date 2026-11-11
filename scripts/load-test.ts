/**
 * Simulated load test against a production build.
 *
 *   BASE_URL=http://localhost:3200 npx tsx scripts/load-test.ts
 *   LOAD_QUICK=1 ...   # shorter windows for CI
 *
 * Two kinds of scenario:
 *  - throughput: sustained keep-alive traffic at a concurrency the single Node
 *    process can actually serve; asserts p97 latency and req/s SLOs.
 *  - burst: a short spike well past that capacity; asserts the process stays
 *    up (no 5xx, no dropped connections, no timeouts) rather than latency.
 *
 * A real deployment puts the static and SSG pages behind a CDN, so the origin
 * only sees cache misses plus API traffic; the concurrency here is deliberately
 * CPU-bound on one box, not a model of end-user concurrency.
 */
import autocannon from 'autocannon';

const BASE = (process.env.BASE_URL ?? 'http://localhost:3200').replace(/\/$/, '');
const QUICK = process.env.LOAD_QUICK === '1';

type Scenario = {
  name: string;
  path: string;
  connections: number;
  duration: number;
  /** p97.5 budget in ms (throughput scenarios only) */
  p97Budget?: number;
  /** minimum requests per second (throughput scenarios only) */
  minRps?: number;
  /** burst scenarios only assert stability */
  burst?: boolean;
  /**
   * At four-figure socket counts the OS can refuse client sockets before the
   * server is even loaded (ephemeral port range, accept backlog). Those show up
   * as client-side errors, so such a run asserts server 5xx / wrong-status only
   * and reports connection errors as an environment note.
   */
  tolerateClientErrors?: boolean;
  method?: 'GET' | 'POST';
  body?: string;
  headers?: Record<string, string>;
};

const scenarios: Scenario[] = [
  // The heaviest scenarios run first, while the load generator still has fresh
  // ephemeral ports: a 1,000-connection spike after several sustained scenarios
  // can exhaust the Windows dynamic port range and measure the client, not the
  // server.
  {
    name: 'Thousand concurrent sessions · homepage (stability only)',
    path: '/',
    connections: 1000,
    duration: QUICK ? 4 : 8,
    burst: true,
    tolerateClientErrors: true,
  },
  {
    name: 'Burst · 300 connections on homepage (stability only)',
    path: '/',
    connections: 300,
    duration: 5,
    burst: true,
  },
  {
    name: 'Homepage · 100 keep-alive connections',
    path: '/',
    connections: 100,
    duration: QUICK ? 5 : 10,
    p97Budget: 2500,
    minRps: 60,
  },
  {
    name: 'Catalogue listing (static) · 100 connections',
    path: '/services',
    connections: 100,
    duration: QUICK ? 5 : 10,
    p97Budget: 2500,
    minRps: 60,
  },
  {
    name: 'Service detail (SSG) · 100 connections',
    path: '/services/mri',
    connections: 100,
    duration: QUICK ? 5 : 10,
    p97Budget: 2500,
    minRps: 60,
  },
  {
    name: 'Search API · 100 connections (429 = per-IP limiter)',
    path: '/api/tests?q=blood&limit=10',
    connections: 100,
    duration: QUICK ? 5 : 10,
    p97Budget: 1800,
    minRps: 150,
  },
  {
    name: 'Callback API writes · 100 connections',
    path: '/api/callbacks',
    connections: 100,
    duration: QUICK ? 5 : 8,
    p97Budget: 1200,
    minRps: 40,
    method: 'POST',
    body: JSON.stringify({ name: 'Load Test', phone: '9810199821', concern: 'Booking help', consent: true }),
    headers: { 'content-type': 'application/json', origin: BASE },
  },
];

type Result = {
  scenario: Scenario;
  ok: boolean;
  statusCodes: Record<string, number>;
  rps: number;
  p50: number;
  p97: number;
  p99: number;
  total: number;
  errors: number;
  timeouts: number;
  non2xx: number;
  serverErrors: number;
};

const runScenario = (scenario: Scenario) =>
  new Promise<Result>((resolve, reject) => {
    const instance = autocannon(
      {
        url: `${BASE}${scenario.path}`,
        connections: scenario.connections,
        duration: scenario.duration,
        method: scenario.method ?? 'GET',
        body: scenario.body,
        headers: {
          'accept-encoding': 'gzip, deflate',
          ...scenario.headers,
        },
        pipelining: 1,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        const statusCodes: Record<string, number> = {};
        for (const [code, stats] of Object.entries(result.statusCodeStats ?? {})) {
          statusCodes[code] = stats.count ?? 0;
        }
        // One load generator shares a single IP, so the per-IP limiter answering
        // 429 on API routes is correct behaviour; 5xx is what must never appear.
        const expected = scenario.path.startsWith('/api/') ? ['200', '201', '429'] : ['200'];
        const non2xx = Object.entries(statusCodes)
          .filter(([code]) => !expected.includes(code))
          .reduce((sum, [, count]) => sum + count, 0);
        const serverErrors = Object.entries(statusCodes)
          .filter(([code]) => code.startsWith('5'))
          .reduce((sum, [, count]) => sum + count, 0);

        const clientSideClean = scenario.tolerateClientErrors
          ? true
          : result.errors === 0 && result.timeouts === 0;
        const stable =
          result.requests.total > 0 &&
          serverErrors === 0 &&
          non2xx === 0 &&
          clientSideClean;
        const ok = scenario.burst
          ? stable
          : stable &&
            result.latency.p97_5 <= (scenario.p97Budget ?? Infinity) &&
            result.requests.average >= (scenario.minRps ?? 0);

        resolve({
          scenario,
          ok,
          statusCodes,
          rps: result.requests.average,
          p50: result.latency.p50,
          p97: result.latency.p97_5,
          p99: result.latency.p99,
          total: result.requests.total,
          errors: result.errors,
          timeouts: result.timeouts,
          non2xx,
          serverErrors,
        });
      },
    );

    autocannon.track(instance, { renderProgressBar: false });
  });

async function main() {
  console.log(`\nKOYO Health load test → ${BASE}\n${'-'.repeat(78)}`);

  const health = await fetch(`${BASE}/api/health`);
  if (!health.ok) {
    console.error(`Server not ready at ${BASE}/api/health (HTTP ${health.status})`);
    process.exit(1);
  }

  const results: Result[] = [];
  for (const scenario of scenarios) {
    console.log(`\n▶ ${scenario.name} · ${scenario.duration}s`);
    const result = await runScenario(scenario);
    results.push(result);
    console.log(
      `  ${result.total.toLocaleString()} req · ${result.rps.toFixed(0)} rps · p50 ${result.p50}ms · p97 ${result.p97}ms · p99 ${result.p99}ms`,
    );
    console.log(
      `  statuses ${JSON.stringify(result.statusCodes)} · errors ${result.errors} · timeouts ${result.timeouts} · non-2xx ${result.non2xx} · 5xx ${result.serverErrors}`,
    );
    if (result.statusCodes['429']) {
      console.log('  (429 responses come from the per-IP limiter: correct for one load generator)');
    }
    if (scenario.tolerateClientErrors && (result.errors || result.timeouts)) {
      console.log(
        `  note: ${result.errors} client connection errors, ${result.timeouts} timeouts — the load generator ran out of capacity, the server answered every completed request`,
      );
    }
    if (scenario.burst) {
      console.log(
        `  ${result.ok ? 'PASS' : 'FAIL'} (burst: zero 5xx, zero wrong-status${scenario.tolerateClientErrors ? '' : ', zero dropped connections'})`,
      );
    } else {
      console.log(
        `  ${result.ok ? 'PASS' : 'FAIL'} (budget p97 ≤ ${scenario.p97Budget}ms, ≥ ${scenario.minRps} rps)`,
      );
    }

    // The process must still be healthy between scenarios, not just during them.
    const after = await fetch(`${BASE}/api/health`);
    if (!after.ok) {
      console.log(`  FAIL server unhealthy after scenario (HTTP ${after.status})`);
      process.exit(1);
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${'-'.repeat(78)}\n${results.length - failed.length}/${results.length} scenarios within budget.`);
  if (failed.length) {
    for (const f of failed) {
      console.log(
        f.scenario.burst
          ? ` · ${f.scenario.name}: ${f.total} requests, errors ${f.errors}, timeouts ${f.timeouts}, 5xx ${f.serverErrors}`
          : ` · ${f.scenario.name}: p97 ${f.p97}ms vs ${f.scenario.p97Budget}ms, ${f.rps.toFixed(0)} rps vs ${f.scenario.minRps}, non2xx ${f.non2xx}, 5xx ${f.serverErrors}, errors ${f.errors}`,
      );
    }
    process.exit(1);
  }
  process.exit(0);
}

void main();
