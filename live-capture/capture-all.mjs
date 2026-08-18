/**
 * Capture rendered HTML from live carwashmgmt.com pages.
 * Usage: node live-capture/capture-all.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.resolve("live-capture/raw");
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { route: "home", url: "https://www.carwashmgmt.com/" },
  { route: "about", url: "https://www.carwashmgmt.com/About" },
  { route: "services", url: "https://www.carwashmgmt.com/Services" },
  { route: "solutions", url: "https://www.carwashmgmt.com/Solutions" },
  { route: "equipment", url: "https://www.carwashmgmt.com/Equipment" },
  { route: "chemistry", url: "https://www.carwashmgmt.com/Chemistry" },
  { route: "preventive-maintenance", url: "https://www.carwashmgmt.com/PreventiveMaintenance" },
  { route: "results", url: "https://www.carwashmgmt.com/Results" },
  { route: "blog", url: "https://www.carwashmgmt.com/Blog" },
  { route: "contact", url: "https://www.carwashmgmt.com/Contact" },
  { route: "book-a-call", url: "https://www.carwashmgmt.com/BookACall" },
  { route: "calculator", url: "https://www.carwashmgmt.com/Calculator" },
  { route: "privacy-policy", url: "https://www.carwashmgmt.com/PrivacyPolicy" },
  { route: "terms-and-conditions", url: "https://www.carwashmgmt.com/TermsAndConditions" },
];

async function dismissPopup(page) {
  await page.evaluate(() => {
    document.querySelectorAll("h1,h2,h3").forEach((h) => {
      if (/Get Our Profit Guide Free/i.test(h.textContent || "")) {
        let el = h;
        while (el && el !== document.body) {
          const pos = getComputedStyle(el).position;
          if (pos === "fixed" || pos === "absolute") {
            // Prefer fixed overlay; also remove common modal wrappers
            if (pos === "fixed" || (el.className && /fixed|modal|overlay/i.test(String(el.className)))) {
              el.remove();
              return;
            }
          }
          el = el.parentElement;
        }
      }
    });
    // Also remove any remaining fixed full-screen overlays with the guide copy
    document.querySelectorAll("div").forEach((d) => {
      if (
        getComputedStyle(d).position === "fixed" &&
        /Get Our Profit Guide Free/i.test(d.textContent || "") &&
        d.querySelector('input[type="email"], input[placeholder*="email" i]')
      ) {
        d.remove();
      }
    });
  });
}

async function capturePage(browser, { route, url }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    // Wait for SPA content
    await page.waitForSelector("h1", { timeout: 30000 });
    await page.waitForTimeout(800);
    await dismissPopup(page);

    const payload = await page.evaluate((r) => {
      const m = document.querySelector('meta[name="description"]');
      const c = document.querySelector('link[rel="canonical"]');
      return {
        route: r,
        title: document.title,
        desc: m ? m.content : "",
        canonical: c ? c.href : location.href,
        html: document.body.outerHTML,
      };
    }, route);

    const outPath = path.join(OUT, `${route}.json`);
    fs.writeFileSync(outPath, JSON.stringify(payload));
    console.log(`✓ ${route}: "${payload.title}" (${payload.html.length} bytes)`);
    return payload;
  } catch (err) {
    console.error(`✗ ${route}: ${err.message}`);
    return null;
  } finally {
    await page.close();
  }
}

async function discoverBlogPosts(browser) {
  const page = await browser.newPage();
  try {
    await page.goto("https://www.carwashmgmt.com/Blog", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector("h1,h2", { timeout: 30000 });
    await page.waitForTimeout(1000);
    const links = await page.evaluate(() => {
      const hrefs = [...document.querySelectorAll("a[href]")]
        .map((a) => a.getAttribute("href"))
        .filter(Boolean);
      // Blog posts typically use /BlogPost?slug=... or /blog/...
      const slugs = new Set();
      for (const h of hrefs) {
        const m1 = h.match(/[?&]slug=([^&]+)/i);
        if (m1) slugs.add(decodeURIComponent(m1[1]));
        const m2 = h.match(/\/BlogPost\/([^/?#]+)/i);
        if (m2) slugs.add(decodeURIComponent(m2[1]));
        const m3 = h.match(/\/blog\/([^/?#]+)/i);
        if (m3 && m3[1] !== "") slugs.add(decodeURIComponent(m3[1]));
      }
      return [...slugs];
    });
    console.log(`Found ${links.length} blog slugs:`, links);
    return links;
  } catch (err) {
    console.error("blog discovery failed:", err.message);
    return [];
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const p of PAGES) {
      await capturePage(browser, p);
    }

    const slugs = await discoverBlogPosts(browser);
    for (const slug of slugs) {
      const url = `https://www.carwashmgmt.com/BlogPost?slug=${encodeURIComponent(slug)}`;
      await capturePage(browser, { route: `blog-${slug}`, url });
    }

    // Also try ChemicalProduct pages if chemistry page links to them
    const chemPath = path.join(OUT, "chemistry.json");
    if (fs.existsSync(chemPath)) {
      const chem = JSON.parse(fs.readFileSync(chemPath, "utf8"));
      const productSlugs = [
        ...chem.html.matchAll(/[?&]slug=([^"'&\s]+)/gi),
        ...chem.html.matchAll(/\/ChemicalProduct\/([^"'/?#]+)/gi),
        ...chem.html.matchAll(/\/chemical-product\/([^"'/?#]+)/gi),
      ].map((m) => decodeURIComponent(m[1]));
      const unique = [...new Set(productSlugs)];
      console.log(`Found ${unique.length} product slugs`);
      for (const slug of unique) {
        const url = `https://www.carwashmgmt.com/ChemicalProduct?slug=${encodeURIComponent(slug)}`;
        await capturePage(browser, { route: `product-${slug}`, url });
      }
    }
  } finally {
    await browser.close();
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
