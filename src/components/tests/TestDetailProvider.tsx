'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight, ArrowUpRight, Check, Clock, Droplet, FileText, Home, MapPin, Plus, ShieldCheck,
  Utensils, X,
} from 'lucide-react';
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { CallbackButton } from '@/components/site/CallbackButton';
import { useBooking } from '@/components/booking/BookingProvider';
import { discountPct, formatINR } from '@/lib/utils';
import {
  formatDuration, formatReport, getTestEntry, relatedTests, type TestEntry,
} from '@/data/tests';

type TestDetailValue = {
  activeId: string | null;
  openTest: (id: string) => void;
  close: () => void;
};

const TestDetailContext = createContext<TestDetailValue | null>(null);

/**
 * One floating panel for every individual study in the catalogue. Any price row
 * anywhere on the site can open it by id, so a test never dead-ends on a link
 * that leaves the page — the full detail and the booking action are the panel.
 */
export function TestDetailProvider({ children }: { children: ReactNode }) {
  const [activeId, setId] = useState<string | null>(null);

  const openTest = useCallback((id: string) => {
    if (getTestEntry(id)) setId(id);
  }, []);
  const close = useCallback(() => setId(null), []);

  const value = useMemo(() => ({ activeId, openTest, close }), [activeId, openTest, close]);

  return (
    <TestDetailContext.Provider value={value}>
      {children}
      <TestDetailPanel activeId={activeId} onClose={close} onOpen={openTest} />
    </TestDetailContext.Provider>
  );
}

export function useTestDetail() {
  const ctx = useContext(TestDetailContext);
  if (!ctx) throw new Error('useTestDetail must be used inside TestDetailProvider');
  return ctx;
}

/** Opens the detail panel; falls back to a plain link where no provider exists. */
export function TestTrigger({
  id,
  className,
  children,
  onOpened,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  /** Lets a host close itself first — the mobile menu would otherwise cover the panel. */
  onOpened?: () => void;
}) {
  const ctx = useContext(TestDetailContext);
  if (!ctx) {
    return (
      <Link href="/services" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        onOpened?.();
        ctx.openTest(id);
      }}
      className={className}
    >
      {children}
    </button>
  );
}

