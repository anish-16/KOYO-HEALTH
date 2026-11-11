import { NextResponse } from 'next/server';
import { otpVerifySchema } from '@/lib/validation';
import { verifyOtp } from '@/lib/server/otp';
import {
  SESSION_COOKIE, createSessionToken, sessionCookieOptions, type SessionUser,
} from '@/lib/server/session';
import { errorResponse, isSameOrigin, readJson, validationError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REASONS: Record<string, string> = {
  not_found: 'Request a code first, then try again.',
  expired: 'That code has expired. Request a new one.',
  locked: 'Too many incorrect attempts. Request a new code.',
  mismatch: 'That code is not correct.',
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse('Cross-origin request blocked.', 403);

  let body: unknown;
  try {
    body = await readJson(request);
  } catch {
    return errorResponse('Invalid request body.', 400);
  }

  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { phone, code, name } = parsed.data;
  const result = verifyOtp(phone, code);
  if (!result.ok) {
    const locked = result.reason === 'locked';
    return NextResponse.json(
      { error: REASONS[result.reason] ?? 'Verification failed.', attemptsLeft: result.attemptsLeft },
      { status: locked ? 429 : 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const digits = phone.replace(/\D/g, '').slice(-10);
  const user: SessionUser = {
    id: `usr_${digits.slice(-6)}`,
    name: name?.trim() || (digits === '9810124477' ? 'Aarav Mehta' : 'KOYO Patient'),
    phone: digits,
  };

  const response = NextResponse.json(
    { ok: true, user },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  response.cookies.set(SESSION_COOKIE, createSessionToken(user), sessionCookieOptions());
  return response;
}
