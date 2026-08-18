# LEARNED (CWM Site)

| Date | Lesson | Promoted? |
|---|---|---|
| 2026-08-16 | 10DLC stays blocked until `legal.carwashmgmt.com` CNAME exists and HTML is on the brand domain. Do not resubmit the campaign first. | already in department rule |
| 2026-08-16 | After GoDaddy CNAME, bind GitHub Pages custom domain + Enforce HTTPS. DNS-only still 404s (`cname` was null on [cwm-a2p-legal](https://github.com/andrewbwm275/cwm-a2p-legal)). | propose |
| 2026-08-16 | 10DLC resubmit only after brand-domain 200. Keyword-only START. github.io URLs fail 30908/30882. PUT brand URLs in MessageFlow. | propose |
| 2026-08-18 | 30909 repeated after START-only MESSAGE_FLOW that still named a website. legal.carwashmgmt.com crawler HTML is not enough while www.carwashmgmt.com is a Base44 JS shell with no START. Do not resubmit another paragraph; next CTA needs HTML on the brand homepage. | yes → .cursor/rules/department.mdc |
| 2026-08-18 | GitHub Pages + CNAME file is not live while www still CNAMEs to base44.onrender.com. Fetch https://www.carwashmgmt.com/ for START before any Twilio edit. Gate is GoDaddy www CNAME Save → andrewbwm275.github.io. | propose |
| 2026-08-18 | Do not set GitHub Pages custom domain to www while DNS still points at Base44 — github.io 301s to the JS shell and the proof URL is useless. Clear cname until www CNAME is github.io. | propose |
| 2026-08-18 | github.io project pages 404 root `/assets/`. Relative href/src after build. Do not ship a CNAME file until www DNS is actually github.io. | propose |
| 2026-08-18 | 10DLC START/STOP/HELP must stay in HTML without JS, but a giant SMS dump at the top is not a designed site. Put the full program copy in a footer strip (`id="sms-opt-in"`). | propose |
