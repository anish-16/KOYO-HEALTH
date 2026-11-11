import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'koyo_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = { id: string; name: string; phone: string; email?: string };
type TokenPayload = SessionUser & { iat: number; exp: number };

/**
 * A stable secret is required for sessions to survive restarts.
 * In production a missing secret generates an ephemeral key (sessions reset on
 * deploy) rather than falling back to a guessable value.
 */
const SECRET =
  process.env.SESSION_SECRET ??
  (process.env.NODE_ENV === 'production'
    ? randomBytes(32).toString('hex')
    : 'koyo-development-session-secret-not-for-production');

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

export function createSessionToken(user: SessionUser): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { ...user, iat: now, exp: now + MAX_AGE_SECONDS };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionUser | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (!payload?.exp || payload.exp * 1000 < Date.now()) return null;
    if (!payload.id || !payload.name || !payload.phone) return null;
    return { id: payload.id, name: payload.name, phone: payload.phone, email: payload.email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export type CookieOptions = {
  httpOnly: true;
  sameSite: 'lax';
  secure: boolean;
  path: '/';
  maxAge: number;
};

export function sessionCookieOptions(): CookieOptions {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';
  const secure = site.startsWith('https://') && !site.includes('localhost');
  return { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: MAX_AGE_SECONDS };
}
