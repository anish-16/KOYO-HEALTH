import { timingSafeEqual } from 'node:crypto';
import { getPortalActor } from '@/lib/server/portal-auth';
import { getBooking, readReportFile } from '@/lib/server/portal-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NOT_FOUND = new Response(JSON.stringify({ error: 'Report not found.' }), {
  status: 404,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

function tokenMatches(provided: string | null, expected: string) {
  if (!provided || provided.length !== expected.length) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * A report file has exactly three legitimate readers: KOYO operations, the
 * partner that raised the booking, and the employee holding the booking's
 * private token. Anything else gets the same 404 as a missing booking, so the
 * route cannot be used to probe which booking ids exist.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBooking(id);
  const file = booking?.report?.file;
  if (!booking || !file) return NOT_FOUND;

  const actor = await getPortalActor();
  const token = new URL(request.url).searchParams.get('token');

  const authorised =
    actor?.role === 'ops' ||
    (actor?.role === 'partner' && actor.partnerId === booking.partnerId) ||
    tokenMatches(token, booking.patientToken);

  if (!authorised) return NOT_FOUND;

  const buffer = await readReportFile(file.storedName);
  if (!buffer) return NOT_FOUND;

  const safeName = file.name.replace(/[^\w.\- ]+/g, '_').slice(0, 100) || 'koyo-report.pdf';

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': file.mime,
      'Content-Disposition': `inline; filename="${safeName}"`,
      'Content-Length': String(buffer.byteLength),
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
    },
  });
}
