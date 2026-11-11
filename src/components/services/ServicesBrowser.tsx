'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { formatINR } from '@/lib/utils';
import type { Modality } from '@/data/types';

export type ServiceSummary = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  modality: Modality;
  icon: string;
  startingPrice: number;
  mrp: number;
  tests: number;
  reportTime: string;
  duration: string;
  isPopular: boolean;
  highlights: string[];
};

const FILTERS: ('All' | Modality)[] = ['All', 'Radiology', 'Cardiology', 'Neurodiagnostics', 'Specialist', 'Pathology'];

type Filter = 'All' | Modality;

/**
 * Applies ?q= and ?filter= to the browser. Reading search params in a small
 * Suspense-wrapped child keeps the catalogue page itself static while still
 * reacting to in-page navigations that only change the query string.
 */
function QuerySync({
  onQuery,
  onFilter,
}: {
  onQuery: (value: string) => void;
  onFilter: (value: Filter) => void;
}) {
  const params = useSearchParams();
  useEffect(() => {
    // Mirror the URL exactly, so a link without ?q= clears a previous search.
    onQuery((params.get('q') ?? '').slice(0, 120));
    const f = params.get('filter');
    onFilter(f && FILTERS.includes(f as Filter) ? (f as Filter) : 'All');
  }, [params, onQuery, onFilter]);
  return null;
}

export function ServicesBrowser({
  items,
  initialQuery = '',
  initialFilter = 'All',
}: {
  items: ServiceSummary[];
  initialQuery?: string;
  initialFilter?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<Filter>(
    FILTERS.includes(initialFilter as Filter) ? (initialFilter as Filter) : 'All',
  );
  const [sort, setSort] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');
  const reduce = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((s) => {
      const matchesFilter = filter === 'All' || s.modality === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return `${s.name} ${s.tagline} ${s.description} ${s.modality}`.toLowerCase().includes(q);
    });
    if (sort === 'price-low') list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.startingPrice - a.startingPrice);
    return list;
  }, [items, query, filter, sort]);

  return (
    <div>
      <Suspense fallback={null}>
        <QuerySync onQuery={setQuery} onFilter={setFilter} />
      </Suspense>
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-line bg-paper px-4 py-2.5 focus-within:border-teal/40">
          <Search className="h-4 w-4 shrink-0 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories — “MRI”, “thyroid”, “heart”…"
            aria-label="Search categories"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="text-ink/35 hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-ink/40">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort categories"
            className="rounded-lg border border-line bg-paper px-3 py-2 text-xs outline-none focus:border-teal"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const count = f === 'All' ? items.length : items.filter((s) => s.modality === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                filter === f
                  ? 'border-ink bg-ink text-white'
                  : 'border-line bg-white text-ink/60 hover:border-ink/25 hover:text-ink'
              }`}
            >
              {f === 'All' ? 'All tests' : f === 'Neurodiagnostics' ? 'Neuro' : f}
              <span className={`ml-1.5 tabular text-[0.625rem] ${filter === f ? 'text-white/50' : 'text-ink/35'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted">
        <p>{results.length} categor{results.length === 1 ? 'y' : 'ies'} · {results.reduce((sum, r) => sum + r.tests, 0)} individual tests</p>
        <p className="hidden sm:block">All prices include taxes</p>
      </div>

      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <p className="font-display text-2xl">No category matches “{query}”</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Try “MRI”, “blood”, “heart” or “sleep”. Or call our care desk and we will find the right test.
          </p>
          <button onClick={() => { setQuery(''); setFilter('All'); }} className="btn-outline btn-sm mt-6">
            Reset filters
          </button>
        </div>
      ) : (
        <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((service, i) => (
            <motion.div
              key={service.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.2), ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal/25 hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-mist text-teal-deep transition-colors group-hover:bg-teal group-hover:text-white">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[0.5625rem] uppercase tracking-[0.1em] text-ink/30">{service.modality}</span>
                    <ArrowUpRight className="h-4 w-4 text-ink/20 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
                  </div>
                </div>

                <h3 className="mt-4 flex items-center gap-2 text-base font-semibold">
                  {service.name}
                  {service.isPopular && (
                    <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-gold-deep">Popular</span>
                  )}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted line-clamp-3">{service.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.highlights.slice(0, 2).map((h) => (
                    <span key={h} className="rounded-full bg-ink/[0.04] px-2 py-1 text-[0.625rem] text-ink/50">{h}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-line pt-3.5">
                  <div>
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Starting at</p>
                    <p className="mt-0.5 tabular text-sm font-semibold">{formatINR(service.startingPrice)}</p>
                  </div>
                  <p className="text-right text-[0.625rem] leading-relaxed text-ink/40">
                    {service.tests} tests<br />{service.reportTime}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
