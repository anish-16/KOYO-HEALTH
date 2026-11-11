'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Activity, CheckCircle2, FileSpreadsheet, MessageCircle, ShieldCheck } from 'lucide-react';

const BATCHES = [
  { client: 'Meridian Tech · Bengaluru', people: 412, pct: 86, state: 'Reports inbound' },
  { client: 'Northline Motors · Pune', people: 268, pct: 64, state: 'Onsite camp · day 2' },
  { client: 'Arcadia Finance · Mumbai', people: 96, pct: 100, state: 'Completed' },
];

/**
 * A working-looking enterprise portal, built from DOM rather than a screenshot
 * so it stays sharp, themeable and readable to screen readers. Motion is limited
 * to the progress bars and respects `prefers-reduced-motion`.
 */
export function CorporateDashboard() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <div className="surface-ink grain relative overflow-hidden rounded-[1.75rem] border border-ink/10 p-5 text-paper shadow-lift sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.5rem] uppercase tracking-[0.24em] text-paper/40">KOYO Enterprise</p>
            <p className="mt-1 font-display text-xl">Workforce screening · Q4</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[0.5625rem] font-semibold text-gold">
            <Activity className="h-3 w-3" /> Live
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {BATCHES.map((batch, i) => (
            <div key={batch.client} className="rounded-xl border border-paper/10 bg-paper/[0.04] p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-[0.6875rem] font-medium text-paper/85">{batch.client}</p>
                <p className="shrink-0 tabular text-[0.625rem] text-paper/45">{batch.people} employees</p>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
                  <motion.span
                    className={batch.pct === 100 ? 'block h-full rounded-full bg-gold' : 'block h-full rounded-full bg-teal'}
                    initial={reduce ? false : { width: 0 }}
                    whileInView={{ width: `${batch.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right tabular text-[0.625rem] text-paper/60">{batch.pct}%</span>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[0.5625rem] text-paper/40">
                {batch.pct === 100 ? <CheckCircle2 className="h-3 w-3 text-gold" /> : <FileSpreadsheet className="h-3 w-3" />}
                {batch.state}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-paper/10 pt-4 text-[0.5625rem] text-paper/50">
          <span className="flex items-center gap-1.5"><MessageCircle className="h-3 w-3 text-teal" /> WhatsApp PDFs sent</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-teal" /> HR sees fit-to-work only</span>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-soft sm:block">
        <p className="text-[0.5rem] uppercase tracking-[0.14em] text-ink/35">Single invoice</p>
        <p className="mt-0.5 text-sm font-semibold">GST-compliant, one line</p>
      </div>
    </div>
  );
}
