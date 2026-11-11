import { describe, expect, it } from 'vitest';
import {
  phoneSchema, otpVerifySchema, bookingSchema, callbackSchema, subscribeSchema,
} from '@/lib/validation';

const iso = (offsetDays: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const validBooking = {
  items: ['mri/mri-brain-plain'],
  mode: 'Home Collection' as const,
  patient: { name: 'Aarav Mehta', age: 39, gender: 'Male' as const },
  contactPhone: '9810124477',
  address: 'A-704, Ivory Towers, Sector 50, Noida',
  pincode: '201301',
  date: iso(3),
  slot: '08:30 AM',
  payment: 'Pay online' as const,
  consent: true as const,
};

describe('phoneSchema', () => {
  it('accepts Indian mobile formats and strips country codes', () => {
    for (const phone of ['9810124477', '+91 98101 24477', '98101-24477']) {
      expect(phoneSchema.safeParse(phone).success).toBe(true);
    }
  });

  it('rejects landlines, short numbers and letters', () => {
    for (const phone of ['1234567890', '98101', 'abcdefghij', '5810124477']) {
      expect(phoneSchema.safeParse(phone).success).toBe(false);
    }
  });
});

describe('otpVerifySchema', () => {
  it('requires a six-digit code and a valid phone', () => {
    expect(otpVerifySchema.safeParse({ phone: '9810124477', code: '482913' }).success).toBe(true);
    expect(otpVerifySchema.safeParse({ phone: '9810124477', code: '48291' }).success).toBe(false);
    expect(otpVerifySchema.safeParse({ phone: '9810124477', code: '48291a' }).success).toBe(false);
    expect(otpVerifySchema.safeParse({ phone: '123', code: '482913' }).success).toBe(false);
  });
});

describe('bookingSchema', () => {
  it('accepts a complete home collection booking', () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it('requires an address and pincode for home collection', () => {
    const result = bookingSchema.safeParse({ ...validBooking, address: '', pincode: undefined });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('address');
      expect(paths).toContain('pincode');
    }
  });

  it('requires a centre for a centre visit', () => {
    const missing = bookingSchema.safeParse({ ...validBooking, mode: 'Center Visit' });
    expect(missing.success).toBe(false);
    const withCentre = bookingSchema.safeParse({ ...validBooking, mode: 'Center Visit', centerId: 'c9' });
    expect(withCentre.success).toBe(true);
  });

  it('rejects past dates, far-future dates and bad date formats', () => {
    expect(bookingSchema.safeParse({ ...validBooking, date: iso(-1) }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, date: iso(120) }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, date: '14-11-2026' }).success).toBe(false);
  });

  it('enforces item limits and explicit consent', () => {
    expect(bookingSchema.safeParse({ ...validBooking, items: [] }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, items: Array(16).fill('mri/mri-brain-plain') }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, consent: false }).success).toBe(false);
  });

  it('rejects out-of-range ages and unknown genders', () => {
    expect(bookingSchema.safeParse({ ...validBooking, patient: { name: 'X Y', age: 130, gender: 'Male' } }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, patient: { name: 'X Y', age: 30, gender: 'Unknown' } }).success).toBe(false);
  });
});

describe('callbackSchema', () => {
  it('defaults an absent message and requires consent', () => {
    const parsed = callbackSchema.safeParse({ name: 'Ishita', phone: '9810199821', concern: 'Report question', consent: true });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.message).toBe('');
    expect(callbackSchema.safeParse({ name: 'Ishita', phone: '9810199821', concern: 'Report question', consent: false }).success).toBe(false);
  });

  it('caps message length at 600 characters', () => {
    expect(callbackSchema.safeParse({ name: 'A B', phone: '9810199821', concern: 'Help', message: 'x'.repeat(601), consent: true }).success).toBe(false);
  });
});

describe('subscribeSchema', () => {
  it('normalises email casing and rejects junk', () => {
    const parsed = subscribeSchema.safeParse({ email: '  Aarav@Example.COM ' });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe('aarav@example.com');
    expect(subscribeSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
});
