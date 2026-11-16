'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearPortalSession, getPortalActor, type PortalActor } from '@/lib/server/portal-auth';
import {
  addCatalogueItemRecord,
  addEmployeeRecords,
  attachBookingReport,
  createBookingRecords,
  createPartnerRecord,
  getBooking,
  listCatalogue,
  listPartners,
  saveReportFile,
  setBookingStatus,
  setCatalogueActive,
} from '@/lib/server/portal-store';
import {
  catalogueItemSchema,
  MAX_REPORT_BYTES,
  parseEmployeeCsv,
  employeeRowSchema,
  partnerSchema,
  portalBookingSchema,
  REPORT_MIME_TYPES,
  reportMimeMatches,
} from '@/lib/portal-validation';
import { priceItem } from '@/lib/pricing';
import { allTests } from '@/data/services';
import {
  BOOKING_STATUSES,
  COLLECTION_MODES,
  type BookingStatus,
  type CatalogueKind,
  type PortalActionState,
} from '@/data/portal';

const PORTAL_PATH = '/portal/b2b';

function fail(message: string, fields?: Record<string, string>): PortalActionState {
  return { status: 'error', message, fields };
}

function ok(message: string, extra: Partial<PortalActionState> = {}): PortalActionState {
  return { status: 'ok', message, ...extra };
}

function fieldError(error: { issues: { path: (string | number | symbol)[]; message: string }[] }) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.') || 'form';
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

async function actorOrRedirect() {
  const actor = await getPortalActor();
  if (!actor) redirect(`${PORTAL_PATH}/sign-in`);
  return actor;
}

type PartnerScope =
  | { actor: PortalActor; partnerId: string }
  | { error: PortalActionState };

async function partnerScope(formData: FormData): Promise<PartnerScope> {
  const actor = await actorOrRedirect();
  const partnerId = String(formData.get('partnerId') ?? '');
  if (!partnerId) return { error: fail('Choose a partner workspace first.') };

  if (actor.role === 'partner' && actor.partnerId !== partnerId) {
    return { error: fail('You do not have access to this partner workspace.') };
  }
  if (actor.role === 'ops') {
    const partners = await listPartners();
    if (!partners.some((partner) => partner.id === partnerId)) {
      return { error: fail('That partner no longer exists.') };
    }
  }
  return { actor, partnerId };
}

function actorFor(actor: PortalActor): { name: string; role: 'KOYO' | 'Partner' } {
  return { name: actor.name, role: actor.role === 'ops' ? 'KOYO' : 'Partner' };
}

function refresh() {
  revalidatePath(PORTAL_PATH, 'layout');
}

/* --------------------------------------------------------------- session --- */

export async function signOutAction() {
  await clearPortalSession();
  redirect(`${PORTAL_PATH}/sign-in`);
}

/* --------------------------------------------------------------- roster ---- */

export async function addEmployeeAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const scope = await partnerScope(formData);
  if ('error' in scope) return scope.error;

  const parsed = employeeRowSchema.safeParse({
    code: String(formData.get('code') ?? ''),
    name: String(formData.get('name') ?? ''),
    age: String(formData.get('age') ?? ''),
    gender: String(formData.get('gender') ?? 'Male'),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    department: String(formData.get('department') ?? ''),
    location: String(formData.get('location') ?? ''),
  });
  if (!parsed.success) {
    return fail('Check the highlighted fields.', fieldError(parsed.error));
  }

  const result = await addEmployeeRecords(scope.partnerId, [parsed.data], actorFor(scope.actor));
  refresh();
  if (result.added.length === 0) {
    return fail(`Employee code ${parsed.data.code || ''} is already on this roster.`);
  }
  return ok(`${parsed.data.name} added to the roster.`);
}

export async function bulkEmployeesAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const scope = await partnerScope(formData);
  if ('error' in scope) return scope.error;

  const text = String(formData.get('csv') ?? '');
  const { rows, errors } = parseEmployeeCsv(text);
  if (rows.length === 0) {
    const first = errors[0]?.message ?? 'No valid rows found.';
    return fail(`Nothing imported. ${first}`);
  }

  const result = await addEmployeeRecords(scope.partnerId, rows, actorFor(scope.actor));
  refresh();

  const parts = [`${result.added.length} employee${result.added.length === 1 ? '' : 's'} imported`];
  if (result.skipped) parts.push(`${result.skipped} duplicate code${result.skipped === 1 ? '' : 's'} skipped`);
  if (errors.length) parts.push(`${errors.length} row${errors.length === 1 ? '' : 's'} rejected`);

  if (result.added.length === 0) {
    return fail(`${parts.join(' · ')}. ${errors[0] ? `Line ${errors[0].line}: ${errors[0].message}` : ''}`);
  }
  return {
    status: 'ok',
    message: `${parts.join(' · ')}.`,
    added: result.added.length,
    skipped: result.skipped,
  };
}

