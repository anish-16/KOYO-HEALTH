import { describe, expect, it, vi, beforeEach } from 'vitest';
import { POST as createBookingRoute, GET as listBookingsRoute } from '@/app/api/bookings/route';
import { allTests } from '@/data/services';
import { packages } from '@/data/packages';

const getSession = vi.fn(async () => null as null | { id: string; name: string; phone: string });

vi.mock('@/lib/server/session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/server/session')>('@/lib/server/session');
  return { ...actual, getSession: () => getSession() };
});

const futureDate = (offset = 4) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const validPayload = () => ({
  items: [allTests[0].id, allTests[1].id],
  mode: 'Home Collection',
  patient: { name: 'Aarav Mehta', age: 39, gender: 'Male' },
  contactPhone: '9810124477',
  address: 'A-704, Ivory Towers, Sector 50, Noida',
  pincode: '201301',
  date: futureDate(),
  slot: '08:30 AM',
  payment: 'Pay online',
  consent: true,
});

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost:3000/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'localhost:3000', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

beforeEach(() => {
  getSession.mockResolvedValue(null);
});

describe('POST /api/bookings', () => {
  it('creates a booking priced from the server catalogue', async () => {
    const payload = validPayload();
    const res = await createBookingRoute(post(payload));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.booking.id).toMatch(/^KB-\d{4}-\d{4}$/);
    expect(body.booking.total).toBe(allTests[0].price + allTests[1].price);
    expect(body.booking.savings).toBe(
      allTests[0].mrp + allTests[1].mrp - (allTests[0].price + allTests[1].price),
    );
    expect(body.booking.items).toEqual([allTests[0].name, allTests[1].name]);
    expect(body.booking.status).toBe('Confirmed');
  });

  it('accepts package ids', async () => {
    const res = await createBookingRoute(
      post({ ...validPayload(), items: [`package/${packages[0].slug}`] }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.booking.total).toBe(packages[0].price);
  });

  it('ignores client-supplied prices', async () => {
    const res = await createBookingRoute(
      post({ ...validPayload(), items: [allTests[0].id], total: 1, price: 1 }),
    );
    const body = await res.json();
    expect(body.booking.total).toBe(allTests[0].price);
  });

  it('rejects an unavailable test with 400', async () => {
    const res = await createBookingRoute(post({ ...validPayload(), items: ['fake/test'] }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain('unavailable');
  });

  it('returns field errors for an incomplete home collection booking', async () => {
    const payload = { ...validPayload(), address: '', pincode: '' };
    const res = await createBookingRoute(post(payload));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.fields.address).toBeTruthy();
    expect(body.fields.pincode).toBeTruthy();
  });

  it('rejects cross-origin writes', async () => {
    const res = await createBookingRoute(
      post(validPayload(), { origin: 'https://evil.example', host: 'localhost:3000' }),
    );
    expect(res.status).toBe(403);
  });

  it('rejects oversized payloads with 413', async () => {
    const res = await createBookingRoute(post({ ...validPayload(), notes: 'x'.repeat(40_000) }));
    expect(res.status).toBe(413);
  });

  it('rejects malformed JSON', async () => {
    const res = await createBookingRoute(post('{"items":'));
    expect(res.status).toBe(400);
  });

  it('rejects duplicate-free but empty baskets', async () => {
    const res = await createBookingRoute(post({ ...validPayload(), items: [] }));
    expect(res.status).toBe(422);
  });
});

describe('GET /api/bookings', () => {
  it('requires a session', async () => {
    const res = await listBookingsRoute();
    expect(res.status).toBe(401);
    expect(res.headers.get('cache-control')).toContain('no-store');
  });

  it('returns only the signed-in patient bookings', async () => {
    const payload = validPayload();
    await createBookingRoute(post(payload));
    getSession.mockResolvedValue({ id: 'usr_124477', name: 'Aarav Mehta', phone: '9810124477' });
    const res = await listBookingsRoute();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.bookings)).toBe(true);
    expect(body.bookings.length).toBeGreaterThan(0);
    expect(body.bookings.every((b: { contactPhone: string }) => b.contactPhone === '9810124477')).toBe(true);
  });
});
