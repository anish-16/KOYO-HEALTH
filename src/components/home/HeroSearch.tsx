'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { formatINR } from '@/lib/utils';
import type { SearchEntry } from '@/components/site/SearchDialog';

export function HeroSearch({ index }: { index: SearchEntry[] }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index
      .filter((e) => `${e.name} ${e.serviceName}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query, index]);

  function go(entry: SearchEntry) {
    router.push(`/services/${entry.serviceSlug}?test=${encodeURIComponent(entry.name)}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) return go(results[0]);
    router.push(`/services?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={submit} className="relative z-20 mt-7 max-w-xl">
      <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white p-1.5 pl-5 shadow-soft focus-within:border-teal/40 focus-within:ring-4 focus-within:ring-teal/10">
        <Search className="h-4 w-4 shrink-0 text-ink/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { blurTimer.current = setTimeout(() => setFocused(false), 150); }}
          placeholder="Search a test, scan or symptom — “MRI brain”"
          aria-label="Search tests"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
        />
        <button type="submit" className="btn-teal btn-sm shrink-0">
          Search <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift"
          >
            {results.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onMouseDown={() => { if (blurTimer.current) clearTimeout(blurTimer.current); go(entry); }}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-teal-mist"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{entry.name}</span>
                  <span className="block text-xs text-muted">{entry.serviceName}</span>
                </span>
                <span className="tabular text-xs font-semibold text-teal-deep">{formatINR(entry.price)}</span>
              </button>
            ))}
            <p className="px-3 pb-1 pt-2 text-[0.625rem] text-ink/35">Prices include all taxes · Free cancellation</p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
