import { cn } from '@/lib/utils';
import { STATUS_STYLE, type BookingStatus } from '@/data/portal';

export function StatusPill({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em]',
        STATUS_STYLE[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {status}
    </span>
  );
}

export function ModeChip({ mode }: { mode: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-sand/60 px-1.5 py-0.5 text-[0.625rem] font-medium text-ink/65">
      {mode}
    </span>
  );
}
