import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'teal' | 'gold' | 'clay' | 'ink';
  className?: string;
}) {
  const tones = {
    default: 'border-line bg-white text-ink/65',
    teal: 'border-teal/15 bg-teal-soft text-teal-deep',
    gold: 'border-gold/30 bg-gold-soft text-gold-deep',
    clay: 'border-clay/20 bg-clay/10 text-clay',
    ink: 'border-ink/10 bg-ink text-paper',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className={cn('eyebrow mb-3', tone === 'light' && 'text-gold')}>{eyebrow}</p>
        )}
        <h2
          className={cn(
            'display text-[2.1rem] leading-[1.06] sm:text-[2.6rem] lg:text-[3rem]',
            tone === 'light' ? 'text-paper' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-4 max-w-xl text-[0.95rem] leading-relaxed',
              tone === 'light' ? 'text-paper/65' : 'text-muted',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-transparent text-ink/20',
          )}
        />
      ))}
    </span>
  );
}

export function Breadcrumbs({ items, tone = 'dark' }: { items: { label: string; href?: string }[]; tone?: 'dark' | 'light' }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className={cn('flex flex-wrap items-center gap-1.5 text-xs', tone === 'light' ? 'text-paper/60' : 'text-muted')}>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-teal">
                {item.label}
              </Link>
            ) : (
              <span className={tone === 'light' ? 'text-paper' : 'text-ink'} aria-current="page">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight className="h-3 w-3 opacity-40" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-line', className)} />;
}
