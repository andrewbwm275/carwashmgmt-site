import fs from "fs";
import path from "path";

const cdpFile = process.argv[2];
const outDir = "live-capture/raw";
fs.mkdirSync(outDir, { recursive: true });

const cdp = JSON.parse(fs.readFileSync(cdpFile, "utf8"));
const payload = JSON.parse(cdp.result.value); // { route, title, desc, canonical, html }
const outPath = path.join(outDir, `${payload.route}.json`);
fs.writeFileSync(outPath, JSON.stringify(payload));
console.log(`saved ${payload.route}: title="${payload.title}" html=${payload.html.length}b desc=${payload.desc.length}chars`);
