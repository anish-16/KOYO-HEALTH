import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .min(10, 'Enter a 10-digit mobile number')
  // Allows separators and a +91 prefix in formatted input (e.g. '+91 98101 24477').
  .max(18, 'Mobile number is too long')
  .refine((value) => {
    const digits = value.replace(/\D/g, '');
    const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    return /^[6-9]\d{9}$/.test(local);
  }, 'Enter a valid Indian mobile number');

export const otpRequestSchema = z.object({ phone: phoneSchema });

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  name: z.string().trim().min(2).max(80).optional(),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const bookingSchema = z.object({
  items: z.array(z.string().min(3).max(160)).min(1, 'Add at least one test').max(15, 'Maximum 15 tests per booking'),
  mode: z.enum(['Home Collection', 'Center Visit']),
  patient: z.object({
    name: z.string().trim().min(2, 'Enter the patient name').max(80),
    age: z.coerce.number().int().min(0).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
  }),
  contactPhone: phoneSchema,
  address: z.string().trim().max(240).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  centerId: z.string().max(40).optional(),
  date: isoDate,
  slot: z.string().min(3).max(20),
  payment: z.enum(['Pay online', 'Pay at centre']),
  notes: z.string().trim().max(400).optional(),
  consent: z.literal(true),
}).superRefine((value, ctx) => {
  if (value.mode === 'Home Collection') {
    if (!value.address || value.address.length < 10) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: 'A full address is required for home collection' });
    }
    if (!value.pincode) {
      ctx.addIssue({ code: 'custom', path: ['pincode'], message: 'A 6-digit pincode is required for home collection' });
    }
  }
  if (value.mode === 'Center Visit' && !value.centerId) {
    ctx.addIssue({ code: 'custom', path: ['centerId'], message: 'Choose a collection centre' });
  }
  const when = new Date(`${value.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 90);
  if (Number.isNaN(when.getTime()) || when < today) {
    ctx.addIssue({ code: 'custom', path: ['date'], message: 'Choose today or a future date' });
  } else if (when > horizon) {
    ctx.addIssue({ code: 'custom', path: ['date'], message: 'Bookings open 90 days in advance' });
  }
});

export const callbackSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  phone: phoneSchema,
  concern: z.string().trim().min(2).max(80),
  message: z.string().trim().max(600).optional().default(''),
  consent: z.literal(true),
});

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type CallbackInput = z.infer<typeof callbackSchema>;