/* ------------------------------------------------------------ catalogue ---- */

export async function addCatalogueItemAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const scope = await partnerScope(formData);
  if ('error' in scope) return scope.error;

  // The catalogue is KOYO's commercial offer; a partner can read its rates but
  // cannot set them.
  if (scope.actor.role !== 'ops') {
    return fail('Only KOYO operations can change the partner catalogue.');
  }

  const parsed = catalogueItemSchema.safeParse({
    refId: String(formData.get('refId') ?? ''),
    kind: String(formData.get('kind') ?? 'Pathology'),
    name: String(formData.get('name') ?? ''),
    includes: String(formData.get('includes') ?? ''),
    listPrice: String(formData.get('listPrice') ?? ''),
    rate: String(formData.get('rate') ?? ''),
    modes: formData.getAll('modes').map(String),
    tatHours: String(formData.get('tatHours') ?? '24'),
  });
  if (!parsed.success) return fail('Check the catalogue fields.', fieldError(parsed.error));

  const input = parsed.data;
  let kind: CatalogueKind = input.kind;
  let name = input.name;
  let listPrice = input.listPrice;
  let refId: string | undefined;
  let includes: string[] | undefined;

  if (kind === 'Custom package') {
    includes = input.includes
      .split(/[,;\n]/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .slice(0, 40);
  } else {
    const reference = input.refId.replace(/^test:/, '');
    const priced = priceItem(reference);
    if (!priced) return fail('That test or package is not in the live catalogue.');
    name = priced.name;
    listPrice = priced.price;
    refId = reference;
    kind = reference.startsWith('package/')
      ? 'Health package'
      : allTests.find((entry) => entry.id === reference)?.modality === 'Pathology'
        ? 'Pathology'
        : 'Radiology & imaging';
  }

  if (input.rate > listPrice) return fail('Partner rate cannot exceed the list price.', { rate: 'Rate exceeds list price' });

  await addCatalogueItemRecord(scope.partnerId, {
    kind,
    name,
    refId,
    includes,
    listPrice,
    rate: input.rate,
    modes: input.modes,
    tatHours: input.tatHours,
    actor: actorFor(scope.actor),
  });
  refresh();
  return ok(`${name} added at ₹${input.rate.toLocaleString('en-IN')}.`);
}

export async function toggleCatalogueItemAction(formData: FormData) {
  const scope = await partnerScope(formData);
  if ('error' in scope) return;
  if (scope.actor.role !== 'ops') return;

  const itemId = String(formData.get('itemId') ?? '');
  const active = String(formData.get('active') ?? '') === 'true';
  await setCatalogueActive(scope.partnerId, itemId, active);
  refresh();
}

/* ------------------------------------------------------------- bookings ---- */

export async function createBookingsAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const scope = await partnerScope(formData);
  if ('error' in scope) return scope.error;

  const parsed = portalBookingSchema.safeParse({
    employeeIds: formData.getAll('employeeIds').map(String),
    itemIds: formData.getAll('itemIds').map(String),
    date: String(formData.get('date') ?? ''),
    mode: String(formData.get('mode') ?? ''),
    location: String(formData.get('location') ?? ''),
    notes: String(formData.get('notes') ?? ''),
  });
  if (!parsed.success) return fail('Check the booking details.', fieldError(parsed.error));

  const catalogue = await listCatalogue(scope.partnerId);
  const selected = catalogue.filter((item) => item.active && parsed.data.itemIds.includes(item.id));
  if (selected.length !== parsed.data.itemIds.length) {
    return fail('One or more catalogue items are no longer available. Refresh and try again.');
  }
  const unsupported = selected.filter((item) => !item.modes.includes(parsed.data.mode));
  if (unsupported.length > 0) {
    return fail(
      `${unsupported.map((item) => item.name).join(', ')} cannot be collected via ${parsed.data.mode.toLowerCase()}.`,
    );
  }

  const result = await createBookingRecords(
    scope.partnerId,
    parsed.data,
    actorFor(scope.actor),
  );
  refresh();

  if (result.created.length === 0) {
    return fail('No booking was created. Check the selected employees and catalogue items.');
  }
  return ok(
    `${result.created.length} booking${result.created.length === 1 ? '' : 's'} scheduled for ${parsed.data.date}.`,
    { created: result.created.length },
  );
}

