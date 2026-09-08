import test from "node:test";
import assert from "node:assert/strict";
import { canTransitionQuote, validateServicePayload, archiveRecord } from "./lifecycle.js";

test("quote lifecycle allows only defined transitions", () => {
  assert.equal(canTransitionQuote("new", "in_review"), true);
  assert.equal(canTransitionQuote("new", "quoted"), false);
  assert.equal(canTransitionQuote("closed", "new"), false);
});

test("service validation rejects incomplete and unsafe payloads", () => {
  assert.equal(validateServicePayload({ name_ar: "خدمة", name_en: "Service", slug: "flight-tickets", external_url: "https://example.com" }).valid, true);
  assert.equal(validateServicePayload({ name_ar: "", name_en: "x", slug: "Bad Slug", external_url: "javascript:alert(1)" }).valid, false);
});

test("archive preserves the record and removes public activity", () => {
  const archived = archiveRecord({ id: "svc-1", is_active: true }, "2026-01-01T00:00:00.000Z");
  assert.equal(archived.id, "svc-1");
  assert.equal(archived.is_active, false);
  assert.equal(archived.lifecycle_status, "archived");
  assert.equal(archived.archived_at, "2026-01-01T00:00:00.000Z");
});
