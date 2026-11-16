'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, Building2, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signInAction, type SignInState } from './actions';

type DemoPartner = { name: string; code: string; accessKey: string };

export function SignInForm({ demoPartners, opsKey }: { demoPartners: DemoPartner[]; opsKey: string }) {
  const [role, setRole] = useState<'partner' | 'ops'>('partner');
  const [code, setCode] = useState('');
  const [key, setKey] = useState('');
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signInAction, {});

  return (
    <div>
      <div role="tablist" aria-label="Portal type" className="flex rounded-full border border-line bg-sand/60 p-1">
        {(
          [
            { value: 'partner', label: 'Partner', icon: Building2 },
            { value: 'ops', label: 'KOYO operations', icon: ShieldCheck },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={role === tab.value}
            onClick={() => setRole(tab.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
              role === tab.value ? 'bg-white text-ink shadow-soft' : 'text-ink/55 hover:text-ink',
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-5 space-y-3">
        <input type="hidden" name="role" value={role} />

        {role === 'partner' ? (
          <label className="block">
            <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">
              Partner code
            </span>
            <input
              name="code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="organization"
              placeholder="MRC-4417"
              className="field uppercase placeholder:normal-case"
            />
          </label>
        ) : (
          <p className="rounded-xl bg-teal-mist px-3.5 py-2.5 text-2xs leading-relaxed text-teal-deep">
            Operations access covers every partner workspace, catalogue pricing and report release.
          </p>
        )}

        <label className="block">
          <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">
            Access key
          </span>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input
              name="key"
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              autoComplete="current-password"
              placeholder="Issued by your account manager"
              className="field pl-10"
            />
          </div>
        </label>

        {state.error ? (
          <p role="alert" className="rounded-lg border border-clay/20 bg-clay/10 px-3 py-2 text-xs font-medium text-clay">
            {state.error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {pending ? 'Checking access…' : role === 'ops' ? 'Enter operations workspace' : 'Open partner workspace'}
        </button>
      </form>

      {demoPartners.length > 0 || opsKey ? (
        <div className="mt-5 rounded-xl border border-dashed border-line bg-sand/50 p-3">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink/45">
            Demo access · local build
          </p>
          <div className="mt-2 space-y-1">
            {demoPartners.map((partner) => (
              <button
                key={partner.code}
                type="button"
                onClick={() => {
                  setRole('partner');
                  setCode(partner.code);
                  setKey(partner.accessKey);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[0.6875rem] transition-colors hover:bg-white"
              >
                <span className="truncate font-medium text-ink/75">{partner.name}</span>
                <span className="shrink-0 font-mono text-[0.625rem] text-ink/45">
                  {partner.code} · {partner.accessKey}
                </span>
              </button>
            ))}
            {opsKey ? (
              <button
                type="button"
                onClick={() => {
                  setRole('ops');
                  setKey(opsKey);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[0.6875rem] transition-colors hover:bg-white"
              >
                <span className="font-medium text-ink/75">KOYO operations</span>
                <span className="shrink-0 font-mono text-[0.625rem] text-ink/45">{opsKey}</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
