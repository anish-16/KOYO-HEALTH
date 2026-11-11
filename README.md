# KOYO Health

A production-grade diagnostic-services platform — a full structural and workflow named as **KOYO Health**. Every module is populated with realistic dummy data: Test categories, Individual tests,Health packages, Cities, Accredited dummy centres, Doctors, FAQs, Articles and Blogs, Reviews, Membership tiers and a Complete patient dashboard.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript, static + SSG + dynamic routes)
- **Tailwind CSS** with a custom design system in `src/app/globals.css` and `tailwind.config.ts`
- **Motion** (`motion/react`) for entrance and layout animations, with `useReducedMotion` respected
- **lucide-react** icons, **zod** validation
- Self-hosted JSON store (`src/lib/server/store.ts`, `.data/`) with in-memory fallback for read-only filesystems

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Demo login: any valid Indian mobile number, e.g. `98101 24477`. The OTP is returned in the UI (`482913` by default) because no SMS gateway is wired; set `KOYO_DEMO_OTP_DISABLED=1` and provide a provider to disable that.

## Routes

| Area | Paths |
| --- | --- |
| Marketing | `/`, `/services`, `/services/[slug]`, `/packages`, `/packages/[slug]`, `/cities`, `/cities/[slug]`, `/doctors/[id]` |
| Content | `/blogs`, `/blogs/[slug]`, `/reviews`, `/faqs`, `/about-us`, `/careers`, `/corporate-wellness`, `/partner`, `/contact`, `/membership`, `/legal/[slug]` |
| Commerce | `/book` (5-step booking flow), `/login` |
| Patient dashboard | `/dashboard`, `/bookings`, `/reports`, `/reports/[id]`, `/family`, `/wallet`, `/membership`, `/notifications`, `/settings` |
| SEO | `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/icon.svg`, `/sitemap` |
| API | `/api/tests`, `/api/bookings`, `/api/callbacks`, `/api/subscribe`, `/api/auth/{otp,verify,me,logout}`, `/api/health` |

## Architecture notes

- **Catalogue is the source of truth for pricing.** Bookings send opaque item ids (`service/test` or `package/slug`); `src/lib/pricing.ts` resolves names and prices server-side, so a tampered client cannot change what it pays.
- **`/services` is fully static.** Search and filters run in the browser; `?q=` / `?filter=` deep links are mirrored via a Suspense-wrapped `useSearchParams` child, so in-page query navigations still work without turning the page dynamic.
- **Scan-only carts cannot choose home collection.** MRI/CT/X-ray items switch the booking flow to centre visit and disable the home option.
- **Sessions** are HMAC-signed, HttpOnly, SameSite=Lax cookies (`src/lib/server/session.ts`); `/dashboard/*` is gated in middleware.
- **Cart buttons are toggles.** "Add" and "Added" are the same control, so a second click removes the item; `aria-pressed` and the label announce the current state to screen readers.
- **Mobile layout cannot be pushed sideways.** A base rule gives template-less grids a `minmax(0, 1fr)` track, so one wide table or a nowrap timestamp cannot size an `auto` column past the viewport; wide tables sit in their own `overflow-x-auto` scrollers. Every page was measured at 390px: `scrollWidth` never exceeds the viewport.
- **Security headers** (CSP, HSTS, COOP, nosniff, frame denial) are set in `next.config.mjs`; API responses are `no-store` and `noindex`.
- **Rate limiting** is per-IP in `src/middleware.ts` (auth 20/min, bookings 15/min, public writes 6/min, other APIs 120/min). Forwarding headers are only trusted when `KOYO_TRUST_PROXY=1`, otherwise a caller could rotate `X-Forwarded-For` to bypass limits.
- **OTP lockout** is per phone number: five wrong guesses lock the code for five minutes and answer `429` until a fresh code is requested.
- **The package catalogue is 18 clinician-designed packages** taken from the clinical master sheet (`src/data/packages.ts`). Each package is declared by the tests it contains; `testCount` is the sum of those tests' NABL reporting parameters, so a package can never advertise a number its own panel does not produce. `panels` groups the tests by discipline for the detail page, which is why the included-tests table can show "CBC — 24 params" next to "ESR — 1 param".
- **Package visuals are human *and* category-specific.** `PackageArt` layers three things on one panel: a person whose subject matches the panel (a man for men's health, a woman for women's, a couple for fertility, an older adult for cancer screening, a family for the full body check), a category tone that sorts the catalogue visually, and a band with the discipline glyph, parameter count and report time. Equipment shots — a microscope, a lab bench, an empty boardroom — never appear on a card. Photographs are mapped per slug in `src/data/families.ts`; a package's subject is asserted by `tests/unit/people.test.ts`, which also proves no photograph repeats within four catalogue positions (so no two neighbouring cards in a three-column grid share a face). Photography lives in `public/images/people/` (self-hosted, so CSP stays `img-src 'self'`), declared with intrinsic dimensions. Sources are in [PHOTOGRAPHY.md](PHOTOGRAPHY.md).
- **The filter matrix is derived, not written by hand.** `src/data/families.ts` groups the 18 packages into eight families and computes each tile's count and starting price from the catalogue, so the strip, the chips and the result count always agree — the counts sum to 18, and a tap on a tile is a real filter (`/packages?family=women`). There is no separate persona list: the homepage and `/packages` headings read their category count from `familyCountWord()`, so copy cannot drift from the catalogue, and the package-count in the site description comes from `packages.length` rather than a hand-typed number.
- **The homepage hero is a live scene, not a still.** `HeroVisual` loops a sample through collection → analyser → clinician verification → report, with an animated ECG and a rotating scan sweep, and freezes on the finished state under `prefers-reduced-motion`.

