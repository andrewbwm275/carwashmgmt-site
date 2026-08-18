/** Verify SEO essentials in dist/ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

let errors = 0;
function fail(msg) {
  console.error('FAIL:', msg);
  errors++;
}

function ok(msg) {
  console.log('OK:', msg);
}

if (!fs.existsSync(DIST)) {
  fail('dist/ missing — run npm run build');
  process.exit(1);
}

const home = path.join(DIST, 'index.html');
if (!fs.existsSync(home)) fail('index.html missing');
else {
  const html = fs.readFileSync(home, 'utf8');
  if (!html.includes('<header')) fail('homepage missing <header> in HTML');
  else ok('homepage has header in HTML');
  if (!html.includes('<main')) fail('homepage missing <main>');
  else ok('homepage has main');
  if (!html.includes('canonical')) fail('homepage missing canonical');
  else ok('homepage has canonical');
  if (html.includes('id="root"') && !html.includes('<header')) fail('looks like SPA shell');
}

const about = path.join(DIST, 'about', 'index.html');
if (!fs.existsSync(about)) fail('about/index.html missing');
else {
  const html = fs.readFileSync(about, 'utf8');
  if (!/<h1[\s>]/i.test(html)) fail('about missing h1');
  else ok('about has h1');
}

const redirects = path.join(DIST, '_redirects');
if (!fs.existsSync(redirects)) fail('_redirects missing');
else {
  const t = fs.readFileSync(redirects, 'utf8');
  if (!t.includes('/About /about')) fail('legacy /About redirect missing');
  else ok('legacy redirects present');
}

const robots = path.join(DIST, 'robots.txt');
if (!fs.existsSync(robots)) fail('robots.txt missing');
else ok('robots.txt present');

const sitemapCandidates = ['sitemap-index.xml', 'sitemap-0.xml', 'sitemap.xml'];
if (!sitemapCandidates.some((f) => fs.existsSync(path.join(DIST, f)))) {
  fail('sitemap missing');
} else ok('sitemap present');

if (errors) {
  console.error(`\n${errors} SEO check(s) failed`);
  process.exit(1);
}
console.log('\nAll SEO checks passed.');
