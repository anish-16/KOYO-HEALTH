'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Banknote, Building2, CalendarDays, Check, CheckCircle2,
  Clock, CreditCard, Home, Loader2, MapPin, ShieldCheck, Stethoscope, Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBooking } from '@/components/booking/BookingProvider';
import { OtpForm } from '@/components/auth/OtpForm';
import { cn, formatDate, formatINR } from '@/lib/utils';
import type { SessionUser } from '@/lib/useSessionUser';

type Center = { id: string; name: string; city: string; address: string };

type BookingResult = {
  id: string;
  date: string;
  slot: string;
  mode: string;
  total: number;
  savings: number;
  items: string[];
  status: string;
};

const STEPS = ['Tests', 'Collection', 'Schedule', 'Verify', 'Payment'];
const SLOTS = ['06:30 AM', '07:30 AM', '08:30 AM', '10:00 AM', '12:00 PM', '04:00 PM', '06:30 PM'];

function nextDates(count = 14) {
  const out: { iso: string; day: string; date: string; month: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      day: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: String(d.getDate()),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    });
  }
  return out;
}

function pincodeRegion(pin: string) {
  const first = pin[0];
  const map: Record<string, string> = {
    '1': 'Delhi NCR & North India', '2': 'Uttar Pradesh & Uttarakhand', '3': 'Rajasthan & Gujarat',
    '4': 'Maharashtra & MP', '5': 'Telangana & Andhra', '6': 'Tamil Nadu & Kerala',
    '7': 'West Bengal & North East', '8': 'Bihar & Jharkhand',
  };
  return map[first] ?? 'your region';
}

