'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, LogOut, Download, ShieldCheck, Smartphone, Mail, Bell } from 'lucide-react';
import { demoUser } from '@/data/dashboard';
import { cn } from '@/lib/utils';

const channels = [
  { id: 'reports', label: 'Report releases', body: 'SMS + email the moment a report is signed off.', on: true },
  { id: 'bookings', label: 'Appointment changes', body: 'Reminders 24 hours and 2 hours before your slot.', on: true },
  { id: 'offers', label: 'Offers and packages', body: 'At most two emails a month. No partner marketing.', on: false },
  { id: 'reminders', label: 'Preventive reminders', body: 'Annual checkup and repeat-test nudges based on your results.', on: true },
  { id: 'whatsapp', label: 'WhatsApp updates', body: 'Booking confirmations and technician arrival times.', on: true },
];

export function SettingsForm({ user }: { user: { name: string; phone: string; email?: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email ?? demoUser.email,
    phone: user.phone,
    dob: demoUser.dob,
    gender: 'Male',
    bloodGroup: demoUser.bloodGroup,
    address: demoUser.address,
    emergency: demoUser.emergencyContact,
  });
  const [toggles, setToggles] = useState(() => Object.fromEntries(channels.map((c) => [c.id, c.on])) as Record<string, boolean>);
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <form onSubmit={save} className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="display text-xl">Personal details</h2>
            <p className="mt-1 text-xs text-muted">Used on every report. Keep it identical to your ID documents.</p>
          </div>
          {saved && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-mist px-3 py-1 text-2xs font-semibold text-teal-deep">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Mobile number', 'tel'],
            ['dob', 'Date of birth', 'date'],
            ['bloodGroup', 'Blood group', 'text'],
            ['emergency', 'Emergency contact', 'text'],
          ].map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">{label}</span>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="field"
                required={key === 'name' || key === 'phone'}
              />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Address for home collection</span>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="field resize-none"
            />
          </label>
        </div>
        <button type="submit" className="btn-primary btn-sm mt-4">
          <Save className="h-3.5 w-3.5" /> Save changes
        </button>
      </form>

      <section className="card p-5 sm:p-6">
        <h2 className="display text-xl">Communication</h2>
        <p className="mt-1 text-xs text-muted">Clinical reports are always sent. Everything else is your choice.</p>
        <ul className="mt-4 space-y-3">
          {channels.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-4 rounded-xl border border-line p-3.5">
              <div>
                <p className="text-xs font-semibold text-ink">{c.label}</p>
                <p className="mt-0.5 text-2xs leading-snug text-muted">{c.body}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[c.id]}
                aria-label={c.label}
                onClick={() => setToggles((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                className={cn(
                  'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
                  toggles[c.id] ? 'bg-teal' : 'bg-ink/15',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                    toggles[c.id] ? 'left-[1.375rem]' : 'left-0.5',
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="display text-xl">Security</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line p-3.5">
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-4 w-4 text-teal" />
              <div>
                <p className="text-xs font-semibold text-ink">Two-factor sign-in</p>
                <p className="mt-0.5 text-2xs text-muted">OTP on +91 {form.phone.slice(0, 5)} {form.phone.slice(5)} every time you sign in on a new device.</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFactor}
              aria-label="Two-factor sign-in"
              onClick={() => setTwoFactor((v) => !v)}
              className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', twoFactor ? 'bg-teal' : 'bg-ink/15')}
            >
              <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', twoFactor ? 'left-[1.375rem]' : 'left-0.5')} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line p-3.5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-teal" />
              <div>
                <p className="text-xs font-semibold text-ink">{form.email}</p>
                <p className="mt-0.5 text-2xs text-muted">Verified · used for invoices and report copies</p>
              </div>
            </div>
            <button type="button" className="btn-outline btn-sm">Change</button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line p-3.5">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-4 w-4 text-teal" />
              <div>
                <p className="text-xs font-semibold text-ink">Active sessions</p>
                <p className="mt-0.5 text-2xs text-muted">1 device · Chrome on Windows · Noida</p>
              </div>
            </div>
            <button type="button" className="btn-outline btn-sm">Sign out others</button>
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="display text-xl">Your data</h2>
        <p className="mt-1 text-xs text-muted">
          Download every report, invoice and booking in one archive, or request deletion. Clinical
          records are retained for 10 years as required by NABL.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify({ user: form, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'koyo-health-data.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-outline btn-sm"
          >
            <Download className="h-3.5 w-3.5" /> Download my data
          </button>
          <button type="button" className="btn btn-sm border border-clay/30 px-4 py-2 text-clay hover:bg-clay/10">
            Request account deletion
          </button>
          <button type="button" onClick={logout} className="btn btn-sm ml-auto border border-ink/15 px-4 py-2 text-ink hover:bg-white">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-2xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Data is encrypted at rest (AES-256) and in transit (TLS 1.3).
        </p>
      </section>
    </div>
  );
}
