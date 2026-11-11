/**
 * SEO audit — walks every URL in the sitemap and checks the on-page contract.
 *
 *   npm run test:seo            # against http://localhost:3200
 *   BASE_URL=https://… npm run test:seo
 *
 * Rules follow the claude-seo checklist: one canonical per page, unique and
 * human-length titles, descriptions that read like copy, complete social cards,
 * a single H1, parseable JSON-LD, and no indexable private routes.
 */

export {}; // module scope: keeps this file's helpers out of the global script namespace

const BASE = (process.env.BASE_URL ?? 'http://localhost:3200').replace(/\/$/, '');

type Check = { path: string; name: string; ok: boolean; detail: string };

const checks: Check[] = [];

/**
 * Checks are collected per page and merged at the end: pages are audited with
 * bounded concurrency, so a shared "current page" variable would attribute one
 * page's failures to another.
 */
function collector(path: string, sink: Check[]) {
  return (name: string, ok: boolean, detail = '') => sink.push({ path, name, ok, detail });
}

function attr(html: string, tag: string, key: string, value: string): string | null {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) ?? [];
  for (const t of tags) {
    if (new RegExp(`${key}\\s*=\\s*["']${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(t)) {
      const content = t.match(/content\s*=\s*"([^"]*)"/i) ?? t.match(/content\s*=\s*'([^']*)'/i);
      if (content) return decode(content[1]);
    }
  }
  return null;
}

function decode(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function textOf(html: string, tag: string): string | null {
  const m = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? decode(m[1].replace(/<[^>]+>/g, '')) : null;
}

const imageProbes = new Map<string, Promise<{ ok: boolean; type: string }>>();

/** Social cards are worthless if the image URL 404s; probe each once. */
function probeImage(url: string) {
  if (!imageProbes.has(url)) {
    // og:image is absolute against the production domain; probe the same path here.
    const local = `${BASE}${url.replace(/^https?:\/\/[^/]+/, '')}`;
    imageProbes.set(
      url,
      fetch(local, { redirect: 'follow' })
        .then((res) => ({ ok: res.status === 200, type: res.headers.get('content-type') ?? '' }))
        .catch(() => ({ ok: false, type: 'fetch failed' })),
    );
  }
  return imageProbes.get(url)!;
}

async function auditPage(path: string, titles: Map<string, string>, descriptions: Map<string, string>) {
  const pageChecks: Check[] = [];
  const check = collector(path, pageChecks);
  const finish = () => checks.push(...pageChecks);

  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  const type = res.headers.get('content-type') ?? '';
  const html = await res.text();

  check('status 200', res.status === 200, `HTTP ${res.status}`);
  if (res.status !== 200) return finish();
  check('html content type', type.includes('text/html'), type);

  const title = textOf(html, 'title');
  const desc = attr(html, 'meta', 'name', 'description');
  const canonical = (html.match(/<link\b[^>]*rel="canonical"[^>]*>/i) ?? [])[0]?.match(/href="([^"]+)"/i)?.[1] ?? null;
  const ogTitle = attr(html, 'meta', 'property', 'og:title');
  const ogDesc = attr(html, 'meta', 'property', 'og:description');
  const ogImage = attr(html, 'meta', 'property', 'og:image');
  const twitter = attr(html, 'meta', 'name', 'twitter:card');
  const robots = attr(html, 'meta', 'name', 'robots');
  const h1s = (html.match(/<h1\b/gi) ?? []).length;
  const jsonLd = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

  check('title present', Boolean(title), title ?? '');
  check('title length 15–70', Boolean(title) && title!.length >= 15 && title!.length <= 70, `${title?.length ?? 0} chars`);
  check('title unique', Boolean(title) && !titles.has(title!), titles.get(title!));

  check('description present', Boolean(desc), desc ?? '');
  check('description 70–165 chars', Boolean(desc) && desc!.length >= 70 && desc!.length <= 165, `${desc?.length ?? 0} chars`);
  check('description unique', Boolean(desc) && !descriptions.has(desc!), descriptions.get(desc!));

  check('canonical absolute', Boolean(canonical) && canonical!.startsWith('https://'), canonical ?? 'missing');
  if (canonical) {
    const canonicalPath = canonical.replace(/^https:\/\/[^/]+/, '').replace(/\/$/, '') || '/';
    const expected = path.replace(/\/$/, '') || '/';
    check('canonical matches page', canonicalPath === expected, `${canonicalPath} vs ${expected}`);
  }

  check('og:title', Boolean(ogTitle), ogTitle ?? '');
  check('og:description', Boolean(ogDesc), ogDesc ?? '');
  check('og:image', Boolean(ogImage) && /^https:\/\//.test(ogImage!), ogImage ?? '');
  if (ogImage) {
    const probe = await probeImage(ogImage);
    check('og:image resolves', probe.ok && probe.type.startsWith('image/'), `${probe.type || 'no content-type'}`);
  }
  check('twitter card', twitter === 'summary_large_image', twitter ?? '');

  check('indexable', !/noindex/i.test(robots ?? ''), robots ?? 'no robots meta');
  check('single h1', h1s === 1, `${h1s} h1 elements`);

  check('has JSON-LD', jsonLd.length > 0, `${jsonLd.length} blocks`);
  for (const [i, block] of jsonLd.entries()) {
    try {
      JSON.parse(block);
      check(`JSON-LD block ${i + 1} parses`, true);
    } catch (error) {
      check(`JSON-LD block ${i + 1} parses`, false, (error as Error).message);
    }
  }

  if (title) titles.set(title, path);
  if (desc) descriptions.set(desc, path);
  finish();
}

async function main() {
  console.log(`\nKOYO Health SEO audit → ${BASE}\n`);

  const robots = await fetch(`${BASE}/robots.txt`);
  const robotsTxt = await robots.text();
  const siteCheck = collector('/robots.txt', checks);
  siteCheck('robots.txt served', robots.status === 200);
  siteCheck('robots declares sitemap', /Sitemap:\s*https:\/\//i.test(robotsTxt));
  siteCheck('robots hides dashboard', /Disallow:\s*\/dashboard/i.test(robotsTxt));

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  const sitemap = await sitemapRes.text();
  const mapCheck = collector('/sitemap.xml', checks);
  mapCheck('sitemap served', sitemapRes.status === 200);
  mapCheck('sitemap is XML', sitemapRes.headers.get('content-type')?.includes('xml') ?? false);

  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  mapCheck('sitemap has 100+ urls', urls.length >= 100, `${urls.length} urls`);
  mapCheck('sitemap excludes private routes', !urls.some((u) => /\/(dashboard|api|login)(\/|$)/.test(u)));

  const paths = urls
    .map((u) => u.replace(/^https:\/\/[^/]+/, ''))
    .map((p) => (p === '' ? '/' : p))
    .filter((p) => !/\.(xml|txt|webmanifest|svg|png|jpg)$/.test(p));

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  // Bounded concurrency keeps the audit fast without hammering a dev machine.
  const queue = [...paths];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const path = queue.shift();
      if (path) await auditPage(path, titles, descriptions);
    }
  });
  await Promise.all(workers);

  const failures = checks.filter((c) => !c.ok);
  if (failures.length) {
    console.log(`${failures.length} failing checks:\n`);
    for (const f of failures.slice(0, 500)) console.log(`FAIL  ${f.path} — ${f.name}${f.detail ? ` (${f.detail})` : ''}`);
  }

  console.log(`\n${checks.length - failures.length}/${checks.length} checks passed across ${paths.length} pages.`);
  if (failures.length) {
    console.error('\nSEO audit failed.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('SEO audit crashed:', error);
  process.exit(1);
});
