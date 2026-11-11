import { getSession } from '@/lib/server/session';
import { bookings } from '@/data/dashboard';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'My bookings', robots: { index: false, follow: false } };

export default async function BookingsPage() {
  await getSession();
  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Appointments</p>
          <h1 className="display mt-1 text-3xl">Your bookings</h1>
          <p className="mt-1 text-sm text-muted">
            {bookings.length} bookings across 14 months · {bookings.filter((b) => b.status === 'Upcoming').length} upcoming.
          </p>
        </div>
        <Link href="/book" className="btn-teal btn-sm">
          <Plus className="h-3.5 w-3.5" /> New booking
        </Link>
      </header>
      <BookingsTable bookings={bookings} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line bg-white p-4 text-xs text-muted">
        <span>Need to move several appointments at once? Your care manager can help.</span>
        <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-teal-deep">
          Request a callback <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
