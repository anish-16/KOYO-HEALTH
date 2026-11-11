'use client';

import { Check, Plus } from 'lucide-react';
import { useBooking } from '@/components/booking/BookingProvider';
import { cn } from '@/lib/utils';
import type { HealthPackage } from '@/data/types';

export function AddPackageButton({ pkg, className }: { pkg: HealthPackage; className?: string }) {
  const { add, remove, has } = useBooking();
  const id = `package/${pkg.slug}`;
  const added = has(id);

  return (
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
      className={cn('btn-teal w-full', added && 'bg-teal-deep', className)}
    >
      {added ? <><Check className="h-4 w-4" /> Added to booking</> : <><Plus className="h-4 w-4" /> Add package</>}
    </button>
  );
}
