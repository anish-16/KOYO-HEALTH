'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

const INTERESTS = [
  'Annual employee health checkups',
  'Onsite camp or vaccination drive',
  'Occupational health centre (OHC)',
  'Pre-employment screening',
  'Executive health panels',
  'Drug testing & risk profiling',
];

export function CorporateEnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    org: '',
    name: '',
    email: '',
    phone: '',
    headcount: '',
    city: '',
    interest: INTERESTS[0],
    message: '',
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          concern: 'Corporate wellness',
          message: `${form.org} · ${form.city} · ${form.headcount} employees · ${form.interest} · ${form.email}. ${form.message}`.slice(0, 600),
          consent: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error?.message ?? 'Could not send that. Please try again.');
        setStatus('error');
        return;
      }
      setReference(data.reference ?? '');
      setStatus('done');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-teal/25 bg-teal-mist p-6">
        <CheckCircle2 className="h-6 w-6 text-teal-deep" />
        <h3 className="display mt-3 text-2xl">Proposal request received.</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          An enterprise health specialist will call {form.phone} and send a costed proposal for{' '}
          {form.headcount || 'your team'} employees within 24 business hours. Reference{' '}
          <span className="font-mono text-xs font-semibold">{reference || 'KOYO-CORP'}</span>.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline btn-sm mt-4">
          Submit another requirement
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-5 sm:p-6">
      <h3 className="display text-2xl">Request a corporate proposal</h3>
      <p className="mt-1 text-xs text-muted">
        Six fields, no obligation. We reply within one business day with a costed panel — not a brochure.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Organisation</span>
          <input required value={form.org} onChange={set('org')} className="field" placeholder="e.g. Meridian Technologies" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Your name</span>
          <input required value={form.name} onChange={set('name')} className="field" placeholder="Full name" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Work phone</span>
          <input required value={form.phone} onChange={set('phone')} className="field" placeholder="98XXXXXXXX" inputMode="tel" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Work email</span>
          <input required type="email" value={form.email} onChange={set('email')} className="field" placeholder="you@company.com" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">City</span>
          <input required value={form.city} onChange={set('city')} className="field" placeholder="Bengaluru" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Headcount</span>
          <input required value={form.headcount} onChange={set('headcount')} className="field" placeholder="250" inputMode="numeric" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">What do you need?</span>
          <select value={form.interest} onChange={set('interest')} className="field">
            {INTERESTS.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Anything specific?</span>
          <textarea rows={3} value={form.message} onChange={set('message')} className="field resize-none" placeholder="Shift patterns, multiple sites, existing OHC, statutory deadlines…" />
        </label>
      </div>

      {status === 'error' && <p className="mt-3 text-xs text-clay">{error}</p>}

      <button type="submit" disabled={status === 'sending'} className="btn-teal mt-4 w-full">
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'sending' ? 'Sending…' : 'Request proposal'}
      </button>
      <p className="mt-2 text-center text-[0.625rem] text-ink/40">
        Workforce data is processed under a DPDP-ready agreement. Individual results never reach HR.
      </p>
    </form>
  );
}
