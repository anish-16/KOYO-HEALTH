import { z } from 'zod';
import { phoneSchema } from '@/lib/validation';
import { parseCsvRows } from '@/lib/portal-csv';
import {
  CATALOGUE_KINDS,
  COLLECTION_MODES,
  PARTNER_STATUSES,
} from '@/data/portal';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const optionalPhone = z.union([z.literal(''), phoneSchema]).optional().default('');
const optionalEmail = z
  .union([z.literal(''), z.string().trim().toLowerCase().email('Enter a valid email').max(160)])
  .optional()
  .default('');

export const employeeRowSchema = z.object({
  code: z.string().trim().max(24, 'Employee code is too long').optional().default(''),
  name: z.string().trim().min(2, 'Enter the employee name').max(80, 'Name is too long'),
  age: z.coerce.number().int().min(1, 'Enter the age').max(120, 'Enter a valid age'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: optionalPhone,
  email: optionalEmail,
  department: z.string().trim().max(60).optional().default(''),
  location: z.string().trim().max(80).optional().default(''),
});

export type EmployeeRowInput = z.infer<typeof employeeRowSchema>;

export function parseEmployeeCsv(text: string) {
  const parsed = parseCsvRows(text);
  if (parsed.error) return { rows: [] as EmployeeRowInput[], errors: [{ line: 0, message: parsed.error }] };

  const rows: EmployeeRowInput[] = [];
  const errors: { line: number; message: string }[] = [];

  for (const row of parsed.rows) {
    const result = employeeRowSchema.safeParse(row.values);
    if (result.success) rows.push(result.data);
    else errors.push({ line: row.line, message: result.error.issues[0]?.message ?? 'Check this row' });
  }

  return { rows, errors };
}

export const catalogueItemSchema = z.object({
  refId: z.string().trim().max(160).optional().default(''),
  kind: z.enum(CATALOGUE_KINDS),
  name: z.string().trim().max(120).optional().default(''),
  includes: z.string().trim().max(600).optional().default(''),
  listPrice: z.coerce.number().min(0, 'Enter the list price').max(500000),
  rate: z.coerce.number().min(0, 'Enter the partner rate').max(500000),
  modes: z.array(z.enum(COLLECTION_MODES)).min(1, 'Choose at least one collection mode'),
  tatHours: z.coerce.number().int().min(1, 'Enter the turnaround').max(720, 'Turnaround is too long'),
}).superRefine((value, ctx) => {
  const isCustom = value.kind === 'Custom package';
  if (isCustom && value.name.length < 3) {
    ctx.addIssue({ code: 'custom', path: ['name'], message: 'Name the custom package' });
  }
  if (!isCustom && !value.refId) {
    ctx.addIssue({ code: 'custom', path: ['refId'], message: 'Choose a test or package' });
  }
  if (value.rate > value.listPrice && value.listPrice > 0) {
    ctx.addIssue({ code: 'custom', path: ['rate'], message: 'Partner rate cannot exceed the list price' });
  }
});

export const portalBookingSchema = z.object({
  employeeIds: z.array(z.string().min(1)).min(1, 'Select at least one employee').max(200, 'Split the batch to 200 employees'),
  itemIds: z.array(z.string().min(1)).min(1, 'Select at least one test or package').max(30),
  date: isoDate,
  mode: z.enum(COLLECTION_MODES),
  location: z.string().trim().min(3, 'Add the collection location').max(160, 'Location is too long'),
  notes: z.string().trim().max(400).optional().default(''),
}).superRefine((value, ctx) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const when = new Date(`${value.date}T00:00:00`);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 180);
  if (Number.isNaN(when.getTime()) || when < today) {
    ctx.addIssue({ code: 'custom', path: ['date'], message: 'Choose today or a future date' });
  } else if (when > horizon) {
    ctx.addIssue({ code: 'custom', path: ['date'], message: 'Schedules open 180 days ahead' });
  }
});

export const partnerSchema = z.object({
  name: z.string().trim().min(3, 'Enter the partner name').max(120),
  city: z.string().trim().min(2, 'Enter the city').max(60),
  contactName: z.string().trim().min(2, 'Enter the contact person').max(80),
  contactEmail: z.string().trim().toLowerCase().email('Enter a valid email').max(160),
  contactPhone: phoneSchema,
  gstin: z.union([z.literal(''), z.string().trim().regex(/^[0-9A-Z]{15}$/i, 'GSTIN is 15 characters')]).optional().default(''),
  headcount: z.coerce.number().int().min(1, 'Enter the workforce size').max(500000),
  accountManager: z.string().trim().min(2, 'Assign an account manager').max(80),
  billingCycle: z.enum(['Monthly', 'Quarterly', 'Per batch']),
  modes: z.array(z.enum(COLLECTION_MODES)).min(1, 'Choose at least one collection mode'),
});

export const partnerStatusSchema = z.enum(PARTNER_STATUSES);

export const MAX_REPORT_BYTES = 6 * 1024 * 1024;
export const REPORT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

export function reportMimeMatches(mime: string, buffer: Buffer) {
  if (mime === 'application/pdf') return buffer.subarray(0, 5).toString('latin1') === '%PDF-';
  if (mime === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  return false;
}
