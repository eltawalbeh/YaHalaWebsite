import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.join(process.cwd(), "src/app/lib/pagination.ts"), "utf8");

test("pagination contract exposes bounded page results", () => {
  assert.match(source, /export function paginate/);
  assert.match(source, /totalPages/);
  assert.match(source, /items\.slice\(start, start \+ safePageSize\)/);
});

test("pagination contract clamps page and page size", () => {
  assert.match(source, /Math\.max\(1, Math\.floor\(pageSize\)\)/);
  assert.match(source, /Math\.min\(Math\.max\(1, Math\.floor\(page\)/);
});
