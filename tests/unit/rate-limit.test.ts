import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit, clientKey, resetRateLimits } from '@/lib/server/rate-limit';
import { requestOtp, verifyOtp, clearOtps, otpConfig } from '@/lib/server/otp';

beforeEach(() => {
  resetRateLimits();
  clearOtps();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('rateLimit', () => {
  it('allows requests up to the limit and blocks the next one', () => {
    expect(rateLimit('k', 3, 60_000)).toMatchObject({ ok: true, remaining: 2, limit: 3 });
    expect(rateLimit('k', 3, 60_000)).toMatchObject({ ok: true, remaining: 1 });
    expect(rateLimit('k', 3, 60_000)).toMatchObject({ ok: true, remaining: 0 });
    const blocked = rateLimit('k', 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('isolates buckets by key', () => {
    rateLimit('a', 1, 60_000);
    expect(rateLimit('a', 1, 60_000).ok).toBe(false);
    expect(rateLimit('b', 1, 60_000).ok).toBe(true);
  });

  it('resets after the window elapses', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    expect(rateLimit('w', 1, 10_000).ok).toBe(true);
    expect(rateLimit('w', 1, 10_000).ok).toBe(false);
    vi.setSystemTime(new Date('2026-01-01T00:00:11Z'));
    expect(rateLimit('w', 1, 10_000).ok).toBe(true);
  });

  it('derives a client key from the first forwarded address behind a trusted proxy', () => {
    vi.stubEnv('KOYO_TRUST_PROXY', '1');
    const request = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
    });
    expect(clientKey(request, '/api/test')).toBe('/api/test:203.0.113.7');
    const anonymous = new Request('http://localhost/api/test');
    expect(clientKey(anonymous, '/api/test')).toBe('/api/test:local');
    vi.unstubAllEnvs();
  });

  it('ignores spoofed forwarding headers when no proxy is trusted', () => {
    vi.stubEnv('KOYO_TRUST_PROXY', '0');
    const spoofed = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '203.0.113.7', 'x-real-ip': '198.51.100.9' },
    });
    expect(clientKey(spoofed, '/api/tests')).toBe('/api/tests:local');
    vi.unstubAllEnvs();
  });
});

describe('OTP', () => {
  it('issues a six-digit demo code with a five-minute TTL', () => {
    const result = requestOtp('+91 98101 24477');
    expect(result.expiresIn).toBe(300);
    expect(result.demoCode).toMatch(/^\d{6}$/);
    expect(otpConfig.ttlSeconds).toBe(300);
  });

  it('accepts the correct code exactly once', () => {
    const { demoCode } = requestOtp('9810124477');
    expect(verifyOtp('+919810124477', demoCode!)).toEqual({ ok: true });
    expect(verifyOtp('9810124477', demoCode!)).toEqual({ ok: false, reason: 'not_found' });
  });

  it('counts failed attempts and locks after five', () => {
    requestOtp('9810124477');
    for (let i = 1; i <= 4; i++) {
      const result = verifyOtp('9810124477', '000000');
      expect(result).toMatchObject({ ok: false, reason: 'mismatch', attemptsLeft: 5 - i });
    }
    const fifth = verifyOtp('9810124477', '000000');
    expect(fifth).toMatchObject({ ok: false, reason: 'mismatch', attemptsLeft: 0 });
    // The lockout outlives the attempt budget so extra guesses stay throttled.
    expect(verifyOtp('9810124477', '482913')).toEqual({ ok: false, reason: 'locked' });
  });

  it('expires a code after five minutes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const { demoCode } = requestOtp('9810124477');
    vi.setSystemTime(new Date('2026-01-01T00:05:01Z'));
    expect(verifyOtp('9810124477', demoCode!)).toEqual({ ok: false, reason: 'expired' });
  });

  it('rejects verification without a request', () => {
    expect(verifyOtp('9000000000', '482913')).toEqual({ ok: false, reason: 'not_found' });
  });
});
