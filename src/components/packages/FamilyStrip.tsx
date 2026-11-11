import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PersonPhoto } from '@/components/media/PersonPhoto';
import { packageFamilies } from '@/data/families';
import { formatINR, cn } from '@/lib/utils';

/**
 * Category cards, generated from the 18 packages rather than a hand-written
 * persona list — every tile is a real filter that returns at least one package,
 * and the count beside it is the number you will actually see.
 */
export function FamilyStrip({
  active,
  className,
  compact = false,
}: {
  active?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {packageFamilies.map((family) => {
        const isActive = active === family.key;
        return (
          <Link
            key={family.key}
            href={`/packages?family=${family.key}#catalogue`}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'group relative overflow-hidden rounded-2xl border transition-all duration-300',
              isActive ? 'border-teal shadow-lift' : 'border-line hover:-translate-y-0.5 hover:shadow-lift',
            )}
          >
            <PersonPhoto
              photo={family.photo}
              className={compact ? 'aspect-[3/2]' : 'aspect-[5/4] sm:aspect-[4/3]'}
              imgClassName={cn(
                'transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]',
                family.key === 'full-body' ? 'object-[center_38%]' : 'object-[center_28%]',
              )}
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 30vw, 45vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 text-white">
              <p className="text-[0.8125rem] font-semibold leading-tight">{family.label}</p>
              {!compact && <p className="mt-1 text-[0.625rem] leading-snug text-paper/70">{family.blurb}</p>}
              <p className="mt-1.5 text-[0.5625rem] font-medium uppercase tracking-[0.1em] text-gold">
                {family.count} package{family.count === 1 ? '' : 's'} · from {formatINR(family.from)}
              </p>
            </div>
            <span
              className={cn(
                'absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-paper/30 bg-paper/15 text-paper backdrop-blur transition-colors',
                isActive ? 'bg-gold text-ink' : 'group-hover:bg-gold group-hover:text-ink',
              )}
              aria-hidden="true"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
