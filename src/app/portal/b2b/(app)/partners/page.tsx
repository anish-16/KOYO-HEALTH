import { redirect } from 'next/navigation';
import { requirePortalContext } from '@/lib/server/portal-context';
import { listBookings, listCatalogue, listEmployees, listPartners } from '@/lib/server/portal-store';
import { AddPartnerForm } from '@/components/portal/AddPartnerForm';
import { OpenWorkspaceButton } from '@/components/portal/OpenWorkspaceButton';
import { formatDate } from '@/lib/utils';
import { isOpenStatus } from '@/data/portal';

export const dynamic = 'force-dynamic';

export default async function PortalPartnersPage() {
  const { actor } = await requirePortalContext();
  if (actor.role !== 'ops') redirect('/portal/b2b');

  const partners = await listPartners();
  const bookings = await listBookings();
  const rows = await Promise.all(
    partners.map(async (partner) => {
      const [employees, catalogue] = await Promise.all([
        listEmployees(partner.id),
        listCatalogue(partner.id),
      ]);
      const partnerBookings = bookings.filter((booking) => booking.partnerId === partner.id);
      return {
        partner,
        roster: employees.length,
        catalogue: catalogue.filter((item) => item.active).length,
        bookings: partnerBookings.length,
        open: partnerBookings.filter((booking) => isOpenStatus(booking.status)).length,
      };
    }),
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">KOYO operations</p>
        <h1 className="display mt-1.5 text-[2rem] leading-tight sm:text-[2.4rem]">Partner portfolio</h1>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted">
          Every corporate, vendor and clinic workspace. A partner only ever sees its own row of this
          list — the roster, rates and bookings stay scoped to the signed-in workspace.
        </p>
      </div>

      <section className="card overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">{partners.length} partner workspaces</h2>
          <p className="mt-0.5 text-2xs text-muted">Open a workspace from the last column</p>
        </div>
        <div className="overflow-x-auto">
          <table className="table-koyo min-w-[760px]">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Roster</th>
                <th>Catalogue</th>
                <th>Bookings</th>
                <th>Since</th>
                <th aria-label="Open workspace" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.partner.id}>
                  <td>
                    <p className="text-[0.8125rem] font-medium text-ink">{row.partner.name}</p>
                    <p className="text-2xs text-muted">
                      {row.partner.code} · {row.partner.city}
                    </p>
                  </td>
                  <td>
                    <p className="text-[0.8125rem] text-ink/75">{row.partner.contactName}</p>
                    <p className="text-2xs text-muted">{row.partner.accountManager} · KAM</p>
                  </td>
                  <td>
                    <span className="rounded-full border border-line bg-sand/60 px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-ink/60">
                      {row.partner.status}
                    </span>
                  </td>
                  <td className="tabular text-[0.8125rem]">
                    {row.roster}
                    <span className="text-2xs text-muted"> / {row.partner.headcount}</span>
                  </td>
                  <td className="tabular text-[0.8125rem]">{row.catalogue}</td>
                  <td className="tabular text-[0.8125rem]">
                    {row.bookings}
                    <span className="text-2xs text-muted"> · {row.open} open</span>
                  </td>
                  <td className="whitespace-nowrap text-2xs text-muted">{formatDate(row.partner.since, { year: undefined })}</td>
                  <td className="text-right">
                    <OpenWorkspaceButton partnerId={row.partner.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AddPartnerForm />
    </div>
  );
}
