import { NextResponse, type NextRequest } from 'next/server';
import { clientKey, rateLimit } from '@/lib/server/rate-limit';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function limitsFor(pathname: string): { limit: number; windowMs: number } {
  // One login is 4 calls (otp → verify → me → logout) and households/NAT share
  // an IP. Brute force is bounded per phone number by the OTP attempt lockout,
  // so the transport bucket stays generous enough for normal sign-in flows.
  if (pathname.startsWith('/api/auth/')) return { limit: 20, windowMs: 60_000 };
  if (pathname.startsWith('/api/bookings')) return { limit: 15, windowMs: 60_000 };
  if (pathname.startsWith('/api/callbacks') || pathname.startsWith('/api/subscribe')) {
    return { limit: 6, windowMs: 60_000 };
  }
  return { limit: 120, windowMs: 60_000 };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (MUTATING.has(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const fetchSite = request.headers.get('sec-fetch-site');
    if (fetchSite === 'cross-site') {
      return NextResponse.json({ error: 'Cross-site request blocked.' }, { status: 403 });
    }
    if (origin && host) {
      let originHost = '';
      try {
        originHost = new URL(origin).host;
      } catch {
        return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
      }
      if (originHost !== host) {
        return NextResponse.json({ error: 'Cross-origin request blocked.' }, { status: 403 });
      }
    }
  }

  const { limit, windowMs } = limitsFor(pathname);
  const key = clientKey(request, pathname.split('/').slice(0, 3).join('/'));
  const result = rateLimit(key, limit, windowMs);

  if (!result.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfterSeconds),
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
