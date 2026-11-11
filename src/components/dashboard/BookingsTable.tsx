'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, Download, CalendarDays, MapPin, Scan, X, FileText, RefreshCw, Ban, Phone,
} from 'lucide-react';
import type { Booking } from '@/data/types';
import { Badge } from '@/components/ui/Primitives';
import { cn, formatDate, formatINR } from '@/lib/utils';

const tabs = ['All', 'Upcoming', 'Report Ready', 'Completed', 'Cancelled'] as const;
type Tab = (typeof tabs)[number];

const statusTone: Record<Booking['status'], 'teal' | 'gold' | 'default' | 'clay'> = {
  Upcoming: 'teal',
  'Sample Collected': 'gold',
  'Report Ready': 'gold',
  Completed: 'default',
  Cancelled: 'clay',
};

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [tab, setTab] = useState<Tab>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelled, setCancelled] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => (tab === 'All' ? true : b.status === tab))
      .filter((b) =>
        !q
          ? true
          : `${b.id} ${b.patient} ${b.tests.join(' ')} ${b.center} ${b.city}`.toLowerCase().includes(q),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [bookings, tab, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: bookings.length };
    for (const b of bookings) map[b.status] = (map[b.status] ?? 0) + 1;
    return map;
  }, [bookings]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                tab === t ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink',
              )}
            >
              {t}
              <span className={cn('ml-1.5 text-2xs', tab === t ? 'text-gold' : 'text-ink/35')}>
                {counts[t] ?? 0}
              </span>
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ID, test, centre…"
            className="field pl-9 py-2.5 text-xs"
          />
        </label>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-koyo min-w-[860px]">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Patient</th>
                <th>Tests</th>
                <th>Date & slot</th>
                <th>Mode</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const isCancelled = cancelled.has(b.id);
                return (
                  <tr key={b.id}>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelected(b)}
                        className="font-mono text-2xs font-semibold text-teal-deep hover:underline"
                      >
                        {b.id}
                      </button>
                    </td>
                    <td className="whitespace-nowrap font-medium text-ink">{b.patient}</td>
                    <td className="max-w-[220px]">
                      <p className="truncate text-xs text-ink/80">{b.tests.join(' · ')}</p>
                      <p className="mt-0.5 text-2xs text-muted">{b.center}, {b.city}</p>
                    </td>
                    <td className="whitespace-nowrap text-xs">
                      {formatDate(b.date)}
                      <span className="block text-2xs text-muted">{b.slot}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink/70">
                        {b.mode === 'Home Collection' ? <MapPin className="h-3.5 w-3.5" /> : <Scan className="h-3.5 w-3.5" />}
                        {b.mode}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-right text-xs font-medium">
                      {formatINR(b.amount)}
                      <span className={cn('block text-2xs', b.payment === 'Refunded' ? 'text-clay' : 'text-muted')}>
                        {b.payment}
                      </span>
                    </td>
                    <td>
                      <Badge tone={isCancelled ? 'clay' : statusTone[b.status]}>{isCancelled ? 'Cancelled' : b.status}</Badge>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelected(b)}
                          className="rounded-lg p-1.5 text-ink/45 hover:bg-teal-mist hover:text-teal-deep"
                          aria-label={`View booking ${b.id}`}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob(
                              [`KOYO Health invoice\n${b.id}\n${b.patient}\n${b.tests.join(', ')}\n${formatINR(b.amount)}`],
                              { type: 'text/plain' },
                            );
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `koyo-${b.id}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="rounded-lg p-1.5 text-ink/45 hover:bg-teal-mist hover:text-teal-deep"
                          aria-label={`Download invoice for ${b.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-ink">No bookings match that filter.</p>
            <p className="mt-1 text-xs text-muted">Try another status or clear the search.</p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-2xs text-muted">
          <span>Showing {rows.length} of {bookings.length} bookings</span>
          <span>Invoices are generated as downloadable text stubs in this demo.</span>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Booking details">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper p-6 shadow-lift sm:rounded-3xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Booking {selected.id}</p>
                <h2 className="display mt-1 text-2xl">{selected.tests[0]}</h2>
                <p className="mt-1 text-xs text-muted">{selected.patient} · {selected.mode}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full p-2 text-ink/40 hover:bg-sand" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              {[
                ['Date', formatDate(selected.date)],
                ['Slot', selected.slot],
                ['Centre', `${selected.center}, ${selected.city}`],
                ['Payment', `${selected.payment} · ${formatINR(selected.amount)}`],
                ['Status', cancelled.has(selected.id) ? 'Cancelled' : selected.status],
                ['Technician', selected.technician ?? 'Assigned 12 hrs before'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-white p-3">
                  <dt className="text-2xs uppercase tracking-[0.1em] text-muted">{label}</dt>
                  <dd className="mt-1 font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-xl bg-teal-mist p-4">
              <p className="text-xs font-semibold text-teal-deep">Tests in this booking</p>
              <ul className="mt-2 space-y-1 text-xs text-ink/70">
                {selected.tests.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CalendarDays className="h-3 w-3 text-teal" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="btn-outline btn-sm">
                <RefreshCw className="h-3.5 w-3.5" /> Reschedule
              </button>
              <button type="button" className="btn-outline btn-sm">
                <Phone className="h-3.5 w-3.5" /> Call care manager
              </button>
              {selected.status === 'Upcoming' && !cancelled.has(selected.id) && (
                <button
                  type="button"
                  onClick={() => {
                    setCancelled((prev) => new Set(prev).add(selected.id));
                    setSelected(null);
                  }}
                  className="btn btn-sm ml-auto border border-clay/30 px-4 py-2 text-clay hover:bg-clay/10"
                >
                  <Ban className="h-3.5 w-3.5" /> Cancel booking
                </button>
              )}
            </div>
            <p className="mt-4 text-2xs leading-relaxed text-muted">
              Free cancellation until 12 hours before the slot. Cancellations inside 12 hours are
              refunded to the KOYO wallet. <Link href="/legal/refunds" className="text-teal-deep underline">Refund policy</Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
