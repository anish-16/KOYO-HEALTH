import { bookingSchema } from '@/lib/validation';
import { priceItems } from '@/lib/pricing';
import { createBooking, listBookings } from '@/lib/server/store';
import { getSession } from '@/lib/server/session';
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

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const priced = priceItems(parsed.data.items);
  if (priced.unknown.length > 0) {
    return errorResponse('One or more selected tests are unavailable. Please refresh your selection.', 400);
  }
  if (priced.items.length === 0) return errorResponse('Add at least one test to continue.', 400);

  const session = await getSession();
  const booking = await createBooking(
    parsed.data,
    priced.items,
    { total: priced.total, savings: priced.savings },
    session?.phone,
  );

  return jsonResponse(
    {
      ok: true,
      booking: {
        id: booking.id,
        date: booking.date,
        slot: booking.slot,
        mode: booking.mode,
        total: booking.total,
        savings: booking.savings,
        items: booking.items.map((i) => i.name),
        status: booking.status,
      },
    },
    201,
  );
}

export async function GET() {
  const session = await getSession();
  if (!session) return errorResponse('Sign in to view your bookings.', 401);
  const bookings = await listBookings(session.phone);
  return jsonResponse({ bookings });
}
