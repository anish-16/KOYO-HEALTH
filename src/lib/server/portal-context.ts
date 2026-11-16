import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPortalActor, type PortalActor } from './portal-auth';
import { getPartner, listPartners } from './portal-store';
import type { Partner } from '@/data/portal';

const ACTIVE_PARTNER_COOKIE = 'koyo_partner';

/**
 * Resolves the workspace a portal page should render.
 *
 * Ops can switch between partners (the switcher stores the choice in a plain
 * cookie, since it is UI state, not authorisation). A partner is always pinned
 * to its own id from the signed session, whatever the cookie says.
 */
export async function requirePortalContext(): Promise<{
  actor: PortalActor;
  partner: Partner;
  partners: Partner[];
}> {
  const actor = await getPortalActor();
  if (!actor) redirect('/portal/b2b/sign-in');

  if (actor.role === 'partner') {
    const partner = await getPartner(actor.partnerId);
    if (!partner) redirect('/portal/b2b/sign-in');
    return { actor, partner, partners: [] };
  }

  const partners = await listPartners();
  if (partners.length === 0) redirect('/portal/b2b/sign-in');

  const store = await cookies();
  const preferred = store.get(ACTIVE_PARTNER_COOKIE)?.value;
  const partner = partners.find((entry) => entry.id === preferred) ?? partners[0];

  return { actor, partner, partners };
}

export async function activePartnerId(): Promise<string | null> {
  const actor = await getPortalActor();
  if (!actor) return null;
  if (actor.role === 'partner') return actor.partnerId;
  const store = await cookies();
  return store.get(ACTIVE_PARTNER_COOKIE)?.value ?? null;
}
