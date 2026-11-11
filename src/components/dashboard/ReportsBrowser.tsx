'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Search, ChevronRight, Clock, Download, ShieldCheck } from 'lucide-react';
import type { Report } from '@/data/types';
import { Badge } from '@/components/ui/Primitives';
import { cn, formatDate } from '@/lib/utils';

export function ReportsBrowser({ reports }: { reports: Report[] }) {
  const [query, setQuery] = useState('');
  const [patient, setPatient] = useState('All');
  const patients = useMemo(() => ['All', ...Array.from(new Set(reports.map((r) => r.patient)))], [reports]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports
      .filter((r) => (patient === 'All' ? true : r.patient === patient))
      .filter((r) => (!q ? true : `${r.title} ${r.patient} ${r.doctor} ${r.id}`.toLowerCase().includes(q)))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [reports, query, patient]);

  const abnormal = reports.reduce(
    (acc, r) => acc + r.biomarkers.filter((b) => b.flag !== 'normal').length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Reports', value: reports.length },
          { label: 'Ready', value: reports.filter((r) => r.status === 'Ready').length },
          { label: 'Flagged values', value: abnormal },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="display text-2xl">{s.value}</p>
            <p className="text-2xs uppercase tracking-[0.1em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {patients.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPatient(p)}
              aria-pressed={patient === p}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                patient === p ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink/60 hover:border-ink/30',
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <span className="sr-only">Search reports</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search report, doctor, ID…"
            className="field py-2.5 pl-9 text-xs"
          />
        </label>
      </div>

      <ul className="space-y-3">
        {rows.map((report) => {
          const flagged = report.biomarkers.filter((b) => b.flag !== 'normal');
          return (
            <li key={report.id} className="card group p-5 transition-shadow hover:shadow-lift">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-mist text-teal-deep">
                    <FileText className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-ink">{report.title}</h2>
                      <Badge tone={report.status === 'Ready' ? 'teal' : 'gold'}>{report.status}</Badge>
                      {flagged.length > 0 && <Badge tone="clay">{flagged.length} flagged</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {report.patient} · {formatDate(report.date)} · {report.pages} pages · {report.doctor}
                    </p>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-ink/60">{report.summary}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {report.status === 'Ready' ? (
                    <>
                      <button type="button" className="btn-outline btn-sm" aria-label={`Download ${report.title}`}>
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                      <Link href={`/dashboard/reports/${report.id.toLowerCase()}`} className="btn-primary btn-sm">
                        Open <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-2xs font-semibold text-gold-deep">
                      <Clock className="h-3 w-3" /> Expected today, 6 pm
                    </span>
                  )}
                </div>
              </div>
              {report.biomarkers.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  {report.biomarkers.slice(0, 8).map((b) => (
                    <span
                      key={b.name}
                      className={cn(
                        'rounded-md px-2 py-1 text-2xs',
                        b.flag === 'normal' ? 'bg-sand text-ink/60' : 'bg-clay/10 font-semibold text-clay',
                      )}
                    >
                      {b.name} {b.value} {b.unit}
                    </span>
                  ))}
                  {report.biomarkers.length > 8 && (
                    <span className="rounded-md px-2 py-1 text-2xs text-muted">+{report.biomarkers.length - 8} more</span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {rows.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium">No reports match that search.</p>
          <p className="mt-1 text-xs text-muted">Try a different name or clear the filters.</p>
        </div>
      )}

      <p className="flex items-center gap-2 text-2xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-teal" />
        Reports are stored for 10 years and shared only through expiring links you generate.
      </p>
    </div>
  );
}