export function BookingFlow({
  user,
  centers,
  suggestions,
}: {
  user: SessionUser | null;
  centers: Center[];
  suggestions: { id: string; serviceName: string; testName: string; price: number; mrp: number; fastingHours: number; homeCollection: boolean; sample: string; serviceSlug: string }[];
}) {
  const { items, subtotal, savings, remove, clear, add } = useBooking();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'Home Collection' | 'Center Visit'>('Home Collection');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [centerId, setCenterId] = useState(centers[0]?.id ?? '');
  const [patient, setPatient] = useState({ name: user?.name ?? '', age: '', gender: 'Male' as 'Male' | 'Female' | 'Other' });
  const [contactPhone, setContactPhone] = useState(user?.phone ?? '');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [payment, setPayment] = useState<'Pay online' | 'Pay at centre'>('Pay online');
  const [verifiedUser, setVerifiedUser] = useState<SessionUser | null>(user);
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const reduce = useReducedMotion();

  const dates = useMemo(() => nextDates(), []);
  const selectedDate = dates.find((d) => d.iso === date);
  const pincodeValid = /^\d{6}$/.test(pincode);

  // MRI/CT/X-ray studies can only be done at a centre, so a scan-only cart must
  // never default to (or keep) home collection and its address validation.
  const homeAvailable = items.every((item) => item.homeCollection);

  useEffect(() => {
    if (!homeAvailable && mode === 'Home Collection') setMode('Center Visit');
  }, [homeAvailable, mode]);

  function scrollTop() {
    if (typeof window !== 'undefined') window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  function validate(target: number): boolean {
    const nextErrors: Record<string, string> = {};
    if (target > 0 && items.length === 0) nextErrors.items = 'Add at least one test to continue.';
    if (target > 1) {
      if (mode === 'Home Collection') {
        if (!pincodeValid) nextErrors.pincode = 'Enter a valid 6-digit pincode.';
        if (address.trim().length < 10) nextErrors.address = 'Enter a complete address for collection.';
      } else if (!centerId) {
        nextErrors.centerId = 'Choose a centre.';
      }
    }
    if (target > 2) {
      if (patient.name.trim().length < 2) nextErrors.name = 'Enter the patient name.';
      const age = Number(patient.age);
      if (!Number.isFinite(age) || age < 0 || age > 120) nextErrors.age = 'Enter a valid age.';
      if (!/^[6-9]\d{9}$/.test(contactPhone.replace(/\D/g, '').slice(-10))) nextErrors.phone = 'Enter a valid 10-digit mobile number.';
      if (!date) nextErrors.date = 'Choose a date.';
      if (!slot) nextErrors.slot = 'Choose a time slot.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goTo(target: number) {
    if (target > step && !validate(target)) return;
    setStep(target);
    scrollTop();
  }

  async function submit() {
    if (!consent) {
      setErrors({ consent: 'Please accept the terms to confirm.' });
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => i.id),
          mode,
          patient: { name: patient.name.trim(), age: Number(patient.age), gender: patient.gender },
          contactPhone,
          ...(mode === 'Home Collection' ? { address: address.trim(), pincode } : { centerId }),
          date,
          slot,
          payment,
          notes: notes.trim() || undefined,
          consent: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data.error ?? 'Could not confirm the booking.' });
        return;
      }
      setResult(data.booking);
      clear();
      setStep(5);
      scrollTop();
    } catch {
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
          <div className="surface-ink grain relative px-7 py-9 text-center text-paper">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-paper/10">
              <CheckCircle2 className="h-8 w-8 text-gold" />
            </div>
            <p className="eyebrow mt-5 text-gold">Booking confirmed</p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">You are all set.</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-paper/55">
              A confirmation is on its way by WhatsApp and email. Your care manager will call if anything needs clarifying.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line p-4">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Booking reference</p>
                <p className="tabular mt-1 text-lg font-semibold">{result.id}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">When</p>
                <p className="mt-1 text-sm font-semibold">{formatDate(result.date, { weekday: 'short' })} · {result.slot}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Collection</p>
                <p className="mt-1 text-sm font-semibold">{result.mode}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Amount</p>
                <p className="tabular mt-1 text-sm font-semibold">
                  {formatINR(result.total)} · {result.items.length} test{result.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-teal-mist/60 p-4">
              <p className="text-xs font-semibold">What happens next</p>
              <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink/65">
                <li>1. You will receive a preparation reminder 12 hours before your appointment.</li>
                <li>2. A phlebotomist or technician will be assigned and their details shared.</li>
                <li>3. Reports arrive in your KOYO vault; we will alert you when ready.</li>
              </ol>
            </div>

            <ul className="mt-5 divide-y divide-line rounded-xl border border-line">
              {result.items.map((name) => (
                <li key={name} className="flex items-center gap-2 px-4 py-2.5 text-xs text-ink/70">
                  <Check className="h-3 w-3 text-teal" /> {name}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/dashboard/bookings" className="btn-primary flex-1">View in dashboard</Link>
              <Link href="/services" className="btn-outline flex-1">Book another test</Link>
            </div>
            <p className="mt-3 text-center text-[0.625rem] text-ink/35">
              Need to change something? Call <a href="tel:+918800580075" className="text-teal-deep underline">+91 88005 80075</a> or reschedule from your dashboard.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-soft">
          <Stethoscope className="h-6 w-6 text-teal-deep" />
        </div>
        <h1 className="display mt-5 text-3xl">Your booking is empty</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Add a test or package to get started. Here are the ones people book most often:
        </p>
        <div className="mt-6 grid gap-2 text-left">
          {suggestions.slice(0, 4).map((s) => (
            <button
              key={s.id}
              onClick={() => add({ ...s })}
              className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 transition-colors hover:border-teal/40"
            >
              <span>
                <span className="block text-sm font-medium">{s.testName}</span>
                <span className="block text-[0.6875rem] text-muted">{s.serviceName}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="tabular text-sm font-semibold">{formatINR(s.price)}</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white"><ArrowRight className="h-3.5 w-3.5" /></span>
              </span>
            </button>
          ))}
        </div>
        <Link href="/services" className="btn-outline mt-6">Browse all 120+ tests</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-8">
        {/* Stepper */}
        <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((label, i) => (
            <li key={label} className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => i < step && goTo(i)}
                disabled={i > step}
                aria-current={i === step ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-medium transition-colors',
                  i === step ? 'bg-ink text-white' : i < step ? 'text-teal-deep hover:bg-teal-mist' : 'text-ink/30',
                )}
              >
                <span className={cn(
                  'grid h-4 w-4 place-items-center rounded-full text-[0.5rem] font-bold',
                  i === step ? 'bg-white/15 text-white' : i < step ? 'bg-teal text-white' : 'bg-ink/8',
                )}>
                  {i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}
                </span>
                {label}
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-4 bg-ink/10" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            {step === 0 && (
              <section>
                <h2 className="display text-2xl">Review your tests</h2>
                <p className="mt-1 text-sm text-muted">Prices are locked for 24 hours. You can remove anything you do not need.</p>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-line bg-white p-4">
                      <div className="min-w-0">
                        <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-teal-deep">{item.serviceName}</p>
                        <p className="mt-1 text-sm font-medium">{item.testName}</p>
                        <p className="mt-1 text-[0.6875rem] text-muted">
                          {item.sample === 'None' ? 'Imaging study' : `${item.sample} sample`}
                          {item.homeCollection ? ' · Home collection available' : ' · Centre visit only'}
                          {item.fastingHours > 0 ? ` · ${item.fastingHours}h fast` : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="tabular text-sm font-semibold">{formatINR(item.price)}</span>
                        <button onClick={() => remove(item.id)} aria-label={`Remove ${item.testName}`} className="grid h-8 w-8 place-items-center rounded-full text-ink/35 hover:bg-clay/10 hover:text-clay">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/services" className="link-underline mt-4 inline-flex text-xs">Add more tests <ArrowRight className="h-3 w-3" /></Link>
              </section>
            )}

            {step === 1 && (
              <section>
                <h2 className="display text-2xl">How should we collect?</h2>
                <p className="mt-1 text-sm text-muted">Home collection is free above ₹499. Scans always require a centre visit.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { key: 'Home Collection' as const, icon: Home, title: 'Home collection', sub: 'Doorstep pickup', detail: 'Certified phlebotomist · 100% hygienic kit · NABL lab', note: 'Available for blood tests only' },
                    { key: 'Center Visit' as const, icon: Building2, title: 'Centre visit', sub: 'Zero waiting', detail: '500+ partner labs · priority counter · scans & blood', note: 'Required for MRI, CT and X-ray' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setMode(option.key)}
                      disabled={option.key === 'Home Collection' && !homeAvailable}
                      aria-pressed={mode === option.key}
                      className={cn(
                        'rounded-2xl border p-5 text-left transition-all',
                        mode === option.key ? 'border-teal bg-teal-mist/50 ring-2 ring-teal/15' : 'border-line bg-white hover:border-ink/20',
                        option.key === 'Home Collection' && !homeAvailable && 'cursor-not-allowed opacity-50 hover:border-line',
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', mode === option.key ? 'bg-teal text-white' : 'bg-sand text-ink/60')}>
                          <option.icon className="h-4 w-4" />
                        </span>
                        <span className={cn('grid h-4 w-4 place-items-center rounded-full border', mode === option.key ? 'border-teal bg-teal' : 'border-ink/20')}>
                          {mode === option.key && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-semibold">{option.title}</p>
                      <p className="text-[0.6875rem] text-teal-deep">{option.sub}</p>
                      <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">{option.detail}</p>
                      <p className="mt-2 text-[0.625rem] text-ink/35">{option.note}</p>
                    </button>
                  ))}
                </div>

                {mode === 'Home Collection' ? (
                  <div className="mt-5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-ink/70">Delivery pincode</span>
                        <input
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          inputMode="numeric" placeholder="201301"
                          className={cn('field', errors.pincode && 'border-clay')}
                        />
                        {pincodeValid ? (
                          <span className="mt-1.5 flex items-center gap-1 text-[0.625rem] text-teal-deep">
                            <CheckCircle2 className="h-3 w-3" /> Serviceable · {pincodeRegion(pincode)}
                          </span>
                        ) : errors.pincode ? (
                          <span className="mt-1.5 block text-[0.625rem] text-clay">{errors.pincode}</span>
                        ) : (
                          <span className="mt-1.5 block text-[0.625rem] text-ink/35">Instant serviceability check</span>
                        )}
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-ink/70">Contact number</span>
                        <input
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value.replace(/[^\d\s]/g, '').slice(0, 12))}
                          inputMode="tel" placeholder="98101 24477"
                          className={cn('field', errors.phone && 'border-clay')}
                        />
                        {errors.phone && <span className="mt-1.5 block text-[0.625rem] text-clay">{errors.phone}</span>}
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-ink/70">Full address</span>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value.slice(0, 240))}
                        rows={2} placeholder="Flat, tower, street, locality, city"
                        className={cn('field resize-none', errors.address && 'border-clay')}
                      />
                      {errors.address && <span className="mt-1.5 block text-[0.625rem] text-clay">{errors.address}</span>}
                    </label>
                    <p className="rounded-lg bg-sand/60 px-3 py-2 text-[0.625rem] text-muted">
                      Not available for scans (MRI/CT/X-ray). A centre visit is required for those studies.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-ink/70">Choose a centre</p>
                    <div className="space-y-2">
                      {centers.map((center) => (
                        <button
                          key={center.id}
                          onClick={() => setCenterId(center.id)}
                          aria-pressed={centerId === center.id}
                          className={cn(
                            'flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors',
                            centerId === center.id ? 'border-teal bg-teal-mist/40' : 'border-line bg-white hover:border-ink/20',
                          )}
                        >
                          <span>
                            <span className="block text-sm font-medium">{center.name}</span>
                            <span className="mt-0.5 block text-[0.6875rem] text-muted">{center.address}</span>
                            <span className="mt-1 block text-[0.625rem] text-teal-deep">{center.city} · 7 am – 9 pm</span>
                          </span>
                          <span className={cn('mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border', centerId === center.id ? 'border-teal bg-teal' : 'border-ink/20')}>
                            {centerId === center.id && <Check className="h-2.5 w-2.5 text-white" />}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.centerId && <p className="mt-2 text-[0.625rem] text-clay">{errors.centerId}</p>}
                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-xs font-medium text-ink/70">Contact number</span>
                      <input
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value.replace(/[^\d\s]/g, '').slice(0, 12))}
                        inputMode="tel" placeholder="98101 24477"
                        className={cn('field', errors.phone && 'border-clay')}
                      />
                      {errors.phone && <span className="mt-1.5 block text-[0.625rem] text-clay">{errors.phone}</span>}
                    </label>
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section>
                <h2 className="display text-2xl">Patient &amp; schedule</h2>
                <p className="mt-1 text-sm text-muted">The report will be issued in this patient&apos;s name.</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-ink/70">Patient name</span>
                    <input value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value.slice(0, 80) })} className={cn('field', errors.name && 'border-clay')} placeholder="Full name" />
                    {errors.name && <span className="mt-1 block text-[0.625rem] text-clay">{errors.name}</span>}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-ink/70">Age</span>
                    <input value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value.replace(/\D/g, '').slice(0, 3) })} inputMode="numeric" className={cn('field', errors.age && 'border-clay')} placeholder="39" />
                    {errors.age && <span className="mt-1 block text-[0.625rem] text-clay">{errors.age}</span>}
                  </label>
                </div>

                <div className="mt-3">
                  <span className="mb-1.5 block text-xs font-medium text-ink/70">Gender</span>
                  <div className="flex gap-2">
                    {(['Male', 'Female', 'Other'] as const).map((g) => (
                      <button
                        key={g} onClick={() => setPatient({ ...patient, gender: g })} aria-pressed={patient.gender === g}
                        className={cn('rounded-full border px-4 py-2 text-xs transition-colors', patient.gender === g ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/60')}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="flex items-center gap-2 text-xs font-medium text-ink/70"><CalendarDays className="h-3.5 w-3.5 text-teal" /> Choose a date</p>
                  <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
                    {dates.map((d) => {
                      const isToday = d.iso === dates[0].iso;
                      return (
                        <button
                          key={d.iso}
                          onClick={() => { setDate(d.iso); setSlot(''); }}
                          aria-pressed={date === d.iso}
                          className={cn(
                            'flex min-w-[4rem] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors',
                            date === d.iso ? 'border-teal bg-teal text-white' : 'border-line bg-white text-ink/70 hover:border-ink/25',
                          )}
                        >
                          <span className="text-[0.5625rem] uppercase tracking-[0.08em] opacity-60">{isToday ? 'Today' : d.day}</span>
                          <span className="tabular mt-0.5 text-lg font-semibold leading-none">{d.date}</span>
                          <span className="text-[0.5625rem] opacity-60">{d.month}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.date && <p className="mt-1 text-[0.625rem] text-clay">{errors.date}</p>}
                </div>

                <div className="mt-5">
                  <p className="flex items-center gap-2 text-xs font-medium text-ink/70"><Clock className="h-3.5 w-3.5 text-teal" /> Choose a slot</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SLOTS.map((s) => (
                      <button
                        key={s} onClick={() => setSlot(s)} aria-pressed={slot === s}
                        className={cn('rounded-lg border px-3.5 py-2 text-xs transition-colors', slot === s ? 'border-teal bg-teal-mist text-teal-deep' : 'border-line bg-white text-ink/60 hover:border-ink/25')}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.slot && <p className="mt-1 text-[0.625rem] text-clay">{errors.slot}</p>}
                  <p className="mt-2 text-[0.625rem] text-ink/35">
                    {mode === 'Home Collection' ? 'Arrival window is ±30 minutes. You will get a call 30 minutes before.' : 'Please arrive 15 minutes before your slot with a photo ID.'}
                  </p>
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <h2 className="display text-2xl">Verify your number</h2>
                <p className="mt-1 text-sm text-muted">
                  We use your mobile number to secure the report and send appointment updates.
                </p>
                {verifiedUser ? (
                  <div className="mt-5 rounded-2xl border border-teal/25 bg-teal-mist/50 p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-teal text-white"><Check className="h-4 w-4" /></span>
                      <div>
                        <p className="text-sm font-semibold">Verified as {verifiedUser.name}</p>
                        <p className="text-xs text-muted">+91 {verifiedUser.phone}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[0.6875rem] text-muted">
                      Reports will be available in this account and can be shared with a doctor via a time-limited link.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 max-w-md rounded-2xl border border-line bg-white p-6">
                    <OtpForm initialPhone={contactPhone} onVerified={(u) => { setVerifiedUser(u); setContactPhone(u.phone); }} compact />
                  </div>
                )}
              </section>
            )}

            {step === 4 && (
              <section>
                <h2 className="display text-2xl">Review &amp; pay</h2>
                <p className="mt-1 text-sm text-muted">One last look before we confirm the slot.</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Patient</p>
                    <p className="mt-1 text-sm font-medium">{patient.name}, {patient.age} · {patient.gender}</p>
                    <p className="text-xs text-muted">+91 {contactPhone}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Appointment</p>
                    <p className="mt-1 text-sm font-medium">{selectedDate ? `${selectedDate.day}, ${selectedDate.date} ${selectedDate.month}` : date} · {slot}</p>
                    <p className="text-xs text-muted">{mode === 'Home Collection' ? `Home · ${pincode}` : centers.find((c) => c.id === centerId)?.name}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-line bg-white p-4">
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Tests</p>
                  <ul className="mt-1.5 space-y-1">
                    {items.map((i) => <li key={i.id} className="flex justify-between text-xs text-ink/70"><span>{i.testName}</span><span className="tabular">{formatINR(i.price)}</span></li>)}
                  </ul>
                </div>

                <p className="mt-5 text-xs font-medium text-ink/70">Payment method</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    { key: 'Pay online' as const, icon: CreditCard, title: 'Pay online', detail: 'UPI, cards, net banking' },
                    { key: 'Pay at centre' as const, icon: Banknote, title: 'Pay later', detail: mode === 'Home Collection' ? 'Pay after sample collection' : 'Pay at the centre' },
                  ].map((option) => (
                    <button
                      key={option.key} onClick={() => setPayment(option.key)} aria-pressed={payment === option.key}
                      className={cn('flex items-center gap-3 rounded-xl border p-4 text-left transition-colors', payment === option.key ? 'border-teal bg-teal-mist/40' : 'border-line bg-white')}
                    >
                      <option.icon className={cn('h-4 w-4', payment === option.key ? 'text-teal' : 'text-ink/40')} />
                      <span>
                        <span className="block text-sm font-medium">{option.title}</span>
                        <span className="block text-[0.625rem] text-muted">{option.detail}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-xs font-medium text-ink/70">Notes for the care team (optional)</span>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 400))} rows={2} className="field resize-none" placeholder="Accessibility needs, preferred language, prior reaction to contrast…" />
                </label>

                <label className="mt-4 flex items-start gap-2.5 text-[0.6875rem] leading-relaxed text-muted">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-line text-teal focus:ring-teal" />
                  <span>
                    I confirm the details are correct and accept the <a href="/terms" className="underline hover:text-ink">terms of service</a>,{' '}
                    <a href="/refund-policy" className="underline hover:text-ink">cancellation policy</a> and{' '}
                    <a href="/privacy-policy" className="underline hover:text-ink">privacy policy</a>.
                  </span>
                </label>
                {errors.consent && <p className="mt-1 text-[0.625rem] text-clay">{errors.consent}</p>}
                {errors.form && <p role="alert" className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-xs text-clay">{errors.form}</p>}

                <button onClick={submit} disabled={submitting} className="btn-teal mt-5 w-full">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : <>Confirm booking · {formatINR(subtotal)} <ArrowRight className="h-4 w-4" /></>}
                </button>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.625rem] text-ink/35">
                  <ShieldCheck className="h-3 w-3 text-teal" /> Secure checkout · no card details stored on our servers
                </p>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-7 flex items-center justify-between border-t border-line pt-5">
            <button onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0} className="btn-ghost btn-sm disabled:opacity-40">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button onClick={() => goTo(step + 1)} className="btn-primary btn-sm">
              {step === 3 ? 'Continue to payment' : 'Continue'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="lg:col-span-4">
        <div className="sticky top-24 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="border-b border-line bg-sand/50 px-5 py-4">
            <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-ink/40">Booking summary</p>
            <p className="mt-1 text-sm font-medium">{items.length} test{items.length > 1 ? 's' : ''} selected</p>
          </div>
          <div className="px-5 py-4">
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-xs">
                  <span className="text-ink/70">{item.testName}</span>
                  <span className="tabular shrink-0 font-medium">{formatINR(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span className="tabular">{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-teal-deep"><span>You save</span><span className="tabular">{formatINR(savings)}</span></div>
              <div className="flex justify-between text-muted"><span>Home collection</span><span>{mode === 'Home Collection' && subtotal >= 499 ? 'Free' : mode === 'Home Collection' ? '₹99' : '—'}</span></div>
              <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold"><span>Total</span><span className="tabular">{formatINR(mode === 'Home Collection' && subtotal < 499 ? subtotal + 99 : subtotal)}</span></div>
            </div>
          </div>
          <div className="border-t border-line bg-teal-mist/40 px-5 py-3 text-[0.625rem] leading-relaxed text-ink/55">
            <p className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-teal" /> Free cancellation up to 4 hours before</p>
            <p className="mt-1 flex items-center gap-1.5"><MapPin className="h-3 w-3 text-teal" /> 268 accredited centres · 48 cities</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
