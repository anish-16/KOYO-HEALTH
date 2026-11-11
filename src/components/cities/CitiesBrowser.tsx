'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MapPin, Search, ArrowUpRight } from 'lucide-react';
import type { City } from '@/data/types';
import { cn } from '@/lib/utils';

export function CitiesBrowser({ cities }: { cities: City[] }) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('All');

  const states = useMemo(() => ['All', ...Array.from(new Set(cities.map((c) => c.state))).sort()], [cities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cities
      .filter((c) => (state === 'All' ? true : c.state === state))
      .filter((c) => (!q ? true : `${c.name} ${c.state} ${c.localities.join(' ')} ${c.pincode}`.toLowerCase().includes(q)))
      .sort((a, b) => b.centers - a.centers);
  }, [cities, query, state]);

  const popular = cities.filter((c) => c.popular);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {popular.slice(0, 8).map((city) => (
          <Link
            key={city.slug}
            href={`/cities/${city.slug}`}
            className="group flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-soft"
          >
            <span>
              <span className="block text-sm font-semibold text-ink">{city.name}</span>
              <span className="text-2xs text-muted">{city.centers} centres · {city.tests} tests</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-ink/25 transition-colors group-hover:text-teal" />
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {states.slice(0, 10).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              aria-pressed={state === s}
              className={cn(
                'rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors',
                state === s ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink/60 hover:border-ink/25',
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <span className="sr-only">Search cities or localities</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, state or locality"
            className="field py-2.5 pl-9 text-xs"
          />
        </label>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="table-koyo min-w-[720px]">
          <thead>
            <tr>
              <th>City</th>
              <th>State</th>
              <th className="text-right">Centres</th>
              <th className="text-right">Tests listed</th>
              <th>Popular localities</th>
              <th className="text-right">Since</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((city) => (
              <tr key={city.slug}>
                <td>
                  <Link href={`/cities/${city.slug}`} className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-teal-deep">
                    <MapPin className="h-3.5 w-3.5 text-teal" /> {city.name}
                  </Link>
                </td>
                <td className="text-xs text-muted">{city.state}</td>
                <td className="text-right text-xs">{city.centers}</td>
                <td className="text-right text-xs">{city.tests}</td>
                <td className="max-w-[260px] truncate text-2xs text-muted">{city.localities.join(', ')}</td>
                <td className="text-right text-xs text-muted">{city.launchYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted">No city matches that search yet.</p>}
      </div>
    </div>
  );
}
