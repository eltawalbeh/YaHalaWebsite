import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const monitoring = fs.readFileSync(path.join(root, "src/app/lib/errorMonitoring.ts"), "utf8");
const app = fs.readFileSync(path.join(root, "src/app/App.tsx"), "utf8");

test("error monitoring emits a provider-neutral safe event", () => {
  assert.match(monitoring, /export function reportError/);
  assert.match(monitoring, /yahala:error/);
  assert.match(monitoring, /\[EMAIL\]/);
  assert.match(monitoring, /\[URL\]/);
  assert.match(app, /reportError\(error\)/);
  assert.doesNotMatch(app, /this\.state\.error<\//);
});
