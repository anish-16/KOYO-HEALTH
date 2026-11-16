'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Building2, ChevronDown, Loader2 } from 'lucide-react';
import type { Partner } from '@/data/portal';

/**
 * Ops can work across every partner; the selection is UI state in a plain
 * cookie, never authorisation. A partner session ignores this entirely and is
 * pinned to its own id in the signed token.
 */
export function PartnerSwitcher({ partners, activeId }: { partners: Partner[]; activeId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(id: string) {
    document.cookie = `koyo_partner=${id}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Active partner workspace</span>
      <Building2 className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-teal-deep" />
      <select
        value={activeId}
        onChange={(event) => switchTo(event.target.value)}
        className="h-9 max-w-[13rem] appearance-none truncate rounded-full border border-line bg-white pl-8 pr-8 text-[0.8125rem] font-medium text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15"
      >
        {partners.map((partner) => (
          <option key={partner.id} value={partner.id}>
            {partner.name}
          </option>
        ))}
      </select>
      {pending ? (
        <Loader2 className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 animate-spin text-ink/40" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-ink/40" />
      )}
    </label>
  );
}
