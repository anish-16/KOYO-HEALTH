import { getSession } from '@/lib/server/session';
import { jsonResponse } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSession();
  if (!user) return jsonResponse({ user: null }, 401);
  return jsonResponse({ user });
}
