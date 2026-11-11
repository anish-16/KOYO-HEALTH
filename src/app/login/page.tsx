'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { OtpForm } from '@/components/auth/OtpForm';
import type { SessionUser } from '@/lib/useSessionUser';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const [user, setUser] = useState<SessionUser | null>(null);

  function onVerified(verified: SessionUser) {
    setUser(verified);
    const target = next && next.startsWith('/') ? next : '/dashboard';
    setTimeout(() => {
      router.push(target);
      router.refresh();
    }, 700);
  }

  return (
    <section className="shell grid min-h-[calc(100vh-11rem)] items-center gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
      <div className="lg:col-span-5">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-ink/45 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="mt-8">
          <Logo />
        </div>

        <h1 className="display mt-8 text-[2.4rem] leading-[1.02] sm:text-[3rem]">
          Your reports, all in one place.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          Sign in with your mobile number to see reports, book repeat tests, manage family
          profiles, and track your health trends over time.
        </p>

        <div className="mt-8 space-y-3">
          {[
            'Every report since 2019, searchable',
            'Family profiles with separate access',
            'Wallet credit, Gold pricing and invoices',
            'Appointment reminders on WhatsApp',
          ].map((item) => (
            <p key={item} className="flex items-start gap-2.5 text-[0.8125rem] text-ink/70">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> {item}
            </p>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[0.6875rem] text-muted">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal" />
          Health data is encrypted and access-logged. Employers never see individual reports.
        </div>
      </div>

      <div className="lg:col-span-7 lg:pl-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
          {user ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-soft">
                <CheckCircle2 className="h-6 w-6 text-teal-deep" />
              </div>
              <p className="mt-4 font-display text-2xl">Welcome back, {user.name.split(' ')[0]}</p>
              <p className="mt-1 text-sm text-muted">Opening your dashboard…</p>
            </div>
          ) : (
            <>
              <p className="eyebrow">Patient login</p>
              <h2 className="mt-2 font-display text-2xl">Sign in or create an account</h2>
              <p className="mt-1.5 text-xs text-muted">
                New here? The same form creates your account. No password to remember.
              </p>
              <div className="mt-6">
                <OtpForm onVerified={onVerified} />
              </div>
            </>
          )}
        </div>

        <p className="mx-auto mt-4 max-w-md text-center text-[0.625rem] leading-relaxed text-ink/35">
          Having trouble? Call <a href="tel:+918800580075" className="text-teal-deep underline">+91 88005 80075</a> or{' '}
          <Link href="/contact" className="text-teal-deep underline">request a callback</Link>.
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="shell py-24 text-center text-sm text-muted">Loading sign in…</div>}>
      <LoginInner />
    </Suspense>
  );
}
