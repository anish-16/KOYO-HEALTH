'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { formatINR, discountPct } from '@/lib/utils';
import type { Modality } from '@/data/types';

export type ExplorerService = {
  slug: string;
  name: string;
  tagline: string;
  modality: Modality;
  icon: string;
  startingPrice: number;
  mrp: number;
  tests: number;
  isPopular: boolean;
};

const FILTERS: ('All' | Modality)[] = ['All', 'Radiology', 'Cardiology', 'Neurodiagnostics', 'Specialist', 'Pathology'];
const SHORT: Record<string, string> = {
  All: 'All 28',
  Radiology: 'Imaging',
  Cardiology: 'Cardiac',
  Neurodiagnostics: 'Neuro',
  Specialist: 'Specialist',
  Pathology: 'Labs',
};

export function CategoryExplorer({ items }: { items: ExplorerService[] }) {
  const [filter, setFilter] = useState<'All' | Modality>('All');
  const [showAll, setShowAll] = useState(false);
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((s) => s.modality === filter)),
    [items, filter],
  );
  const visible = showAll ? filtered : filtered.slice(0, 9);

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => {
          const count = f === 'All' ? items.length : items.filter((s) => s.modality === f).length;
          return (
            <button
              key={f}
              onClick={() => { setFilter(f); setShowAll(false); }}
              aria-pressed={filter === f}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                filter === f
                  ? 'border-ink bg-ink text-white'
                  : 'border-line bg-white text-ink/60 hover:border-ink/25 hover:text-ink'
              }`}
            >
              {SHORT[f]} <span className={`ml-1 tabular text-[0.625rem] ${filter === f ? 'text-white/50' : 'text-ink/35'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((service, i) => (
            <motion.article
              key={service.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.025, 0.2), ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal/25 hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-mist text-teal-deep transition-colors group-hover:bg-teal group-hover:text-white">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    {service.isPopular && (
                      <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-gold-deep">
                        Popular
                      </span>
                    )}
                    <ArrowUpRight className="h-4 w-4 text-ink/20 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
                  </div>
                </div>

                <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink">{service.name}</h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-muted line-clamp-2">{service.tagline}</p>

                <div className="mt-4 flex items-end justify-between border-t border-line pt-3.5">
                  <div>
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Starting at</p>
                    <p className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="tabular text-sm font-semibold">{formatINR(service.startingPrice)}</span>
                      <span className="tabular text-[0.625rem] text-ink/30 line-through">{formatINR(service.mrp)}</span>
                    </p>
                  </div>
                  <span className="text-[0.625rem] text-ink/40">
                    {service.tests} test{service.tests > 1 ? 's' : ''} · {discountPct(service.startingPrice, service.mrp)}% off
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length > 9 && (
        <div className="mt-7 flex justify-center">
          <button onClick={() => setShowAll((s) => !s)} className="btn-outline btn-sm">
            {showAll ? 'Show fewer categories' : `View all ${filtered.length} categories`}
          </button>
        </div>
      )}
    </div>
  );
}
