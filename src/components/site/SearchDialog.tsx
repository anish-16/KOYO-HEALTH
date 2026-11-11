'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Loader2, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatINR } from '@/lib/utils';

export type SearchEntry = {
  id: string;
  name: string;
  serviceName: string;
  serviceSlug: string;
  price: number;
  aliases: string;
};

const POPULAR = ['MRI Brain', 'Full body', 'Thyroid', 'HbA1c', 'CT Chest', 'Vitamin D', 'Echo', 'Liver'];

export function SearchDialog({
  open,
  onClose,
  index,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchEntry[];
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/);
    return index
      .map((entry) => {
        const hay = `${entry.name} ${entry.serviceName} ${entry.aliases}`.toLowerCase();
        let score = 0;
        for (const token of tokens) {
          if (entry.name.toLowerCase().startsWith(token)) score += 5;
          else if (hay.includes(token)) score += 2;
        }
        return { entry, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.price - b.entry.price)
      .slice(0, 7)
      .map((r) => r.entry);
  }, [query, index]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === 'Enter' && results[active]) {
        e.preventDefault();
        go(results[active]);
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, results, active, onClose]);

  function go(entry: SearchEntry) {
    setSearching(true);
    onClose();
    router.push(`/services/${entry.serviceSlug}?test=${encodeURIComponent(entry.name)}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-[3px]" onClick={onClose} aria-hidden="true" />
          <motion.div
            role="dialog" aria-modal="true" aria-label="Search tests"
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-paper shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-ink/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                placeholder="Search 1,700+ tests, scans and packages…"
                aria-label="Search tests"
                aria-controls="search-results"
                aria-expanded={results.length > 0}
                role="combobox"
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
              />
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin text-teal" />
              ) : (
                <button onClick={onClose} aria-label="Close search" className="grid h-7 w-7 place-items-center rounded-full text-ink/40 hover:bg-ink/5">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div id="search-results" className="max-h-[52vh] overflow-y-auto p-2">
              {!query && (
                <div className="px-3 py-3">
                  <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-ink/40">Popular searches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink/70 transition-colors hover:border-teal/40 hover:text-teal-deep"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query && results.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-medium">No test matches “{query}”</p>
                  <p className="mt-1.5 text-xs text-muted">
                    Try a shorter term, or call <a href="tel:+918800580075" className="text-teal-deep underline">88005 80075</a> and we will find it for you.
                  </p>
                </div>
              )}

              {results.map((entry, i) => (
                <button
                  key={entry.id}
                  onClick={() => go(entry)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === active ? 'bg-teal-mist' : 'hover:bg-ink/[0.03]'
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-teal-deep ring-1 ring-line">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{entry.name}</span>
                    <span className="block text-xs text-muted">{entry.serviceName}</span>
                  </span>
                  <span className="tabular shrink-0 text-xs font-semibold">{formatINR(entry.price)}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink/25" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line bg-white px-4 py-2.5 text-[0.625rem] text-ink/40">
              <span>↑ ↓ to navigate · Enter to open · Esc to close</span>
              <span>KOYO catalogue</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
