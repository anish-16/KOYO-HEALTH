import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { demoOpsKey, getPortalActor } from '@/lib/server/portal-auth';
import { demoCredentials } from '@/lib/server/portal-store';
import { SignInForm } from './SignInForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'B2B portal sign in',
  description: 'Sign in to the KOYO partner workspace.',
};

export default async function PortalSignInPage() {
  const actor = await getPortalActor();
  if (actor) redirect('/portal/b2b');

  const showDemo = process.env.NODE_ENV !== 'production' || process.env.KOYO_DEMO_PORTAL === '1';
  const partnerCredentials = showDemo ? await demoCredentials() : [];
  const opsKey = showDemo ? demoOpsKey() : '';

  return (
    <div className="bg-sand/40">
      <div className="shell py-10 lg:py-16">
        <Link href="/portal" className="inline-flex items-center gap-2 text-xs text-ink/45 hover:text-ink">
          ← All portals
        </Link>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:pt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl tracking-tight text-ink">KOYO</span>
              <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                B2B partner portal
              </span>
            </div>

            <h1 className="display mt-6 text-[2.3rem] leading-[1.03] sm:text-[2.9rem]">
              Your workforce screening, in one workspace.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Build the partner catalogue, upload a roster in bulk, schedule a camp or home collection
              batch, and track every employee from scheduled to report released.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Negotiated rates, locked per partner',
                'Bulk roster and bulk booking uploads',
                'Status updates by your team or ours',
                'Private report link for every employee',
              ].map((item) => (
                <p key={item} className="flex items-start gap-2.5 text-[0.8125rem] text-ink/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> {item}
                </p>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[0.6875rem] leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              Partner access is scoped to your own roster and bookings. Clinical reports open only on the
              employee&apos;s private link — never in the employer workspace.
            </div>

            <p className="mt-4 text-[0.6875rem] text-ink/40">
              Patient (B2C) portal is coming later.{' '}
              <Link href="/portal/b2c" className="text-teal-deep hover:underline">
                What it will include
              </Link>
              .
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
              <p className="eyebrow">Sign in</p>
              <h2 className="mt-2 font-display text-2xl">Open your workspace</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Use the partner code and access key issued by your KOYO account manager.
              </p>
              <div className="mt-6">
                <SignInForm demoPartners={partnerCredentials} opsKey={opsKey} />
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-md text-center text-[0.625rem] leading-relaxed text-ink/35">
              Lost your access key? Call{' '}
              <a href="tel:+918800580075" className="text-teal-deep underline">+91 88005 80075</a> or{' '}
              <Link href="/contact" className="text-teal-deep underline">request a callback</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
