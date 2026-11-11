import { getTest } from '@/data/services';
import { getPackage } from '@/data/packages';

export type PricedItem = {
  id: string;
  name: string;
  serviceName: string;
  price: number;
  mrp: number;
  fastingHours: number;
  homeCollection: boolean;
  sample: string;
};

/**
 * Prices are always resolved from the catalogue, never from the client.
 * The booking payload only carries opaque item ids.
 */
export function priceItem(id: string): PricedItem | null {
  if (!id || typeof id !== 'string' || id.length > 160) return null;

  if (id.startsWith('package/')) {
    const pkg = getPackage(id.slice('package/'.length));
    if (!pkg) return null;
    return {
      id,
      name: pkg.name,
      serviceName: 'Health package',
      price: pkg.price,
      mrp: pkg.mrp,
      fastingHours: pkg.fastingHours,
      homeCollection: true,
      sample: 'Blood',
    };
  }

  const [serviceSlug, testSlug] = id.split('/');
  if (!serviceSlug || !testSlug) return null;
  const test = getTest(serviceSlug, testSlug);
  if (!test) return null;
  return {
    id,
    name: test.name,
    serviceName: test.serviceName,
    price: test.price,
    mrp: test.mrp,
    fastingHours: test.fastingHours,
    homeCollection: test.homeCollection,
    sample: test.sample,
  };
}

export function priceItems(ids: string[]) {
  const seen = new Set<string>();
  const items: PricedItem[] = [];
  const unknown: string[] = [];

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const priced = priceItem(id);
    if (priced) items.push(priced);
    else unknown.push(id);
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const mrpTotal = items.reduce((sum, item) => sum + item.mrp, 0);
  return { items, unknown, total, mrpTotal, savings: Math.max(0, mrpTotal - total) };
}

export function bookingTotal(items: PricedItem[], walletCredit = 0) {
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  return Math.max(0, subtotal - walletCredit);
}
