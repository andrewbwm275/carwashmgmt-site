/**
 * Process live-capture/raw/*.json → cleaned HTML fragments + page metadata.
 * Rewrites PascalCase SPA links to clean crawlable routes.
 */
import fs from "fs";
import path from "path";

const RAW = path.resolve("live-capture/raw");
const OUT_FRAG = path.resolve("src/live-fragments");
const OUT_META = path.resolve("src/data/live-pages.json");
const PUBLIC_CSS = path.resolve("public/assets/live.css");

fs.mkdirSync(OUT_FRAG, { recursive: true });
fs.mkdirSync(path.dirname(OUT_META), { recursive: true });
fs.mkdirSync(path.dirname(PUBLIC_CSS), { recursive: true });

// Copy exact live CSS bundle
const cssSrc = path.resolve("live-capture/assets/live.css");
if (fs.existsSync(cssSrc)) {
  fs.copyFileSync(cssSrc, PUBLIC_CSS);
  console.log("copied live.css → public/assets/live.css");
}

const ROUTE_MAP = {
  "/Home": "/",
  "/About": "/about",
  "/Services": "/services",
  "/Solutions": "/solutions",
  "/Equipment": "/equipment",
  "/Chemistry": "/chemistry",
  "/PreventiveMaintenance": "/preventive-maintenance",
  "/Results": "/results",
  "/Blog": "/blog",
  "/Contact": "/contact",
  "/BookACall": "/book-a-call",
  "/Calculator": "/calculator",
  "/PrivacyPolicy": "/privacy-policy",
  "/TermsAndConditions": "/terms-and-conditions",
  "/Testimonials": "/testimonials",
  "/SubmitTestimonial": "/submit-testimonial",
  "/Resources": "/resources",
  "/Login": "/login",
  "/Register": "/register",
};