export async function updateBookingStatusAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const actor = await actorOrRedirect();
  const bookingId = String(formData.get('bookingId') ?? '');
  const status = String(formData.get('status') ?? '') as BookingStatus;

  if (!BOOKING_STATUSES.includes(status)) return fail('Choose a valid status.');

  const booking = await getBooking(bookingId);
  if (!booking) return fail('That booking no longer exists.');
  if (actor.role === 'partner' && actor.partnerId !== booking.partnerId) {
    return fail('You do not have access to this booking.');
  }
  if (booking.status === status) return ok('Status already up to date.');

  await setBookingStatus(bookingId, status, { name: actor.name, role: actor.role === 'ops' ? 'KOYO' : 'Partner' });
  refresh();
  return ok(`Marked ${booking.employeeName}'s booking as ${status.toLowerCase()}.`);
}

export async function uploadReportAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const actor = await actorOrRedirect();
  const bookingId = String(formData.get('bookingId') ?? '');
  const note = String(formData.get('note') ?? '').trim();

  const booking = await getBooking(bookingId);
  if (!booking) return fail('That booking no longer exists.');
  if (actor.role === 'partner' && actor.partnerId !== booking.partnerId) {
    return fail('You do not have access to this booking.');
  }

  const file = formData.get('file');
  const hasFile = file instanceof File && file.size > 0;
  if (!hasFile && note.length < 5) {
    return fail('Attach a PDF or image, or write a summary the patient can read.');
  }

  let uploaded: { name: string; mime: string; size: number; storedName: string } | undefined;
  if (hasFile) {
    const report = file as File;
    if (report.size > MAX_REPORT_BYTES) {
      return fail('Reports must be 6 MB or smaller.');
    }
    if (!(REPORT_MIME_TYPES as readonly string[]).includes(report.type)) {
      return fail('Upload a PDF, JPG or PNG report.');
    }
    const buffer = Buffer.from(await report.arrayBuffer());
    if (!reportMimeMatches(report.type, buffer)) {
      return fail('That file does not look like a valid PDF or image.');
    }
    try {
      const stored = await saveReportFile(booking.id, buffer, report.type);
      uploaded = {
        name: report.name.slice(0, 120),
        mime: report.type,
        size: report.size,
        storedName: stored.storedName,
      };
    } catch {
      return fail('Report storage is unavailable. Try again, or save the summary without a file.');
    }
  }

  await attachBookingReport(
    bookingId,
    {
      uploadedAt: new Date().toISOString(),
      uploadedBy: actor.name,
      note: note || undefined,
      file: uploaded,
    },
    { name: actor.name, role: actor.role === 'ops' ? 'KOYO' : 'Partner' },
  );
  refresh();
  return ok(`Report released to ${booking.employeeName}. Their private link is now live.`);
}

/* -------------------------------------------------------------- partners --- */

export async function addPartnerAction(
  _prev: PortalActionState,
  formData: FormData,
): Promise<PortalActionState> {
  const actor = await actorOrRedirect();
  if (actor.role !== 'ops') return fail('Only KOYO operations can onboard a partner.');

  const parsed = partnerSchema.safeParse({
    name: String(formData.get('name') ?? ''),
    city: String(formData.get('city') ?? ''),
    contactName: String(formData.get('contactName') ?? ''),
    contactEmail: String(formData.get('contactEmail') ?? ''),
    contactPhone: String(formData.get('contactPhone') ?? ''),
    gstin: String(formData.get('gstin') ?? ''),
    headcount: String(formData.get('headcount') ?? ''),
    accountManager: String(formData.get('accountManager') ?? ''),
    billingCycle: String(formData.get('billingCycle') ?? 'Monthly'),
    modes: formData.getAll('modes').map(String),
  });
  if (!parsed.success) return fail('Check the partner details.', fieldError(parsed.error));

  const { partner, accessKey } = await createPartnerRecord(parsed.data);
  refresh();
  return {
    status: 'ok',
    message: `${partner.name} is onboarded. Share the credentials below with their HR team.`,
    partnerCode: partner.code,
    accessKey,
  };
}
