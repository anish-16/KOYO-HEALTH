import { randomInt } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { BookingInput, CallbackInput } from '@/lib/validation';
import type { PricedItem } from '@/lib/pricing';

export type StoredBooking = {
  id: string;
  createdAt: string;
  userPhone?: string;
  patient: BookingInput['patient'];
  contactPhone: string;
  items: PricedItem[];
  total: number;
  savings: number;
  mode: BookingInput['mode'];
  address?: string;
  pincode?: string;
  centerId?: string;
  date: string;
  slot: string;
  payment: BookingInput['payment'];
  notes?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
};

export type StoredCallback = CallbackInput & { id: string; createdAt: string; status: 'New' };
export type StoredSubscriber = { id: string; email: string; createdAt: string };

const DATA_DIR = process.env.KOYO_DATA_DIR ?? path.join(process.cwd(), '.data');
const memory: Record<string, unknown[]> = { bookings: [], callbacks: [], subscribers: [] };

let writeChain: Promise<unknown> = Promise.resolve();

async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(DATA_DIR, `${name}.json`), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return (memory[name] as T[]) ?? [];
  }
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeChain.then(task, task);
  writeChain = next.catch(() => undefined);
  return next;
}

async function appendRecord<T>(name: string, record: T): Promise<T> {
  return enqueue(async () => {
    const existing = await readCollection<T>(name);
    const next = [record, ...existing].slice(0, 5000);
    memory[name] = next;
    try {
      await mkdir(DATA_DIR, { recursive: true });
      const target = path.join(DATA_DIR, `${name}.json`);
      const temp = `${target}.${process.pid}.tmp`;
      await writeFile(temp, JSON.stringify(next, null, 2), 'utf8');
      await rename(temp, target);
    } catch {
      // Read-only filesystems still serve the in-memory copy for this process.
    }
    return record;
  });
}

function makeId(prefix: string) {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `${prefix}-${yy}${mm}-${randomInt(1000, 9999)}`;
}

export async function createBooking(
  input: BookingInput,
  items: PricedItem[],
  totals: { total: number; savings: number },
  userPhone?: string,
): Promise<StoredBooking> {
  const record: StoredBooking = {
    id: makeId('KB'),
    createdAt: new Date().toISOString(),
    userPhone,
    patient: input.patient,
    contactPhone: input.contactPhone.replace(/\D/g, '').slice(-10),
    items,
    total: totals.total,
    savings: totals.savings,
    mode: input.mode,
    address: input.address,
    pincode: input.pincode,
    centerId: input.centerId,
    date: input.date,
    slot: input.slot,
    payment: input.payment,
    notes: input.notes,
    status: 'Confirmed',
  };
  return appendRecord('bookings', record);
}

export async function listBookings(phone?: string): Promise<StoredBooking[]> {
  const all = await readCollection<StoredBooking>('bookings');
  if (!phone) return all;
  const digits = phone.replace(/\D/g, '').slice(-10);
  return all.filter((b) => b.contactPhone === digits || b.userPhone === digits);
}

export async function createCallback(input: CallbackInput): Promise<StoredCallback> {
  const record: StoredCallback = {
    ...input,
    id: makeId('CB'),
    createdAt: new Date().toISOString(),
    status: 'New',
  };
  return appendRecord('callbacks', record);
}

export async function createSubscriber(email: string): Promise<StoredSubscriber> {
  const record: StoredSubscriber = { id: makeId('SUB'), email, createdAt: new Date().toISOString() };
  return appendRecord('subscribers', record);
}

export async function storeCounts() {
  const [bookings, callbacks, subscribers] = await Promise.all([
    readCollection('bookings'),
    readCollection('callbacks'),
    readCollection('subscribers'),
  ]);
  return { bookings: bookings.length, callbacks: callbacks.length, subscribers: subscribers.length };
}