/** @type {Record<string, string>} */
const HOME_FAQS = {
  "How much does a consultation cost?":
    "Our initial consultation is completely free. We'll review your operation, identify opportunities, and give you clear next steps with no obligation.",
  "Do you work with single-location operators?":
    "Yes. We work with both single-location owners and multi-site operators. Whether you're just getting started or managing multiple washes, we tailor our approach to your operation.",
  "What areas do you serve?":
    "We work with clients across the United States and support both on-site and remote consultations depending on your needs.",
  "How quickly can we see results?":
    "Many clients begin seeing improvements within weeks, especially when addressing chemical usage, maintenance issues, and operational inefficiencies.",
  "What types of problems can you help solve?":
    "We help reduce chemical and water costs, eliminate downtime, improve wash quality, optimize equipment performance, and increase overall profitability.",
  "What happens after the consultation?":
    "You'll receive a clear breakdown of your operation, key issues, and actionable recommendations. From there, you can choose to implement changes yourself or continue working with us for ongoing support.",
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rewriteLinks(html) {
  let out = html;

  // BlogPost?slug= → /blog/slug
  out = out.replace(
    /href="\/BlogPost\?slug=([^"]+)"/gi,
    (_, slug) => `href="/blog/${decodeURIComponent(slug)}"`
  );
  // ChemicalProduct?slug= → /chemical-product/slug
  out = out.replace(
    /href="\/ChemicalProduct\?slug=([^"]+)"/gi,
    (_, slug) => `href="/chemical-product/${decodeURIComponent(slug)}"`
  );
  // Also handle /blog-post?slug= variants
  out = out.replace(
    /href="\/[Bb]log-[Pp]ost\?slug=([^"]+)"/gi,
    (_, slug) => `href="/blog/${decodeURIComponent(slug)}"`
  );

  // PascalCase routes
  for (const [from, to] of Object.entries(ROUTE_MAP)) {
    const re = new RegExp(`href="${from.replace(/\//g, "\\/")}"`, "g");
    out = out.replace(re, `href="${to}"`);
  }

  // Strip tracking params from calendly
  out = out.replace(
    /https:\/\/calendly\.com\/andrew-carwashmgmt\?[^"]+/g,
    "https://calendly.com/andrew-carwashmgmt"
  );

  return out;
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

function extractRoot(html) {
  // Prefer #root contents
  const m = html.match(/<div id="root">([\s\S]*)<\/div>\s*$/i);
  if (m) return m[1];
  // body inner
  const b = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (b) return b[1];
  return html;
}

function injectFaqAnswers(html) {
  // After each FAQ question button that matches known Qs, inject answer panel if missing
  for (const [q, a] of Object.entries(HOME_FAQS)) {
    const qEsc = escapeHtml(q);
    // If answer already present nearby, skip
    if (html.includes(a.slice(0, 40))) continue;

    // Find the button containing the question span and close of its parent card div
    // Pattern: ...>QUESTION?</span>...<svg>...</svg></button></div>
    // Insert answer before </div> that closes the card
    const needle = `>${q}</span>`;
    const idx = html.indexOf(needle);
    if (idx === -1) continue;

    // Find the </button></div> after this question
    const after = html.indexOf("</button>", idx);
    if (after === -1) continue;
    const insertAt = after + "</button>".length;

    const panel = `<div class="cwm-faq-answer hidden px-6 pb-4 text-sm text-slate-600 leading-relaxed" data-faq-answer hidden>${escapeHtml(a)}</div>`;
    html = html.slice(0, insertAt) + panel + html.slice(insertAt);
  }
  return html;
}

function annotateForms(html, route) {
  // Mark forms for live-interact.js by context
  // Guide form: "Send Me the Guide"
  html = html.replace(
    /(<form[^>]*)(>[\s\S]*?Send Me the Guide)/i,
    (_, open, rest) => {
      if (/data-cwm-form=/.test(open)) return open + rest;
      return `${open} data-cwm-form="guide" action="/api/guide" method="POST"${rest}`;
    }
  );

  // Contact forms (pages with Contact)
  if (route === "contact") {
    html = html.replace(/<form(?![^>]*data-cwm-form)/i, '<form data-cwm-form="contact" action="/api/contact" method="POST"');
  }

  // Newsletter in footer / popup patterns: "Get Free Guide"
  html = html.replace(
    /(<form[^>]*)(>[\s\S]*?Get Free Guide)/i,
    (_, open, rest) => {
      if (/data-cwm-form=/.test(open)) return open + rest;
      return `${open} data-cwm-form="newsletter" action="/api/newsletter" method="POST"${rest}`;
    }
  );

  return html;
}

function annotateFaqButtons(html) {
  // Add data-cwm-faq to FAQ accordion buttons (questions ending with ?)
  return html.replace(
    /<button([^>]*class="[^"]*w-full flex items-center justify-between[^"]*"[^>]*)>/gi,
    '<button$1 type="button" data-cwm-faq>'
  );
}

function annotateMobileMenu(html) {
  // Mark the hamburger button
  return html.replace(
    /<button([^>]*class="[^"]*lg:hidden[^"]*"[^>]*)>/i,
    '<button$1 type="button" data-cwm-mobile-toggle aria-label="Open menu">'
  );
}

function annotateDropdownsSimple(html) {
  // Insert data-cwm-dropdown on the relative div wrapping Services and Results links
  html = html.replace(
    /<div class="relative">(\s*<a[^>]*href="\/solutions"[^>]*>Services)/i,
    '<div class="relative" data-cwm-dropdown="services">$1'
  );
  html = html.replace(
    /<div class="relative">(\s*<a[^>]*href="\/results"[^>]*>Results)/i,
    '<div class="relative" data-cwm-dropdown="results">$1'
  );
  return html;
}

function annotateCalculator(html, route) {
  if (route !== "calculator") return html;
  // Mark the step-1 section container
  return html.replace(
    /(<section class="py-12 px-6 bg-slate-50[^"]*"[^>]*>)/i,
    '$1<div data-cwm-calculator><!-- hydrated by live-interact.js --></div>'
  );
}

/**
 * Map capture route key → Astro URL path
 */
function routeToPath(route) {
  if (route === "home") return "/";
  if (route.startsWith("blog-")) return `/blog/${route.slice(5)}`;
  if (route.startsWith("product-")) return `/chemical-product/${route.slice(8)}`;
  return `/${route}`;
}

function processOne(file) {
  const raw = JSON.parse(fs.readFileSync(path.join(RAW, file), "utf8"));
  const route = raw.route;
  let html = raw.html;
  html = stripScripts(html);
  html = extractRoot(html);
  html = rewriteLinks(html);
  html = injectFaqAnswers(html);
  html = annotateFaqButtons(html);
  html = annotateMobileMenu(html);
  html = annotateDropdownsSimple(html);
  html = annotateForms(html, route);
  // Don't double-inject calculator marker into every page

  const outFile = path.join(OUT_FRAG, `${route}.html`);
  fs.writeFileSync(outFile, html);

  return {
    route,
    path: routeToPath(route),
    title: raw.title || "Car Wash Management",
    description: raw.desc || "",
    canonical: raw.canonical || `https://www.carwashmgmt.com${routeToPath(route)}`,
    fragment: `live-fragments/${route}.html`,
  };
}

const files = fs.readdirSync(RAW).filter((f) => f.endsWith(".json")).sort();
const pages = [];
for (const f of files) {
  try {
    const meta = processOne(f);
    pages.push(meta);
    console.log(`✓ ${meta.route} → ${meta.path}`);
  } catch (e) {
    console.error(`✗ ${f}:`, e.message);
  }
}

fs.writeFileSync(OUT_META, JSON.stringify(pages, null, 2));
console.log(`\nWrote ${pages.length} pages → ${OUT_META}`);
