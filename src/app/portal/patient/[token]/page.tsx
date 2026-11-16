import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarDays, CheckCircle2, Clock, Download, FileText, MapPin, Phone, ShieldCheck, Stethoscope,
} from 'lucide-react';
import { getBookingByToken, getPartner } from '@/lib/server/portal-store';
import { StatusPill } from '@/components/portal/StatusPill';
import { STATUS_FLOW } from '@/data/portal';
import { formatDate, formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your health record',
  description: 'Your KOYO booking status and report.',
  robots: { index: false, follow: false, nocache: true },
};

export default async function PatientRecordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getBookingByToken(token);
  if (!booking) notFound();

  const partner = await getPartner(booking.partnerId);
  const step = STATUS_FLOW.indexOf(booking.status);
  const cancelled = booking.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-sand/40">
      <div className="border-b border-line bg-paper">
        <div className="shell flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight text-ink">KOYO</span>
            <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-teal-deep">Health record</span>
          </Link>
          <a
            href="tel:+918800580075"
            className="inline-flex items-center gap-1.5 text-2xs font-semibold text-teal-deep hover:underline"
          >
            <Phone className="h-3.5 w-3.5" /> +91 88005 80075
          </a>
        </div>
      </div>

      <div className="shell py-8 lg:py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <section className="card p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Booked through {partner?.name ?? 'KOYO Health'}</p>
                <h1 className="display mt-2 text-[2rem] leading-tight">{booking.employeeName}</h1>
                <p className="mt-1 text-xs text-muted">
                  {booking.employeeCode}
                  {booking.department ? ` · ${booking.department}` : ''} · {booking.id}
                </p>
              </div>
              <StatusPill status={booking.status} />
            </div>

            <div className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <div>
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/40">Test date</p>
                  <p className="mt-0.5 text-xs font-medium text-ink">{formatDate(booking.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <div>
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/40">Collection</p>
                  <p className="mt-0.5 text-xs font-medium text-ink">{booking.mode}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <div className="min-w-0">
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/40">Location</p>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink">{booking.location}</p>
                </div>
              </div>
            </div>

            {cancelled ? (
              <div className="mt-4 rounded-xl border border-clay/20 bg-clay/10 px-4 py-3 text-xs leading-relaxed text-clay">
                This booking was cancelled. If you still need the test, ask your employer&apos;s HR team to
                raise a new booking, or call KOYO care on +91 88005 80075.
              </div>
            ) : (
              <ol className="mt-5 grid grid-cols-5 gap-1 border-t border-line pt-4">
                {STATUS_FLOW.map((status, index) => {
                  const done = step >= index;
                  return (
                    <li key={status} className="min-w-0">
                      <span className={done ? 'block h-1 rounded-full bg-teal' : 'block h-1 rounded-full bg-sand'} />
                      <span className={done ? 'mt-2 flex items-start gap-1 text-[0.5625rem] font-semibold leading-tight text-teal-deep' : 'mt-2 flex items-start gap-1 text-[0.5625rem] leading-tight text-ink/35'}>
                        {done ? <CheckCircle2 className="mt-px h-2.5 w-2.5 shrink-0" /> : null}
                        {status}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Tests in this booking</h2>
              <p className="mt-0.5 text-2xs text-muted">{booking.items.length} item{booking.items.length === 1 ? '' : 's'} ordered by your employer</p>
            </div>
            <ul className="divide-y divide-line">
              {booking.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-medium text-ink">{item.name}</p>
                    <p className="text-2xs text-muted">{item.kind}</p>
                  </div>
                  <FileText className="h-3.5 w-3.5 shrink-0 text-ink/25" />
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-mist text-teal-deep">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-ink">Your report</h2>
                {booking.report ? (
                  <>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-2xs text-muted">
                      <Clock className="h-3 w-3" /> Released {formatDateTime(booking.report.uploadedAt)} · {booking.report.uploadedBy}
                    </p>
                    {booking.report.note ? (
                      <p className="mt-3 rounded-xl border border-line bg-sand/50 px-3.5 py-3 text-xs leading-relaxed text-ink/75">
                        {booking.report.note}
                      </p>
                    ) : null}
                    {booking.report.file ? (
                      <a
                        href={`/api/portal/reports/${booking.id}?token=${booking.patientToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary btn-sm mt-3"
                      >
                        <Download className="h-3.5 w-3.5" /> Open report ({booking.report.file.name})
                      </a>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Your report has not been released yet. It will appear here as soon as KOYO publishes
                    it — usually within the turnaround promised for these tests. Keep this link; nothing
                    else is needed to open it.
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[0.6875rem] leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            This page is private to the person named above. It shows the booking and the report only — never
            your employer&apos;s rates or anyone else&apos;s results. Do not forward the link.
          </div>

          <p className="text-center text-[0.625rem] text-ink/35">
            Questions about this booking? Call{' '}
            <a href="tel:+918800580075" className="text-teal-deep underline">+91 88005 80075</a> and quote {booking.id}.
          </p>
        </div>
      </div>
    </div>
  );
}
