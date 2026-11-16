import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Portal sessions are separate from patient sessions on purpose: a partner
 * login must never read a patient wallet, and a patient login must never reach
 * an employer roster. The cookie carries only the role and the partner id; every
 * page re-checks that the partner still exists in the store.
 */

export const PORTAL_COOKIE = 'koyo_portal';
const MAX_AGE_SECONDS = 60 * 60 * 8;

export type PortalActor =
  | { role: 'ops'; name: string }
  | { role: 'partner'; name: string; partnerId: string; partnerName: string };

type TokenPayload = {
  role: 'ops' | 'partner';
  name: string;
  partnerId?: string;
  partnerName?: string;
  iat: number;
  exp: number;
};

const SECRET =
  process.env.KOYO_PORTAL_SECRET ??
  process.env.SESSION_SECRET ??
  (process.env.NODE_ENV === 'production'
    ? randomBytes(32).toString('hex')
    : 'koyo-development-portal-secret-not-for-production');

const OPS_ACCESS_KEY = process.env.KOYO_OPS_ACCESS_KEY ?? 'KOYO-OPS-2026';

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function safeEqual(a: string, b: string) {
  const left = createHmac('sha256', SECRET).update(a).digest();
  const right = createHmac('sha256', SECRET).update(b).digest();
  return timingSafeEqual(left, right);
}

export function verifyOpsKey(key: string) {
  return safeEqual(key.trim(), OPS_ACCESS_KEY);
}

/** Only used by the sign-in page's demo panel, never sent to a browser in prod. */
export function demoOpsKey() {
  return process.env.KOYO_OPS_ACCESS_KEY ? '' : OPS_ACCESS_KEY;
}

function sign(payload: TokenPayload) {
  const body = b64url(JSON.stringify(payload));
  const signature = createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifyPortalToken(token: string | undefined | null): PortalActor | null {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = createHmac('sha256', SECRET).update(body).digest('base64url');
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (!payload?.exp || payload.exp * 1000 < Date.now()) return null;
    if (payload.role === 'ops' && payload.name) return { role: 'ops', name: payload.name };
    if (payload.role === 'partner' && payload.partnerId && payload.partnerName && payload.name) {
      return {
        role: 'partner',
        name: payload.name,
        partnerId: payload.partnerId,
        partnerName: payload.partnerName,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getPortalActor(): Promise<PortalActor | null> {
  const store = await cookies();
  return verifyPortalToken(store.get(PORTAL_COOKIE)?.value);
}

export function portalToken(actor: PortalActor) {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload =
    actor.role === 'ops'
      ? { role: 'ops', name: actor.name, iat: now, exp: now + MAX_AGE_SECONDS }
      : {
          role: 'partner',
          name: actor.name,
          partnerId: actor.partnerId,
          partnerName: actor.partnerName,
          iat: now,
          exp: now + MAX_AGE_SECONDS,
        };
  return sign(payload);
}

export async function setPortalSession(actor: PortalActor) {
  const store = await cookies();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';
  const secure = site.startsWith('https://') && !site.includes('localhost');
  store.set(PORTAL_COOKIE, portalToken(actor), {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearPortalSession() {
  const store = await cookies();
  store.set(PORTAL_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}
