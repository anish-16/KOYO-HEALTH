'use client';

import { useState } from 'react';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', concern: 'Booking help', message: '', consent: false });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? data?.error ?? 'Could not send that. Please try again.');
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
        <h2 className="display mt-3 text-2xl">We have your request.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          A care advisor will call {form.phone} within five minutes during working hours (7 am – 10 pm,
          all days). Your reference is <span className="font-mono text-xs font-semibold">{reference || 'KOYO-XXXX'}</span>.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline btn-sm mt-4">Send another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <h2 className="display text-2xl">Request a callback</h2>
      <p className="mt-1 text-xs text-muted">Average wait time today: 4 minutes. No sales pitch — just an answer.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Your name</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="Aarav Mehta" />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Mobile number</span>
          <input required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" placeholder="98101 24477" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">What is this about?</span>
          <select value={form.concern} onChange={(e) => setForm({ ...form, concern: e.target.value })} className="field">
            {['Booking help', 'Report question', 'Reschedule or cancel', 'Insurance & claims', 'Corporate wellness', 'Membership', 'Something went wrong'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Anything we should know? (optional)</span>
          <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field resize-none" placeholder="Booking ID, test name, or a short description." />
        </label>
      </div>
      <label className="mt-3 flex items-start gap-2 text-2xs text-muted">
        <input
          type="checkbox"
          required
          checked={form.consent}
          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-line text-teal focus:ring-teal"
        />
        I agree to be contacted by KOYO Health about this request, and have read the{' '}
        <a href="/legal/privacy" className="text-teal-deep underline">privacy policy</a>.
      </label>
      {error && <p className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-xs text-clay">{error}</p>}
      <button type="submit" disabled={status === 'sending'} className={cn('btn-teal mt-4 w-full')}>
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'sending' ? 'Sending…' : 'Request a callback'}
      </button>
      <p className="mt-2 text-center text-2xs text-muted">We never share your number with third parties.</p>
    </form>
  );
}
