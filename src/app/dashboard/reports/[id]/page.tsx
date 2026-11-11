import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, FileText, Stethoscope, AlertTriangle, CheckCircle2, CalendarDays, Hash, ShieldCheck,
} from 'lucide-react';
import { reports, prescriptions } from '@/data/dashboard';
import { doctors } from '@/data/company';
import { ReportActions } from '@/components/dashboard/ReportActions';
import { Badge } from '@/components/ui/Primitives';
import { cn, formatDate } from '@/lib/utils';

export const metadata = { title: 'Report', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = reports.find((r) => r.id.toLowerCase() === id.toLowerCase());
  if (!report) notFound();

  const doctor = doctors.find((d) => d.name === report.doctor);
  const flagged = report.biomarkers.filter((b) => b.flag !== 'normal');
  const related = prescriptions.slice(0, 2);

  return (
    <div className="space-y-5">
      <Link href="/dashboard/reports" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All reports
      </Link>

      <header className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-mist text-teal-deep">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow">{report.id}</p>
              <h1 className="display mt-1 text-2xl leading-tight sm:text-3xl">{report.title}</h1>
              <p className="mt-1 text-xs text-muted">
                {report.patient} · {formatDate(report.date)} · {report.pages} pages · Reviewed by {report.doctor}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone={report.status === 'Ready' ? 'teal' : 'gold'}>{report.status}</Badge>
                <Badge tone={flagged.length ? 'clay' : 'teal'}>
                  {flagged.length ? `${flagged.length} values to watch` : 'All values in range'}
                </Badge>
                <Badge>NABL lab · Noida</Badge>
              </div>
            </div>
          </div>
          <ReportActions reportId={report.id} />
        </div>

        <div className="grid gap-px bg-line sm:grid-cols-3">
          {[
            { icon: Hash, label: 'Booking', value: report.bookingId },
            { icon: CalendarDays, label: 'Collected', value: formatDate(report.date) },
            { icon: ShieldCheck, label: 'Released by', value: report.doctor },
          ].map((item) => (
            <div key={item.label} className="bg-white p-4">
              <p className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-[0.1em] text-muted">
                <item.icon className="h-3 w-3" /> {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <section className="card p-5 sm:p-6">
            <h2 className="display text-xl">Physician summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{report.summary}</p>

            {flagged.length > 0 && (
              <div className="mt-4 rounded-xl border border-clay/20 bg-clay/5 p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-clay">
                  <AlertTriangle className="h-3.5 w-3.5" /> Worth a conversation
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-ink/75">
                  {flagged.map((b) => (
                    <li key={b.name}>
                      <strong className="font-semibold text-ink">{b.name}</strong> is {b.flag} at {b.value} {b.unit}
                      {' '}(reference {b.range}). {b.flag === 'high' ? 'Lifestyle review and a repeat test in 12 weeks is usually enough.' : 'Dietary correction and a repeat test after 12 weeks is advised.'}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.biomarkers.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <table className="table-koyo min-w-[520px]">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th className="text-right">Result</th>
                      <th className="text-right">Reference</th>
                      <th>Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.biomarkers.map((b) => (
                      <tr key={b.name}>
                        <td className="font-medium text-ink">{b.name}</td>
                        <td className={cn('text-right font-medium', b.flag === 'normal' ? 'text-ink' : 'text-clay')}>
                          {b.value} <span className="text-2xs font-normal text-muted">{b.unit}</span>
                        </td>
                        <td className="text-right text-xs text-muted">{b.range}</td>
                        <td>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.08em]',
                              b.flag === 'normal' ? 'bg-teal-mist text-teal-deep' : 'bg-clay/10 text-clay',
                            )}
                          >
                            {b.flag === 'normal' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                            {b.flag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="display text-xl">What happens next</h2>
            <ol className="mt-4 space-y-3">
              {[
                'Book a free 15-minute call with your report physician — included with every KOYO package.',
                'Repeat the flagged tests after 12 weeks; your care manager will book them automatically.',
                'Carry this report to any specialist. The QR on the PDF opens a verified copy.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-ink/75">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-2xs font-semibold text-gold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/book" className="btn-teal btn-sm">Book follow-up tests</Link>
              <Link href="/contact" className="btn-outline btn-sm">Talk to a physician</Link>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="card p-5">
            <p className="eyebrow">Reporting physician</p>
            <div className="mt-3 flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand text-teal-deep">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{report.doctor}</p>
                <p className="text-2xs text-muted">{doctor?.qualifications ?? 'MBBS, MD'}</p>
                <p className="mt-2 text-2xs leading-relaxed text-muted">
                  {doctor?.bio ?? 'Reviews and releases every report against the reference range for your age and sex.'}
                </p>
              </div>
            </div>
            <Link href={`/doctors/${doctor?.id ?? ''}`} className="mt-3 inline-flex text-xs font-semibold text-teal-deep hover:underline">
              View profile
            </Link>
          </section>

          <section className="card p-5">
            <p className="eyebrow">Value breakdown</p>
            <ul className="mt-3 space-y-2.5">
              {report.biomarkers.slice(0, 6).map((b) => {
                const numeric = Number(b.value.replace('−', '-').replace(/[^\d.-]/g, ''));
                const ok = b.flag === 'normal';
                const pct = Number.isFinite(numeric) ? Math.min(96, Math.max(12, Math.abs(numeric) % 92)) : 50;
                return (
                  <li key={b.name}>
                    <div className="flex items-center justify-between text-2xs">
                      <span className="text-ink/70">{b.name}</span>
                      <span className={ok ? 'text-teal-deep' : 'text-clay'}>{b.value} {b.unit}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                      <div className={cn('h-full rounded-full', ok ? 'bg-teal' : 'bg-clay')} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-5">
            <p className="eyebrow">Linked prescriptions</p>
            <ul className="mt-3 space-y-3">
              {related.map((rx) => (
                <li key={rx.id} className="rounded-xl border border-line p-3">
                  <p className="text-xs font-semibold text-ink">{rx.name}</p>
                  <p className="text-2xs text-muted">{rx.speciality} · {formatDate(rx.date)}</p>
                  <p className="mt-1.5 text-2xs leading-relaxed text-ink/60">{rx.notes}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rx.tests.map((t) => (
                      <span key={t} className="rounded bg-sand px-1.5 py-0.5 text-2xs text-ink/60">{t}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
