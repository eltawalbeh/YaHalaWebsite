import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.join(process.cwd(), "src/app/lib/adminTableTools.ts"), "utf8");

test("admin table tools define shared filters and exports", () => {
  assert.match(source, /export function filterRecords/);
  assert.match(source, /filters\.from/);
  assert.match(source, /filters\.to/);
  assert.match(source, /export function rowsToCsv/);
  assert.match(source, /export function printPdf/);
});

test("CSV cells escape embedded quotes", () => {
  assert.match(source, /replace\(\/\"\/g, '\"\"'\)/);
});
