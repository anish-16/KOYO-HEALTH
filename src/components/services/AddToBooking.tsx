'use client';

import { Check, Plus } from 'lucide-react';
import { useBooking, type CartItem } from '@/components/booking/BookingProvider';
import { cn } from '@/lib/utils';

export function AddToBooking({
  item,
  className,
  label = 'Add to booking',
}: {
  item: CartItem;
  className?: string;
  label?: string;
}) {
  const { add, remove, has } = useBooking();
  const added = has(item.id);

  return (
    <button
      type="button"
      onClick={() => (added ? remove(item.id) : add(item))}
      aria-pressed={added}
      aria-label={`${added ? 'Remove' : 'Add'} ${item.testName} ${added ? 'from' : 'to'} booking`}
      className={cn('btn-teal w-full', added && 'bg-teal-deep', className)}
    >
      {added ? <><Check className="h-4 w-4" /> Added to booking</> : <><Plus className="h-4 w-4" /> {label}</>}
    </button>
  );
}
