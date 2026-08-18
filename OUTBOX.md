# OUTBOX — CWM Site

From: CWM Site / Jarvis. Updated 2026-08-18 ~3:56 AM PT. Do not SMS-test. Do not resubmit.

## Status

**Crawlable START HTML is live on GitHub Pages.** Campaign 6 was **not** resubmitted. Wrangler is **not** logged in (no Cloudflare Pages deploy this turn). `legal.carwashmgmt.com` left alone (still 200).

| URL | Result |
|---|---|
| [https://andrewbwm275.github.io/carwashmgmt-site/](https://andrewbwm275.github.io/carwashmgmt-site/) | **200**, START / STOP / HELP / 619-914-6819 / legal privacy+terms in raw HTML (`id="sms-opt-in"`) |
| [https://andrewbwm275.github.io/carwashmgmt-site/sms/](https://andrewbwm275.github.io/carwashmgmt-site/sms/) | **200** keyword-only program page |
| [https://andrewbwm275.github.io/cwm-vision/](https://andrewbwm275.github.io/cwm-vision/) | **200** designed vision site (`noindex`, not a competing SMS homepage) |
| [https://www.carwashmgmt.com/](https://www.carwashmgmt.com/) | Still **Base44 JS** (`#root`). DNS `www` CNAME → `base44.onrender.com` |
| [https://legal.carwashmgmt.com/](https://legal.carwashmgmt.com/) | **200** (untouched) |
| [https://legal.carwashmgmt.com/privacy-policy.html](https://legal.carwashmgmt.com/privacy-policy.html) | **200** |
| [https://legal.carwashmgmt.com/terms-and-conditions.html](https://legal.carwashmgmt.com/terms-and-conditions.html) | **200** |

GitHub Pages custom domain on [carwashmgmt-site](https://github.com/andrewbwm275/carwashmgmt-site) was **cleared** so github.io no longer 301s to Base44. After the www DNS Save, Jarvis will bind `www.carwashmgmt.com` again + Enforce HTTPS.

Keyword-only: contact form checkbox removed. Opt-in is **only** text START to +1 619-914-6819.

## Pages converted (Astro static HTML, every public route)

Home `/`, About, Services, Solutions, Equipment, Chemistry, Preventive Maintenance, Results, Testimonials, Blog + 12 posts, Contact, Book a call, Calculator, Resources, Water reclaim ROI, CMS guide (noindex), chemical-product index + 23 SKUs, Privacy, Terms, Submit testimonial, **SMS `/sms`**, login/register/forgot/reset (noindex stubs). Snapshot HTML moved to [archive/base44-html](file:///C:/Users/Andrew/Projects/carwashmgmt-site/archive/base44-html) so it cannot overwrite `dist/`.

## Draft / path

- [SmsOptIn.astro](file:///C:/Users/Andrew/Projects/carwashmgmt-site/src/components/site/SmsOptIn.astro)
- Vision: [site-vision/index.html](file:///C:/Users/Andrew/Projects/carwashmgmt-site/site-vision/index.html)
- Packet (do not paste until www 200): [A2P_CONSOLE_PACKET.txt](file:///C:/Users/Andrew/Projects/jarvis/A2P_CONSOLE_PACKET.txt)

## NeedFromAndrew

One GoDaddy Save: [carwashmgmt.com DNS](https://dcc.godaddy.com/control/portfolio/carwashmgmt.com/settings?tab=dns) → edit **www** CNAME from `base44.onrender.com` to `andrewbwm275.github.io` → **Save**. Do **not** change `legal`. Do not resubmit 10DLC. After Save, Jarvis verifies https://www.carwashmgmt.com/ has START then binds the custom domain.

Optional later (not this sitting): `npx wrangler login` if you want Cloudflare Pages instead of GitHub Pages.

## ClickUp

- [868ktgj3y](https://app.clickup.com/t/868ktgj3y) HTML deploy
- [868krx86x](https://app.clickup.com/t/868krx86x) 10DLC 30909 — do not resubmit until www START 200

## SelfImprove

SelfImprove: Binding GitHub Pages custom domain to www while www still CNAMEs to Base44 makes github.io 301 to the JS shell; TCR still sees no START. Proof URL must not redirect until DNS is cut over.
