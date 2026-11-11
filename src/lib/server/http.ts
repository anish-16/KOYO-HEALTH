import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' };

export function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(data, { status, headers: { ...NO_STORE, ...headers } });
}

export function errorResponse(message: string, status = 400, fields?: Record<string, string>) {
  return NextResponse.json({ error: message, ...(fields ? { fields } : {}) }, { status, headers: NO_STORE });
}

export function validationError(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.') || 'form';
    if (!fields[key]) fields[key] = issue.message;
  }
  const first = error.issues[0]?.message ?? 'Please check the details and try again.';
  return NextResponse.json({ error: first, fields }, { status: 422, headers: NO_STORE });
}

export function rateLimited(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429, headers: { ...NO_STORE, 'Retry-After': String(retryAfter) } },
  );
}

/** Blocks cross-site browser writes while still allowing server-to-server calls. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  if (site === 'cross-site') return false;
  if (!origin) return true;
  const host = request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 32_000) throw new Error('PAYLOAD_TOO_LARGE');
  const text = await request.text();
  if (text.length > 32_000) throw new Error('PAYLOAD_TOO_LARGE');
  return JSON.parse(text);
}
