import { describe, expect, it, vi, afterEach } from 'vitest';
import { createSessionToken, verifySessionToken, sessionCookieOptions, SESSION_COOKIE } from '@/lib/server/session';

const user = { id: 'usr_124477', name: 'Aarav Mehta', phone: '9810124477', email: 'aarav@example.com' };

afterEach(() => {
  vi.useRealTimers();
});

describe('session tokens', () => {
  it('round-trips a signed payload', () => {
    const token = createSessionToken(user);
    expect(token.split('.')).toHaveLength(2);
    expect(verifySessionToken(token)).toEqual(user);
  });

  it('rejects missing, malformed and unsigned tokens', () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken(null)).toBeNull();
    expect(verifySessionToken('')).toBeNull();
    expect(verifySessionToken('just-a-string')).toBeNull();
    expect(verifySessionToken('abc.def')).toBeNull();
  });

  it('rejects a tampered payload even when the signature is well formed', () => {
    const token = createSessionToken(user);
    const [body, sig] = token.split('.');
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    decoded.id = 'usr_999999';
    const forgedBody = Buffer.from(JSON.stringify(decoded)).toString('base64url');
    expect(verifySessionToken(`${forgedBody}.${sig}`)).toBeNull();
  });

  it('rejects a tampered signature', () => {
    const [body] = createSessionToken(user).split('.');
    const sig = Buffer.from('not-the-real-signature').toString('base64url');
    expect(verifySessionToken(`${body}.${sig}`)).toBeNull();
  });

  it('expires after seven days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const token = createSessionToken(user);
    vi.setSystemTime(new Date('2026-01-07T23:59:00Z'));
    expect(verifySessionToken(token)).not.toBeNull();
    vi.setSystemTime(new Date('2026-01-09T00:00:00Z'));
    expect(verifySessionToken(token)).toBeNull();
  });

  it('rejects tokens missing required claims', () => {
    const token = createSessionToken({ id: '', name: '', phone: '' });
    expect(verifySessionToken(token)).toBeNull();
  });

  it('uses a hardened cookie configuration', () => {
    const options = sessionCookieOptions();
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe('lax');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(60 * 60 * 24 * 7);
    expect(SESSION_COOKIE).toBe('koyo_session');
  });
});
