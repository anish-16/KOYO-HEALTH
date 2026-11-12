'use client';

import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { TestTrigger } from '@/components/tests/TestDetailProvider';
import { cn, formatINR } from '@/lib/utils';
import { testsInGroup, type Discipline } from '@/data/tests';

/**
 * The floating panel behind "Blood tests" and "Scans". Six curated columns of
 * real studies with real prices; clicking a study opens the detail panel, so
 * the menu is a way to book rather than a way to read a sitemap.
 */
export function DisciplineMenu({
  discipline,
  onNavigate,
  className,
}: {
  discipline: Discipline;
  onNavigate: () => void;
  className?: string;
}) {
  const isLab = discipline.key === 'pathology';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-line bg-white shadow-lift',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl',
              isLab ? 'bg-teal-mist text-teal-deep' : 'bg-ink text-gold',
            )}
          >
            <ServiceIcon name={discipline.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[0.9375rem] font-semibold leading-tight">{discipline.menuTitle}</p>
            <p className="mt-0.5 text-[0.6875rem] text-muted">{discipline.menuBlurb}</p>
          </div>
        </div>
        <Link
          href={`/tests/${discipline.slug}`}
          onClick={onNavigate}
          className="inline-flex items-center gap-1.5 rounded-full border border-teal/20 bg-teal-mist px-3.5 py-1.5 text-[0.6875rem] font-semibold text-teal-deep transition-colors hover:bg-teal hover:text-white"
        >
          All {discipline.tests.length} {isLab ? 'blood tests' : 'scans'}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-x-6 gap-y-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
        {discipline.menuGroups.map((group) => (
          <div key={group.key}>
            <p className="flex items-center gap-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-teal-deep">
              <ServiceIcon name={group.icon} className="h-3 w-3" strokeWidth={1.8} />
              {group.label}
            </p>
            <ul className="mt-2 space-y-px">
              {testsInGroup(group)
                .slice(0, 4)
                .map((test) => (
                  <li key={test.id}>
                    <TestTrigger
                      id={test.id}
                      className="group flex w-full items-baseline justify-between gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-teal-mist/70"
                    >
                      <span className="truncate text-[0.8125rem] leading-snug text-ink/75 group-hover:text-ink">
                        {test.name}
                      </span>
                      <span className="tabular shrink-0 text-[0.625rem] text-ink/35">
                        {formatINR(test.price)}
                      </span>
                    </TestTrigger>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sand/50 px-5 py-3 text-[0.625rem] text-muted">
        <span className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" />
            {isLab ? 'NABL-accredited labs' : 'NABH & NABL imaging centres'}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-teal" />
            {isLab
              ? 'Free home collection over ₹499'
              : `Reports from ${discipline.fastestReport} h`}
          </span>
        </span>
        <Link
          href={`/tests/${discipline.slug}`}
          onClick={onNavigate}
          className="inline-flex items-center gap-1 font-semibold text-teal-deep hover:text-ink"
        >
          Browse {isLab ? 'pathology' : 'imaging'}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
