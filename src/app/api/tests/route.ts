import { searchTests, allTests } from '@/data/services';
import { jsonResponse } from '@/lib/server/http';

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').slice(0, 80);
  const limitRaw = Number(searchParams.get('limit') ?? 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.trunc(limitRaw), 1), 20) : 10;

  if (!query) {
    return jsonResponse({
      total: allTests.length,
      results: allTests.slice(0, limit).map((t) => ({
        id: t.id, name: t.name, service: t.serviceName, price: t.price, mrp: t.mrp,
      })),
    });
  }

  const results = searchTests(query, limit).map((t) => ({
    id: t.id, name: t.name, service: t.serviceName, price: t.price, mrp: t.mrp,
  }));
  return jsonResponse({ total: results.length, query, results });
}
