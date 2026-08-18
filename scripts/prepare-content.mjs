/**
 * Transform source/*.html → src/content/html/*.html (main inner HTML only)
 * and write page metadata for Astro.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from './products.mjs';
import { PILLAR_CARDS } from './partials.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'source');
const OUT = path.join(ROOT, 'src', 'fragments');
const META_OUT = path.join(ROOT, 'src', 'data', 'pages.generated.ts');

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

function extractMeta(html, name) {
  // Double-quoted content allows apostrophes inside the value
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content="([^"]*)"`, 'i');
  const m = html.match(re);
  if (m) return m[1];
  const reSingle = new RegExp(`<meta\\s+name=["']${name}["']\\s+content='([^']*)'`, 'i');
  const m2 = html.match(reSingle);
  return m2 ? m2[1] : '';
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

function transformContactForm(html) {
  return html
    .replace(/<form data-mock data-success="Request received!"/, '<form data-form="contact" data-success="Request received!"')
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

function transformCalculator(html) {
  return html.replace(
    /document\.getElementById\('to-step3'\)\.onclick=function\(\)\{[\s\S]*?setStep\(3\);\s*\};/,
    `document.getElementById('to-step3').onclick=async function(){
      var name=document.getElementById('ld-name').value, email=document.getElementById('ld-email').value, city=document.getElementById('ld-city').value;
      if(!name||!email||!city){alert('Please enter your name, email, and city/state.');return;}
      var r=compute();
      var btn=document.getElementById('to-step3');
      var prev=btn?btn.innerHTML:'';
      if(btn){btn.disabled=true;btn.textContent='Processing…';}
      try{
        await fetch('/api/calculator',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          name:name,email:email,phone:(document.getElementById('ld-phone')||{}).value||'',
          city_state:city,locations:(document.getElementById('ld-loc')||{}).value||'1',
          results:r,
          cars:(document.getElementById('cal-cars')||{}).value,
          water:(document.getElementById('cal-water')||{}).value,
          chem:(document.getElementById('cal-chem')||{}).value,
          pit:(document.getElementById('cal-pit')||{}).value,
          maint:(document.getElementById('cal-maint')||{}).value
        })});
      }catch(e){}
      if(btn){btn.disabled=false;btn.innerHTML=prev;}
      document.getElementById('res-annual').textContent=money(r.total_annual);
      document.getElementById('res-monthly').textContent=money(r.total_monthly);
      document.getElementById('res-roi').textContent=r.roi;
      document.getElementById('res-water').textContent=money(r.water_savings);
      document.getElementById('res-chem').textContent=money(r.chemical_savings);
      document.getElementById('res-maint').textContent=money(r.maintenance_savings);
      document.getElementById('res-conf').textContent=r.conf+'%';
      setStep(3);
    };`
  );
}

function extractMainInner(html) {
  const m = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  if (!m) throw new Error('No <main> found');
  let inner = m[1].trim();
  // Keep page scripts that sit after </main> (e.g. calculator)
  const afterMain = html.slice(html.toLowerCase().indexOf('</main>') + 7);
  const scripts = [...afterMain.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map((x) => x[0]);
  if (scripts.length) {
    inner += '\n' + scripts.join('\n');
  }
  return inner;
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.dirname(META_OUT), { recursive: true });

const pages = [];

for (const [file, route] of Object.entries(FILE_TO_PATH)) {
  const raw = fs.readFileSync(path.join(SOURCE, file), 'utf8');
  let html = rewriteLinks(raw);

  if (file === 'index.html') {
    html = html.replace(
      /<div class="pillars-grid"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="pillars-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">\n        ${PILLAR_CARDS}\n      </div>\n    </div>\n  </section>`
    );
    html = html.replace(/<script>[\s\S]*?pillar cards[\s\S]*?<\/script>/, '');
  }
  if (file === 'contact.html') html = transformContactForm(html);
  if (file === 'chemistry.html') html = transformChemistryPage(html);
  if (file === 'submit-testimonial.html') html = transformTestimonialForm(html);
  if (file === 'calculator.html') html = transformCalculator(html);

  // Drop header/footer placeholders inside main if any (they are outside main)
  const inner = extractMainInner(html);
  const contentKey = route === '' ? 'index' : route.replace(/\//g, '__');
  const outFile = path.join(OUT, `${contentKey}.html`);
  fs.writeFileSync(outFile, inner);

  const title = extractTitle(raw);
  const description = extractMeta(raw, 'description') || title;
  const dataPage = extractDataPage(raw);
  const isArticle = route.startsWith('blog/') && route !== 'blog';

  pages.push({
    route,
    contentKey,
    title,
    description,
    dataPage,
    isArticle,
  });
}

const ts = `/** Auto-generated by scripts/prepare-content.mjs — do not edit */
export type PageMeta = {
  route: string;
  contentKey: string;
  title: string;
  description: string;
  dataPage: string;
  isArticle: boolean;
};

export const pages: PageMeta[] = ${JSON.stringify(pages, null, 2)};
`;
fs.writeFileSync(META_OUT, ts);
console.log(`Prepared ${pages.length} content fragments → ${OUT}`);
