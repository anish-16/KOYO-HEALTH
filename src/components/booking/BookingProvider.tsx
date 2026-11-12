'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ShoppingBag, Trash2, X, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { formatINR } from '@/lib/utils';

export type CartItem = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  testName: string;
  price: number;
  mrp: number;
  fastingHours: number;
  homeCollection: boolean;
  sample: string;
};

type BookingContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  open: () => void;
  close: () => void;
  isOpen: boolean;
  subtotal: number;
  savings: number;
  count: number;
};

const BookingContext = createContext<BookingContextValue | null>(null);
const STORAGE_KEY = 'koyo-booking-v2';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, 20));
      }
    } catch {
      // Corrupt storage should never break the app.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be full or blocked; the cart still works in memory.
    }
  }, [items, hydrated]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item].slice(0, 20)));
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);
  const savings = useMemo(() => items.reduce((sum, i) => sum + Math.max(0, i.mrp - i.price), 0), [items]);

  return (
    <BookingContext.Provider
      value={{
        items, add, remove, clear, has, open: () => setIsOpen(true), close: () => setIsOpen(false),
        isOpen, subtotal, savings, count: items.length,
      }}
    >
      {children}
      <BookingDrawer />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

function BookingDrawer() {
  const { items, isOpen, close, remove, clear, subtotal, savings } = useBooking();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[79]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your booking"
            initial={reduce ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-lift"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="eyebrow">Your selection</p>
                <h2 className="mt-1 font-display text-2xl">
                  {items.length === 0 ? 'Booking is empty' : `${items.length} test${items.length > 1 ? 's' : ''} added`}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Close booking"
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-soft">
                    <ShoppingBag className="h-6 w-6 text-teal-deep" />
                  </div>
                  <p className="mt-5 font-display text-xl">Nothing here yet</p>
                  <p className="mt-2 max-w-[15rem] text-sm text-muted">
                    Add a scan, lab test or health package and it will wait for you here.
                  </p>
                  <Link href="/services" onClick={close} className="btn-outline btn-sm mt-6">
                    Browse tests
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-teal-deep">
                            {item.serviceName}
                          </p>
                          <p className="mt-1 truncate text-sm font-medium">{item.testName}</p>
                          <p className="mt-1 text-xs text-muted">
                            {item.sample !== 'None' ? `${item.sample} sample` : 'Imaging study'}
                            {item.homeCollection ? ' · Home available' : ' · Centre visit'}
                            {item.fastingHours > 0 ? ` · ${item.fastingHours}h fast` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${item.testName}`}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/40 transition-colors hover:bg-clay/10 hover:text-clay"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                        <span className="text-xs text-muted line-through">{formatINR(item.mrp)}</span>
                        <span className="tabular text-sm font-semibold">{formatINR(item.price)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-line bg-white px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Total payable</span>
                  <span className="tabular font-display text-2xl">{formatINR(subtotal)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-teal-deep">
                    <ShieldCheck className="h-3.5 w-3.5" /> You save {formatINR(savings)}
                  </span>
                  <button onClick={clear} className="text-ink/40 hover:text-clay">Clear all</button>
                </div>
                <Link href="/book" onClick={close} className="btn-teal mt-4 w-full">
                  Continue booking <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-[0.6875rem] text-muted">
                  No payment now · Free cancellation up to 4 hours before
                </p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
