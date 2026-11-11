import { describe, expect, it } from 'vitest';
import { bookingTotal, priceItem, priceItems } from '@/lib/pricing';
import { allTests } from '@/data/services';
import { packages } from '@/data/packages';

describe('priceItem', () => {
  it('resolves a catalogue test id to server-side pricing', () => {
    const test = allTests[0];
    const priced = priceItem(test.id);
    expect(priced).not.toBeNull();
    expect(priced!.price).toBe(test.price);
    expect(priced!.name).toBe(test.name);
    expect(priced!.serviceName).toBe(test.serviceName);
  });

  it('resolves package ids using the package prefix', () => {
    const pkg = packages[0];
    const priced = priceItem(`package/${pkg.slug}`);
    expect(priced?.price).toBe(pkg.price);
    expect(priced?.serviceName).toBe('Health package');
  });

  it('rejects unknown, malformed and oversized ids', () => {
    expect(priceItem('mri/not-real')).toBeNull();
    expect(priceItem('mri')).toBeNull();
    expect(priceItem('')).toBeNull();
    expect(priceItem('package/does-not-exist')).toBeNull();
    expect(priceItem('x'.repeat(200))).toBeNull();
    expect(priceItem(undefined as unknown as string)).toBeNull();
  });

  it('refuses non-string ids so a client cannot smuggle a price object', () => {
    const test = allTests[2];
    const tampered = { id: test.id, price: 1 } as unknown as string;
    expect(priceItem(tampered)).toBeNull();
    expect(priceItem(test.id)?.price).toBe(test.price);
  });
});

describe('priceItems', () => {
  it('de-duplicates, totals and reports unknown ids', () => {
    const [a, b] = allTests;
    const result = priceItems([a.id, a.id, b.id, 'ghost/ghost']);
    expect(result.items).toHaveLength(2);
    expect(result.unknown).toEqual(['ghost/ghost']);
    expect(result.total).toBe(a.price + b.price);
    expect(result.mrpTotal).toBe(a.mrp + b.mrp);
    expect(result.savings).toBe(a.mrp + b.mrp - (a.price + b.price));
  });

  it('returns an empty, zeroed basket for no ids', () => {
    const result = priceItems([]);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.savings).toBe(0);
  });

  it('never reports negative savings', () => {
    const result = priceItems(allTests.slice(0, 3).map((t) => t.id));
    expect(result.savings).toBeGreaterThanOrEqual(0);
  });
});

describe('bookingTotal', () => {
  it('subtracts wallet credit and floors at zero', () => {
    const items = priceItems(allTests.slice(0, 2).map((t) => t.id)).items;
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    expect(bookingTotal(items)).toBe(subtotal);
    expect(bookingTotal(items, 100)).toBe(subtotal - 100);
    expect(bookingTotal(items, subtotal + 50000)).toBe(0);
  });
});
