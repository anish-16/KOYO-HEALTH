import { requirePortalContext } from '@/lib/server/portal-context';
import { listBookings, listEmployees } from '@/lib/server/portal-store';
import { RosterWorkbench, type RosterRow } from '@/components/portal/RosterWorkbench';

export const dynamic = 'force-dynamic';

export default async function PortalEmployeesPage() {
  const { partner } = await requirePortalContext();
  const [employees, bookings] = await Promise.all([
    listEmployees(partner.id),
    listBookings(partner.id),
  ]);

  const rows: RosterRow[] = employees.map((employee) => {
    const own = bookings.filter(
      (booking) => booking.employeeId === employee.id && booking.status !== 'Cancelled',
    );
    const lastBooking = own
      .map((booking) => booking.date)
      .sort((a, b) => b.localeCompare(a))[0];

    return { ...employee, bookingCount: own.length, lastBooking };
  });

  return <RosterWorkbench partnerId={partner.id} rows={rows} headcount={partner.headcount} />;
}
