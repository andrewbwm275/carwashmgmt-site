import { renderHeader, renderFooter } from './partials.mjs';

const SITE = 'https://www.carwashmgmt.com';
const DEFAULT_OG = 'https://media.base44.com/images/public/699f163455fdaf19c59586b8/f50cc0d88_image.png';

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildSeoHead({ title, description, canonical, isArticle, image, noindex }) {
  const ogImage = image || DEFAULT_OG;
  const safeTitle = escAttr(title);
  const safeDesc = escAttr(description);
  const orgJson = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Car Wash Services LLC',
    url: SITE,
    logo: 'https://media.base44.com/images/public/699f163455fdaf19c59586b8/a0be2bc22_Untitleddesign7.png',
  };
  const websiteJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Car Wash Services',
    url: SITE,
  };
  const articleJson = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title.replace(/ \| Car Wash Services$/, ''),
        description,
        image: ogImage,
        author: { '@type': 'Organization', name: 'Car Wash Services' },
        publisher: { '@type': 'Organization', name: 'Car Wash Services LLC' },
        mainEntityOfPage: canonical,
      }
    : null;
  const schemas = [orgJson, websiteJson, articleJson].filter(Boolean);
  return `
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
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

export function wrapPage({ title, description, body, dataPage, canonical, isArticle, image, noindex, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escAttr(title)}</title>
<meta name="description" content="${escAttr(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
${extraHead}
${buildSeoHead({ title, description, canonical, isArticle, image, noindex })}
</head>
<body data-page="${dataPage}">
${renderHeader(dataPage)}
<main>${body}</main>
${renderFooter()}
<script src="/assets/site.js"></script>
</body>
</html>`;
}
