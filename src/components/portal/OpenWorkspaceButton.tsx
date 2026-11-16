'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export function OpenWorkspaceButton({ partnerId }: { partnerId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `koyo_partner=${partnerId}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
        startTransition(() => router.push('/portal/b2b'));
      }}
      className="inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep hover:underline"
    >
      {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
      Open
    </button>
  );
}
