'use client';

import Link from 'next/link';
import { Check, Clock, FileText, Plus, ShieldCheck } from 'lucide-react';
import { useBooking } from '@/components/booking/BookingProvider';
import { PackageArt } from '@/components/packages/PackageArt';
import { cn, discountPct, formatINR } from '@/lib/utils';
import type { HealthPackage } from '@/data/types';

export function PackageCard({
  pkg,
  compact = false,
  className,
}: {
  pkg: HealthPackage;
  compact?: boolean;
  className?: string;
}) {
  const { add, remove, has } = useBooking();
  const id = `package/${pkg.slug}`;
  const added = has(id);
  const shown = compact ? 3 : 4;

  return (
    <article className={cn('card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift', className)}>
      <Link href={`/packages/${pkg.slug}`} className="block" aria-label={`${pkg.name} — full test list`}>
        <PackageArt pkg={pkg} className={cn('w-full', compact ? 'aspect-[16/7]' : 'aspect-[16/9]')} />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink">
            <Link href={`/packages/${pkg.slug}`} className="hover:text-teal-deep">{pkg.name}</Link>
          </h3>
          <span className="shrink-0 rounded-full bg-sand/70 px-2 py-0.5 text-[0.5625rem] font-medium text-ink/55">
            {pkg.ageBand}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{pkg.tagline}</p>

        <p className="mt-4 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink/35">
          Tests included
        </p>
        <ul className="mt-2 space-y-1.5">
          {pkg.testsIncluded.slice(0, shown).map((test) => (
            <li key={test} className="flex items-start gap-2 text-[0.75rem] leading-snug text-ink/70">
              <Check className="mt-[3px] h-3 w-3 shrink-0 text-teal" />
              <span className="truncate">{test}</span>
            </li>
          ))}
          {pkg.testsIncluded.length > shown && (
            <li className="pl-5 text-[0.6875rem] text-ink/40">
              + {pkg.testsIncluded.length - shown} more tests
            </li>
          )}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3 text-[0.625rem] text-ink/45">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-teal" /> {pkg.testCount} parameters</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-teal" /> {pkg.testsIncluded.length} tests</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-teal" /> {pkg.reportTime}</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="tabular font-display text-2xl">{formatINR(pkg.price)}</span>
                <span className="tabular text-xs text-ink/35 line-through">{formatINR(pkg.mrp)}</span>
              </div>
              <p className="mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-clay">
                {discountPct(pkg.price, pkg.mrp) >= 25
                  ? `${discountPct(pkg.price, pkg.mrp)}% off · save ${formatINR(pkg.mrp - pkg.price)}`
                  : `Save ${formatINR(pkg.mrp - pkg.price)} on list price`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/packages/${pkg.slug}`}
                className="hidden text-[0.6875rem] font-medium text-teal-deep hover:underline sm:block"
              >
                Test list
              </Link>
              <button
                onClick={() =>
                  added
                    ? remove(id)
                    : add({
                        id,
                        serviceSlug: 'packages',
                        serviceName: 'Health package',
                        testName: pkg.name,
                        price: pkg.price,
                        mrp: pkg.mrp,
                        fastingHours: pkg.fastingHours,
                        homeCollection: true,
                        sample: 'Blood',
                      })
                }
                aria-pressed={added}
                aria-label={`${added ? 'Remove' : 'Add'} ${pkg.name} ${added ? 'from' : 'to'} booking`}
                className={cn(
                  'grid h-10 w-10 place-items-center rounded-full border transition-all',
                  added ? 'border-teal bg-teal text-white' : 'border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white',
                )}
              >
                {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="mt-3 block text-center text-[0.6875rem] font-medium text-teal-deep hover:underline sm:hidden"
          >
            What is included →
          </Link>
        </div>
      </div>
    </article>
  );
}
