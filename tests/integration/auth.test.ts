import { describe, expect, it, beforeEach } from 'vitest';
import { POST as requestOtpRoute } from '@/app/api/auth/otp/route';
import { POST as verifyRoute } from '@/app/api/auth/verify/route';
import { POST as logoutRoute } from '@/app/api/auth/logout/route';
import { clearOtps } from '@/lib/server/otp';
import { resetRateLimits } from '@/lib/server/rate-limit';

const json = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost:3000/api/auth/otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'localhost:3000', ...headers },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  clearOtps();
  resetRateLimits();
});

describe('POST /api/auth/otp', () => {
  it('rejects malformed JSON with 400', async () => {
    const res = await requestOtpRoute(
      new Request('http://localhost:3000/api/auth/otp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', host: 'localhost:3000' },
        body: '{not json',
      }),
    );
    expect(res.status).toBe(400);
  });

  it('rejects an invalid phone with field-level errors', async () => {
    const res = await requestOtpRoute(json({ phone: '12345' }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.fields.phone).toBeTruthy();
    expect(res.headers.get('cache-control')).toContain('no-store');
  });

  it('accepts a valid phone and returns a demo code plus resend metadata', async () => {
    const res = await requestOtpRoute(json({ phone: '+91 98101 24477' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.demoCode).toMatch(/^\d{6}$/);
    expect(body.expiresIn).toBe(300);
    expect(body.resendAfter).toBe(30);
  });

  it('blocks cross-origin requests with 403', async () => {
    const res = await requestOtpRoute(
      json({ phone: '9810124477' }, { origin: 'https://evil.example', host: 'localhost:3000' }),
    );
    expect(res.status).toBe(403);
  });

  it('limits each number to five codes per ten minutes', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await requestOtpRoute(json({ phone: '9810100001' }));
      expect(res.status).toBe(200);
    }
    const blocked = await requestOtpRoute(json({ phone: '9810100001' }));
    expect(blocked.status).toBe(429);
    const body = await blocked.json();
    expect(body.error).toContain('Too many codes');
  });
});

describe('POST /api/auth/verify', () => {
  const phone = '9810124477';

  it('rejects a code that was never requested', async () => {
    const res = await verifyRoute(json({ phone: '9800000001', code: '482913' }));
    expect(res.status).toBe(401);
  });

  it('rejects a wrong code and reports attempts left', async () => {
    const otp = await (await requestOtpRoute(json({ phone }))).json();
    expect(otp.demoCode).toBeTruthy();
    const res = await verifyRoute(json({ phone, code: '111111' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.attemptsLeft).toBe(4);
  });

  it('signs in with the correct code and sets a hardened session cookie', async () => {
    const { demoCode } = await (await requestOtpRoute(json({ phone }))).json();
    const res = await verifyRoute(json({ phone, code: demoCode, name: 'Aarav Mehta' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.user.phone).toBe(phone);
    expect(body.user.name).toBe('Aarav Mehta');
    const cookie = res.headers.get('set-cookie') ?? '';
    expect(cookie).toContain('koyo_session=');
    expect(cookie.toLowerCase()).toContain('httponly');
    expect(cookie.toLowerCase()).toContain('samesite=lax');
  });

  it('locks the code after five incorrect attempts', async () => {
    await requestOtpRoute(json({ phone }));
    for (let i = 0; i < 5; i++) {
      await verifyRoute(json({ phone, code: '000000' }));
    }
    const res = await verifyRoute(json({ phone, code: '482913' }));
    expect(res.status).toBe(429);
    expect((await res.json()).error).toContain('Too many incorrect attempts');

    const again = await verifyRoute(json({ phone, code: '000000' }));
    expect(again.status).toBe(429);
  });

  it('unlocks when the patient asks for a fresh code', async () => {
    await requestOtpRoute(json({ phone }));
    for (let i = 0; i < 5; i++) await verifyRoute(json({ phone, code: '000000' }));
    expect((await verifyRoute(json({ phone, code: '482913' }))).status).toBe(429);

    await requestOtpRoute(json({ phone }));
    const res = await verifyRoute(json({ phone, code: '482913', name: 'Retry Patient' }));
    expect(res.status).toBe(200);
  });

  it('validates the six-digit code format', async () => {
    const res = await verifyRoute(json({ phone, code: '12345' }));
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the session cookie', async () => {
    const res = await logoutRoute(
      new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { host: 'localhost:3000', 'content-type': 'application/json' },
        body: '{}',
      }),
    );
    expect(res.status).toBe(200);
    const cookie = res.headers.get('set-cookie') ?? '';
    expect(cookie).toContain('koyo_session=');
    expect(cookie.toLowerCase()).toMatch(/max-age=0|expires=thu, 01 jan 1970/);
  });
});
