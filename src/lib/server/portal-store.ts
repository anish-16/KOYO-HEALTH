import { randomBytes, randomInt } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPortalSeed } from '@/data/portal-seed';
import type {
  BookingStatus,
  CatalogueItem,
  CatalogueKind,
  CollectionMode,
  Employee,
  Partner,
  PartnerBooking,
  PartnerReport,
  PortalActivity,
  PortalData,
  StoredPartner,
} from '@/data/portal';

/**
 * The B2B portal book: partners, negotiated catalogues, employee rosters,
 * bookings and an audit trail, held in one JSON document so a booking and its
 * status history can never be written apart. Writes are serialised through a
 * promise chain and atomically renamed into place, mirroring `store.ts`.
 */

const DATA_DIR = process.env.KOYO_DATA_DIR ?? path.join(process.cwd(), '.data');
const FILE = path.join(DATA_DIR, 'portal.json');
const REPORT_DIR = path.join(DATA_DIR, 'partner-reports');

let cache: PortalData | null = null;
let chain: Promise<unknown> = Promise.resolve();

function makeId(prefix: string) {
  return `${prefix}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

function isPortalData(value: unknown): value is PortalData {
  if (!value || typeof value !== 'object') return false;
  const doc = value as Partial<PortalData>;
  return Array.isArray(doc.partners) && Array.isArray(doc.catalogue) && Array.isArray(doc.employees) && Array.isArray(doc.bookings);
}

async function persist(doc: PortalData) {
  await mkdir(DATA_DIR, { recursive: true });
  const temp = `${FILE}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(doc, null, 2), 'utf8');
  await rename(temp, FILE);
}

async function readDoc(): Promise<PortalData> {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    if (isPortalData(parsed)) {
      cache = { ...parsed, activity: Array.isArray(parsed.activity) ? parsed.activity : [] };
      return cache;
    }
  } catch {
    // First run, or an unreadable file: fall through to the demo seed.
  }
  const seeded = buildPortalSeed();
  cache = seeded;
  try {
    await persist(seeded);
  } catch {
    // A read-only filesystem still serves the in-memory copy for this process.
  }
  return seeded;
}

function mutate<T>(task: (doc: PortalData) => T | Promise<T>): Promise<T> {
  const next = chain.then(async () => {
    const doc = await readDoc();
    const result = await task(doc);
    try {
      await persist(doc);
    } catch {
      // Same read-only fallback: the process keeps the updated copy.
    }
    return result;
  });
  chain = next.catch(() => undefined);
  return next;
}

function publicPartner(partner: StoredPartner): Partner {
  const { accessKey: _accessKey, ...rest } = partner;
  return rest;
}

