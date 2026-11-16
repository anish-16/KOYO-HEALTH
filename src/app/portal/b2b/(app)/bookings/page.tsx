import { requirePortalContext } from '@/lib/server/portal-context';
import { listBookings, listCatalogue, listEmployees } from '@/lib/server/portal-store';
import { BookingWorkspace } from '@/components/portal/BookingWorkspace';

export const dynamic = 'force-dynamic';

function isoDay(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export default async function PortalBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ employee?: string }>;
}) {
  const { partner } = await requirePortalContext();
  const [employees, catalogue, bookings, params] = await Promise.all([
    listEmployees(partner.id),
    listCatalogue(partner.id),
    listBookings(partner.id),
    searchParams,
  ]);

  const defaultEmployee =
    params.employee && employees.some((employee) => employee.id === params.employee)
      ? params.employee
      : undefined;

  return (
    <BookingWorkspace
      partnerId={partner.id}
      employees={employees}
      catalogue={catalogue.filter((item) => item.active)}
      bookings={bookings}
      defaultEmployee={defaultEmployee}
      defaultDate={isoDay(2)}
      minDate={isoDay(0)}
    />
  );
}
