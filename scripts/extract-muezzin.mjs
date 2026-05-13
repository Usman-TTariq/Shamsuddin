import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const src = path.join(
  "C:",
  "Users",
  "User",
  ".cursor",
  "projects",
  "c-Users-User-Documents-development-shamsuddin",
  "uploads",
  "c__Shamsuddin_naudummy.com_muezzin_index-L1-L2819-0.html"
);
const html = fs.readFileSync(src, "utf8");

const headM = html.match(/<head>([\s\S]*?)<\/head>/i);
if (!headM) throw new Error("no head");
let head = headM[1];
head = head.replace(/<script[\s\S]*?<\/script>/gi, "");
/** Next.js `public/wp-content` is served at `/wp-content` */
head = head.replace(/href="(wp-content[^"]*)"/gi, (_, p1) => `href="/${p1}"`);
head = head.replace(/href='(wp-content[^']*)'/gi, (_, p1) => `href='/${p1}'`);
head = head.replace(/src="(wp-content[^"]*)"/gi, (_, p1) => `src="/${p1}"`);
head = head.replace(/href="(wp-includes[^"]*)"/gi, (_, p1) => `href="/${p1}"`);
head = head.replace(/href='(wp-includes[^']*)'/gi, (_, p1) => `href='/${p1}'`);
head = head.replace(/<title>[\s\S]*?<\/title>/i, "");

const mainM = html.match(/<main>([\s\S]*?)<\/main>/i);
if (!mainM) throw new Error("no main");
let main = mainM[1];
main = main.replace(/<img\b([^>]*?)\ssrc="[^"]*"/gi, '<img$1 src=""');
main = main.replace(/<img\b([^>]*?)\ssrc='[^']*'/gi, '<img$1 src=""');
main = main.replace(/style="([^"]*)"/gi, (full, st) => {
  if (!/background-image\s*:\s*url\(/i.test(st)) return full;
  const n = st.replace(/background-image\s*:\s*url\([^)]*\)\s*;?/gi, "").trim();
  return n ? `style="${n}"` : `style=""`;
});

const out = path.join(projectRoot, "content");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "muezzin-head-fragment.html"), head, "utf8");
fs.writeFileSync(path.join(out, "muezzin-main-fragment.html"), main, "utf8");
console.log("wrote head", head.length, "main", main.length);
