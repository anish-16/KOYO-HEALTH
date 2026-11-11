'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: String(form.get('email') ?? '') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not subscribe.');
      setStatus('done');
      setMessage(data.message ?? 'You are on the list.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <p className="flex items-center gap-2 text-xs text-teal-soft">
        <Check className="h-3.5 w-3.5" /> {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.06] p-1 pl-4">
        <input
          type="email" name="email" required placeholder="Your email for monthly health notes"
          aria-label="Email address" className="min-w-0 flex-1 bg-transparent text-xs text-paper placeholder:text-paper/35 focus:outline-none"
        />
        <button
          type="submit" disabled={status === 'sending'}
          aria-label="Subscribe"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-ink transition-colors hover:bg-paper disabled:opacity-60"
        >
          {status === 'sending' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
      {status === 'error' && <p role="alert" className="mt-2 text-[0.6875rem] text-red-300">{message}</p>}
      <p className="mt-2 text-[0.625rem] leading-relaxed text-paper/35">
        One email a month. No offers disguised as advice. Unsubscribe anytime.
      </p>
    </form>
  );
}
