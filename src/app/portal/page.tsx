import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, Building2, CalendarDays, FileText, KeyRound, ShieldCheck, UserRound, Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portals',
  description: 'KOYO partner and patient portals.',
};

const b2bPoints = [
  'Negotiated catalogue per partner',
  'Roster uploads — single or bulk',
  'Bulk booking with date, location, status',
  'Report release and employee links',
];

const b2cPoints = [
  'Every report in one timeline',
  'Book, reschedule and repeat tests',
  'Family profiles and wallet credit',
  'Appointment reminders on WhatsApp',
];

export default function PortalChooserPage() {
  return (
    <>
      <section className="surface-ink grain relative overflow-hidden">
        <div className="shell relative py-14 text-paper lg:py-20">
          <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-gold">KOYO portals</p>
          <h1 className="display mt-4 max-w-3xl text-[2.6rem] leading-[1.02] sm:text-[3.4rem]">
            One front door. Two workspaces.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/65">
            Partners run their workforce screening here. Patients get their own portal next. Access is
            role-scoped: a partner login can never open a patient record, and a patient login can never
            open an employer roster.
          </p>
        </div>
      </section>

      <section className="shell -mt-8 pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="card flex flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-gold">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-teal/25 bg-teal-mist px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-teal-deep">
                Live
              </span>
            </div>
            <h2 className="display mt-5 text-[1.8rem] leading-tight">B2B partner portal</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              For corporates, vendors and clinics sending employees or members for pathology, radiology
              and custom health packages — at home, on site or at a centre.
            </p>
            <ul className="mt-5 grid flex-1 gap-2 sm:grid-cols-2">
              {b2bPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-ink/75">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {point}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/portal/b2b" className="btn-primary btn-sm">
                Open B2B portal <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/portal/b2b/sign-in" className="btn-outline btn-sm">
                Partner sign-in
              </Link>
            </div>
          </article>

          <article className="flex flex-col rounded-2xl border border-line bg-sand/70 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-teal-deep shadow-soft">
                <UserRound className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-gold/30 bg-gold-soft px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                Coming soon
              </span>
            </div>
            <h2 className="display mt-5 text-[1.8rem] leading-tight">B2C patient portal</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The individual side — your own bookings, reports, family profiles and wallet — is being
              built next. The portal entry point is already in place.
            </p>
            <ul className="mt-5 grid flex-1 gap-2 sm:grid-cols-2">
              {b2cPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-ink/60">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-ink/30" /> {point}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/portal/b2c" className="btn-outline btn-sm">
                See what&apos;s coming
              </Link>
              <Link href="/dashboard" className="btn-ghost btn-sm">
                Existing patient dashboard
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3">
          {[
            { icon: KeyRound, title: 'Issued access, not self-serve', body: 'Your account manager issues a partner code and access key; KOYO operations use a separate key.' },
            { icon: ShieldCheck, title: 'Scoped by role', body: 'Partners see their own roster and bookings. Ops see every workspace. Neither sees a patient login.' },
            { icon: FileText, title: 'Every action is logged', body: 'Status changes record who made them and when, so a batch can always be reconciled.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <div>
                <p className="text-xs font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-2xs leading-relaxed text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-2xs text-muted">
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-teal" /> 24 employees seeded across four demo partners</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-teal" /> Bookings in every status</span>
          <Link href="/partner" className="font-semibold text-teal-deep hover:underline">Not a partner yet? Apply to join the network</Link>
        </div>
      </section>
    </>
  );
}