function recordActivity(
  doc: PortalData,
  entry: { partnerId: string; actor: string; role: 'KOYO' | 'Partner'; action: string; detail: string },
) {
  doc.activity = [
    { id: makeId('ACT'), at: new Date().toISOString(), ...entry },
    ...doc.activity,
  ].slice(0, 250);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------------------------------------------------------------- reads ---- */

export async function listPartners(): Promise<Partner[]> {
  const doc = await readDoc();
  return doc.partners.map(publicPartner);
}

export async function getPartner(id: string): Promise<Partner | null> {
  const doc = await readDoc();
  const partner = doc.partners.find((entry) => entry.id === id);
  return partner ? publicPartner(partner) : null;
}

export async function listCatalogue(partnerId: string): Promise<CatalogueItem[]> {
  const doc = await readDoc();
  return doc.catalogue
    .filter((item) => item.partnerId === partnerId)
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
}

export async function listEmployees(partnerId: string): Promise<Employee[]> {
  const doc = await readDoc();
  return doc.employees
    .filter((entry) => entry.partnerId === partnerId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function listBookings(partnerId?: string): Promise<PartnerBooking[]> {
  const doc = await readDoc();
  const bookings = partnerId ? doc.bookings.filter((entry) => entry.partnerId === partnerId) : doc.bookings;
  return [...bookings].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export async function getBooking(id: string): Promise<PartnerBooking | null> {
  const doc = await readDoc();
  return doc.bookings.find((entry) => entry.id === id) ?? null;
}

export async function getBookingByToken(token: string): Promise<PartnerBooking | null> {
  if (!token || token.length < 16 || token.length > 64) return null;
  const doc = await readDoc();
  return doc.bookings.find((entry) => entry.patientToken === token) ?? null;
}

export async function listActivity(partnerId?: string, limit = 12): Promise<PortalActivity[]> {
  const doc = await readDoc();
  const entries = partnerId ? doc.activity.filter((entry) => entry.partnerId === partnerId) : doc.activity;
  return [...entries].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

export async function verifyPartnerLogin(code: string, accessKey: string): Promise<Partner | null> {
  const normalised = code.trim().toUpperCase();
  const doc = await readDoc();
  const partner = doc.partners.find((entry) => entry.code.toUpperCase() === normalised);
  if (!partner) return null;
  if (partner.status === 'Paused') return null;
  if (partner.accessKey !== accessKey.trim()) return null;
  return publicPartner(partner);
}

/**
 * Demo-only credential list for the local sign-in card. The sign-in page calls
 * this only outside production (or when KOYO_DEMO_PORTAL=1), because a real
 * deployment issues partner keys through the account manager, not the UI.
 */
export async function demoCredentials() {
  const doc = await readDoc();
  return doc.partners
    .filter((partner) => partner.status !== 'Paused')
    .map((partner) => ({ name: partner.name, code: partner.code, accessKey: partner.accessKey }));
}

export async function partnerByToken(token: string): Promise<Partner | null> {
  const doc = await readDoc();
  const partner = doc.partners.find((entry) => entry.accessKey === token);
  return partner ? publicPartner(partner) : null;
}

/* ------------------------------------------------------------ mutations ---- */

export async function createPartnerRecord(input: {
  name: string;
  city: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  gstin?: string;
  headcount: number;
  accountManager: string;
  billingCycle: Partner['billingCycle'];
  modes: CollectionMode[];
}): Promise<{ partner: Partner; accessKey: string }> {
  return mutate((doc) => {
    const sequence = doc.partners.length + 1;
    const prefix = input.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'PRT';
    const accessKey = `${prefix}-${randomInt(1000, 9999)}`;
    const partner: StoredPartner = {
      id: `PTR-${String(sequence).padStart(2, '0')}`,
      name: input.name,
      code: `${prefix}-${randomInt(1000, 9999)}`,
      city: input.city,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone.replace(/\D/g, '').slice(-10),
      gstin: input.gstin || undefined,
      status: 'Onboarding',
      since: todayIso(),
      headcount: input.headcount,
      accountManager: input.accountManager,
      modes: input.modes,
      billingCycle: input.billingCycle,
      accessKey,
      createdAt: new Date().toISOString(),
    };
    doc.partners.push(partner);
    recordActivity(doc, {
      partnerId: partner.id,
      actor: 'KOYO Operations',
      role: 'KOYO',
      action: 'Partner onboarded',
      detail: `${partner.name} · ${partner.city} · ${partner.code}`,
    });
    return { partner: publicPartner(partner), accessKey };
  });
}

export async function addCatalogueItemRecord(
  partnerId: string,
  input: {
    kind: CatalogueKind;
    name: string;
    refId?: string;
    includes?: string[];
    listPrice: number;
    rate: number;
    modes: CollectionMode[];
    tatHours: number;
    actor: { name: string; role: 'KOYO' | 'Partner' };
  },
): Promise<CatalogueItem> {
  return mutate((doc) => {
    const partner = doc.partners.find((entry) => entry.id === partnerId);
    const item: CatalogueItem = {
      id: makeId('CAT'),
      partnerId,
      kind: input.kind,
      name: input.name,
      refId: input.refId,
      includes: input.includes,
      listPrice: input.listPrice,
      rate: input.rate,
      modes: input.modes,
      tatHours: input.tatHours,
      active: true,
      createdAt: new Date().toISOString(),
    };
    doc.catalogue.push(item);
    recordActivity(doc, {
      partnerId,
      actor: input.actor.name,
      role: input.actor.role,
      action: 'Catalogue item added',
      detail: `${item.name} at ₹${item.rate} for ${partner?.name ?? partnerId}`,
    });
    return item;
  });
}

export async function setCatalogueActive(partnerId: string, itemId: string, active: boolean): Promise<boolean> {
  return mutate((doc) => {
    const item = doc.catalogue.find((entry) => entry.id === itemId && entry.partnerId === partnerId);
    if (!item) return false;
    item.active = active;
    return true;
  });
}

export async function addEmployeeRecords(
  partnerId: string,
  rows: {
    code?: string;
    name: string;
    age: number;
    gender: Employee['gender'];
    phone?: string;
    email?: string;
    department?: string;
    location?: string;
  }[],
  actor: { name: string; role: 'KOYO' | 'Partner' },
): Promise<{ added: Employee[]; skipped: number }> {
  return mutate((doc) => {
    const existing = new Set(
      doc.employees.filter((entry) => entry.partnerId === partnerId).map((entry) => entry.code.toUpperCase()),
    );
    const added: Employee[] = [];
    let skipped = 0;

    for (const row of rows) {
      const code = (row.code || '').trim().toUpperCase();
      if (code && existing.has(code)) {
        skipped += 1;
        continue;
      }
      const nextCode = code || `EMP-${String(doc.employees.length + 1).padStart(4, '0')}`;
      const employee: Employee = {
        id: makeId('EST'),
        partnerId,
        code: nextCode,
        name: row.name,
        age: row.age,
        gender: row.gender,
        phone: row.phone ? row.phone.replace(/\D/g, '').slice(-10) : undefined,
        email: row.email || undefined,
        department: row.department ?? '',
        location: row.location ?? '',
        addedAt: new Date().toISOString(),
      };
      doc.employees.push(employee);
      existing.add(nextCode);
      added.push(employee);
    }

    if (added.length) {
      recordActivity(doc, {
        partnerId,
        actor: actor.name,
        role: actor.role,
        action: 'Roster updated',
        detail: `${added.length} employee${added.length === 1 ? '' : 's'} added`,
      });
    }
    return { added, skipped };
  });
}

export async function createBookingRecords(
  partnerId: string,
  input: {
    employeeIds: string[];
    itemIds: string[];
    date: string;
    mode: CollectionMode;
    location: string;
    notes?: string;
  },
  actor: { name: string; role: 'KOYO' | 'Partner' },
): Promise<{ created: PartnerBooking[]; skipped: number }> {
  return mutate((doc) => {
    const catalogue = doc.catalogue.filter(
      (item) => item.partnerId === partnerId && item.active && input.itemIds.includes(item.id),
    );
    const employees = doc.employees.filter(
      (entry) => entry.partnerId === partnerId && input.employeeIds.includes(entry.id),
    );

    const created: PartnerBooking[] = [];
    const now = new Date().toISOString();

    for (const employee of employees) {
      if (catalogue.length === 0) break;
      const items = catalogue.map((item) => ({ id: item.id, name: item.name, kind: item.kind, rate: item.rate }));
      const total = items.reduce((sum, item) => sum + item.rate, 0);
      const booking: PartnerBooking = {
        id: makeId('PB'),
        partnerId,
        employeeId: employee.id,
        employeeName: employee.name,
        employeeCode: employee.code,
        department: employee.department,
        items,
        total,
        date: input.date,
        mode: input.mode,
        location: input.location,
        notes: input.notes || undefined,
        status: 'Scheduled',
        statusBy: actor.role,
        history: [{ at: now, status: 'Scheduled', actor: actor.name, role: actor.role }],
        patientToken: randomBytes(12).toString('hex'),
        createdAt: now,
      };
      doc.bookings.push(booking);
      created.push(booking);
    }

    if (created.length) {
      recordActivity(doc, {
        partnerId,
        actor: actor.name,
        role: actor.role,
        action: 'Bookings scheduled',
        detail: `${created.length} employee${created.length === 1 ? '' : 's'} · ${input.mode} · ${input.date}`,
      });
    }

    return { created, skipped: Math.max(0, employees.length - created.length) };
  });
}

export async function setBookingStatus(
  bookingId: string,
  status: BookingStatus,
  actor: { name: string; role: 'KOYO' | 'Partner' },
): Promise<PartnerBooking | null> {
  return mutate((doc) => {
    const booking = doc.bookings.find((entry) => entry.id === bookingId);
    if (!booking || booking.status === status) return booking ?? null;
    booking.status = status;
    booking.statusBy = actor.role;
    booking.history.push({ at: new Date().toISOString(), status, actor: actor.name, role: actor.role });
    recordActivity(doc, {
      partnerId: booking.partnerId,
      actor: actor.name,
      role: actor.role,
      action: `Booking ${status.toLowerCase()}`,
      detail: `${booking.employeeName} · ${booking.id}`,
    });
    return booking;
  });
}

export async function attachBookingReport(
  bookingId: string,
  report: PartnerReport,
  actor: { name: string; role: 'KOYO' | 'Partner' },
): Promise<PartnerBooking | null> {
  return mutate((doc) => {
    const booking = doc.bookings.find((entry) => entry.id === bookingId);
    if (!booking) return null;
    booking.report = report;
    if (booking.status !== 'Completed') {
      booking.status = 'Report ready';
      booking.statusBy = actor.role;
      booking.history.push({
        at: new Date().toISOString(),
        status: 'Report ready',
        actor: actor.name,
        role: actor.role,
      });
    }
    recordActivity(doc, {
      partnerId: booking.partnerId,
      actor: actor.name,
      role: actor.role,
      action: 'Report released',
      detail: `${booking.employeeName} · ${booking.id}`,
    });
    return booking;
  });
}

/* -------------------------------------------------------- report files ---- */

const MIME_EXTENSION: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export async function saveReportFile(
  bookingId: string,
  buffer: Buffer,
  mime: string,
): Promise<{ storedName: string }> {
  const extension = MIME_EXTENSION[mime];
  if (!extension) throw new Error('Unsupported report type');
  const storedName = `${bookingId}-${randomBytes(8).toString('hex')}.${extension}`;
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(path.join(REPORT_DIR, storedName), buffer);
  return { storedName };
}

export async function readReportFile(storedName: string): Promise<Buffer | null> {
  // storedName is generated by saveReportFile, never by a request. Still,
  // reject any path separator so a corrupted record cannot escape the folder.
  if (!/^[A-Za-z0-9-]+\.(pdf|jpg|png)$/.test(storedName)) return null;
  try {
    return await readFile(path.join(REPORT_DIR, storedName));
  } catch {
    return null;
  }
}
