'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PackageCard } from '@/components/cards/PackageCard';
import { packageFamilies } from '@/data/families';
import type { HealthPackage } from '@/data/types';

const CATEGORIES = ['All', 'Essential', 'Advanced', 'Premium', 'Focused'] as const;
const AUDIENCE = ['Everyone', 'Women', 'Men', 'Seniors', 'Couples'] as const;

const isAudience = (value?: string): value is (typeof AUDIENCE)[number] =>
  !!value && (AUDIENCE as readonly string[]).includes(value);

export function PackagesBrowser({
  packages,
  initialQuery = '',
  initialAudience,
  initialFamily,
}: {
  packages: HealthPackage[];
  initialQuery?: string;
  initialAudience?: string;
  initialFamily?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [family, setFamily] = useState<string | undefined>(
    packageFamilies.some((f) => f.key === initialFamily) ? initialFamily : undefined,
  );
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [audience, setAudience] = useState<(typeof AUDIENCE)[number]>(
    isAudience(initialAudience) ? initialAudience : 'Everyone',
  );
  const [audienceOn, setAudienceOn] = useState(isAudience(initialAudience));
  const reduce = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages.filter((p) => {
      if (family && p.family !== family) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (audienceOn && p.forWhom !== audience) return false;
      if (!q) return true;
      return `${p.name} ${p.tagline} ${p.testsIncluded.join(' ')} ${p.forWhom}`.toLowerCase().includes(q);
    });
  }, [packages, family, category, audience, audienceOn, query]);

  const reset = () => {
    setQuery('');
    setFamily(undefined);
    setCategory('All');
    setAudienceOn(false);
  };

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-line bg-paper px-4 py-2.5 focus-within:border-teal/40">
            <Search className="h-4 w-4 shrink-0 text-ink/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages or included tests — “vitamin”, “cardiac”, “PCOS”…"
              aria-label="Search packages"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear" className="text-ink/35 hover:text-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <label className="flex shrink-0 items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-xs text-ink/60">
            <input
              type="checkbox"
              checked={audienceOn}
              onChange={(e) => setAudienceOn(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-line text-teal focus:ring-teal"
            />
            For
            <select
              value={audience}
              onChange={(e) => {
                setAudience(e.target.value as typeof audience);
                setAudienceOn(true);
              }}
              aria-label="Filter by audience"
              className="bg-transparent font-medium text-ink outline-none disabled:opacity-40"
            >
              {AUDIENCE.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
          <button
            onClick={() => setFamily(undefined)}
            aria-pressed={!family}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              !family ? 'bg-ink text-white' : 'bg-sand/70 text-ink/60 hover:bg-sand'
            }`}
          >
            All <span className="opacity-60">{packages.length}</span>
          </button>
          {packageFamilies.map((f) => (
            <button
              key={f.key}
              onClick={() => setFamily(f.key)}
              aria-pressed={family === f.key}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                family === f.key ? 'bg-ink text-white' : 'bg-sand/70 text-ink/60 hover:bg-sand'
              }`}
            >
              {f.label} <span className="opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-2.5 flex items-center gap-2 border-t border-line pt-2.5">
          <span className="shrink-0 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">
            Tier
          </span>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`shrink-0 rounded-full px-3 py-1 text-[0.6875rem] transition-colors ${
                  category === c ? 'bg-teal text-white' : 'text-ink/50 hover:bg-teal-mist hover:text-teal-deep'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          {results.length} of {packages.length} packages · prices include all tests, collection and reporting
        </p>
        {(family || category !== 'All' || audienceOn || query) && (
          <button onClick={reset} className="text-[0.6875rem] font-medium text-teal-deep hover:underline">
            Reset filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <p className="font-display text-2xl">Nothing matches those filters</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Try a broader category or clear the search. Every package includes a free physician review of
            abnormal results.
          </p>
          <button onClick={reset} className="btn-outline btn-sm mt-5">Reset filters</button>
        </div>
      ) : (
        <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((pkg, i) => (
            <motion.div
              key={pkg.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.25) }}
              className="h-full"
            >
              <PackageCard pkg={pkg} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
