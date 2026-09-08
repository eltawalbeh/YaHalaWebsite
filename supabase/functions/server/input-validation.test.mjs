import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactPayload, validateQuotePayload, createRateLimiter, pickContactPayload, pickQuotePayload } from './input-validation.js';

test('validates contact payload and rejects oversized or incomplete input', () => {
  assert.equal(validateContactPayload({ name: 'A', email: 'a@example.com', phone: '+966500000000', message: 'Hello' }).ok, true);
  assert.equal(validateContactPayload({ name: '', email: 'bad', phone: '', message: '' }).ok, false);
  assert.equal(validateContactPayload({ name: 'A', email: 'a@example.com', phone: '+966500000000', message: 'x'.repeat(5001) }).ok, false);
});

test('validates quote payload and rejects unbounded fields', () => {
  assert.equal(validateQuotePayload({ company_name: 'Acme', contact_name: 'A', email: 'a@example.com', phone: '+966500000000' }).ok, true);
  assert.equal(validateQuotePayload({ company_name: '', contact_name: 'A', email: 'bad', phone: '' }).ok, false);
  assert.equal(validateQuotePayload({ company_name: 'x'.repeat(201), contact_name: 'A', email: 'a@example.com', phone: '+966500000000' }).ok, false);
});

test('rate limiter allows the configured burst and blocks the next request', () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
  assert.equal(limiter.allow('client').allowed, true);
  assert.equal(limiter.allow('client').allowed, true);
  assert.equal(limiter.allow('client').allowed, false);
});

test('whitelists persisted public intake fields', () => {
  assert.deepEqual(pickContactPayload({ name: ' A ', email: 'a@example.com', phone: ' +1 ', message: ' Hi ', role: 'admin' }), { name: 'A', email: 'a@example.com', phone: '+1', message: 'Hi', company: '' });
  assert.equal(Object.hasOwn(pickQuotePayload({ company_name: 'Acme', secret: 'drop' }), 'secret'), false);
});
