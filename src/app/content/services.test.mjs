import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "src/app");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("canonical service source has unique slugs and complete identity fields", async () => {
  const source = read("content/services.ts");
  const slugs = [...source.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.length >= 9);
  assert.match(source, /export const serviceBySlug/);
  assert.match(source, /name_ar:/);
  assert.match(source, /name_en:/);
});

test("public service pages consume the canonical source", () => {
  for (const file of ["pages/HomePage.tsx", "pages/ServicesPage.tsx", "pages/ServiceDetailPage.tsx"]) {
    assert.match(read(file), /content\/services/);
    assert.doesNotMatch(read(file), /const defaultServices\s*=|const defaultServicesMap\s*=/);
  }
});

test("unknown service slugs have an explicit not-found branch", () => {
  const source = read("pages/ServiceDetailPage.tsx");
  assert.match(source, /404|Not Found|not found/i);
  assert.match(source, /serviceBySlug/);
});
