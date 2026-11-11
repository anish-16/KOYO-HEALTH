import { otpRequestSchema } from '@/lib/validation';
import { requestOtp } from '@/lib/server/otp';
import { rateLimit } from '@/lib/server/rate-limit';
import { errorResponse, isSameOrigin, jsonResponse, readJson, validationError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse('Cross-origin request blocked.', 403);

  let body: unknown;
  try {
    body = await readJson(request);
  } catch {
    return errorResponse('Invalid request body.', 400);
  }

  const parsed = otpRequestSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const digits = parsed.data.phone.replace(/\D/g, '').slice(-10);
  const perPhone = rateLimit(`otp:phone:${digits}`, 5, 10 * 60_000);
  if (!perPhone.ok) {
    return errorResponse('Too many codes requested for this number. Try again in 10 minutes.', 429);
  }

  const result = requestOtp(digits);
  return jsonResponse({
    ok: true,
    expiresIn: result.expiresIn,
    resendAfter: 30,
    // Only populated in demo mode; a real deployment returns nothing here.
    ...(result.demoCode ? { demoCode: result.demoCode } : {}),
  });
}
