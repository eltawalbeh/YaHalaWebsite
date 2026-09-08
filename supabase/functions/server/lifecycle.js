export const QUOTE_STATUSES = ["new", "in_review", "quoted", "closed"];
const ALLOWED_TRANSITIONS = {
  new: ["new", "in_review", "closed"],
  in_review: ["in_review", "quoted", "closed"],
  quoted: ["quoted", "closed", "in_review"],
  closed: ["closed", "in_review"],
};

export function canTransitionQuote(from, to) {
  return QUOTE_STATUSES.includes(from) && QUOTE_STATUSES.includes(to) && ALLOWED_TRANSITIONS[from].includes(to);
}

export function validateServicePayload(body, existing = {}) {
  const value = { ...existing, ...body };
  const errors = {};
  if (typeof value.name_ar !== "string" || value.name_ar.trim().length < 2 || value.name_ar.length > 160) errors.name_ar = "Arabic name is required";
  if (typeof value.name_en !== "string" || value.name_en.trim().length < 2 || value.name_en.length > 160) errors.name_en = "English name is required";
  if (typeof value.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) errors.slug = "Slug must contain lowercase letters, numbers, and hyphens only";
  if (value.external_url && (typeof value.external_url !== "string" || !/^https:\/\//.test(value.external_url))) errors.external_url = "External URL must use HTTPS";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function archiveRecord(record, now = new Date().toISOString()) {
  return { ...record, is_active: false, lifecycle_status: "archived", archived_at: now, updated_at: now };
}
