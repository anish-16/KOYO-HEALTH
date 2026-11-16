import {
  FlaskConical, Package, PauseCircle, PlayCircle, ScanLine,
} from 'lucide-react';
import { requirePortalContext } from '@/lib/server/portal-context';
import { listCatalogue } from '@/lib/server/portal-store';
import { toggleCatalogueItemAction } from '../../actions';
import { CatalogueBuilder, type CatalogueOption } from '@/components/portal/CatalogueBuilder';
import { services } from '@/data/services';
import { packages } from '@/data/packages';
import { formatINR } from '@/lib/utils';
import type { CatalogueKind } from '@/data/portal';

export const dynamic = 'force-dynamic';

export default async function PortalCataloguePage() {
  const { actor, partner } = await requirePortalContext();
  const items = await listCatalogue(partner.id);
  const canEdit = actor.role === 'ops';

  const options: CatalogueOption[] = [
    ...services.flatMap((service) =>
      service.tests.map((test) => ({
        value: `test:${service.slug}/${test.slug}`,
        label: test.name,
        group: service.name,
        price: test.price,
        kind: (service.modality === 'Pathology' ? 'Pathology' : 'Radiology & imaging') as CatalogueKind,
      })),
    ),
    ...packages.map((pkg) => ({
      value: `package/${pkg.slug}`,
      label: pkg.name,
      group: 'Health packages',
      price: pkg.price,
      kind: 'Health package' as CatalogueKind,
    })),
  ];

  const active = items.filter((item) => item.active);
  const kinds = Array.from(new Set(active.map((item) => item.kind)));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Booking catalogue</p>
          <h1 className="display mt-1.5 text-[2rem] leading-tight sm:text-[2.4rem]">
            {partner.name}&apos;s rate card
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted">
            Pathology, radiology and custom health packages, each with the collection modes it supports.
            Employees can only be booked against active items.
          </p>
        </div>
        <div className="flex gap-2 text-2xs">
          <span className="rounded-lg border border-line bg-white px-3 py-2">
            <span className="tabular block text-base font-semibold text-ink">{active.length}</span>
            active items
          </span>
          <span className="rounded-lg border border-line bg-white px-3 py-2">
            <span className="tabular block text-base font-semibold text-ink">{kinds.length}</span>
            categories
          </span>
        </div>
      </div>

      {canEdit ? (
        <CatalogueBuilder partnerId={partner.id} options={options} />
      ) : (
        <p className="rounded-xl border border-line bg-teal-mist px-4 py-3 text-xs leading-relaxed text-teal-deep">
          Rates on this page are your negotiated contract. Ask your account manager — {partner.accountManager} — for
          a new test or a rate review.
        </p>
      )}

      <section className="card overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Catalogue items</h2>
          <p className="mt-0.5 text-2xs text-muted">
            Rate is what this partner pays per employee, ex-tax. Paused items stay on past bookings.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-ink">No catalogue yet</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">
              Add the tests this partner has contracted. Bookings cannot be raised until at least one
              item is active.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-koyo min-w-[840px]">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>List</th>
                  <th>Partner rate</th>
                  <th>Collection modes</th>
                  <th>TAT</th>
                  <th>Status</th>
                  {canEdit ? <th aria-label="Actions" /> : null}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={item.active ? undefined : 'opacity-55'}>
                    <td>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-teal">
                          {item.kind === 'Health package' || item.kind === 'Custom package' ? (
                            <Package className="h-3.5 w-3.5" />
                          ) : item.kind === 'Pathology' ? (
                            <FlaskConical className="h-3.5 w-3.5" />
                          ) : (
                            <ScanLine className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[0.8125rem] font-medium text-ink">{item.name}</p>
                          {item.includes?.length ? (
                            <p className="mt-0.5 max-w-[22rem] text-2xs leading-relaxed text-muted">
                              {item.includes.join(' · ')}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-[0.75rem] text-ink/65">{item.kind}</td>
                    <td className="tabular whitespace-nowrap text-2xs text-muted">{formatINR(item.listPrice)}</td>
                    <td className="tabular whitespace-nowrap text-[0.8125rem] font-semibold text-ink">
                      {formatINR(item.rate)}
                    </td>
                    <td>
                      <div className="flex max-w-[13rem] flex-wrap gap-1">
                        {item.modes.map((mode) => (
                          <span key={mode} className="rounded bg-sand px-1.5 py-0.5 text-[0.5625rem] text-ink/60">
                            {mode}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="tabular whitespace-nowrap text-2xs text-ink/60">{item.tatHours} h</td>
                    <td>
                      <span
                        className={
                          item.active
                            ? 'rounded-full border border-teal/25 bg-teal-mist px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-teal-deep'
                            : 'rounded-full border border-line bg-sand px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ink/45'
                        }
                      >
                        {item.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    {canEdit ? (
                      <td className="text-right">
                        <form action={toggleCatalogueItemAction}>
                          <input type="hidden" name="partnerId" value={partner.id} />
                          <input type="hidden" name="itemId" value={item.id} />
                          <input type="hidden" name="active" value={String(!item.active)} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 text-2xs font-semibold text-ink/55 hover:text-teal-deep"
                          >
                            {item.active ? (
                              <><PauseCircle className="h-3.5 w-3.5" /> Pause</>
                            ) : (
                              <><PlayCircle className="h-3.5 w-3.5" /> Activate</>
                            )}
                          </button>
                        </form>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
