import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("static SEO contract is present and admin is excluded", () => {
  const html = read("index.html");
  const robots = read("public/robots.txt");
  const sitemap = read("public/sitemap.xml");
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /\*{2,}/);
  assert.match(html, /rel="canonical"/);
  assert.match(robots, /Disallow: \/admin/);
  assert.doesNotMatch(sitemap, /\/admin/);
});

test("analytics contract contains only approved Ya Hala public events", () => {
  const analytics = read("src/app/lib/analytics.ts");
  for (const event of ["service_view", "quote_start", "quote_submit", "contact_submit"]) assert.match(analytics, new RegExp(event));
  assert.doesNotMatch(analytics, /al.?etihad|etihad/i);
  assert.match(analytics, /CustomEvent\("yahala:analytics"/);
  assert.match(analytics, /analyticsWindow\.gtag\("event", name/);
  assert.match(analytics, /safeKeys = new Set/);
  assert.doesNotMatch(analytics, /email|phone|contact_details/i);
});

test("dashboard chart uses API activity rather than static demo data", () => {
  const dashboard = read("src/app/admin/AdminDashboard.tsx");
  const server = read("supabase/functions/server/index.tsx");
  assert.match(dashboard, /stats\?\.activity/);
  assert.doesNotMatch(dashboard, /const mockChartData/);
  assert.match(server, /const activity = Array\.from/);
});

test("health endpoint exposes a safe Ya Hala release marker", () => {
  const server = read("supabase/functions/server/index.tsx");
  assert.match(server, /service: "Ya Hala Travel & Tourism API"/);
  assert.match(server, /release: "6\.0\.0-local"/);
  assert.match(server, /checked_at: new Date\(\)\.toISOString\(\)/);
});

test("dashboard exposes safe response timing and recent audit alerts", () => {
  const server = read("supabase/functions/server/index.tsx");
  assert.match(server, /response_time_ms: Date\.now\(\) - requestStartedAt/);
  assert.match(server, /audit_alerts: auditAlerts/);
  assert.doesNotMatch(server, /auditAlerts.*actor_email/);
});

test("CORS uses an explicit Ya Hala origin allowlist", () => {
  const server = read("supabase/functions/server/index.tsx");
  assert.match(server, /const allowedOrigins = new Set/);
  assert.ok(server.includes('"https://yahala.co"'));
  assert.doesNotMatch(server, /origin: "\*"/);
});
