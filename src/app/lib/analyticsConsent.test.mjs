import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const analytics = readFileSync(new URL("./analytics.ts", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

assert.match(analytics, /const pendingEvents/);
assert.match(analytics, /analytics_storage:\s*"granted"/);
assert.match(analytics, /function grantAnalyticsConsent\(/);
assert.match(analytics, /flushPendingEvents\(\)/);
assert.match(analytics, /localStorage\.setItem\(ANALYTICS_CONSENT_KEY, "granted"\)/);
assert.match(analytics, /function denyAnalyticsConsent\(/);
assert.match(app, /AnalyticsConsent/);

console.log("Analytics consent delivery contract: passed");
