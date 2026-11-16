import Link from 'next/link';
import { LogOut, Phone, ShieldCheck } from 'lucide-react';
import { requirePortalContext } from '@/lib/server/portal-context';
import { signOutAction } from '../actions';
import { PortalNav } from '@/components/portal/PortalNav';
import { PartnerSwitcher } from '@/components/portal/PartnerSwitcher';
import { cn, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PortalWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { actor, partner, partners } = await requirePortalContext();

  return (
    <div className="min-h-[calc(100vh-11rem)] bg-sand/40">
      <div className="border-b border-line bg-paper">
        <div className="shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/portal" className="flex items-baseline gap-2">
              <span className="font-display text-xl tracking-tight text-ink">KOYO</span>
              <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-teal-deep">B2B portal</span>
            </Link>
            <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
            <p className="hidden truncate text-xs text-muted sm:block">{partner.name}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {actor.role === 'ops' ? (
              <PartnerSwitcher partners={partners} activeId={partner.id} />
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[0.6875rem] font-medium text-ink/70">
                <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Partner workspace
              </span>
            )}
            <span className="rounded-full bg-forest px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-gold">
              {actor.role === 'ops' ? 'KOYO Ops' : 'Partner'}
            </span>
            <form action={signOutAction}>
              <button type="submit" className="btn-ghost btn-sm">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="shell py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          <aside className="min-w-0 space-y-4">
            <div className="card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="eyebrow">Workspace</p>
                  <p className="mt-1 truncate text-base font-semibold text-ink">{partner.name}</p>
                  <p className="mt-0.5 text-2xs text-muted">
                    {partner.city}
                    {partner.state ? `, ${partner.state}` : ''} · since{' '}
                    {formatDate(partner.since, { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full border px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.1em]',
                    partner.status === 'Active'
                      ? 'border-teal/25 bg-teal-mist text-teal-deep'
                      : 'border-gold/30 bg-gold-soft text-gold-deep',
                  )}
                >
                  {partner.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-2xs">
                <div>
                  <dt className="uppercase tracking-[0.1em] text-ink/40">Partner code</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{partner.code}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.1em] text-ink/40">Workforce</dt>
                  <dd className="tabular mt-0.5 font-semibold text-ink">{partner.headcount.toLocaleString('en-IN')}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="uppercase tracking-[0.1em] text-ink/40">Account manager</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{partner.accountManager}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {partner.modes.map((mode) => (
                  <span
                    key={mode}
                    className="rounded-md bg-teal-mist px-1.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-teal-deep"
                  >
                    {mode}
                  </span>
                ))}
              </div>

              <div className="mt-4 hidden border-t border-line pt-4 lg:block">
                <PortalNav role={actor.role} />
              </div>
            </div>

            <div className="card p-5">
              <p className="eyebrow">Partner support</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Batch planning, rate changes and report escalations go through your named account manager.
              </p>
              <a
                href="tel:+918800580075"
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-deep hover:underline"
              >
                <Phone className="h-3.5 w-3.5" /> +91 88005 80075
              </a>
            </div>

            <div className="hidden rounded-2xl bg-ink p-5 text-paper lg:block">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <p className="mt-3 text-sm font-semibold">Reports go to the employee</p>
              <p className="mt-1.5 text-xs leading-relaxed text-paper/60">
                The employer sees booking status and fit-to-work outcomes. Clinical reports open only on
                the employee&apos;s private link.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 lg:hidden">
              <PortalNav role={actor.role} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
