'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight, ChevronDown, Menu, Phone, Search, ShoppingBag, UserRound, X, Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { useBooking } from '@/components/booking/BookingProvider';
import { SearchDialog, type SearchEntry } from './SearchDialog';
import { CallbackButton } from './CallbackButton';
import { DisciplineMenu } from './DisciplineMenu';
import { TestTrigger } from '@/components/tests/TestDetailProvider';
import { cn, formatINR } from '@/lib/utils';
import { useSessionUser } from '@/lib/useSessionUser';
import { disciplines, testsInGroup } from '@/data/tests';

const RESOURCES = [
  { href: '/blogs', label: 'Health insights', detail: 'Evidence-based articles from our clinicians' },
  { href: '/faqs', label: 'FAQs', detail: 'Booking, reports, insurance and quality' },
  { href: '/cities', label: 'Cities we serve', detail: '48 cities, 268 accredited centres' },
  { href: '/about-us', label: 'About KOYO', detail: 'Our clinical governance and story' },
  { href: '/contact', label: 'Contact & support', detail: 'Talk to a care advisor' },
];

export function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const { count, open: openCart } = useBooking();
  const { user } = useSessionUser();
  const [mega, setMega] = useState<'blood' | 'scans' | 'resources' | null>(null);
  // Hover already opened the panel, so the first click must not immediately
  // close it again — only a second click (or moving away) does that.
  const hoverOpened = useRef<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === 'Escape') setMega(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!mobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobile]);

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-3 top-3 z-[100] rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
        Skip to content
      </a>

      <div className="hidden bg-ink text-paper/70 md:block">
        <div className="shell flex h-9 items-center justify-between text-[0.6875rem]">
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            NABL &amp; NABH accredited partner network · 268 centres in 48 cities
          </p>
          <div className="flex items-center gap-5">
            <span className="hidden lg:inline">Free home collection over ₹499</span>
            <Link href="/dashboard/reports" className="transition-colors hover:text-paper">Track your report</Link>
            <a href="tel:+918800580075" className="flex items-center gap-1.5 transition-colors hover:text-paper">
              <Phone className="h-3 w-3" /> +91 88005 80075
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-paper/92 backdrop-blur-md transition-shadow duration-300',
          scrolled ? 'border-line shadow-[0_8px_24px_-18px_rgba(6,25,31,0.5)]' : 'border-transparent',
        )}
        onMouseLeave={() => setMega(null)}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-4 lg:h-[76px]">
          <Link href="/" aria-label="KOYO Health home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {disciplines.map((discipline) => {
              const open = mega === (discipline.key === 'pathology' ? 'blood' : 'scans');
              const key = discipline.key === 'pathology' ? 'blood' : 'scans';
              return (
                <button
                  key={key}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`mega-${key}`}
                  onClick={() => {
                    if (hoverOpened.current === key) {
                      hoverOpened.current = null;
                      setMega(key);
                      return;
                    }
                    setMega(open ? null : key);
                  }}
                  onMouseEnter={() => {
                    hoverOpened.current = key;
                    setMega(key);
                  }}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3 py-2 text-[0.8125rem] font-medium transition-colors',
                    open
                      ? discipline.key === 'pathology'
                        ? 'bg-teal-mist text-teal-deep'
                        : 'bg-ink text-white'
                      : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink',
                  )}
                >
                  {discipline.navLabel}
                  <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
                </button>
              );
            })}
            <Link href="/packages" className="rounded-full px-3 py-2 text-[0.8125rem] font-medium text-ink/75 transition-colors hover:bg-ink/[0.05] hover:text-ink">
              Health packages
            </Link>
            <Link href="/corporate-wellness" className="hidden rounded-full px-3 py-2 text-[0.8125rem] font-medium text-ink/75 transition-colors hover:bg-ink/[0.05] hover:text-ink xl:block">
              Corporate
            </Link>
            <Link href="/membership" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.8125rem] font-medium text-ink/75 transition-colors hover:bg-ink/[0.05] hover:text-ink">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Gold
            </Link>
            <button
              type="button"
              aria-expanded={mega === 'resources'}
              onClick={() => setMega(mega === 'resources' ? null : 'resources')}
              onMouseEnter={() => setMega('resources')}
              className={cn(
                'flex items-center gap-1 rounded-full px-3 py-2 text-[0.8125rem] font-medium transition-colors',
                mega === 'resources' ? 'bg-ink text-white' : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink',
              )}
            >
              Resources <ChevronDown className={cn('h-3 w-3 transition-transform', mega === 'resources' && 'rotate-180')} />
            </button>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearch(true)}
              aria-label="Search tests"
              className="hidden h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink sm:grid"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href={user ? '/dashboard' : '/login'}
              aria-label={user ? 'Your dashboard' : 'Log in'}
              className="hidden h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink sm:grid"
            >
              <UserRound className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open booking, ${count} item${count === 1 ? '' : 's'}`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-teal px-1 text-[0.5625rem] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <Link href="/book" className="btn-primary btn-sm ml-1 hidden sm:inline-flex">
              Book a test
            </Link>
            <button
              type="button"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
              aria-expanded={mobile}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {(mega === 'blood' || mega === 'scans') && (
            <motion.div
              key={mega}
              id={`mega-${mega}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden px-4 pt-1 lg:block"
            >
              <DisciplineMenu
                discipline={mega === 'blood' ? disciplines[0] : disciplines[1]}
                onNavigate={() => setMega(null)}
                className="mx-auto max-w-5xl"
              />
            </motion.div>
          )}

          {mega === 'resources' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-4 top-full hidden w-[26rem] border border-line bg-paper p-2 shadow-lift lg:block"
              style={{ borderRadius: '0 0 1rem 1rem' }}
            >
              {RESOURCES.map((r) => (
                <Link key={r.href} href={r.href} className="block rounded-xl px-4 py-3 transition-colors hover:bg-teal-mist">
                  <span className="block text-sm font-medium">{r.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{r.detail}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[85] lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobile(false)} aria-hidden="true" />
            <motion.div
              role="dialog" aria-modal="true" aria-label="Menu"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-paper"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo compact />
                <button onClick={() => setMobile(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full border border-line">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: '/packages', label: 'Health packages' },
                    { href: '/corporate-wellness', label: 'Corporate Wellness' },
                    { href: '/membership', label: 'Gold membership' },
                    { href: '/cities', label: 'Cities' },
                    { href: '/blogs', label: 'Health insights' },
                    { href: '/about-us', label: 'About KOYO' },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="rounded-xl border border-line bg-white px-3 py-3 text-[0.8125rem] font-medium">
                      {l.label}
                    </Link>
                  ))}
                </div>

                <p className="mt-6 text-2xs font-semibold uppercase tracking-[0.14em] text-teal-deep">Tests &amp; scans</p>
                <div className="mt-2 divide-y divide-line">
                  {disciplines.map((discipline) => (
                    <details key={discipline.key} className="group py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <ServiceIcon name={discipline.icon} className="h-3.5 w-3.5 text-teal" />
                          {discipline.label}
                          <span className="tabular text-[0.625rem] text-ink/35">{discipline.tests.length}</span>
                        </span>
                        <ChevronDown className="h-4 w-4 text-ink/40 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pb-2">
                        {discipline.menuGroups.map((group) => (
                          <div key={group.key} className="pt-2">
                            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                              {group.label}
                            </p>
                            <ul>
                              {testsInGroup(group)
                                .slice(0, 4)
                                .map((test) => (
                                  <li key={test.id}>
                                    <TestTrigger
                                      id={test.id}
                                      onOpened={() => setMobile(false)}
                                      className="flex w-full items-center justify-between gap-2 py-1.5 pl-1 text-left text-[0.8125rem] text-ink/70"
                                    >
                                      <span className="truncate">{test.name}</span>
                                      <span className="tabular shrink-0 text-[0.6875rem] text-ink/35">
                                        {formatINR(test.price)}
                                      </span>
                                    </TestTrigger>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href={`/tests/${discipline.slug}`}
                          className="mt-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-teal-deep"
                        >
                          All {discipline.tests.length} {discipline.key === 'pathology' ? 'blood tests' : 'scans'}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
              <div className="space-y-2 border-t border-line p-5">
                <Link href="/book" className="btn-primary w-full">Book a test</Link>
                <Link href={user ? '/dashboard' : '/login'} className="btn-outline w-full">
                  {user ? 'Open dashboard' : 'Log in / Sign up'}
                </Link>
                <a href="tel:+918800580075" className="flex items-center justify-center gap-2 py-2 text-xs text-muted">
                  <Phone className="h-3.5 w-3.5" /> +91 88005 80075
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={search} onClose={() => setSearch(false)} index={searchIndex} />
    </>
  );
}
