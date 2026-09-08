import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const routes = readFileSync(new URL('../../../src/app/routes.ts', import.meta.url), 'utf8');
const vite = readFileSync(new URL('../../../vite.config.ts', import.meta.url), 'utf8');

test('public and admin pages are loaded through route-level lazy imports', () => {
  assert.match(routes, /lazy:\s*load\(\(\)\s*=>\s*import\(['"]\.\/pages\/HomePage['"]\)/);
  assert.match(routes, /lazy:\s*load\(\(\)\s*=>\s*import\(['"]\.\/admin\/AdminDashboard['"]\)/);
});

test('heavy chart dependency is isolated from the public entry', () => {
  assert.match(vite, /manualChunks/);
  assert.match(vite, /recharts/);
});

test('lazy route trees provide an explicit hydration fallback', () => {
  assert.match(routes, /import HydrateFallback/);
  assert.equal((routes.match(/HydrateFallback,/g) || []).length, 2);
});
