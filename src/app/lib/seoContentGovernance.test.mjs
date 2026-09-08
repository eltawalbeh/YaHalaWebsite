import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../../..", import.meta.url);
const sitemap = readFileSync(new URL("public/sitemap.xml", root), "utf8");
const seo = readFileSync(new URL("src/app/lib/serviceSeo.ts", root), "utf8");
const detail = readFileSync(new URL("src/app/pages/ServiceDetailPage.tsx", root), "utf8");
const contact = readFileSync(new URL("src/app/pages/ContactPage.tsx", root), "utf8");

assert.match(sitemap, /services\/therapeutic-educational/);
assert.match(seo, /export function clearServiceSeo\(/);
assert.match(seo, /locale\?: "ar" \| "en"/);
assert.match(detail, /clearServiceSeo/);
assert.match(detail, /isAr/);
assert.doesNotMatch(contact, /tel:\+966\*\*\*\*3000/);

console.log("SEO and content-boundary regression contract: passed");
