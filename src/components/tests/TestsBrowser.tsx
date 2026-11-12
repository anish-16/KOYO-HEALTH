'use client';

import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { TestTrigger } from '@/components/tests/TestDetailProvider';
import { formatINR } from '@/lib/utils';
import { formatReport, getDiscipline } from '@/data/tests';

const PAGE = 15;

/**
 * The listing behind /tests/[discipline]: one row per study, with the price and
 * a Book action, grouped the same way as the header menu so a study found in a
 * menu can be found again here.
 */
export function TestsBrowser({ slug }: { slug: string }) {
  const discipline = getDiscipline(slug);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('all');
  const [limit, setLimit] = useState(PAGE);

  // Deep links from the home page arrive as #everyday, #mri and so on.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && discipline?.groups.some((g) => g.key.split(':')[1] === hash)) {
      setGroup(hash);
    }
  }, [discipline]);

  const results = useMemo(() => {
    if (!discipline) return [];
    const q = query.trim().toLowerCase();
    return discipline.tests.filter((test) => {
      const matchesGroup = group === 'all' || test.groupKey.split(':')[1] === group;
      if (!matchesGroup) return false;
      if (!q) return true;
      return `${test.name} ${test.groupLabel} ${test.serviceName} ${test.sample}`.toLowerCase().includes(q);
    });
  }, [discipline, group, query]);

  if (!discipline) return null;

  const visible = results.slice(0, limit);

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-4 py-2.5 focus-within:border-teal/40">
          <Search className="h-4 w-4 shrink-0 text-ink/35" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(PAGE);
            }}
            placeholder={`Search ${discipline.tests.length} ${
              discipline.key === 'pathology' ? 'blood tests' : 'scans'
            } — “thyroid”, “MRI”, “vitamin”…`}
            aria-label={`Search ${discipline.label}`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="text-ink/35 hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {[{ key: 'all', label: 'All', count: discipline.tests.length }, ...discipline.groups.map((g) => ({
            key: g.key.split(':')[1],
            label: g.label,
            count: g.ids.length,
          }))].map((chip) => {
            const active = group === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => {
                  setGroup(chip.key);
                  setLimit(PAGE);
                }}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-paper text-ink/60 hover:border-ink/25 hover:text-ink'
                }`}
              >
                {chip.label}
                <span className={`ml-1.5 tabular text-[0.625rem] ${active ? 'text-white/50' : 'text-ink/35'}`}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <p>
          Showing {visible.length} of {results.length}
          {query ? ` match${results.length === 1 ? '' : 'es'}` : ` ${discipline.key === 'pathology' ? 'tests' : 'scans'}`}
        </p>
        <p className="hidden sm:block">All prices include taxes · Free cancellation up to 4 hours before</p>
      </div>

      {results.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-white py-14 text-center">
          <p className="font-display text-2xl">Nothing matches “{query}”</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Try a shorter term, or switch to {discipline.key === 'pathology' ? 'scans' : 'blood tests'} if you were
            looking for {discipline.key === 'pathology' ? 'imaging' : 'lab work'}.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setGroup('all');
            }}
            className="btn-outline btn-sm mt-6"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
          {visible.map((test) => (
            <li key={test.id} className="border-b border-line last:border-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors hover:bg-teal-mist/40 sm:px-5">
                <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-mist text-teal-deep sm:grid">
                  <ServiceIcon name={test.groupIcon} className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <TestTrigger
                    id={test.id}
                    className="block max-w-full truncate text-left text-[0.875rem] font-medium text-ink hover:text-teal-deep"
                  >
                    {test.name}
                  </TestTrigger>
                  <p className="mt-0.5 truncate text-[0.6875rem] text-muted">
                    {test.groupLabel} · {test.sample === 'None' ? 'No sample' : `${test.sample} sample`} ·{' '}
                    {test.fastingHours > 0 ? `${test.fastingHours} h fast` : 'No fasting'} · report{' '}
                    {formatReport(test.reportHours)} · {test.centers} centres
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[0.5625rem] uppercase tracking-[0.1em] text-ink/35">from</p>
                    <p className="tabular text-[0.9375rem] font-semibold">{formatINR(test.price)}</p>
                  </div>
                  <TestTrigger
                    id={test.id}
                    className="rounded-full border border-teal/25 bg-white px-3.5 py-1.5 text-[0.75rem] font-semibold text-teal-deep transition-colors hover:bg-teal hover:text-white"
                  >
                    Book
                  </TestTrigger>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {results.length > limit && (
        <div className="mt-6 flex justify-center">
          <button onClick={() => setLimit((n) => n + PAGE)} className="btn-outline btn-sm">
            Show {Math.min(PAGE, results.length - limit)} more
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-[0.6875rem] text-muted">
        Not sure which one?{' '}
        <Link href="/contact" className="link-underline font-medium text-teal-deep">
          Ask a clinician
        </Link>{' '}
        — the guidance call is free.
      </p>
    </div>
  );
}
