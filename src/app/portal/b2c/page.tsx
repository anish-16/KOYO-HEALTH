import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarDays, FileText, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Patient portal',
  description: 'The KOYO patient portal is coming next.',
};

const planned = [
  {
    icon: FileText,
    title: 'Reports that stay yours',
    body: 'Every past report, its reference ranges and trend arrows, in one timeline — shareable with a clinician in two taps.',
  },
  {
    icon: CalendarDays,
    title: 'Book, move, repeat',
    body: 'Home collection or a centre slot, rescheduled without a phone call, with repeat tests prefilled from your last order.',
  },
  {
    icon: Users,
    title: 'Family under one login',
    body: 'Separate profiles and separate access for parents, children and dependants, without mixing anyone’s records.',
  },
  {
    icon: BadgeCheck,
    title: 'Membership and wallet',
    body: 'Gold pricing, credit balance and GST invoices in the same place as your bookings.',
  },
];

export default function B2CPortalPage() {
  return (
    <section className="shell py-12 lg:py-16">
      <Link href="/portal" className="text-xs text-ink/45 hover:text-ink">
        ← All portals
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">B2C patient portal</p>
          <h1 className="display mt-3 text-[2.4rem] leading-[1.04] sm:text-[3.2rem]">
            The patient side is next.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
            The B2B partner workspace is live. The consumer portal — where an individual can book, track
            a collection and read their own report — is the next build, and this entry point is already
            reserved for it.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5">
            <p className="text-sm font-semibold text-ink">While it is being built</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Individual bookings, reports and family profiles continue to work on the existing patient
              dashboard. Nothing you have booked today moves or disappears.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/dashboard" className="btn-primary btn-sm">
                Open patient dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/book" className="btn-outline btn-sm">Book a test</Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {planned.map((item) => (
              <div key={item.title} className="card p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-mist text-teal-deep">
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-2xs leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-3 text-2xs leading-relaxed text-muted">
            Corporate employees already have a private report link from their B2B booking — no patient
            account needed. That link opens the same report the portal will show.
          </p>
        </div>
      </div>
    </section>
  );
}
