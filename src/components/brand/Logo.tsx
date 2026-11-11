import { cn } from '@/lib/utils';

export function KoyoMark({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'light' }) {
  const primary = tone === 'light' ? '#F6F3EA' : '#0C3B34';
  const accent = '#BF9B4F';
  return (
    <svg viewBox="0 0 40 40" className={cn('h-9 w-9', className)} aria-hidden="true" fill="none">
      <circle cx="20" cy="20" r="18.5" stroke={primary} strokeOpacity="0.22" />
      <circle cx="20" cy="20" r="12" stroke={primary} strokeOpacity="0.5" strokeDasharray="2 4" />
      <path d="M14 10.5v19" stroke={primary} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 20.5 25.5 10" stroke={primary} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.4 18.6 26 29.5" stroke={primary} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="27.5" cy="12.5" r="2.4" fill={accent} />
    </svg>
  );
}

export function Logo({
  className,
  tone = 'ink',
  compact = false,
}: {
  className?: string;
  tone?: 'ink' | 'light';
  compact?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <KoyoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[1.55rem] tracking-[0.01em]',
            tone === 'light' ? 'text-paper' : 'text-ink',
          )}
        >
          KOYO
        </span>
        {!compact && (
          <span
            className={cn(
              'mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.42em]',
              tone === 'light' ? 'text-paper/55' : 'text-ink/45',
            )}
          >
            Health
          </span>
        )}
      </span>
    </span>
  );
}
