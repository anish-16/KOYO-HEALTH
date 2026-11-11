import type { Metadata } from 'next';
import { getSession } from '@/lib/server/session';
import { centers } from '@/data/company';
import { popularTests } from '@/data/services';
import { PageHeader } from '@/components/site/PageHeader';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { ShieldCheck, BadgeCheck, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book a test or scan',
  description: 'Book a diagnostic test or scan at KOYO Health. Choose home collection or a centre visit, pick a slot, and pay online or at the centre.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const user = await getSession();

  const bookableCenters = centers.slice(0, 5).map((c) => ({
    id: c.id, name: c.name, city: c.city, address: c.address,
  }));

  const suggestions = popularTests.slice(0, 6).map((t) => ({
    id: t.id,
    serviceSlug: t.serviceSlug,
    serviceName: t.serviceName,
    testName: t.name,
    price: t.price,
    mrp: t.mrp,
    fastingHours: t.fastingHours,
    homeCollection: t.homeCollection,
    sample: t.sample,
  }));

  return (
    <>
      <PageHeader
        compact
        eyebrow="Booking"
        title="Two minutes now. One appointment. No follow-up calls."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Book a test' }]}
        aside={
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {[
              { icon: ShieldCheck, label: 'NABL & NABH' },
              { icon: BadgeCheck, label: 'Free cancellation' },
              { icon: Clock, label: 'Reports in 12 hrs' },
            ].map((i) => (
              <span key={i.label} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[0.625rem] text-ink/60">
                <i.icon className="h-3 w-3 text-teal" /> {i.label}
              </span>
            ))}
          </div>
        }
      />
      <section className="shell py-8 lg:py-12">
        <BookingFlow user={user} centers={bookableCenters} suggestions={suggestions} />
      </section>
    </>
  );
}
