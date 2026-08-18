import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { wrapPage } from './page-shell.mjs';
import { products } from './products.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public');
const SITE = 'https://www.carwashmgmt.com';

export const LEGACY_REDIRECTS = [
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
];

export const EXTRA_SITEMAP = [
  { path: 'services', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'submit-testimonial', priority: '0.6', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'water-reclaim-roi', priority: '0.8', changefreq: 'monthly', lastmod: '2026-06-29' },
  { path: 'cms-guide', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-29' },
  { path: 'blog/cost-per-car', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-18' },
];

const BLOG_SLUG_MAP = {
  'reduce-chemical-costs': '/blog/reduce-chemical-costs',
  'downtime-costs': '/blog/downtime-costs',
  'cost-per-car': '/blog/cost-per-car',
  'profit-leaks': '/blog/profit-leaks',
  'preventive-maintenance-guide': '/blog/preventive-maintenance-guide',
  'start-car-wash-california': '/blog/start-car-wash-california',
  'best-car-wash-chemicals-2026': '/blog/best-car-wash-chemicals-2026',
  'equipment-maintenance-schedule': '/blog/equipment-maintenance-schedule',
  'staffing-optimization': '/blog/staffing-optimization',
  'throughput-optimization': '/blog/throughput-optimization',
  'how-much-water-does-car-wash-use': '/blog/how-much-water-does-car-wash-use',
  'nano-bubble-roi-guide': '/blog/nano-bubble-roi-guide',
};

function writePage(route, html) {
  const dir = route ? path.join(OUT, route) : OUT;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

function money(n) {
  if (n == null) return 'Request quote';
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderChemicalProduct(product) {
  const sizes = ['5 GAL', '15 GAL', '30 GAL', '55 GAL'];
  const priceRows = sizes
    .map((s) => {
      const p = product.prices[s];
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600">${s}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">${p != null ? money(p) : 'Request quote'}</td></tr>`;
    })
    .join('');
  const features = product.features.map((f) => `<li style="display:flex;gap:10px;margin-bottom:10px;color:#334155;line-height:1.6"><span style="color:#0F52FB;font-weight:700">✓</span><span>${f}</span></li>`).join('');
  const apps = (product.applicationTypes || []).map((t) => `<span style="display:inline-block;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(15,82,251,.08);color:#0F52FB;border:1px solid rgba(15,82,251,.15);margin:0 6px 6px 0">${t}</span>`).join('');

  const body = `
  <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:12px 24px">
    <div class="wrap" style="display:flex;align-items:center;gap:8px;font-size:13px;color:#64748b">
      <a href="/chemistry" style="color:#64748b">Chemistry</a> › <span style="color:#0f172a;font-weight:600">${product.name}</span>
    </div>
  </div>
  <section style="padding:56px 24px;background:#fff">
    <div class="wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px;align-items:start">
      <div>
        <img src="${product.image}" alt="${product.name}" style="width:100%;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(2,19,63,.08)">
      </div>
      <div>
        <span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#0F52FB;background:rgba(15,82,251,.08);padding:4px 12px;border-radius:999px;margin-bottom:12px">${product.category}</span>
        <h1 style="font-size:clamp(1.8rem,4vw,2.4rem);font-weight:900;color:#02133F;margin:0 0 8px;line-height:1.1">${product.name}</h1>
        <p style="font-size:17px;color:#64748b;margin:0 0 16px">${product.tagline}</p>
        <p style="color:#334155;line-height:1.7;margin:0 0 24px">${product.description}</p>
        <div style="margin-bottom:20px">${apps}</div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px">
          <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-size:12px;color:#64748b">Size</th><th style="padding:10px 14px;text-align:left;font-size:12px;color:#64748b">Price</th></tr></thead>
          <tbody>${priceRows}</tbody>
        </table>
        <a href="/contact?type=quote" class="btn btn-blue" style="padding:14px 28px;border-radius:8px;font-size:14px;font-weight:700">Request a Quote</a>
        <p style="font-size:12px;color:#94a3b8;margin-top:12px">Need help choosing? <a href="/book-a-call" style="color:#0F52FB">Book a free consultation →</a></p>
      </div>
    </div>
  </section>
  <section style="padding:56px 24px;background:#f8fafc">
    <div class="wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px">
      <div>
        <h2 style="font-size:22px;font-weight:900;color:#02133F;margin:0 0 16px">Key Features</h2>
        <ul style="list-style:none;padding:0;margin:0">${features}</ul>
      </div>
      <div>
        <h2 style="font-size:22px;font-weight:900;color:#02133F;margin:0 0 16px">Usage &amp; Best For</h2>
        <p style="color:#334155;line-height:1.7;margin:0 0 12px"><strong>Usage:</strong> ${product.usage}</p>
        <p style="color:#334155;line-height:1.7;margin:0"><strong>Best for:</strong> ${product.bestFor}</p>
      </div>
    </div>
  </section>`;

  return wrapPage({
    title: `${product.name} | Car Wash Services`,
    description: product.tagline,
    body,
    dataPage: 'Chemistry',
    canonical: `${SITE}/chemical-product/${product.slug}`,
    image: product.image,
  });
}

export function generateExtras() {
  let count = 0;

  // Chemical product pages + router
  for (const product of products) {
    writePage(`chemical-product/${product.slug}`, renderChemicalProduct(product));
    count++;
  }

  const chemRouter = wrapPage({
    title: 'Chemical Products | Car Wash Services',
    description: 'Browse car wash chemical products.',
    dataPage: 'Chemistry',
    canonical: `${SITE}/chemical-product`,
    body: `<script>
var s=new URLSearchParams(location.search).get('slug');
if(s)location.replace('/chemical-product/'+encodeURIComponent(s)+'/');
else location.replace('/chemistry');
</script><p style="padding:48px 24px;text-align:center">Redirecting… <a href="/chemistry">Go to Chemistry</a></p>`,
  });
  writePage('chemical-product', chemRouter);
  count++;

  // BlogPost slug router
  const slugMapJson = JSON.stringify(BLOG_SLUG_MAP);
  writePage(
    'blog-post',
    wrapPage({
      title: 'Blog | Car Wash Services',
      description: 'Redirecting to article…',
      dataPage: 'Blog',
      canonical: `${SITE}/blog-post`,
      body: `<script>
var map=${slugMapJson};
var s=new URLSearchParams(location.search).get('slug');
if(s&&map[s])location.replace(map[s]+'/');
else if(s)location.replace('/blog/'+encodeURIComponent(s)+'/');
else location.replace('/blog/');
</script><p style="padding:48px 24px;text-align:center">Redirecting… <a href="/blog">Go to Blog</a></p>`,
    })
  );
  count++;

  // Water reclaim ROI landing
  writePage(
    'water-reclaim-roi',
    wrapPage({
      title: 'Water Reclaim ROI Calculator | Car Wash Services',
      description:
        'Calculate how much your failing reclaim system is costing you. Most tunnel washes waste 30–50% more water than necessary.',
      dataPage: 'Calculator',
      canonical: `${SITE}/water-reclaim-roi`,
      image: 'https://media.base44.com/images/public/699f163455fdaf19c59586b8/94eaf06c7_image.png',
      body: `
  <section style="position:relative;padding:80px 24px;overflow:hidden;background:linear-gradient(135deg,#02133F,#0A1E52);color:#fff;text-align:center">
    <div class="wrap" style="position:relative;max-width:44rem;margin:0 auto">
      <span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A961;margin-bottom:16px">Water &amp; Reclaim ROI</span>
      <h1 style="font-size:clamp(2rem,4vw,2.8rem);font-weight:900;margin:0 0 16px;line-height:1.1">Is your reclaim system silently wasting water?</h1>
      <p style="color:#cbd5e1;font-size:17px;line-height:1.7;margin:0 auto 28px;max-width:36rem">Most operators assume their reclaim works. Silent failures cost the average tunnel wash <strong style="color:#fff">30–50% more water</strong> than necessary — often $800–$2,400/month in recoverable savings.</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">
        <a href="/calculator" class="btn btn-blue" style="padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700">Run the ROI Calculator</a>
        <a href="/blog/how-much-water-does-car-wash-use" class="btn" style="padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;border:1px solid rgba(255,255,255,.3);color:#fff">Read the Water Guide</a>
      </div>
    </div>
  </section>
  <section style="padding:64px 24px;background:#fff">
    <div class="wrap" style="max-width:48rem;margin:0 auto">
      <h2 style="font-size:24px;font-weight:900;color:#02133F;margin:0 0 20px">What you'll learn</h2>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px">
        <li style="display:flex;gap:12px;color:#334155;line-height:1.6"><span style="color:#0F52FB;font-weight:800">✓</span> How much water your wash type should use per vehicle</li>
        <li style="display:flex;gap:12px;color:#334155;line-height:1.6"><span style="color:#0F52FB;font-weight:800">✓</span> The 4 most common reclaim failure points operators miss</li>
        <li style="display:flex;gap:12px;color:#334155;line-height:1.6"><span style="color:#0F52FB;font-weight:800">✓</span> Warning signs your system is operating in failure mode right now</li>
        <li style="display:flex;gap:12px;color:#334155;line-height:1.6"><span style="color:#0F52FB;font-weight:800">✓</span> A remediation framework to restore reclaim performance</li>
      </ul>
      <div style="margin-top:32px;padding:24px;border-radius:14px;background:rgba(15,82,251,.05);border:1px solid rgba(15,82,251,.15)">
        <p style="margin:0 0 16px;color:#334155;line-height:1.7">Want a professional audit? Our team will review your reclaim operation and identify savings — at no cost.</p>
        <a href="/book-a-call" class="btn btn-blue" style="padding:12px 24px;border-radius:8px;font-size:14px;font-weight:700">Book a Free Strategy Call</a>
      </div>
    </div>
  </section>`,
    })
  );
  count++;

  // CMS Guide
  writePage(
    'cms-guide',
    wrapPage({
      title: 'CMS Guide | Car Wash Services',
      description: 'Content management guide for updating site content.',
      dataPage: 'Resources',
      canonical: `${SITE}/cms-guide`,
      noindex: true,
      body: `
  <section style="padding:64px 24px;background:#fff">
    <div class="wrap" style="max-width:48rem">
      <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#0F52FB">CMS Guide</span>
      <h1 style="font-size:clamp(1.8rem,4vw,2.4rem);font-weight:900;color:#02133F;margin:16px 0">Content Management System Guide</h1>
      <p style="color:#64748b;line-height:1.7;margin-bottom:32px">Learn how to update content without touching code.</p>
      <div style="display:flex;flex-direction:column;gap:24px;color:#334155;line-height:1.7">
        <div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0">
          <h2 style="font-size:18px;font-weight:800;color:#02133F;margin:0 0 8px">How the CMS Works</h2>
          <p style="margin:0">This site uses static HTML pages in the <code>source/</code> folder. Edit those files, then run <code>npm run build</code> to publish changes.</p>
        </div>
        <div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0">
          <h2 style="font-size:18px;font-weight:800;color:#02133F;margin:0 0 8px">Blog posts</h2>
          <p style="margin:0">Add a new <code>blog-your-slug.html</code> file in <code>source/</code> and register it in <code>scripts/build.mjs</code>.</p>
        </div>
        <div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0">
          <h2 style="font-size:18px;font-weight:800;color:#02133F;margin:0 0 8px">Chemical products</h2>
          <p style="margin:0">Product pages are generated from <code>scripts/products.mjs</code>. Update product data there and rebuild.</p>
        </div>
      </div>
    </div>
  </section>`,
    })
  );
  count++;

  // Auth stubs (noindex)
  const authBody = (heading, text, ctaHref, ctaLabel) => `
  <section style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:48px 24px;background:#f8fafc">
    <div style="max-width:28rem;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:40px;text-align:center;box-shadow:0 4px 24px rgba(2,19,63,.06)">
      <h1 style="font-size:24px;font-weight:900;color:#02133F;margin:0 0 12px">${heading}</h1>
      <p style="color:#64748b;line-height:1.6;margin:0 0 24px">${text}</p>
      <a href="${ctaHref}" class="btn btn-blue" style="display:inline-flex;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:700">${ctaLabel}</a>
    </div>
  </section>`;

  const authPages = [
    {
      route: 'login',
      title: 'Team Login | Car Wash Services',
      heading: 'Team Login',
      text: 'Staff login has moved with our site migration. Contact us if you need access to internal tools.',
      cta: '/contact',
      label: 'Contact Support',
    },
    {
      route: 'register',
      title: 'Register | Car Wash Services',
      heading: 'Create Account',
      text: 'New account registration is handled by our team. Reach out to get set up.',
      cta: '/contact',
      label: 'Contact Us',
    },
    {
      route: 'forgot-password',
      title: 'Forgot Password | Car Wash Services',
      heading: 'Forgot Password',
      text: 'Password reset is managed by our team during the site migration. Email us for help.',
      cta: 'mailto:info@carwashmgmt.com',
      label: 'Email Support',
    },
    {
      route: 'reset-password',
      title: 'Reset Password | Car Wash Services',
      heading: 'Reset Password',
      text: 'Use the link from your reset email, or contact support if you need assistance.',
      cta: '/contact',
      label: 'Contact Support',
    },
  ];

  for (const p of authPages) {
    writePage(
      p.route,
      wrapPage({
        title: p.title,
        description: p.heading,
        dataPage: 'Contact',
        canonical: `${SITE}/${p.route}`,
        noindex: true,
        body: authBody(p.heading, p.text, p.cta, p.label),
      })
    );
    count++;
  }

  // Add chemical product slugs to sitemap via return value
  const productSitemap = products.map((p) => ({
    path: `chemical-product/${p.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-06-29',
  }));

  console.log(`Generated ${count} extra pages (${products.length} chemical products)`);
  return [...EXTRA_SITEMAP, ...productSitemap];
}
