import test from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter, pickContactPayload, validateContactPayload } from "./input-validation.js";
import { canManagePublicContent, canManageUsers, isSupportedRole } from "./rbac.js";

test("public intake boundaries reject oversized payloads and enforce rate limits", () => {
  assert.equal(validateContactPayload({ name: "A", email: "a@example.com", phone: "123", message: "x" }).ok, true);
  assert.equal(validateContactPayload({ name: "A", email: "a@example.com", phone: "123", message: "x".repeat(5001) }).error, "Invalid request");
  const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
  assert.equal(limiter.allow("test").allowed, true);
  assert.equal(limiter.allow("test").allowed, true);
  assert.equal(limiter.allow("test").allowed, false);
});

test("admin authorization distinguishes supported roles and payload whitelist", () => {
  assert.equal(isSupportedRole("super_admin"), true);
  assert.equal(isSupportedRole("editor"), false);
  assert.equal(canManageUsers("moderator"), false);
  assert.equal(canManagePublicContent("super_admin"), true);
  const picked = pickContactPayload({ name: "A", email: "a@example.com", phone: "123", message: "x", password: "secret" });
  assert.equal("password" in picked, false);
});
