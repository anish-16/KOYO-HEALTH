'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { isValidIndianPhone } from '@/lib/utils';
import type { SessionUser } from '@/lib/useSessionUser';

type Stage = 'phone' | 'code';

export function OtpForm({
  initialPhone = '',
  onVerified,
  compact = false,
}: {
  initialPhone?: string;
  onVerified: (user: SessionUser) => void;
  compact?: boolean;
}) {
  const [stage, setStage] = useState<Stage>('phone');
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    if (stage === 'code') setTimeout(() => inputRef.current?.focus(), 120);
  }, [stage]);

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    setError('');
    if (!isValidIndianPhone(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not send the code.');
      setDemoCode(data.demoCode ?? null);
      setStage('code');
      setSecondsLeft(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Verification failed.');
      onVerified(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
      setCode('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {stage === 'phone' ? (
        <form onSubmit={sendCode} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink/70">Mobile number</span>
            <div className="flex items-center rounded-xl border border-line bg-white focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
              <span className="flex items-center gap-1.5 border-r border-line px-3 py-3 text-sm text-ink/50">
                <Smartphone className="h-3.5 w-3.5" /> +91
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, '').slice(0, 12))}
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98101 24477"
                aria-label="Mobile number"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-ink/30"
              />
            </div>
          </label>

          {error && <p role="alert" className="rounded-lg bg-clay/10 px-3 py-2 text-xs text-clay">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending code…</> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
          </button>

          <p className="flex items-start gap-2 text-[0.625rem] leading-relaxed text-ink/40">
            <Lock className="mt-0.5 h-3 w-3 shrink-0" />
            By continuing you agree to our <a href="/terms" className="underline hover:text-ink">terms</a> and{' '}
            <a href="/privacy-policy" className="underline hover:text-ink">privacy policy</a>. We never share your number.
          </p>

          {!compact && (
            <button
              type="button"
              onClick={() => setPhone('9810124477')}
              className="w-full rounded-lg border border-dashed border-line px-3 py-2 text-[0.625rem] text-ink/45 transition-colors hover:border-teal/40 hover:text-teal-deep"
            >
              Demo build · use 98101 24477 to explore the patient dashboard
            </button>
          )}
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <button
            type="button"
            onClick={() => { setStage('phone'); setCode(''); setError(''); }}
            className="flex items-center gap-1.5 text-xs text-ink/45 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Change number
          </button>

          <div>
            <p className="text-sm text-ink/70">We sent a 6-digit code to <span className="font-semibold text-ink">+91 {phone}</span></p>
            <label className="mt-3 block">
              <span className="sr-only">6-digit code</span>
              <input
                ref={inputRef}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="• • • • • •"
                aria-label="6-digit verification code"
                className="field text-center text-lg tracking-[0.5em]"
              />
            </label>
          </div>

          {demoCode && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold-soft/40 px-3 py-2.5">
              <p className="text-[0.6875rem] text-gold-deep">
                Demo mode · your code is <span className="tabular font-bold">{demoCode}</span>
              </p>
              <button type="button" onClick={() => setCode(demoCode)} className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-gold-deep underline">
                Use it
              </button>
            </div>
          )}

          {error && <p role="alert" className="rounded-lg bg-clay/10 px-3 py-2 text-xs text-clay">{error}</p>}

          <button type="submit" disabled={busy || code.length !== 6} className="btn-primary w-full">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : <><CheckCircle2 className="h-4 w-4" /> Verify &amp; continue</>}
          </button>

          <div className="flex items-center justify-between text-[0.625rem] text-ink/40">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-teal" /> Secured with a 5-minute expiry</span>
            <button
              type="button"
              disabled={secondsLeft > 0 || busy}
              onClick={() => sendCode()}
              className="font-medium text-teal-deep disabled:text-ink/30"
            >
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
