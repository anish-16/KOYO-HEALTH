'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import {
  CalendarPlus, Check, ClipboardPaste, Copy, FileUp, Loader2, Search, UserPlus, Users,
} from 'lucide-react';
import {
  addEmployeeAction, bulkEmployeesAction,
} from '@/app/portal/b2b/actions';
import { EMPLOYEE_CSV_TEMPLATE, parseCsvRows } from '@/lib/portal-csv';
import { idleAction, type Employee } from '@/data/portal';
import { cn, formatDate } from '@/lib/utils';

export type RosterRow = Employee & { bookingCount: number; lastBooking?: string };

const fieldLabel = 'mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted';

export function RosterWorkbench({
  partnerId,
  rows,
  headcount,
}: {
  partnerId: string;
  rows: RosterRow[];
  headcount: number;
}) {
  const [tab, setTab] = useState<'single' | 'bulk'>('single');
  const [singleState, singleAction, singlePending] = useActionState(addEmployeeAction, idleAction);
  const [bulkState, bulkAction, bulkPending] = useActionState(bulkEmployeesAction, idleAction);
  const [csv, setCsv] = useState('');
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  const departments = Array.from(new Set(rows.map((row) => row.department).filter(Boolean))).sort();
  const query = search.trim().toLowerCase();
  const visible = rows.filter((row) => {
    const matchesDepartment = department === 'All' || row.department === department;
    const matchesQuery =
      !query ||
      `${row.name} ${row.code} ${row.department} ${row.location}`.toLowerCase().includes(query);
    return matchesDepartment && matchesQuery;
  });

  const preview = csv.trim() ? parseCsvRows(csv) : null;

  useEffect(() => {
    if (bulkState.status === 'ok') setCsv('');
  }, [bulkState.status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Employee roster</p>
          <h1 className="display mt-1.5 text-[2rem] leading-tight sm:text-[2.4rem]">Who is being screened</h1>
          <p className="mt-1 text-xs text-muted">
            {rows.length} on roster · {headcount.toLocaleString('en-IN')} declared by the partner
          </p>
        </div>
        <Link href="/portal/b2b/bookings" className="btn-primary btn-sm">
          <CalendarPlus className="h-3.5 w-3.5" /> New booking
        </Link>
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex rounded-full border border-line bg-sand/60 p-1 sm:w-max">
          {(
            [
              { value: 'single', label: 'Single employee', icon: UserPlus },
              { value: 'bulk', label: 'Bulk upload', icon: FileUp },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:flex-none',
                tab === item.value ? 'bg-white text-ink shadow-soft' : 'text-ink/55 hover:text-ink',
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'single' ? (
          <form action={singleAction} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input type="hidden" name="partnerId" value={partnerId} />
            <label className="block">
              <span className={fieldLabel}>Employee code (optional)</span>
              <input name="code" className="field" placeholder="Auto-generated" />
            </label>
            <label className="block">
              <span className={fieldLabel}>Full name</span>
              <input name="name" required className="field" placeholder="Aarav Sharma" />
              {singleState.fields?.name ? <span className="mt-1 block text-2xs text-clay">{singleState.fields.name}</span> : null}
            </label>
            <label className="block">
              <span className={fieldLabel}>Age</span>
              <input name="age" required inputMode="numeric" className="field" placeholder="34" />
              {singleState.fields?.age ? <span className="mt-1 block text-2xs text-clay">{singleState.fields.age}</span> : null}
            </label>
            <label className="block">
              <span className={fieldLabel}>Gender</span>
              <select name="gender" className="field" defaultValue="Male">
                {['Male', 'Female', 'Other'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={fieldLabel}>Phone</span>
              <input name="phone" inputMode="tel" className="field" placeholder="98101 24477" />
              {singleState.fields?.phone ? <span className="mt-1 block text-2xs text-clay">{singleState.fields.phone}</span> : null}
            </label>
            <label className="block">
              <span className={fieldLabel}>Email</span>
              <input name="email" type="email" className="field" placeholder="name@company.com" />
              {singleState.fields?.email ? <span className="mt-1 block text-2xs text-clay">{singleState.fields.email}</span> : null}
            </label>
            <label className="block">
              <span className={fieldLabel}>Department</span>
              <input name="department" className="field" placeholder="Engineering" />
            </label>
            <label className="block sm:col-span-2">
              <span className={fieldLabel}>Base location</span>
              <input name="location" className="field" placeholder="Bengaluru — Whitefield" />
            </label>

            {singleState.status === 'ok' ? (
              <p className="sm:col-span-2 lg:col-span-3 rounded-lg border border-teal/25 bg-teal-mist px-3 py-2 text-xs font-medium text-teal-deep">
                {singleState.message}
              </p>
            ) : null}
            {singleState.status === 'error' ? (
              <p role="alert" className="sm:col-span-2 lg:col-span-3 rounded-lg border border-clay/20 bg-clay/10 px-3 py-2 text-xs text-clay">
                {singleState.message}
              </p>
            ) : null}

            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" disabled={singlePending} className="btn-primary btn-sm">
                {singlePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                {singlePending ? 'Adding…' : 'Add employee'}
              </button>
            </div>
          </form>
        ) : (
          <form action={bulkAction} className="mt-5 space-y-3">
            <input type="hidden" name="partnerId" value={partnerId} />

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
              <label className="block">
                <span className={fieldLabel}>Paste rows or upload the HRMS export</span>
                <textarea
                  name="csv"
                  value={csv}
                  onChange={(event) => setCsv(event.target.value)}
                  rows={7}
                  className="field resize-y font-mono text-[0.75rem] leading-relaxed"
                  placeholder={EMPLOYEE_CSV_TEMPLATE}
                />
              </label>

              <div className="space-y-2">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-sand/40 px-3 py-5 text-center transition-colors hover:border-teal/40">
                  <FileUp className="h-4 w-4 text-teal" />
                  <span className="text-2xs font-semibold text-ink">Choose a CSV</span>
                  <span className="text-[0.625rem] text-muted">Header row recommended</span>
                  <input
                    type="file"
                    accept=".csv,.txt,text/csv,text/plain"
                    className="sr-only"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) return;
                      setCsv(await file.text());
                    }}
                  />
                </label>

                <details className="rounded-xl border border-line bg-white px-3 py-2">
                  <summary className="cursor-pointer list-none text-2xs font-semibold text-ink/70">
                    <ClipboardPaste className="mr-1 inline h-3 w-3" /> CSV format
                  </summary>
                  <pre className="mt-2 overflow-x-auto whitespace-pre rounded-lg bg-ink p-2 text-[0.5625rem] leading-relaxed text-paper/80">
{EMPLOYEE_CSV_TEMPLATE}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(EMPLOYEE_CSV_TEMPLATE)
                        .then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        })
                        .catch(() => undefined);
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-[0.625rem] font-semibold text-teal-deep"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy template'}
                  </button>
                </details>
              </div>
            </div>

            {preview && preview.rows.length > 0 ? (
              <p className="text-2xs text-muted">
                {preview.rows.length} data row{preview.rows.length === 1 ? '' : 's'} detected
                {preview.hasHeader ? ' · header row found' : ' · no header, using column order'}.
                Duplicate employee codes are skipped.
              </p>
            ) : null}

            {bulkState.status === 'ok' ? (
              <p className="rounded-lg border border-teal/25 bg-teal-mist px-3 py-2 text-xs font-medium text-teal-deep">
                {bulkState.message}
              </p>
            ) : null}
            {bulkState.status === 'error' ? (
              <p role="alert" className="rounded-lg border border-clay/20 bg-clay/10 px-3 py-2 text-xs text-clay">
                {bulkState.message}
              </p>
            ) : null}

            <button type="submit" disabled={bulkPending || !csv.trim()} className="btn-teal btn-sm">
              {bulkPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Users className="h-3.5 w-3.5" />}
              {bulkPending ? 'Importing…' : 'Import roster'}
            </button>
          </form>
        )}
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">Roster</h2>
            <p className="mt-0.5 text-2xs text-muted">Search, filter, then book an individual test</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Search employees</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/30" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, code, location"
                className="h-9 w-48 rounded-full border border-line bg-white pl-8 pr-3 text-xs focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15"
              />
            </label>
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              aria-label="Filter by department"
              className="h-9 rounded-full border border-line bg-white px-3 text-xs text-ink/70 focus:border-teal focus:outline-none"
            >
              <option value="All">All departments</option>
              {departments.map((entry) => <option key={entry}>{entry}</option>)}
            </select>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-ink">The roster is empty</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">
              Add one employee above, or paste the HRMS export to bring the whole batch in at once.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <p className="px-5 py-8 text-center text-xs text-muted">No employee matches that search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-koyo min-w-[760px]">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Age / gender</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Bookings</th>
                  <th aria-label="Book" />
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <p className="text-[0.8125rem] font-medium text-ink">{row.name}</p>
                      <p className="text-2xs text-muted">{row.code}{row.phone ? ` · ${row.phone}` : ''}</p>
                    </td>
                    <td className="whitespace-nowrap text-[0.8125rem] text-ink/70">
                      {row.age} · {row.gender}
                    </td>
                    <td className="text-[0.8125rem] text-ink/70">{row.department || '—'}</td>
                    <td className="text-[0.75rem] text-ink/60">{row.location || '—'}</td>
                    <td>
                      <p className="text-[0.8125rem] text-ink/75">{row.bookingCount}</p>
                      <p className="text-2xs text-muted">
                        {row.lastBooking ? `last ${formatDate(row.lastBooking, { year: undefined })}` : 'no booking yet'}
                      </p>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/portal/b2b/bookings?employee=${row.id}`}
                        className="inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep hover:underline"
                      >
                        <CalendarPlus className="h-3 w-3" /> Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {visible.length > 0 ? (
          <p className="border-t border-line px-5 py-2.5 text-2xs text-muted">
            Showing {visible.length} of {rows.length} employees
          </p>
        ) : null}
      </section>
    </div>
  );
}
