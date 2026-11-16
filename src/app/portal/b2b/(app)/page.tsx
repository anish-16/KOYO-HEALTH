import Link from 'next/link';
import {
  ArrowRight, BookOpenCheck, CalendarDays, CheckCircle2, Clock, Plus, Users,
} from 'lucide-react';
import { requirePortalContext } from '@/lib/server/portal-context';
import {
  listActivity, listBookings, listCatalogue, listEmployees, listPartners,
} from '@/lib/server/portal-store';
import { StatusPill } from '@/components/portal/StatusPill';
import { formatDate, formatINR, formatDateTime } from '@/lib/utils';
import { COLLECTION_MODES, isOpenStatus } from '@/data/portal';

export const dynamic = 'force-dynamic';

export default async function PortalOverviewPage() {
  const { actor, partner } = await requirePortalContext();
  const [employees, catalogue, bookings, activity] = await Promise.all([
    listEmployees(partner.id),
    listCatalogue(partner.id),
    listBookings(partner.id),
    listActivity(partner.id, 6),
  ]);

  const month = new Date().toISOString().slice(0, 7);
  const active = bookings.filter((booking) => booking.status !== 'Cancelled');
  const open = bookings.filter((booking) => isOpenStatus(booking.status));
  const released = bookings.filter((booking) => booking.report);
  const thisMonth = active.filter((booking) => booking.date.startsWith(month));
  const bookedValue = active.reduce((sum, booking) => sum + booking.total, 0);
  const overdue = open.filter((booking) => booking.date < new Date().toISOString().slice(0, 10));

  const portfolio = actor.role === 'ops' ? await listPartners() : [];
  const allBookings = actor.role === 'ops' ? await listBookings() : [];

  const kpis = [
    {
      label: 'Employees on roster',
      value: employees.length.toLocaleString('en-IN'),
      sub: `of ${partner.headcount.toLocaleString('en-IN')} declared`,
      icon: Users,
    },
    {
      label: 'Open bookings',
      value: open.length.toLocaleString('en-IN'),
      sub: `${thisMonth.length} scheduled this month`,
      icon: CalendarDays,
    },
    {
      label: 'Reports released',
      value: released.length.toLocaleString('en-IN'),
      sub: `${bookings.length - released.length} still to come`,
      icon: CheckCircle2,
    },
    {
      label: 'Booked value',
      value: formatINR(bookedValue, { compact: true }),
      sub: 'at partner rates, ex-tax',
      icon: BookOpenCheck,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1 className="display mt-1.5 text-[2rem] leading-tight sm:text-[2.4rem]">
            Workforce screening book
          </h1>
          <p className="mt-1 text-xs text-muted">
            {partner.name} · {partner.city} · {partner.billingCycle.toLowerCase()} billing
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/portal/b2b/bookings" className="btn-primary btn-sm">
            <Plus className="h-3.5 w-3.5" /> New booking
          </Link>
          <Link href="/portal/b2b/employees" className="btn-outline btn-sm">
            Add employees
          </Link>
        </div>
      </div>

      {overdue.length > 0 ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold-soft/60 px-4 py-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
          <p className="text-xs leading-relaxed text-ink/75">
            <strong className="font-semibold">{overdue.length}</strong>{' '}
            {overdue.length === 1 ? 'booking is' : 'bookings are'} past the test date without a released
            report. Open{' '}
            <Link href="/portal/b2b/bookings" className="font-semibold text-teal-deep hover:underline">
              Bookings
            </Link>{' '}
            to update their status.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-5">
            <kpi.icon className="h-4 w-4 text-teal" />
            <p className="display mt-3 text-3xl leading-none">{kpi.value}</p>
            <p className="mt-1.5 text-2xs font-semibold uppercase tracking-[0.1em] text-ink/55">{kpi.label}</p>
            <p className="mt-1 text-2xs text-muted">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">Recent bookings</h2>
              <p className="mt-0.5 text-2xs text-muted">Latest test dates first</p>
            </div>
            <Link href="/portal/b2b/bookings" className="inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep hover:underline">
              All bookings <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-medium text-ink">No bookings yet</p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">
                Upload the employee roster, then schedule a single test or a full batch.
              </p>
              <Link href="/portal/b2b/employees" className="btn-primary btn-sm mt-4">Add employees</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-koyo min-w-[640px]">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Tests</th>
                    <th>Date</th>
                    <th>Collection</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 6).map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <p className="text-[0.8125rem] font-medium text-ink">{booking.employeeName}</p>
                        <p className="text-2xs text-muted">{booking.employeeCode} · {booking.department || '—'}</p>
                      </td>
                      <td>
                        <p className="max-w-[15rem] truncate text-[0.8125rem] text-ink/75">
                          {booking.items[0]?.name ?? '—'}
                        </p>
                        <p className="text-2xs text-muted">
                          {booking.items.length} {booking.items.length === 1 ? 'item' : 'items'} · {formatINR(booking.total)}
                        </p>
                      </td>
                      <td className="whitespace-nowrap text-[0.8125rem]">{formatDate(booking.date, { year: undefined })}</td>
                      <td className="text-[0.75rem] text-ink/65">{booking.mode}</td>
                      <td><StatusPill status={booking.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Collection mix</h2>
            <p className="mt-0.5 text-2xs text-muted">Across all non-cancelled bookings</p>
            <div className="mt-4 space-y-3">
              {COLLECTION_MODES.map((mode) => {
                const count = active.filter((booking) => booking.mode === mode).length;
                const pct = active.length ? Math.round((count / active.length) * 100) : 0;
                return (
                  <div key={mode}>
                    <div className="flex items-baseline justify-between gap-2 text-2xs">
                      <span className="font-medium text-ink/70">{mode}</span>
                      <span className="tabular text-muted">{count} · {pct}%</span>
                    </div>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-sand">
                      <span className="block h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-2xs">
              <span className="text-muted">Catalogue items</span>
              <span className="font-semibold text-ink">{catalogue.filter((item) => item.active).length}</span>
            </div>
            <Link href="/portal/b2b/catalogue" className="mt-2 inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep hover:underline">
              Manage catalogue <ArrowRight className="h-3 w-3" />
            </Link>
          </section>

          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Activity</h2>
            <p className="mt-0.5 text-2xs text-muted">Status and report changes, newest first</p>
            <ol className="mt-4 space-y-3">
              {activity.length === 0 ? (
                <li className="text-2xs text-muted">Nothing logged yet.</li>
              ) : (
                activity.map((entry) => (
                  <li key={entry.id} className="border-l border-line pl-3">
                    <p className="text-2xs font-semibold text-ink">{entry.action}</p>
                    <p className="mt-0.5 text-[0.6875rem] leading-relaxed text-muted">{entry.detail}</p>
                    <p className="mt-0.5 text-[0.625rem] text-ink/35">
                      {entry.actor} · {formatDateTime(entry.at)}
                    </p>
                  </li>
                ))
              )}
            </ol>
          </section>
        </div>
      </div>

      {actor.role === 'ops' ? (
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">Portfolio</h2>
              <p className="mt-0.5 text-2xs text-muted">Every partner workspace you can switch into</p>
            </div>
            <Link href="/portal/b2b/partners" className="inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep hover:underline">
              Manage partners <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table-koyo min-w-[620px]">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Status</th>
                  <th>Bookings</th>
                  <th>Open</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((entry) => {
                  const partnerBookings = allBookings.filter((booking) => booking.partnerId === entry.id);
                  return (
                    <tr key={entry.id}>
                      <td>
                        <p className="text-[0.8125rem] font-medium text-ink">{entry.name}</p>
                        <p className="text-2xs text-muted">{entry.code}</p>
                      </td>
                      <td className="text-[0.75rem] text-ink/65">{entry.status}</td>
                      <td className="tabular text-[0.8125rem]">{partnerBookings.length}</td>
                      <td className="tabular text-[0.8125rem]">
                        {partnerBookings.filter((booking) => isOpenStatus(booking.status)).length}
                      </td>
                      <td className="text-[0.75rem] text-ink/65">{entry.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
