# Cutover checklist — carwashmgmt.com

## Pre-launch (complete before switching DNS)

- [x] Build static site (`npm run build`)
- [x] SEO verify passes (`npm run verify`)
- [x] Header/footer baked into HTML (view source — nav visible without JS)
- [x] `sitemap.xml` at https://www.carwashmgmt.com/sitemap.xml
- [x] `robots.txt` allows crawlers
- [x] `_redirects` for legacy `.html` paths and apex → www
- [ ] Set `RESEND_API_KEY` in Cloudflare Pages environment variables
- [ ] Verify Resend domain for `carwashmgmt.com` (for form emails)
- [ ] Test contact form on preview URL
- [ ] Test newsletter + guide popup forms

## Deploy steps

1. Push repo to GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Connect Git
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add custom domain: `www.carwashmgmt.com` and `carwashmgmt.com`

Or CLI:

```bash
npm run build
npx wrangler pages deploy dist --project-name=carwashmgmt
```

## DNS cutover

1. Deploy succeeds on Cloudflare preview URL
2. Add custom domains in Pages project
3. Update DNS if not already on Cloudflare (CNAME `www` → `<project>.pages.dev`)
4. Confirm `https://carwashmgmt.com` redirects to `https://www.carwashmgmt.com`
5. **Remove custom domain from Base44** (prevents duplicate content)

## Post-launch — Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console)
2. Verify property `https://www.carwashmgmt.com`
3. Submit sitemap: `https://www.carwashmgmt.com/sitemap.xml`
4. URL Inspection → Request indexing for:
   - `/`
   - `/about`
   - `/chemistry`
   - `/blog`
   - `/blog/reduce-chemical-costs`
5. Repeat in [Bing Webmaster Tools](https://www.bing.com/webmasters)

## Validation tests

| Test | How |
|------|-----|
| Crawlable content | View source on `/` — see `<header>`, `<main>`, `<footer>` |
| Clean URLs | Visit `/about` (not `/about.html`) |
| Legacy redirect | `/about.html` → `/about` (301) |
| Blog URLs preserved | `/blog/reduce-chemical-costs` loads |
| Rich results | [Google Rich Results Test](https://search.google.com/test/rich-results) on homepage + blog |
| Mobile | Lighthouse in Chrome DevTools |

## Timeline expectations

- Indexing improvements: 1–3 weeks
- Ranking changes: 1–3 months
- Monitor GSC Coverage and Crawl stats for 404s weekly
