/**
 * Write Cloudflare Pages _redirects + robots + llms into dist/ after Astro build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from './products.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://www.carwashmgmt.com';

const LEGACY = [
  ['/About', '/about'],
  ['/Services', '/services'],
  ['/Solutions', '/solutions'],
  ['/Chemistry', '/chemistry'],
  ['/Equipment', '/equipment'],
  ['/PreventiveMaintenance', '/preventive-maintenance'],
  ['/ChemicalProduct', '/chemical-product'],
  ['/Results', '/results'],
  ['/Testimonials', '/testimonials'],
  ['/Blog', '/blog'],
  ['/BlogPost', '/blog-post'],
  ['/Resources', '/resources'],
  ['/Contact', '/contact'],
  ['/BookACall', '/book-a-call'],
  ['/Calculator', '/calculator'],
  ['/CMSGuide', '/cms-guide'],
  ['/SubmitTestimonial', '/submit-testimonial'],
  ['/PrivacyPolicy', '/privacy-policy'],
  ['/TermsAndConditions', '/terms-and-conditions'],
  ['/AdminChat', '/login'],
  ['/Home', '/'],
  ['/BlogAdmin', '/cms-guide'],
  // Until Testimonials page is re-captured from live:
  ['/testimonials', '/results'],
];

const HTML_FILES = [
  'about',
  'chemistry',
  'equipment',
  'solutions',
  'services',
  'results',
  'blog',
  'calculator',
  'book-a-call',
  'contact',
  'preventive-maintenance',
  'testimonials',
  'resources',
  'privacy-policy',
  'terms-and-conditions',
  'submit-testimonial',
  'sms',
];

if (!fs.existsSync(DIST)) {
  console.error('dist/ missing — run astro build first');
  process.exit(1);
}

const lines = [
  'https://carwashmgmt.com/* https://www.carwashmgmt.com/:splat 301',
  'http://carwashmgmt.com/* https://www.carwashmgmt.com/:splat 301',
  'http://www.carwashmgmt.com/* https://www.carwashmgmt.com/:splat 301',
  '/index.html / 301',
];

for (const slug of HTML_FILES) {
  lines.push(`/${slug}.html /${slug} 301`);
}
for (const [from, to] of LEGACY) {
  lines.push(`${from} ${to} 301`);
}

fs.writeFileSync(path.join(DIST, '_redirects'), lines.join('\n') + '\n');

fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /register\nDisallow: /forgot-password\nDisallow: /reset-password\nDisallow: /cms-guide\nSitemap: ${SITE}/sitemap-index.xml\nSitemap: ${SITE}/sitemap.xml\n`
);

const llms = `# Car Wash Services (carwashmgmt.com)

> California's full-service car wash partner — premium chemicals, preventive maintenance, equipment solutions, and expert consulting.

## Main pages
- Home: ${SITE}/
- About: ${SITE}/about
- Chemical programs: ${SITE}/chemistry
- Preventive maintenance: ${SITE}/preventive-maintenance
- Equipment: ${SITE}/equipment
- Consulting: ${SITE}/solutions
- Results: ${SITE}/results
- Blog: ${SITE}/blog
- Contact: ${SITE}/contact
- Book a call: ${SITE}/book-a-call
- ROI calculator: ${SITE}/calculator

## Contact
- Phone: (808) 465-2291
- SMS (keyword only): text START to +1 619-914-6819
- Email: info@carwashmgmt.com
- SMS program: ${SITE}/sms
- A2P privacy: https://legal.carwashmgmt.com/privacy-policy.html
- A2P terms: https://legal.carwashmgmt.com/terms-and-conditions.html

## Products
${products.map((p) => `- ${p.name}: ${SITE}/chemical-product/${p.slug}`).join('\n')}
`;
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);

// Ensure assets from public are present (Astro copies public/)
const cssSrc = path.join(ROOT, 'public', 'assets', 'site.css');
const jsSrc = path.join(ROOT, 'public', 'assets', 'site.js');
const assetsOut = path.join(DIST, 'assets');
fs.mkdirSync(assetsOut, { recursive: true });
if (fs.existsSync(cssSrc)) fs.copyFileSync(cssSrc, path.join(assetsOut, 'site.css'));
if (fs.existsSync(jsSrc)) fs.copyFileSync(jsSrc, path.join(assetsOut, 'site.js'));

// GitHub project pages 404 root-absolute /assets/ (they live under /carwashmgmt-site/).
// Relative href/src keeps github.io AND a future www custom domain working.
// Do NOT emit CNAME while www still points at Base44 — that 301s github.io to the JS shell.
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
const cnamePath = path.join(DIST, 'CNAME');
if (fs.existsSync(cnamePath) && process.env.WRITE_WWW_CNAME !== '1') {
  fs.unlinkSync(cnamePath);
  console.log('Post-build: stripped dist/CNAME (www DNS is not GitHub Pages yet)');
}

function relativizeHtml(dir, rel = '') {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const nested = rel ? `${rel}/${name}` : name;
    if (fs.statSync(p).isDirectory()) {
      relativizeHtml(p, nested);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    const depth = rel.split('/').filter(Boolean).length;
    const prefix = depth === 0 ? './' : '../'.repeat(depth);
    let html = fs.readFileSync(p, 'utf8');
    html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${prefix}`);
    fs.writeFileSync(p, html);
  }
}
relativizeHtml(DIST);

console.log('Post-build: _redirects, robots.txt, llms.txt, relative asset paths written to dist/');
