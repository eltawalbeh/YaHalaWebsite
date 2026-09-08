import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const seo = fs.readFileSync(path.join(root, "src/app/lib/serviceSeo.ts"), "utf8");
const page = fs.readFileSync(path.join(root, "src/app/pages/ServiceDetailPage.tsx"), "utf8");

test("service detail uses native dynamic SEO without Helmet", () => {
  assert.match(seo, /export function applyServiceSeo/);
  assert.match(seo, /script\.type = "application\/ld\+json"/);
  assert.match(seo, /data-yahala-service-seo/);
  assert.match(page, /applyServiceSeo/);
  assert.doesNotMatch(page, /Helmet/);
});
