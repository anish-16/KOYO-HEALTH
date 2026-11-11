import { describe, expect, it, beforeEach } from 'vitest';
import { GET as testsRoute } from '@/app/api/tests/route';
import { GET as healthRoute } from '@/app/api/health/route';
import { POST as callbacksRoute } from '@/app/api/callbacks/route';
import { POST as subscribeRoute } from '@/app/api/subscribe/route';
import { allTests } from '@/data/services';
import { resetRateLimits } from '@/lib/server/rate-limit';

const post = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'localhost:3000', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

beforeEach(() => resetRateLimits());

describe('GET /api/tests', () => {
  it('returns a paginated default listing', async () => {
    const res = await testsRoute(new Request('http://localhost:3000/api/tests'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(allTests.length);
    expect(body.results).toHaveLength(10);
    expect(body.results[0]).toHaveProperty('price');
  });

  it('searches by name and clamps the limit', async () => {
    const res = await testsRoute(new Request('http://localhost:3000/api/tests?q=mri&limit=500'));
    const body = await res.json();
    expect(body.query).toBe('mri');
    expect(body.results.length).toBeLessThanOrEqual(20);
    expect(body.results[0].id).toContain('mri');
  });

  it('handles junk limits and long queries safely', async () => {
    const res = await testsRoute(new Request(`http://localhost:3000/api/tests?limit=abc&q=${'x'.repeat(300)}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toEqual([]);
  });
});

describe('GET /api/health', () => {
  it('reports service status and storage state', async () => {
    const res = await healthRoute();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('koyo-health');
    expect(['available', 'degraded']).toContain(body.storage);
    expect(res.headers.get('cache-control')).toContain('no-store');
  });
});

describe('POST /api/callbacks', () => {
  const valid = { name: 'Ishita Mehta', phone: '9810199821', concern: 'Report question', message: 'Need a copy', consent: true };

  it('creates a callback request with a reference', async () => {
    const res = await callbacksRoute(post('/api/callbacks', valid));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(/^CB-\d{4}-\d{4}$/);
    expect(body.message).toContain('care advisor');
  });

  it('validates the payload', async () => {
    const res = await callbacksRoute(post('/api/callbacks', { ...valid, phone: '123' }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.phone).toBeTruthy();
  });

  it('blocks cross-site submissions', async () => {
    const res = await callbacksRoute(post('/api/callbacks', valid, { 'sec-fetch-site': 'cross-site' }));
    expect(res.status).toBe(403);
  });
});

describe('POST /api/subscribe', () => {
  it('stores a normalised email', async () => {
    const res = await subscribeRoute(post('/api/subscribe', { email: ' Reader@Example.COM ' }));
    expect(res.status).toBe(201);
    expect((await res.json()).ok).toBe(true);
  });

  it('rejects an invalid email', async () => {
    const res = await subscribeRoute(post('/api/subscribe', { email: 'nope' }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.email).toBeTruthy();
  });
});
