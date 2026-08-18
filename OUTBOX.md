# OUTBOX — CWM Site

From: CWM Site. Updated 2026-08-18 ~4:25 AM PT. Do not SMS-test. Do not resubmit 10DLC. Do not touch legal.carwashmgmt.com.

## Status

Production GitHub Pages restyled as an editorial site (Newsreader + Outfit, photography, SMS in a designed **footer** program strip — not a dump at the top). Hard-refresh:

**[https://andrewbwm275.github.io/carwashmgmt-site/](https://andrewbwm275.github.io/carwashmgmt-site/)**

START / STOP / HELP / +1 619-914-6819 remain in HTML source (`id="sms-opt-in"` in the footer). Same keywords on [/sms](https://andrewbwm275.github.io/carwashmgmt-site/sms/). No live.css Tailwind. No fake testimonials or logos.

| URL | Result |
|---|---|
| [https://andrewbwm275.github.io/carwashmgmt-site/](https://andrewbwm275.github.io/carwashmgmt-site/) | Restyle live. START in footer HTML |
| [https://andrewbwm275.github.io/carwashmgmt-site/sms/](https://andrewbwm275.github.io/carwashmgmt-site/sms/) | Program page + footer strip |
| [https://www.carwashmgmt.com/](https://www.carwashmgmt.com/) | Still Base44 JS (`#root`). DNS not cut over this turn (per Andrew) |
| [https://legal.carwashmgmt.com/](https://legal.carwashmgmt.com/) | Untouched |

Screenshots: [preview/home.png](file:///C:/Users/Andrew/Projects/carwashmgmt-site/preview/home.png) · [preview/home-full.png](file:///C:/Users/Andrew/Projects/carwashmgmt-site/preview/home-full.png) · [preview/sms-strip.png](file:///C:/Users/Andrew/Projects/carwashmgmt-site/preview/sms-strip.png)

## What was ugly / what changed

Ugly: github.io linked `/assets/` so CSS 404’d (unstyled dump); lime SMS wall at the top; SaaS-blue Tailwind; fake quotes; system fonts.

Changed: full-bleed photography hero, restrained ink/cream/brass, Newsreader display type, SMS moved to footer strip (still crawlable, no JS). Relative asset paths so github.io actually loads CSS.

## Draft / path

- [site.css](file:///C:/Users/Andrew/Projects/carwashmgmt-site/public/assets/site.css)
- [SmsOptIn.astro](file:///C:/Users/Andrew/Projects/carwashmgmt-site/src/components/site/SmsOptIn.astro)

## NeedFromAndrew

Empty for this restyle. www DNS cutover stays Andrew’s when he wants the brand hostname on this HTML. Do not resubmit 10DLC.

## ClickUp

- [868ktgj3y](https://app.clickup.com/t/868ktgj3y) HTML deploy

## SelfImprove

SelfImprove: A GitHub project site with `href="/assets/…"` is an unstyled dump; TCR still sees START but Andrew sees “hideous.” Relative rewrite + no top-of-page SMS dump.
