import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

type OtpEntry = {
  hash: string;
  phone: string;
  expiresAt: number;
  attempts: number;
  issuedAt: number;
  lockedUntil?: number;
};

const otps = new Map<string, OtpEntry>();
const TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000;

/**
 * Demo builds expose a fixed OTP so the flow is testable without an SMS
 * gateway. Set KOYO_DEMO_OTP_DISABLED=1 (and wire an SMS provider) to force
 * random codes that are never returned to the client.
 */
const DEMO_MODE = process.env.KOYO_DEMO_OTP_DISABLED !== '1';
const DEMO_CODE = process.env.KOYO_DEMO_OTP ?? '482913';

const hash = (code: string) => createHash('sha256').update(code).digest('hex');

export function requestOtp(phone: string) {
  const normalized = phone.replace(/\D/g, '').slice(-10);
  const code = DEMO_MODE ? DEMO_CODE : String(randomInt(100000, 999999));
  otps.set(normalized, {
    hash: hash(code),
    phone: normalized,
    expiresAt: Date.now() + TTL_MS,
    attempts: 0,
    issuedAt: Date.now(),
  });
  return {
    expiresIn: Math.floor(TTL_MS / 1000),
    demoCode: DEMO_MODE ? code : undefined,
  };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'expired' | 'locked' | 'mismatch'; attemptsLeft?: number };

export function verifyOtp(phone: string, code: string): VerifyResult {
  const normalized = phone.replace(/\D/g, '').slice(-10);
  const entry = otps.get(normalized);
  if (!entry) return { ok: false, reason: 'not_found' };
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
    return { ok: false, reason: 'locked' };
  }
  if (entry.expiresAt < Date.now()) {
    otps.delete(normalized);
    return { ok: false, reason: 'expired' };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    // A locked entry stays in place so every further guess is throttled until a
    // fresh code is requested, instead of silently resetting the attempt budget.
    entry.lockedUntil = Date.now() + LOCK_MS;
    return { ok: false, reason: 'locked' };
  }

  entry.attempts += 1;
  const provided = Buffer.from(hash(code));
  const expected = Buffer.from(entry.hash);
  const matches = provided.length === expected.length && timingSafeEqual(provided, expected);

  if (!matches) {
    const attemptsLeft = MAX_ATTEMPTS - entry.attempts;
    if (attemptsLeft <= 0) entry.lockedUntil = Date.now() + LOCK_MS;
    return { ok: false, reason: 'mismatch', attemptsLeft: Math.max(0, attemptsLeft) };
  }

  otps.delete(normalized);
  return { ok: true };
}

export function clearOtps() {
  otps.clear();
}

export const otpConfig = { demoMode: DEMO_MODE, maxAttempts: MAX_ATTEMPTS, ttlSeconds: TTL_MS / 1000 };
