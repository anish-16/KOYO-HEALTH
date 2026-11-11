'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Loader2, PhoneCall } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

const CONCERNS = [
  'General health checkup', 'Specific test query', 'Report interpretation',
  'Package information', 'Appointment booking', 'Pricing query',
  'Corporate wellness', 'Technical issue', 'Something else',
];

export function CallbackButton({
  label = 'Get a call back',
  className,
  variant = 'outline',
}: {
  label?: string;
  className?: string;
  variant?: 'outline' | 'primary' | 'ghost' | 'link' | 'gold';
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      concern: String(form.get('concern') ?? ''),
      message: String(form.get('message') ?? '').trim(),
      consent: form.get('consent') === 'on',
    };
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not submit your request.');
      setReference(data.reference ?? '');
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  const triggerClass =
    variant === 'primary' ? 'btn-teal'
    : variant === 'ghost' ? 'btn-ghost'
    : variant === 'link' ? 'link-underline text-sm'
    : variant === 'gold' ? 'btn-gold'
    : 'btn-outline';

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setStatus('idle'); }} className={cn(triggerClass, className)}>
        {variant === 'link' ? label : <>{label} <PhoneCall className="h-4 w-4" /></>}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={status === 'done' ? 'We have your number' : 'Talk to a care advisor'}
        description={
          status === 'done'
            ? 'A KOYO advisor will call you within 5 minutes during working hours (8 am – 8 pm).'
            : 'Tell us what you need and a clinician-led care team will call you back within 5 minutes.'
        }
      >
        {status === 'done' ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-soft">
              <CheckCircle2 className="h-6 w-6 text-teal-deep" />
            </div>
            <p className="mt-4 text-sm text-muted">
              Reference <span className="font-semibold text-ink">{reference}</span>. You can also call us directly.
            </p>
            <a href="tel:+918800580075" className="btn-primary mt-6 w-full">Call +91 88005 80075</a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink/70">Full name</span>
                <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="field" placeholder="Aarav Mehta" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink/70">Mobile number</span>
                <input
                  name="phone" required inputMode="tel" pattern="[0-9+\s-]{10,14}" autoComplete="tel"
                  className="field" placeholder="98101 24477"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink/70">What is this about?</span>
              <select name="concern" className="field" defaultValue={CONCERNS[0]}>
                {CONCERNS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink/70">Anything we should know? (optional)</span>
              <textarea name="message" rows={3} maxLength={600} className="field resize-none" placeholder="Reports, symptoms, preferred language…" />
            </label>
            <label className="flex items-start gap-2.5 text-[0.6875rem] leading-relaxed text-muted">
              <input
                type="checkbox" name="consent" required
                className="mt-0.5 h-4 w-4 rounded border-line text-teal focus:ring-teal"
              />
              <span>
                I agree to be contacted about this request and accept the{' '}
                <a href="/privacy-policy" className="underline hover:text-ink">privacy policy</a>. No marketing calls.
              </span>
            </label>
            {error && <p role="alert" className="rounded-lg bg-clay/10 px-3 py-2 text-xs text-clay">{error}</p>}
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
              {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Requesting a call…</> : <>Request call back <ArrowRight className="h-4 w-4" /></>}
            </button>
            <p className="text-center text-[0.6875rem] text-muted">Average response time today: 3 min 12 sec</p>
          </form>
        )}
      </Modal>
    </>
  );
}
