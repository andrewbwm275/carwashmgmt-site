/** Verify key routes exist in dist/ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from './products.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

const ROUTES = [
  '',
  'about',
  'services',
  'solutions',
  'chemistry',
  'equipment',
  'preventive-maintenance',
  'chemical-product',
  'results',
  'testimonials',
  'blog',
  'blog-post',
  'resources',
  'contact',
  'book-a-call',
  'calculator',
  'cms-guide',
  'submit-testimonial',
  'privacy-policy',
  'terms-and-conditions',
  'water-reclaim-roi',
  'login',
  'register',
  'forgot-password',
  'reset-password',
  'blog/reduce-chemical-costs',
  'blog/downtime-costs',
  'blog/profit-leaks',
  'blog/preventive-maintenance-guide',
  'blog/start-car-wash-california',
  'blog/best-car-wash-chemicals-2026',
  'blog/equipment-maintenance-schedule',
  'blog/staffing-optimization',
  'blog/throughput-optimization',
  'blog/how-much-water-does-car-wash-use',
  'blog/nano-bubble-roi-guide',
  'blog/cost-per-car',
  ...products.map((p) => `chemical-product/${p.slug}`),
];

let missing = 0;
for (const route of ROUTES) {
  const file = route ? path.join(DIST, route, 'index.html') : path.join(DIST, 'index.html');
  if (!fs.existsSync(file)) {
    console.error('MISSING:', route || '/');
    missing++;
  }
}

const redirects = fs.readFileSync(path.join(DIST, '_redirects'), 'utf8');
for (const r of ['/About', '/ChemicalProduct', '/BlogPost', '/BookACall', '/AdminChat', '/BlogAdmin']) {
  if (!redirects.includes(`${r} `)) {
    console.error('MISSING REDIRECT:', r);
    missing++;
  }
}

if (missing) {
  console.error(`\n${missing} route issues`);
  process.exit(1);
}
console.log(`All ${ROUTES.length} routes verified.`);
