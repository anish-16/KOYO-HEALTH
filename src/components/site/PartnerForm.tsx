'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export function PartnerForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [form, setForm] = useState({ org: '', contact: '', phone: '', city: '', type: 'Diagnostic lab', beds: '', message: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contact,
          phone: form.phone,
          concern: 'Partner with us',
          message: `${form.org} · ${form.type} · ${form.city}${form.beds ? ` · ${form.beds} beds` : ''}. ${form.message}`.slice(0, 600),
          consent: true,
        }),
      });
    } catch {
      /* demo: treat as success */
    }
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-teal/25 bg-teal-mist p-6">
        <CheckCircle2 className="h-6 w-6 text-teal-deep" />
        <h2 className="display mt-3 text-2xl">Application received.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          Our network team reviews every application within five working days. If your centre meets the
          accreditation bar, we will schedule a site audit.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline btn-sm mt-4">Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <h2 className="display text-2xl">Apply to join the network</h2>
      <p className="mt-1 text-xs text-muted">We onboard 10–14 centres a quarter. Accreditation is mandatory; we help you get there.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Centre / organisation</span>
          <input required value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="field" placeholder="e.g. Meridian Diagnostics" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Contact name</span>
          <input required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="field" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Phone</span>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" placeholder="98XXXXXXXX" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">City</span>
          <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="field" placeholder="Indore" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Facility type</span>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="field">
            {['Diagnostic lab', 'Imaging centre', 'Hospital', 'Polyclinic', 'Mobile collection'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Modalities & accreditations</span>
          <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field resize-none" placeholder="MRI 1.5T, CT 128-slice, NABL since 2019…" />
        </label>
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn-teal mt-4 w-full">
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'sending' ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  );
}
