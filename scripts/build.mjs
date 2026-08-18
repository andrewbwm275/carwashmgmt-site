import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter, PILLAR_CARDS } from './partials.mjs';
import { generateExtras, LEGACY_REDIRECTS } from './generate-extras.mjs';
import { products } from './products.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'source');
const OUT = path.join(ROOT, 'public');
const SITE = 'https://www.carwashmgmt.com';
const DEFAULT_OG = 'https://media.base44.com/images/public/699f163455fdaf19c59586b8/f50cc0d88_image.png';

const FILE_TO_PATH = {
  'index.html': '',
  'about.html': 'about',
  'chemistry.html': 'chemistry',
  'equipment.html': 'equipment',
  'solutions.html': 'solutions',
  'services.html': 'services',
  'results.html': 'results',
  'blog.html': 'blog',
  'calculator.html': 'calculator',
  'book-a-call.html': 'book-a-call',
  'contact.html': 'contact',
  'preventive-maintenance.html': 'preventive-maintenance',
  'testimonials.html': 'testimonials',
  'resources.html': 'resources',
  'privacy-policy.html': 'privacy-policy',
  'terms-and-conditions.html': 'terms-and-conditions',
  'submit-testimonial.html': 'submit-testimonial',
  'blog-reduce-chemical-costs.html': 'blog/reduce-chemical-costs',
  'blog-downtime-costs.html': 'blog/downtime-costs',
  'blog-profit-leaks.html': 'blog/profit-leaks',
  'blog-preventive-maintenance-guide.html': 'blog/preventive-maintenance-guide',
  'blog-how-much-water-does-car-wash-use.html': 'blog/how-much-water-does-car-wash-use',
  'blog-nano-bubble-roi-guide.html': 'blog/nano-bubble-roi-guide',
  'blog-staffing-optimization.html': 'blog/staffing-optimization',
  'blog-throughput-optimization.html': 'blog/throughput-optimization',
  'blog-cost-per-car.html': 'blog/cost-per-car',
  'blog-best-car-wash-chemicals-2026.html': 'blog/best-car-wash-chemicals-2026',
  'blog-start-car-wash-california.html': 'blog/start-car-wash-california',
  'blog-equipment-maintenance-schedule.html': 'blog/equipment-maintenance-schedule',
};

