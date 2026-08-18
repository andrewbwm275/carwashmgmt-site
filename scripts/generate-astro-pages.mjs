/**
 * Generate Astro pages from prepared content metadata.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const META = path.join(ROOT, 'src', 'data', 'pages.generated.ts');
const PAGES = path.join(ROOT, 'src', 'pages');

const metaSrc = fs.readFileSync(META, 'utf8');
const jsonMatch = metaSrc.match(/export const pages: PageMeta\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) throw new Error('Could not parse pages.generated.ts');
const pages = JSON.parse(jsonMatch[1]);

function writePage(route, contentKey, title, description, dataPage, isArticle) {
  const isIndex = route === '';
  const filePath = isIndex
    ? path.join(PAGES, 'index.astro')
    : path.join(PAGES, ...route.split('/')) + '.astro';

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // pages/index.astro → depth 1; pages/about.astro → 1; pages/blog/x.astro → 2
  const depth = isIndex ? 1 : route.split('/').length;
  const up = '../'.repeat(depth);
  const relToContent = `${up}fragments/${contentKey}.html?raw`;
  const relToLayout = `${up}layouts/BaseLayout.astro`;

  const astro = `---
import BaseLayout from '${relToLayout}';
import content from '${relToContent}';
---

<BaseLayout
  title=${JSON.stringify(title)}
  description=${JSON.stringify(description)}
  canonicalPath=${JSON.stringify(route)}
  dataPage=${JSON.stringify(dataPage)}
  isArticle={${isArticle}}
>
  <Fragment set:html={content} />
</BaseLayout>
`;
  fs.writeFileSync(filePath, astro);
}

for (const p of pages) {
  writePage(p.route, p.contentKey, p.title, p.description, p.dataPage, p.isArticle);
}

console.log(`Generated ${pages.length} Astro pages`);
