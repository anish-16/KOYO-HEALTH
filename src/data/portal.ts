/**
 * B2B partner portal domain model.
 *
 * A partner (vendor / corporate client) gets a negotiated catalogue, an employee
 * roster, and bookings raised against both. Bookings carry the collection date,
 * location and a status that either KOYO operations or the partner can advance.
 * Reports are attached by KOYO and exposed to the employee through a private
 * patient link, so the employer never handles the clinical file.
 *
 * This module is safe to import from client components: it holds types and
 * presentation constants only. Seed data lives in `portal-seed.ts` (server).
 */

export const COLLECTION_MODES = ['Home Collection', 'On-site', 'Centre Visit'] as const;
export type CollectionMode = (typeof COLLECTION_MODES)[number];

export const COLLECTION_MODE_DETAIL: Record<CollectionMode, string> = {
  'Home Collection': 'Phlebotomist visits the employee at home',
  'On-site': 'Camp at the office, plant or campus',
  'Centre Visit': 'Employee walks into an accredited centre',
};

export const CATALOGUE_KINDS = [
  'Pathology',
  'Radiology & imaging',
  'Health package',
  'Custom package',
] as const;
export type CatalogueKind = (typeof CATALOGUE_KINDS)[number];

export const BOOKING_STATUSES = [
  'Scheduled',
  'Sample collected',
  'In lab',
  'Report ready',
  'Completed',
  'Cancelled',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Statuses that still owe the employee a report. */
export const OPEN_STATUSES: BookingStatus[] = ['Scheduled', 'Sample collected', 'In lab'];

/** The linear path a healthy booking takes; `Cancelled` sits outside it. */
export const STATUS_FLOW: BookingStatus[] = [
  'Scheduled',
  'Sample collected',
  'In lab',
  'Report ready',
  'Completed',
];

export const STATUS_STYLE: Record<BookingStatus, string> = {
  Scheduled: 'border-teal/20 bg-teal/10 text-teal-deep',
  'Sample collected': 'border-gold/30 bg-gold-soft text-gold-deep',
  'In lab': 'border-mauve/25 bg-mauve/10 text-mauve',
  'Report ready': 'border-teal/30 bg-teal-soft text-forest',
  Completed: 'border-ink bg-ink text-paper',
  Cancelled: 'border-clay/20 bg-clay/10 text-clay',
};

export const PARTNER_STATUSES = ['Active', 'Onboarding', 'Paused'] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export type Partner = {
  id: string;
  name: string;
  /** Short partner code the partner signs in with, e.g. MRC-4417. */
  code: string;
  city: string;
  state?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  gstin?: string;
  status: PartnerStatus;
  /** ISO date the partnership started. */
  since: string;
  /** Declared workforce size; the roster can be smaller while onboarding. */
  headcount: number;
  accountManager: string;
  modes: CollectionMode[];
  billingCycle: 'Monthly' | 'Quarterly' | 'Per batch';
  createdAt: string;
};

export type Employee = {
  id: string;
  partnerId: string;
  /** Employer's own employee id, printed on the invoice. */
  code: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  email?: string;
  department: string;
  location: string;
  addedAt: string;
};

export type CatalogueItem = {
  id: string;
  partnerId: string;
  kind: CatalogueKind;
  name: string;
  /** Catalogue test id (`service/test`) or package slug, when sourced. */
  refId?: string;
  /** Included tests for a custom-built package. */
  includes?: string[];
  listPrice: number;
  /** Negotiated partner rate. Always resolved server-side into a booking. */
  rate: number;
  modes: CollectionMode[];
  tatHours: number;
  active: boolean;
  createdAt: string;
};

export type BookingItem = {
  /** Catalogue item id — rates are copied in at booking time. */
  id: string;
  name: string;
  kind: CatalogueKind;
  rate: number;
};

export type BookingHistoryEntry = {
  at: string;
  status: BookingStatus;
  actor: string;
  role: 'KOYO' | 'Partner';
};

export type ReportFile = {
  name: string;
  mime: string;
  size: number;
  /** Random on-disk name, never derived from user input. */
  storedName: string;
};

export type PartnerReport = {
  uploadedAt: string;
  uploadedBy: string;
  /** Clinician summary shown in the portal and on the patient link. */
  note?: string;
  file?: ReportFile;
};

export type PartnerBooking = {
  id: string;
  partnerId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  items: BookingItem[];
  total: number;
  date: string;
  mode: CollectionMode;
  location: string;
  notes?: string;
  status: BookingStatus;
  statusBy: 'KOYO' | 'Partner';
  history: BookingHistoryEntry[];
  report?: PartnerReport;
  /** Unguessable token behind the employee's private report link. */
  patientToken: string;
  createdAt: string;
};

export type PortalActivity = {
  id: string;
  at: string;
  partnerId: string;
  actor: string;
  role: 'KOYO' | 'Partner';
  action: string;
  detail: string;
};

export type StoredPartner = Partner & {
  /**
   * Demo access key. A real deployment replaces this with SSO / hashed
   * credentials; the store never returns this field outside the auth check.
   */
  accessKey: string;
};

export type PortalData = {
  version: number;
  partners: StoredPartner[];
  catalogue: CatalogueItem[];
  employees: Employee[];
  bookings: PartnerBooking[];
  activity: PortalActivity[];
};

/** Shared server-action result shape, consumed by `useActionState` forms. */
export type PortalActionState = {
  status: 'idle' | 'ok' | 'error';
  message?: string;
  fields?: Record<string, string>;
  added?: number;
  skipped?: number;
  created?: number;
  accessKey?: string;
  partnerCode?: string;
};

export const idleAction: PortalActionState = { status: 'idle' };

export function statusStepIndex(status: BookingStatus) {
  return STATUS_FLOW.indexOf(status);
}

export function isOpenStatus(status: BookingStatus) {
  return OPEN_STATUSES.includes(status);
}
