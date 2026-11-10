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
- **Photography is a first-class part of the UI.** Packages, the packages index and the homepage lead with real people rather than illustration: every package card carries a photograph resolved from its slug/audience, package pages pair a banner with the phlebotomist who actually visits, and the audience strip (`/packages?for=Women`) turns those photographs into navigation that filters the catalogue. Images are self-hosted in `public/images/people/` (so CSP stays `img-src 'self'`), pre-cropped at their display size, declared with intrinsic dimensions, lazy-loaded below the fold, and mapped through `src/data/people.ts`. Sources and the replacement procedure are in [PHOTOGRAPHY.md](PHOTOGRAPHY.md).

## Verification

```bash
npm run typecheck      # tsc --noEmit
npm test               # 115 unit + integration + UI tests (vitest)
npm run build          # production build
npm start -- -p 3200
npm run test:security  # 39-check active audit against the running server
npm run test:seo       # 3,205 on-page SEO checks across 161 sitemap URLs
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

Current result: **3,205/3,205 checks passing across 161 pages.** This audit caught real defects: 209 failures on first run, including social cards silently dropped on 74 routes (Next replaces a parent's `openGraph` when a child defines one), blog cards pointing at a per-article image route that did not exist, descriptions up to 354 characters, and titles up to 83.

## Known limitations

- The JSON store is single-node and file-backed; use a real database for multi-instance deployments.
- The demo OTP is intentionally exposed; disable it before any public deployment.
- Analytics, payments and SMS integrations are simulated at the workflow level.
