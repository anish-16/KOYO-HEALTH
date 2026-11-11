'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { testimonials } from '@/data/company';
import { Stars } from '@/components/ui/Primitives';
import { cn, formatDate } from '@/lib/utils';

export function ReviewsBrowser() {
  const [rating, setRating] = useState(0);
  const [city, setCity] = useState('All');

  const cities = useMemo(() => ['All', ...Array.from(new Set(testimonials.map((t) => t.city)))], []);
  const rows = useMemo(
    () =>
      testimonials
        .filter((t) => (rating === 0 ? true : t.rating >= rating))
        .filter((t) => (city === 'All' ? true : t.city === city)),
    [rating, city],
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs uppercase tracking-[0.12em] text-muted">Rating</span>
          {[0, 5, 4].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              aria-pressed={rating === r}
              className={cn(
                'rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors',
                rating === r ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink/60 hover:border-ink/25',
              )}
            >
              {r === 0 ? 'All' : `${r}★ only`}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-2xs text-muted">
          City
          <select value={city} onChange={(e) => setCity(e.target.value)} className="field w-auto py-2 text-xs">
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((t) => (
          <figure key={t.id} className="card flex h-full flex-col p-5">
            <div className="flex items-center justify-between">
              <Stars rating={t.rating} />
              {t.verified && (
                <span className="inline-flex items-center gap-1 text-2xs font-medium text-teal-deep">
                  <BadgeCheck className="h-3 w-3" /> Verified booking
                </span>
              )}
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">“{t.quote}”</blockquote>
            <figcaption className="mt-4 border-t border-line pt-3 text-2xs text-muted">
              <span className="font-semibold text-ink">{t.name}</span> · {t.city}
              <span className="block mt-0.5">{t.service} · {formatDate(t.date)}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {rows.length === 0 && <p className="card mt-4 p-10 text-center text-sm text-muted">No reviews match those filters.</p>}
    </div>
  );
}
