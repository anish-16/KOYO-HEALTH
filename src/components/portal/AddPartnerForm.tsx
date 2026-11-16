'use client';

import { useActionState, useState } from 'react';
import { Building2, Check, Copy, Loader2, UserPlus } from 'lucide-react';
import { addPartnerAction } from '@/app/portal/b2b/actions';
import { COLLECTION_MODES, idleAction } from '@/data/portal';
import { cn } from '@/lib/utils';

const fieldLabel = 'mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted';

export function AddPartnerForm() {
  const [state, formAction, pending] = useActionState(addPartnerAction, idleAction);
  const [copied, setCopied] = useState(false);

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-mist text-teal-deep">
          <Building2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink">Onboard a partner</h2>
          <p className="mt-0.5 text-2xs leading-relaxed text-muted">
            Creates an isolated workspace with its own catalogue, roster and bookings, plus a partner
            code and access key to hand over.
          </p>
        </div>
      </div>

      {state.status === 'ok' && state.partnerCode ? (
        <div className="mt-4 rounded-xl border border-teal/25 bg-teal-mist p-4">
          <p className="text-xs font-semibold text-teal-deep">{state.message}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-teal-deep/70">Partner code</dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold text-ink">{state.partnerCode}</dd>
            </div>
            <div>
              <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-teal-deep/70">Access key</dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold text-ink">{state.accessKey}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard
                .writeText(`Partner code: ${state.partnerCode}\nAccess key: ${state.accessKey}`)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => undefined);
            }}
            className="btn-outline btn-sm mt-3"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy credentials'}
          </button>
          <p className="mt-2 text-[0.625rem] leading-relaxed text-teal-deep/70">
            This key is shown once in the UI. Rotate it through your account manager if it is shared
            beyond the partner&apos;s HR team.
          </p>
        </div>
      ) : null}

      <form action={formAction} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={fieldLabel}>Partner / vendor name</span>
          <input name="name" required className="field" placeholder="Meridian Tech Pvt Ltd" />
          {state.fields?.name ? <span className="mt-1 block text-2xs text-clay">{state.fields.name}</span> : null}
        </label>

        <label className="block">
          <span className={fieldLabel}>City</span>
          <input name="city" required className="field" placeholder="Bengaluru" />
          {state.fields?.city ? <span className="mt-1 block text-2xs text-clay">{state.fields.city}</span> : null}
        </label>
        <label className="block">
          <span className={fieldLabel}>Workforce size</span>
          <input name="headcount" required inputMode="numeric" className="field" placeholder="412" />
          {state.fields?.headcount ? <span className="mt-1 block text-2xs text-clay">{state.fields.headcount}</span> : null}
        </label>

        <label className="block">
          <span className={fieldLabel}>HR contact</span>
          <input name="contactName" required className="field" placeholder="Ananya Rao" />
          {state.fields?.contactName ? <span className="mt-1 block text-2xs text-clay">{state.fields.contactName}</span> : null}
        </label>
        <label className="block">
          <span className={fieldLabel}>Contact phone</span>
          <input name="contactPhone" required inputMode="tel" className="field" placeholder="98101 24477" />
          {state.fields?.contactPhone ? <span className="mt-1 block text-2xs text-clay">{state.fields.contactPhone}</span> : null}
        </label>
        <label className="block sm:col-span-2">
          <span className={fieldLabel}>Contact email</span>
          <input name="contactEmail" required type="email" className="field" placeholder="hr@company.com" />
          {state.fields?.contactEmail ? <span className="mt-1 block text-2xs text-clay">{state.fields.contactEmail}</span> : null}
        </label>

        <label className="block">
          <span className={fieldLabel}>GSTIN (optional)</span>
          <input name="gstin" className="field uppercase" placeholder="29AABCM1234F1Z5" />
          {state.fields?.gstin ? <span className="mt-1 block text-2xs text-clay">{state.fields.gstin}</span> : null}
        </label>
        <label className="block">
          <span className={fieldLabel}>Account manager</span>
          <input name="accountManager" required className="field" placeholder="Ritika Menon" />
          {state.fields?.accountManager ? <span className="mt-1 block text-2xs text-clay">{state.fields.accountManager}</span> : null}
        </label>

        <label className="block">
          <span className={fieldLabel}>Billing cycle</span>
          <select name="billingCycle" className="field" defaultValue="Monthly">
            {['Monthly', 'Quarterly', 'Per batch'].map((cycle) => (
              <option key={cycle}>{cycle}</option>
            ))}
          </select>
        </label>

        <fieldset className="block sm:col-span-2">
          <legend className={fieldLabel}>Collection modes offered</legend>
          <div className="flex flex-wrap gap-2">
            {COLLECTION_MODES.map((mode) => (
              <label
                key={mode}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-2xs font-medium text-ink/70 transition-colors hover:border-teal/40',
                )}
              >
                <input type="checkbox" name="modes" value={mode} defaultChecked className="h-3.5 w-3.5 accent-[#0F7A6C]" />
                {mode}
              </label>
            ))}
          </div>
        </fieldset>

        {state.status === 'error' ? (
          <p role="alert" className="sm:col-span-2 rounded-lg border border-clay/20 bg-clay/10 px-3 py-2 text-xs text-clay">
            {state.message}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="btn-primary btn-sm sm:col-span-2">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          {pending ? 'Creating workspace…' : 'Create partner workspace'}
        </button>
      </form>
    </section>
  );
}
