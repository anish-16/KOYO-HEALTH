import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearOtps, otpConfig, requestOtp, verifyOtp,
} from '@/lib/server/otp';

const phone = '9810124477';

afterEach(() => {
  clearOtps();
  vi.useRealTimers();
});

describe('requestOtp', () => {
  it('returns a six-digit demo code with an expiry window', () => {
    const issued = requestOtp(phone);
    expect(issued.expiresIn).toBe(300);
    if (otpConfig.demoMode) {
      expect(issued.demoCode).toMatch(/^\d{6}$/);
    }
  });

  it('normalises formatted numbers so +91 and separators match', () => {
    const { demoCode } = requestOtp('+91 98101 24477');
    expect(verifyOtp('9810124477', demoCode ?? '000000').ok).toBe(true);
    expect(verifyOtp('9810124477', demoCode ?? '000000').ok).toBe(false);
  });
});

describe('verifyOtp', () => {
  it('accepts the issued code exactly once', () => {
    const { demoCode } = requestOtp(phone);
    expect(verifyOtp(phone, demoCode ?? '').ok).toBe(true);
    expect(verifyOtp(phone, demoCode ?? '')).toEqual({ ok: false, reason: 'not_found' });
  });

  it('rejects a code that was never requested', () => {
    expect(verifyOtp(phone, '123456')).toEqual({ ok: false, reason: 'not_found' });
  });

  it('counts down remaining attempts on each mismatch', () => {
    requestOtp(phone);
    const first = verifyOtp(phone, '000000');
    expect(first).toEqual({ ok: false, reason: 'mismatch', attemptsLeft: 4 });
    const second = verifyOtp(phone, '000000');
    expect(second).toEqual({ ok: false, reason: 'mismatch', attemptsLeft: 3 });
  });

  it('expires codes after the five minute window', () => {
    vi.useFakeTimers();
    requestOtp(phone);
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(verifyOtp(phone, otpConfig.demoMode ? '482913' : '123456')).toEqual({
      ok: false,
      reason: 'expired',
    });
  });

  it('locks the number after the attempt budget and throttles further guesses', () => {
    const { demoCode } = requestOtp(phone);
    for (let i = 0; i < otpConfig.maxAttempts; i++) {
      expect(verifyOtp(phone, '000000')).toMatchObject({ ok: false, reason: 'mismatch' });
    }
    expect(verifyOtp(phone, '000000')).toEqual({ ok: false, reason: 'locked' });
    expect(verifyOtp(phone, demoCode ?? '')).toEqual({ ok: false, reason: 'locked' });
  });

  it('lets a fresh code reset the lock', () => {
    requestOtp(phone);
    for (let i = 0; i <= otpConfig.maxAttempts; i++) verifyOtp(phone, '000000');
    expect(verifyOtp(phone, '000000')).toEqual({ ok: false, reason: 'locked' });

    const { demoCode } = requestOtp(phone);
    expect(verifyOtp(phone, demoCode ?? '').ok).toBe(true);
  });
});
