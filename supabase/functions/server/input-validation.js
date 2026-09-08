const MAX = {
  name: 120,
  email: 254,
  phone: 40,
  message: 5000,
  company_name: 200,
  contact_name: 120,
  job_title: 120,
  cr_number: 80,
};

const isString = (value) => typeof value === 'string';
const validEmail = (value) => isString(value) && value.length <= MAX.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const bounded = (value, key) => isString(value) && value.trim().length > 0 && value.length <= MAX[key];

export function validateContactPayload(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request' };
  if (!bounded(body.name, 'name') || !validEmail(body.email) || !bounded(body.phone, 'phone') || !bounded(body.message, 'message')) {
    return { ok: false, error: 'Invalid request' };
  }
  return { ok: true };
}

export function validateQuotePayload(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request' };
  if (!bounded(body.company_name, 'company_name') || !bounded(body.contact_name, 'contact_name') || !validEmail(body.email) || !bounded(body.phone, 'phone')) {
    return { ok: false, error: 'Invalid request' };
  }
  for (const [key, max] of Object.entries(MAX)) {
    if (body[key] !== undefined && (!isString(body[key]) || body[key].length > max)) return { ok: false, error: 'Invalid request' };
  }
  return { ok: true };
}

export function createRateLimiter({ limit = 5, windowMs = 60_000 } = {}) {
  const entries = new Map();
  return { allow(key) {
    const now = Date.now();
    const current = entries.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      entries.set(key, { startedAt: now, count: 1 });
      return { allowed: true };
    }
    current.count += 1;
    return { allowed: current.count <= limit };
  }};
}

export function pickContactPayload(body) {
  return { name: body.name.trim(), email: body.email.trim(), phone: body.phone.trim(), message: body.message.trim(), company: isString(body.company) ? body.company.trim().slice(0, 200) : '' };
}

export function pickQuotePayload(body) {
  const keys = ['company_name', 'cr_number', 'contact_name', 'job_title', 'email', 'phone', 'services', 'travel_dates', 'travelers', 'destination', 'budget', 'notes'];
  return Object.fromEntries(keys.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
}