function TestDetailPanel({
  activeId,
  onClose,
  onOpen,
}: {
  activeId: string | null;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const { add, remove, has } = useBooking();
  const entry = activeId ? getTestEntry(activeId) : undefined;

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [activeId, onClose]);

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-0 z-[78]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${entry.name} — full test details`}
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 16, opacity: 0 }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-paper shadow-lift sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-lg sm:rounded-none"
          >
            <TestDetailBody
              entry={entry}
              added={has(entry.id)}
              onToggle={() =>
                has(entry.id)
                  ? remove(entry.id)
                  : add({
                      id: entry.id,
                      serviceSlug: entry.serviceSlug,
                      serviceName: entry.serviceName,
                      testName: entry.name,
                      price: entry.price,
                      mrp: entry.mrp,
                      fastingHours: entry.fastingHours,
                      homeCollection: entry.homeCollection,
                      sample: entry.sample,
                    })
              }
              onOpen={onOpen}
              onClose={onClose}
            />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TestDetailBody({
  entry,
  added,
  onToggle,
  onOpen,
  onClose,
}: {
  entry: TestEntry;
  added: boolean;
  onToggle: () => void;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const related = relatedTests(entry, 4);
  const duration = formatDuration(entry.durationMinutes);
  const report = formatReport(entry.reportHours);

  return (
    <>
      <header className="surface-ink grain relative px-6 pb-6 pt-5 text-paper">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper/10 text-gold">
              <ServiceIcon name={entry.icon} />
            </span>
            <div>
              <p className="text-[0.5625rem] uppercase tracking-[0.16em] text-paper/45">
                {entry.groupLabel} · {entry.modality}
              </p>
              <p className="mt-0.5 text-xs text-paper/70">{entry.serviceName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close test details"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="display mt-5 text-[1.7rem] leading-tight">{entry.name}</h2>

        <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
          <span className="tabular font-display text-3xl">{formatINR(entry.price)}</span>
          <span className="tabular pb-1 text-sm text-paper/35 line-through">{formatINR(entry.mrp)}</span>
          <span className="mb-1 rounded-full bg-gold px-2 py-0.5 text-[0.5625rem] font-bold text-ink">
            {discountPct(entry.price, entry.mrp)}% off
          </span>
          <span className="mb-1 ml-auto text-[0.625rem] text-paper/45">
            {duration} · report {report}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="text-[0.8125rem] leading-relaxed text-ink/70">{entry.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-2.5">
          {[
            { icon: Droplet, label: 'Sample', value: entry.sample === 'None' ? 'No sample' : entry.sample },
            { icon: Utensils, label: 'Fasting', value: entry.fastingHours > 0 ? `${entry.fastingHours} hrs` : 'Not required' },
            { icon: Clock, label: 'Chair time', value: duration },
            { icon: FileText, label: 'Report', value: report },
            {
              icon: Home,
              label: 'Collection',
              value: entry.homeCollection ? 'Home or centre' : 'Centre visit',
            },
            { icon: MapPin, label: 'Centres', value: `${entry.centers} accredited` },
          ].map((fact) => (
            <div key={fact.label} className="rounded-xl border border-line bg-white px-3 py-2.5">
              <dt className="flex items-center gap-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-ink/40">
                <fact.icon className="h-3 w-3 text-teal" /> {fact.label}
              </dt>
              <dd className="mt-1 text-[0.8125rem] font-medium text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-6">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-teal-deep">
            Before the visit
          </h3>
          <ol className="mt-2.5 space-y-2">
            {entry.preparation.map((step, i) => (
              <li key={step} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-ink/70">
                <span className="tabular mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-mist text-[0.5625rem] font-bold text-teal-deep">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {related.length > 0 && (
          <section className="mt-6">
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-teal-deep">
              Often booked with
            </h3>
            <ul className="mt-2.5 divide-y divide-line rounded-xl border border-line bg-white">
              {related.map((test) => (
                <li key={test.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(test.id)}
                    className="group flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-teal-mist/60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.8125rem] text-ink/80 group-hover:text-ink">
                        {test.name}
                      </span>
                      <span className="text-[0.625rem] text-ink/40">
                        {test.sample === 'None' ? 'Imaging study' : `${test.sample} sample`} · report{' '}
                        {formatReport(test.reportHours)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="tabular text-[0.75rem] font-semibold">{formatINR(test.price)}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-ink/25 group-hover:text-teal" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-5 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-ink/45">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
          Reported by a senior {entry.modality === 'Pathology' ? 'pathologist' : 'consultant'} and kept in your
          report vault. Free cancellation up to 4 hours before.
        </p>
      </div>

      <footer className="space-y-2 border-t border-line bg-white px-6 py-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={added}
            aria-label={`${added ? 'Remove' : 'Add'} ${entry.name} ${added ? 'from' : 'to'} booking`}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all ${
              added
                ? 'border border-teal bg-teal text-white'
                : 'border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white'
            }`}
          >
            {added ? <><Check className="h-4 w-4" /> Added to booking</> : <><Plus className="h-4 w-4" /> Add to booking</>}
          </button>
          <Link href="/book" onClick={onClose} className="btn-primary flex-1 justify-center py-3">
            Book now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex items-center justify-between gap-3 text-[0.6875rem] text-muted">
          <CallbackButton
            label="Ask a clinician"
            variant="ghost"
            className="justify-start px-0 text-[0.6875rem] text-teal-deep"
          />
          <Link href={`/services/${entry.serviceSlug}`} onClick={onClose} className="hover:text-teal-deep">
            All {entry.serviceShortName} tests →
          </Link>
        </div>
      </footer>
    </>
  );
}
