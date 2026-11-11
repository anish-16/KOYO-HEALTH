import { storeCounts } from '@/lib/server/store';
import { jsonResponse } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const startedAt = Date.now();

export async function GET() {
  let counts: { bookings: number; callbacks: number; subscribers: number } | null = null;
  try {
    counts = await storeCounts();
  } catch {
    counts = null;
  }

  return jsonResponse({
    status: 'ok',
    service: 'koyo-health',
    version: '1.0.0',
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    storage: counts ? 'available' : 'degraded',
    counts,
  });
}
