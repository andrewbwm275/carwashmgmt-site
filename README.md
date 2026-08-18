# carwashmgmt.com — Astro static site

Crawlable static HTML for [www.carwashmgmt.com](https://www.carwashmgmt.com). Real Astro components (not a React SPA, not DOM snapshots).

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview
npm run deploy    # Cloudflare Pages (wrangler)
```

## Architecture

| Layer | Role |
|-------|------|
| `src/layouts/SiteLayout.astro` | Shared shell + SEO |
| `src/components/site/*` | Header (mega menu), Footer, Sticky CTA |
| `src/components/home/*` | Homepage sections |
| `src/pages/*` | Routes (hand-authored) |
| `scripts/products.mjs` | Chemistry catalog |
| `public/assets/live.css` | Production visual stylesheet |
| `public/assets/site.css` + `site-interact.js` | Nav, FAQ, cart, calculator, forms |
| `functions/api/*` | Resend email APIs |

## Forms / APIs

| Endpoint | Purpose |
|----------|---------|
| `POST /api/contact` | Contact form |
| `POST /api/newsletter` | Newsletter |
| `POST /api/guide` | Profit guide |
| `POST /api/testimonial` | Testimonials |
| `POST /api/calculator` | ROI calculator lead |
| `POST /api/quote` | Chemistry quote cart |

Requires `RESEND_API_KEY` in Cloudflare Pages env.

## Deploy

1. Build command: `npm run build`
2. Output: `dist`
3. Env: `RESEND_API_KEY`
4. See [`CUTOVER.md`](file:///C:/Users/Andrew/Projects/carwashmgmt-site/CUTOVER.md)

## Optional: live snapshots

Legacy capture tooling remains for reference only:

```bash
npm run capture:live
npm run prepare:snapshots
```

Do **not** use snapshots as the default build path—Astro components are the source of truth.
