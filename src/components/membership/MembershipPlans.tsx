'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { membershipTiers } from '@/data/membership';
import { cn, formatINR } from '@/lib/utils';

export function MembershipPlans() {
  const [billing, setBilling] = useState<'annual' | 'monthly'>('annual');

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-line bg-white p-1">
          {(['annual', 'monthly'] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              aria-pressed={billing === b}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors',
                billing === b ? 'bg-ink text-paper' : 'text-ink/60',
              )}
            >
              {b} {b === 'annual' && <span className={billing === b ? 'text-gold' : 'text-teal'}>· save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {membershipTiers.map((tier) => {
          const price = tier.price === 0 ? 0 : billing === 'annual' ? tier.price : Math.round(tier.price / 10);
          return (
            <article
              key={tier.name}
              className={cn(
                'relative flex flex-col rounded-3xl border p-6 transition-shadow hover:shadow-lift',
                tier.highlight ? 'border-ink bg-ink text-paper' : 'border-line bg-white',
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-2xs font-bold uppercase tracking-[0.12em] text-ink">
                  <Sparkles className="h-3 w-3" /> Most chosen
                </span>
              )}
              <h3 className={cn('display text-2xl', tier.highlight ? 'text-paper' : 'text-ink')}>{tier.name}</h3>
              <p className={cn('mt-1 text-xs', tier.highlight ? 'text-paper/55' : 'text-muted')}>{tier.tagline}</p>
              <p className={cn('mt-4 flex items-end gap-1.5', tier.highlight ? 'text-paper' : 'text-ink')}>
                <span className="display text-3xl">{price === 0 ? 'Free' : formatINR(price)}</span>
                {price !== 0 && (
                  <span className={cn('pb-1 text-2xs', tier.highlight ? 'text-paper/45' : 'text-muted')}>
                    {billing === 'annual' ? '/ year' : '/ month'}
                  </span>
                )}
              </p>
              {tier.mrp > 0 && billing === 'annual' && (
                <p className={cn('text-2xs line-through', tier.highlight ? 'text-paper/35' : 'text-muted')}>{formatINR(tier.mrp)}</p>
              )}
              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className={cn('flex gap-2 text-xs leading-relaxed', tier.highlight ? 'text-paper/80' : 'text-ink/75')}>
                    <Check className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', tier.highlight ? 'text-gold' : 'text-teal')} />
                    {benefit}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={cn(
                  'mt-6 w-full',
                  tier.highlight ? 'btn-gold' : tier.name === 'Basic' ? 'btn-outline' : 'btn-primary',
                )}
              >
                {tier.name === 'Basic' ? 'Continue free' : `Join ${tier.name}`}
              </button>
              <p className={cn('mt-2 text-center text-2xs', tier.highlight ? 'text-paper/40' : 'text-muted')}>
                {tier.name === 'Basic' ? 'No card required' : 'Cancel within 7 days for a full refund'}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
