import { callbackSchema } from '@/lib/validation';
import { createCallback } from '@/lib/server/store';
import {
  errorResponse, isSameOrigin, jsonResponse, readJson, validationError,
} from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse('Cross-origin request blocked.', 403);

  let body: unknown;
  try {
    body = await readJson(request);
  } catch (err) {
    const tooLarge = err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE';
    return errorResponse(tooLarge ? 'Request is too large.' : 'Invalid request body.', tooLarge ? 413 : 400);
  }

  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const record = await createCallback(parsed.data);
  return jsonResponse(
    {
      ok: true,
      reference: record.id,
      message: 'A care advisor will call you within 5 minutes during working hours.',
    },
    201,
  );
}
