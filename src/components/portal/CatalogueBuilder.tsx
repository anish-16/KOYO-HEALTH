'use client';

import { useActionState, useState } from 'react';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { addCatalogueItemAction } from '@/app/portal/b2b/actions';
import {
  CATALOGUE_KINDS, COLLECTION_MODES, idleAction, type CatalogueKind,
} from '@/data/portal';
import { cn, formatINR } from '@/lib/utils';

export type CatalogueOption = {
  value: string;
  label: string;
  group: string;
  price: number;
  kind: CatalogueKind;
};

const fieldLabel = 'mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted';

function suggestRate(price: number) {
  return Math.max(50, Math.round((price * 0.85) / 10) * 10);
}

export function CatalogueBuilder({
  partnerId,
  options,
}: {
  partnerId: string;
  options: CatalogueOption[];
}) {
  const [state, formAction, pending] = useActionState(addCatalogueItemAction, idleAction);
  const [source, setSource] = useState<'library' | 'custom'>('library');
  const first = options[0];
  const [refId, setRefId] = useState(first?.value ?? '');
  const [listPrice, setListPrice] = useState(first?.price ?? 0);
  const [rate, setRate] = useState(first ? suggestRate(first.price) : 0);
  const [modes, setModes] = useState<string[]>([...COLLECTION_MODES]);
  const [tatHours, setTatHours] = useState('24');

  const selected = options.find((option) => option.value === refId) ?? first;
  const groups = Array.from(new Set(options.map((option) => option.group)));

  function pickReference(value: string) {
    setRefId(value);
    const option = options.find((entry) => entry.value === value);
    if (!option) return;
    setListPrice(option.price);
    setRate(suggestRate(option.price));
  }

  function toggleMode(mode: string) {
    setModes((current) =>
      current.includes(mode) ? current.filter((entry) => entry !== mode) : [...current, mode],
    );
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-deep">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink">Add to this partner&apos;s catalogue</h2>
          <p className="mt-0.5 text-2xs leading-relaxed text-muted">
            Pick a live pathology test, scan or package at a negotiated rate — or build a custom health
            package from the tests you want included.
          </p>
        </div>
      </div>

      <div className="mt-5 flex rounded-full border border-line bg-sand/60 p-1">
        {(
          [
            { value: 'library', label: 'Live catalogue' },
            { value: 'custom', label: 'Custom package' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSource(tab.value)}
            className={cn(
              'flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
              source === tab.value ? 'bg-white text-ink shadow-soft' : 'text-ink/55 hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="partnerId" value={partnerId} />
        <input type="hidden" name="source" value={source} />

        {source === 'library' ? (
          <>
            <input type="hidden" name="kind" value={selected?.kind ?? 'Pathology'} />
            <label className="block sm:col-span-2">
              <span className={fieldLabel}>Test, scan or package</span>
              <select
                name="refId"
                value={refId}
                onChange={(event) => pickReference(event.target.value)}
                className="field"
              >
                {groups.map((group) => (
                  <optgroup key={group} label={group}>
                    {options
                      .filter((option) => option.group === group)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} — {formatINR(option.price)}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <input type="hidden" name="listPrice" value={listPrice} />
            <div className="rounded-xl border border-line bg-sand/40 px-3.5 py-2.5">
              <p className="text-[0.5625rem] uppercase tracking-[0.12em] text-ink/40">List price</p>
              <p className="tabular mt-0.5 text-sm font-semibold text-ink">{formatINR(listPrice)}</p>
            </div>
            <div className="rounded-xl border border-line bg-sand/40 px-3.5 py-2.5">
              <p className="text-[0.5625rem] uppercase tracking-[0.12em] text-ink/40">Catalogue type</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{selected?.kind ?? '—'}</p>
            </div>
          </>
        ) : (
          <>
            <input type="hidden" name="kind" value="Custom package" />
            <label className="block sm:col-span-2">
              <span className={fieldLabel}>Custom package name</span>
              <input name="name" className="field" placeholder="Meridian Pre-employment Panel" />
              {state.fields?.name ? <span className="mt-1 block text-2xs text-clay">{state.fields.name}</span> : null}
            </label>
            <label className="block sm:col-span-2">
              <span className={fieldLabel}>Included tests</span>
              <textarea
                name="includes"
                rows={2}
                className="field resize-none"
                placeholder="CBC, LFT, KFT, Urine routine, Chest X-ray (PA)"
              />
              <span className="mt-1 block text-[0.625rem] text-ink/40">Comma-separated; printed on the employee report.</span>
            </label>
            <label className="block">
              <span className={fieldLabel}>List price (₹)</span>
              <input
                name="listPrice"
                inputMode="numeric"
                value={listPrice}
                onChange={(event) => setListPrice(Number(event.target.value) || 0)}
                className="field"
              />
            </label>
          </>
        )}

        <label className="block">
          <span className={fieldLabel}>Partner rate (₹)</span>
          <input
            name="rate"
            inputMode="numeric"
            value={rate}
            onChange={(event) => setRate(Number(event.target.value) || 0)}
            className="field"
          />
          {state.fields?.rate ? <span className="mt-1 block text-2xs text-clay">{state.fields.rate}</span> : null}
        </label>

        <label className="block">
          <span className={fieldLabel}>Turnaround (hours)</span>
          <input
            name="tatHours"
            inputMode="numeric"
            value={tatHours}
            onChange={(event) => setTatHours(event.target.value)}
            className="field"
          />
          {state.fields?.tatHours ? <span className="mt-1 block text-2xs text-clay">{state.fields.tatHours}</span> : null}
        </label>

        <fieldset className="sm:col-span-2">
          <legend className={fieldLabel}>Available for</legend>
          <div className="flex flex-wrap gap-2">
            {COLLECTION_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={modes.includes(mode)}
                onClick={() => toggleMode(mode)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors',
                  modes.includes(mode)
                    ? 'border-teal/40 bg-teal-mist text-teal-deep'
                    : 'border-line bg-white text-ink/55 hover:border-ink/20',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          {modes.map((mode) => (
            <input key={mode} type="hidden" name="modes" value={mode} />
          ))}
          {state.fields?.modes ? <span className="mt-1 block text-2xs text-clay">{state.fields.modes}</span> : null}
        </fieldset>

        {state.status === 'ok' ? (
          <p className="sm:col-span-2 rounded-lg border border-teal/25 bg-teal-mist px-3 py-2 text-xs font-medium text-teal-deep">
            {state.message}
          </p>
        ) : null}
        {state.status === 'error' ? (
          <p role="alert" className="sm:col-span-2 rounded-lg border border-clay/20 bg-clay/10 px-3 py-2 text-xs text-clay">
            {state.message}
          </p>
        ) : null}

        <button type="submit" disabled={pending || modes.length === 0} className="btn-primary btn-sm sm:col-span-2">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          {pending ? 'Adding…' : 'Add to catalogue'}
        </button>
        <p className="sm:col-span-2 text-[0.625rem] text-ink/40">
          {CATALOGUE_KINDS.length} catalogue types · the rate here is copied into every booking, so a later
          price change never rewrites an existing batch.
        </p>
      </form>
    </section>
  );
}
