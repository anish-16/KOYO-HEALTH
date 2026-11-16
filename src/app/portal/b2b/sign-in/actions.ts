'use server';

import { redirect } from 'next/navigation';
import { getPortalActor, setPortalSession, verifyOpsKey } from '@/lib/server/portal-auth';
import { verifyPartnerLogin } from '@/lib/server/portal-store';

export type SignInState = { error?: string };

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const existing = await getPortalActor();
  if (existing) redirect('/portal/b2b');

  const role = String(formData.get('role') ?? 'partner');
  const key = String(formData.get('key') ?? '');

  if (role === 'ops') {
    if (!verifyOpsKey(key)) return { error: 'That operations access key is not valid.' };
    await setPortalSession({ role: 'ops', name: 'KOYO Operations' });
    redirect('/portal/b2b');
  }

  const code = String(formData.get('code') ?? '');
  if (!code.trim() || !key.trim()) {
    return { error: 'Enter your partner code and access key.' };
  }

  const partner = await verifyPartnerLogin(code, key);
  if (!partner) {
    return { error: 'Partner code and access key do not match an active workspace.' };
  }

  await setPortalSession({
    role: 'partner',
    partnerId: partner.id,
    partnerName: partner.name,
    name: partner.contactName,
  });
  redirect('/portal/b2b');
}
