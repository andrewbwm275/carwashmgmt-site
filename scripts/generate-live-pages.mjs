/**
 * Generate Astro pages from live-pages.json metadata.
 */
import fs from "fs";
import path from "path";

const META = JSON.parse(fs.readFileSync("src/data/live-pages.json", "utf8"));
const PAGES = path.resolve("src/pages");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function fileForPath(urlPath) {
  if (urlPath === "/") return path.join(PAGES, "index.astro");
  // /blog/slug → blog/slug.astro
  // /chemical-product/slug → chemical-product/slug.astro
  // /about → about.astro
  const cleaned = urlPath.replace(/^\//, "");
  if (cleaned.includes("/")) {
    const parts = cleaned.split("/");
    const dir = path.join(PAGES, ...parts.slice(0, -1));
    ensureDir(dir);
    return path.join(dir, `${parts[parts.length - 1]}.astro`);
  }
  return path.join(PAGES, `${cleaned}.astro`);
}

function relativeImport(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function pageSource(meta, outFile) {
  const layout = relativeImport(outFile, path.resolve("src/layouts/LiveLayout.astro"));
  const frag = relativeImport(outFile, path.resolve(`src/${meta.fragment}`));
  const title = JSON.stringify(meta.title);
  const desc = JSON.stringify(meta.description || "");
  const canonical = JSON.stringify(
    (meta.canonical || "").replace("https://carwashmgmt.com", "https://www.carwashmgmt.com") ||
      `https://www.carwashmgmt.com${meta.path}`
  );
  const pageKey = JSON.stringify(meta.route);

  return `---
import LiveLayout from '${layout}';
import content from '${frag}?raw';

const title = ${title};
const description = ${desc};
const canonical = ${canonical};
const pageKey = ${pageKey};
---

<LiveLayout title={title} description={description} canonical={canonical} pageKey={pageKey}>
  <div set:html={content} />
</LiveLayout>
`;
}

// Remove stale generated pages that conflict? Keep auth stubs.
// We'll overwrite public marketing pages from captures.

let n = 0;
for (const meta of META) {
  const out = fileForPath(meta.path);
  ensureDir(path.dirname(out));
  fs.writeFileSync(out, pageSource(meta, out));
  n++;
  console.log(`page ${meta.path} → ${path.relative(process.cwd(), out)}`);
}
console.log(`Generated ${n} Astro pages`);
