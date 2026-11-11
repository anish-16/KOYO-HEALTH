import { describe, expect, it } from 'vitest';
import {
  cn, formatDate, formatINR, discountPct, initials, isValidIndianPhone,
  maskPhone, pluralise, slugify, titleCase, seeded, clamp, istGreeting,
} from '@/lib/utils';

describe('istGreeting', () => {
  it('greets by IST clock, not the server timezone', () => {
    // 02:30 UTC is 08:00 IST — morning in Kolkata.
    expect(istGreeting(new Date('2026-11-07T02:30:00Z')).greeting).toBe('Good morning');
    // 09:30 UTC is 15:00 IST — afternoon.
    expect(istGreeting(new Date('2026-11-07T09:30:00Z')).greeting).toBe('Good afternoon');
    // 14:30 UTC is 20:00 IST — evening.
    expect(istGreeting(new Date('2026-11-07T14:30:00Z')).greeting).toBe('Good evening');
  });

  it('rolls the date over at IST midnight and names the weekday correctly', () => {
    const label = istGreeting(new Date('2026-11-07T18:30:00Z')).dayLabel;
    expect(label).toContain('8 November 2026');
    expect(label).toContain('Sunday');
  });
});

describe('formatINR', () => {
  it('formats whole rupees in the Indian grouping system', () => {
    expect(formatINR(999)).toBe('₹999');
    expect(formatINR(1500)).toBe('₹1,500');
    expect(formatINR(124500)).toBe('₹1,24,500');
    expect(formatINR(12345678)).toBe('₹1,23,45,678');
  });

  it('supports compact lakh and crore notation', () => {
    expect(formatINR(124000, { compact: true })).toBe('₹1.2L');
    expect(formatINR(25000000, { compact: true })).toBe('₹2.5Cr');
    expect(formatINR(1500, { compact: true })).toBe('₹1,500');
  });

  it('handles negatives, decimals and invalid input', () => {
    expect(formatINR(-2500)).toBe('-₹2,500');
    expect(formatINR(1234.56, { decimals: 2 })).toBe('₹1,234.56');
    expect(formatINR(Number.NaN)).toBe('₹0');
    expect(formatINR(Number.POSITIVE_INFINITY)).toBe('₹0');
  });
});

describe('discountPct', () => {
  it('computes a rounded discount', () => {
    expect(discountPct(6499, 10499)).toBe(38);
    expect(discountPct(100, 200)).toBe(50);
  });
  it('never returns a negative or nonsensical discount', () => {
    expect(discountPct(500, 400)).toBe(0);
    expect(discountPct(500, 0)).toBe(0);
  });
});

describe('slugify', () => {
  it('normalises names into URL slugs', () => {
    expect(slugify('MRI Brain (Plain)')).toBe('mri-brain-plain');
    expect(slugify('  Thyroid Profile — T3, T4  ')).toBe('thyroid-profile-t3-t4');
    expect(slugify('CT')).toBe('ct');
  });
});

describe('phone helpers', () => {
  it('accepts valid Indian mobiles in common formats', () => {
    expect(isValidIndianPhone('9810124477')).toBe(true);
    expect(isValidIndianPhone('+91 98101 24477')).toBe(true);
    expect(isValidIndianPhone('09810124477')).toBe(true);
    expect(isValidIndianPhone('12345')).toBe(false);
  });

  it('masks all but the first and last three digits', () => {
    expect(maskPhone('9810124477')).toBe('+91 981••••477');
    expect(maskPhone('123')).toBe('123');
  });
});

describe('misc helpers', () => {
  it('builds initials without titles', () => {
    expect(initials('Dr. Ananya Rao')).toBe('AR');
    expect(initials('Aarav')).toBe('A');
  });

  it('title-cases and pluralises', () => {
    expect(titleCase('full body checkup')).toBe('Full Body Checkup');
    expect(pluralise(1, 'test')).toBe('1 test');
    expect(pluralise(3, 'test')).toBe('3 tests');
    expect(pluralise(3, 'biopsy', 'biopsies')).toBe('3 biopsies');
  });

  it('clamps values and formats dates deterministically', () => {
    expect(clamp(120, 0, 100)).toBe(100);
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(formatDate('2026-11-14')).toBe('14 Nov 2026');
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('produces a repeatable pseudo-random sequence', () => {
    const a = seeded('koyo');
    const b = seeded('koyo');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(seeded('different')()).not.toBe(seeded('koyo')());
  });

  it('merges conditional class names', () => {
    expect(cn('px-2', false && 'hidden', 'px-4')).toBe('px-4');
  });
});