const SITEMAP_ENTRIES = [
  { path: '', priority: '1.0', changefreq: 'weekly', lastmod: '2026-06-29' },
  { path: 'about', priority: '0.9', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'chemistry', priority: '0.9', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'equipment', priority: '0.9', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'solutions', priority: '0.9', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'results', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'blog', priority: '0.9', changefreq: 'weekly', lastmod: '2026-06-29' },
  { path: 'calculator', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'book-a-call', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'preventive-maintenance', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'testimonials', priority: '0.7', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'blog/reduce-chemical-costs', priority: '0.8', changefreq: 'monthly', lastmod: '2026-03-15' },
  { path: 'blog/downtime-costs', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-17' },
  { path: 'blog/profit-leaks', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-19' },
  { path: 'blog/preventive-maintenance-guide', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-20' },
  { path: 'blog/how-much-water-does-car-wash-use', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-09' },
  { path: 'blog/nano-bubble-roi-guide', priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-02' },
  { path: 'blog/staffing-optimization', priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-05' },
  { path: 'blog/throughput-optimization', priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-08' },
  { path: 'blog/cost-per-car', priority: '0.7', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'blog/best-car-wash-chemicals-2026', priority: '0.7', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'blog/start-car-wash-california', priority: '0.7', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'blog/equipment-maintenance-schedule', priority: '0.7', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'resources', priority: '0.7', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-29' },
  { path: 'terms-and-conditions', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-29' },
];

function rmDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : 'Car Wash Services';
}

function extractDataPage(html) {
  const m = html.match(/<body[^>]*data-page=["']([^"']*)["']/i);
  return m ? m[1] : 'Home';
}

function rewriteLinks(html) {
  let out = html;
  const replacements = [
    [/href=["']index\.html["']/gi, 'href="/"'],
    [/href=["']blog\.html["']/gi, 'href="/blog"'],
    [/href=["']about\.html["']/gi, 'href="/about"'],
    [/href=["']chemistry\.html["']/gi, 'href="/chemistry"'],
    [/href=["']equipment\.html["']/gi, 'href="/equipment"'],
    [/href=["']solutions\.html["']/gi, 'href="/solutions"'],
    [/href=["']services\.html["']/gi, 'href="/services"'],
    [/href=["']results\.html["']/gi, 'href="/results"'],
    [/href=["']calculator\.html["']/gi, 'href="/calculator"'],
    [/href=["']book-a-call\.html["']/gi, 'href="/book-a-call"'],
    [/href=["']contact\.html["']/gi, 'href="/contact"'],
    [/href=["']preventive-maintenance\.html["']/gi, 'href="/preventive-maintenance"'],
    [/href=["']testimonials\.html["']/gi, 'href="/testimonials"'],
    [/href=["']resources\.html["']/gi, 'href="/resources"'],
    [/href=["']privacy-policy\.html["']/gi, 'href="/privacy-policy"'],
    [/href=["']terms-and-conditions\.html["']/gi, 'href="/terms-and-conditions"'],
    [/href=["']submit-testimonial\.html["']/gi, 'href="/submit-testimonial"'],
    [/href=["']assets\//gi, 'href="/assets/'],
    [/src=["']assets\//gi, 'src="/assets/'],
  ];
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }
  for (const [file, route] of Object.entries(FILE_TO_PATH)) {
    if (!file.startsWith('blog-')) continue;
    const slug = route.replace('blog/', '');
    const re = new RegExp(`href=["']${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'gi');
    out = out.replace(re, `href="/blog/${slug}"`);
  }
  return out;
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSeoHead({ title, description, canonical, isArticle, image }) {
  const ogImage = image || DEFAULT_OG;
  const safeTitle = escAttr(title);
  const safeDesc = escAttr(description);
  const orgJson = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Car Wash Services LLC',
    url: SITE,
    logo: 'https://media.base44.com/images/public/699f163455fdaf19c59586b8/a0be2bc22_Untitleddesign7.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-808-465-2291',
      contactType: 'customer service',
      email: 'info@carwashmgmt.com',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.facebook.com/CarWashManagementLLC',
      'https://www.linkedin.com/company/carwashmgmt/',
      'https://www.youtube.com/@CarWashManagementLLC',
      'https://www.instagram.com/carwashmgmt',
    ],
  };
  const websiteJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Car Wash Services',
    url: SITE,
    publisher: { '@type': 'Organization', name: 'Car Wash Services LLC' },
  };
  const articleJson = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title.replace(/ \| Car Wash Services$/, ''),
        description,
        image: ogImage,
        author: { '@type': 'Organization', name: 'Car Wash Services' },
        publisher: {
          '@type': 'Organization',
          name: 'Car Wash Services LLC',
          logo: { '@type': 'ImageObject', url: orgJson.logo },
        },
        mainEntityOfPage: canonical,
      }
    : null;

  const schemas = [orgJson, websiteJson, articleJson].filter(Boolean);

  return `
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${isArticle ? 'article' : 'website'}">
<meta property="og:site_name" content="Car Wash Services">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDesc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDesc}">
<meta name="twitter:image" content="${ogImage}">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}`;
}

function transformContactForm(html) {
  return html
    .replace(
      /<form data-mock data-success="Request received!"/,
      '<form data-form="contact" data-success="Request received!"'
    )
    .replace(/<label class="flbl">Full Name \*<\/label><input class="fi" required>/, '<label class="flbl">Full Name *</label><input class="fi" name="name" required>')
    .replace(/<label class="flbl">Company<\/label><input class="fi">/, '<label class="flbl">Company</label><input class="fi" name="company_name">')
    .replace(/<label class="flbl">Email \*<\/label><input class="fi" type="email" required>/, '<label class="flbl">Email *</label><input class="fi" type="email" name="email" required>')
    .replace(/<label class="flbl">Phone<\/label><input class="fi">/, '<label class="flbl">Phone</label><input class="fi" name="phone">')
    .replace(/<label class="flbl">City \/ State<\/label><input class="fi">/, '<label class="flbl">City / State</label><input class="fi" name="city_state">')
    .replace(/<select class="fi"><option value="">Select…<\/option><option>Express tunnel/, '<select class="fi" name="wash_type"><option value="">Select…</option><option>Express tunnel')
    .replace(/<label class="flbl">Number of Locations<\/label><input class="fi" type="number"/, '<label class="flbl">Number of Locations</label><input class="fi" type="number" name="locations"')
    .replace(/<label class="flbl">Urgency<\/label><select class="fi">/, '<label class="flbl">Urgency</label><select class="fi" name="urgency">')
    .replace(/<label class="flbl">Preferred Follow-up<\/label><select class="fi">/, '<label class="flbl">Preferred Follow-up</label><select class="fi" name="followup">')
    .replace(/<textarea class="fi" rows="4"><\/textarea>/, '<textarea class="fi" rows="4" name="message"></textarea>');
}

function transformChemistryPage(html) {
  const slugLines = products.map((p) => `  "${p.name.replace(/"/g, '\\"')}": "${p.slug}"`).join(',\n');
  const slugBlock = `var SLUGS={\n${slugLines}\n};\n`;
  html = html.replace(/\(function\(\)\{/, `(function(){${slugBlock}`);
  html = html.replace(
    /return '<div class="pcard">/,
    "var slug=SLUGS[p.n];return '<a href=\"'+(slug?'/chemical-product/'+slug:'/contact')+'\" class=\"pcard\" style=\"text-decoration:none;color:inherit;display:flex;flex-direction:column\">"
  );
  html = html.replace(/<\/div><\/div>';/, '</div></div></a>\';');
  html = html.replace(
    /b\.onclick=function\(\)\{var n=b\.getAttribute\('data-n'\)/,
    "b.onclick=function(e){e.preventDefault();e.stopPropagation();var n=b.getAttribute('data-n')"
  );
  return html;
}

function transformTestimonialForm(html) {
  return html
    .replace(/<form data-mock/, '<form data-form="testimonial"')
    .replace(/<label class="flbl">Your Name \*<\/label><input class="fi" required>/, '<label class="flbl">Your Name *</label><input class="fi" name="name" required>')
    .replace(/<label class="flbl">Email \*<\/label><input class="fi" type="email" required>/, '<label class="flbl">Email *</label><input class="fi" type="email" name="email" required>')
    .replace(/<label class="flbl">Phone<\/label><input class="fi">/, '<label class="flbl">Phone</label><input class="fi" name="phone">')
    .replace(/<label class="flbl">Your Role \/ Business<\/label><input class="fi"/, '<label class="flbl">Your Role / Business</label><input class="fi" name="company"')
    .replace(/<select class="fi"><option value="">Select…<\/option><option>Nano Bubble/, '<select class="fi" name="service"><option value="">Select…</option><option>Nano Bubble')
    .replace(/<textarea class="fi" rows="4" required/, '<textarea class="fi" name="testimonial" rows="4" required')
    .replace(/<label class="flbl">Results \/ Numbers \(optional\)<\/label><input class="fi"/, '<label class="flbl">Results / Numbers (optional)</label><input class="fi" name="results"');
}

function processPage(filename, rawHtml) {
  const route = FILE_TO_PATH[filename];
  if (route === undefined) return null;

  const canonical = route ? `${SITE}/${route}` : `${SITE}/`;
  const title = extractTitle(rawHtml);
  const description = extractMeta(rawHtml, 'description') || title;
  const currentPage = extractDataPage(rawHtml);
  const isArticle = route.startsWith('blog/') && route !== 'blog';

  let html = rawHtml;
  html = rewriteLinks(html);

  if (filename === 'index.html') {
    html = html.replace(
      /<div class="pillars-grid"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="pillars-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">\n        ${PILLAR_CARDS}\n      </div>\n    </div>\n  </section>`
    );
    html = html.replace(/<script>[\s\S]*?pillar cards[\s\S]*?<\/script>/, '');
    html = html.replace(/href=["']book-a-call\.html["']/gi, 'href="/book-a-call"');
  }

  if (filename === 'contact.html') html = transformContactForm(html);
  if (filename === 'chemistry.html') html = transformChemistryPage(html);
  if (filename === 'submit-testimonial.html') html = transformTestimonialForm(html);

  const header = renderHeader(currentPage);
  const footer = renderFooter();

  html = html.replace('<div id="site-header"></div>', header);
  html = html.replace('<div id="site-footer"></div>', footer);

  const seo = buildSeoHead({ title, description, canonical, isArticle });
  html = html.replace('</head>', `${seo}\n</head>`);

  let heroImage = DEFAULT_OG;
  const imgMatch = html.match(/blog-hero-img[^>]*src=["']([^"']+)["']/i)
    || html.match(/background-image:url\(['"]?([^'")]+)['"]?\)/i);
  if (imgMatch) heroImage = imgMatch[1];

  return { route, html, heroImage };
}

function writeRedirects() {
  const lines = [
    'https://carwashmgmt.com/* https://www.carwashmgmt.com/:splat 301',
    'http://carwashmgmt.com/* https://www.carwashmgmt.com/:splat 301',
    'http://www.carwashmgmt.com/* https://www.carwashmgmt.com/:splat 301',
  ];
  for (const [file, route] of Object.entries(FILE_TO_PATH)) {
    if (file === 'index.html') {
      lines.push('/index.html / 301');
      continue;
    }
    const target = route ? `/${route}` : '/';
    lines.push(`/${file} ${target} 301`);
  }
  for (const [from, to] of LEGACY_REDIRECTS) {
    lines.push(`${from} ${to} 301`);
  }
  fs.writeFileSync(path.join(OUT, '_redirects'), lines.join('\n') + '\n');
}

function writeSitemap(extraEntries = []) {
  const allEntries = [...SITEMAP_ENTRIES, ...extraEntries];
  const urls = allEntries.map((e) => {
    const loc = e.path ? `${SITE}/${e.path}` : `${SITE}/`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
}

function writeRobots() {
  fs.writeFileSync(
    path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`
  );
}

function writeLlms() {
  const content = `# Car Wash Services (carwashmgmt.com)

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
- Email: info@carwashmgmt.com
`;
  fs.writeFileSync(path.join(OUT, 'llms.txt'), content);
}

// Build
rmDir(OUT);
ensureDir(path.join(OUT, 'assets'));

fs.copyFileSync(path.join(SOURCE, 'site.css'), path.join(OUT, 'assets', 'site.css'));
fs.copyFileSync(path.join(ROOT, 'assets', 'site.js'), path.join(OUT, 'assets', 'site.js'));

const files = fs.readdirSync(SOURCE).filter((f) => f.endsWith('.html'));
let built = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(SOURCE, file), 'utf8');
  const result = processPage(file, raw);
  if (!result) continue;

  const outDir = result.route ? path.join(OUT, result.route) : OUT;
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, 'index.html'), result.html);
  built++;
}

const extraSitemap = generateExtras();

writeRedirects();
writeSitemap(extraSitemap);
writeRobots();
writeLlms();

console.log(`Built site to ${OUT} (core pages + extras)`);
