import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian numbering system: ₹1,24,500 */
export function formatINR(value: number, opts: { compact?: boolean; decimals?: number } = {}) {
  const { compact = false, decimals = 0 } = opts;
  if (!Number.isFinite(value)) return '₹0';
  if (compact && Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (compact && Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  const fixed = Number(value.toFixed(decimals));
  const [whole, decimal] = Math.abs(fixed).toString().split('.');
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}` : last3;
  return `${fixed < 0 ? '-' : ''}₹${grouped}${decimal ? `.${decimal}` : ''}`;
}

export function discountPct(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function titleCase(input: string) {
  return input.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

export function initials(name: string) {
  return name
    .replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(date);
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Date label and time-of-day greeting in IST, where KOYO's patients live — a
 * server in UTC should not wish anyone a good morning at 2am.
 */
export function istGreeting(now: Date = new Date()) {
  const dayLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  }).format(now);
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Kolkata' }).format(now),
  );
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return { dayLabel, greeting };
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return phone;
  return `+91 ${digits.slice(0, 3)}••••${digits.slice(-3)}`;
}

export function isValidIndianPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10)) &&
    phone.replace(/\D/g, '').length <= 12;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString('en-IN')} ${count === 1 ? singular : plural}`;
}

/** Deterministic pseudo-random from string — keeps dummy data stable across renders. */
export function seeded(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
