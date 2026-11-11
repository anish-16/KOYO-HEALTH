'use client';

import { Check, Clock, Droplet, Plus, Utensils } from 'lucide-react';
import { useBooking } from '@/components/booking/BookingProvider';
import { discountPct, formatINR } from '@/lib/utils';
import type { ServiceTest } from '@/data/types';

export function TestTable({
  serviceSlug,
  serviceName,
  tests,
}: {
  serviceSlug: string;
  serviceName: string;
  tests: ServiceTest[];
}) {
  const { add, remove, has } = useBooking();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="hidden grid-cols-12 gap-4 border-b border-line bg-sand/60 px-5 py-3 text-2xs font-semibold uppercase tracking-[0.1em] text-ink/45 md:grid">
        <span className="col-span-5">Test</span>
        <span className="col-span-2">Duration</span>
        <span className="col-span-2">Fasting</span>
        <span className="col-span-2 text-right">Price</span>
        <span className="col-span-1" />
      </div>
      <ul className="divide-y divide-line">
        {tests.map((test) => {
          const id = `${serviceSlug}/${test.slug}`;
          const added = has(id);
          return (
            <li key={test.slug} className="grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-teal-mist/40">
              <div className="col-span-12 md:col-span-5">
                <p className="text-sm font-medium">{test.name}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[0.6875rem] text-muted">
                  <Droplet className="h-3 w-3 text-teal/60" />
                  {test.sample === 'None' ? 'Imaging study' : `${test.sample} sample`}
                  {test.homeCollection ? ' · Home available' : ' · Centre only'}
                </p>
              </div>
              <p className="col-span-4 flex items-center gap-1.5 text-xs text-ink/60 md:col-span-2">
                <Clock className="h-3 w-3 text-ink/30" /> {test.durationMinutes >= 60 ? `${Math.round(test.durationMinutes / 60)} hr` : `${test.durationMinutes} min`}
              </p>
              <p className="col-span-4 flex items-center gap-1.5 text-xs text-ink/60 md:col-span-2">
                <Utensils className="h-3 w-3 text-ink/30" /> {test.fastingHours > 0 ? `${test.fastingHours} hrs` : 'Not required'}
              </p>
              <div className="col-span-4 flex flex-col items-end md:col-span-2">
                <span className="tabular text-sm font-semibold">{formatINR(test.price)}</span>
                <span className="text-[0.625rem] text-ink/35">
                  <span className="line-through">{formatINR(test.mrp)}</span> · {discountPct(test.price, test.mrp)}% off
                </span>
              </div>
              <div className="col-span-12 flex justify-end md:col-span-1">
                <button
                  onClick={() =>
                    added
                      ? remove(id)
                      : add({
                          id,
                          serviceSlug,
                          serviceName,
                          testName: test.name,
                          price: test.price,
                          mrp: test.mrp,
                          fastingHours: test.fastingHours,
                          homeCollection: test.homeCollection,
                          sample: test.sample,
                        })
                  }
                  aria-pressed={added}
                  aria-label={`${added ? 'Remove' : 'Add'} ${test.name} ${added ? 'from' : 'to'} booking`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.6875rem] font-medium transition-all ${
                    added
                      ? 'border-teal bg-teal text-white'
                      : 'border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white'
                  }`}
                >
                  {added ? <><Check className="h-3 w-3" /> Added</> : <><Plus className="h-3 w-3" /> Add</>}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