## Verification

```bash
npm run typecheck      # tsc --noEmit
npm test               # 121 unit + integration + UI tests (vitest)
npm run build          # production build
npm start -- -p 3200
npm run test:security  # 39-check active audit against the running server
npm run test:seo       # 2,846 on-page SEO checks across 143 sitemap URLs
npm run test:load      # autocannon throughput + burst + 1,000-session scenarios
```

`npm run verify` chains typecheck, tests and build.

### Security audit (`scripts/security-audit.ts`)

39 checks covering headers/CSP, auth gating, forged cookies, CSRF (Origin and Sec-Fetch-Site), injection payloads, path traversal, `.env` exposure, payload limits, non-JSON bodies, 404/405 handling, stack-trace leakage, cookie flags, OTP brute-force lockout, and rate limiting. It exits non-zero on any failure, and retries payload checks once if a prior scenario drained the limiter bucket.

### Load test (`scripts/load-test.ts`)

One production-build instance, measured on an 8-thread laptop-class CPU:

| Scenario | Throughput | p97 | Failures |
| --- | --- | --- | --- |
| 1,000 concurrent sessions, homepage | 125 rps | 5.7 s | 0 |
| Burst, 300 connections, homepage | 181 rps | 1.8 s | 0 |
| Homepage, 100 connections | 185 rps | 661 ms | 0 |
| Catalogue listing, 100 connections | 273 rps | 423 ms | 0 |
| Service detail (SSG), 100 connections | 279 rps | 401 ms | 0 |
| Search API, 100 connections | 871 rps | 161 ms | 0 |
| Callback writes, 100 connections | 878 rps | 153 ms | 0 |

No 5xx, no dropped connections and no timeouts in any scenario, including 1,000 simultaneous sockets (every one of the 1,000 requests answered `200`; latency rises to ~5.7 s because a single process is queueing, not failing). The two API rows are dominated by `429`s from the per-IP limiter (6 accepted writes, 120 accepted searches), so their latency describes the throttle path plus a small sample of real work; the limiter is doing its job, and the test asserts 5xx never appears. Static and SSG pages are designed to sit behind a CDN, so production concurrency is not bounded by one Node process.

Pushing one client to 2,000 sockets on this Windows box breaks the load generator itself (ephemeral port range), which is why the committed suite stops at 1,000 and the 2,000-socket run is not a claim about the server. Beyond that, scale out: CDN for static/SSG, multiple app instances, and a shared store.

These are single-process numbers from a laptop-class box, not a promise about a specific cloud shape. They are the floor the design clears locally.

### SEO audit (`scripts/seo-audit.ts`)

Walks every URL in `sitemap.xml` and checks the on-page contract: HTTP 200, unique 15–70 character titles, 70–165 character descriptions, absolute canonicals that match the page, complete Open Graph and Twitter cards, a resolvable `og:image`, one `<h1>`, indexability, and parseable JSON-LD. It follows the claude-seo checklist (the repo itself is a Claude Code prompt pack, not a library, so the rules are encoded here as executable checks).

Current result: **3,206/3,206 checks passing across 161 pages.** This audit caught real defects: 209 failures on first run, including social cards silently dropped on 74 routes (Next replaces a parent's `openGraph` when a child defines one), blog cards pointing at a per-article image route that did not exist, descriptions up to 354 characters, and titles up to 83.

## Known limitations

- The JSON store is single-node and file-backed; use a real database for multi-instance deployments.
- The demo OTP is intentionally exposed; disable it before any public deployment.
- Analytics, payments and SMS integrations are simulated at the workflow level.
