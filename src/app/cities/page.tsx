import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { CitiesBrowser } from '@/components/cities/CitiesBrowser';
import { CTASection } from '@/components/site/CTASection';
import { cities, cityStats } from '@/data/cities';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const citiesTitle = metaTitle('Diagnostic centres in 48 Indian cities');
const citiesDescription = metaDescription(
  'Find a KOYO Health accredited diagnostic centre or book free home sample collection across 48 cities, including Delhi NCR, Mumbai, Bengaluru, Hyderabad and Pune.',
);

export const metadata: Metadata = {
  title: citiesTitle,
  description: citiesDescription,
  alternates: { canonical: '/cities' },
  ...socialCards({ title: citiesTitle, description: citiesDescription, path: '/cities' }),
};

export default function CitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Where we are"
        title="268 accredited centres. 48 cities. One standard."
        description="Every KOYO partner is audited twice a year against the same protocol, whether it is in Saket or Siliguri. If a centre cannot meet the standard, it leaves the network."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cities' }]}
        aside={
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Cities', cityStats.count],
              ['Centres', cityStats.centers],
              ['Tests / city', cityStats.tests],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-line bg-white p-3">
                <dd className="display text-2xl text-ink">{value}</dd>
                <dt className="text-2xs uppercase tracking-[0.1em] text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        }
      />
      <section className="shell py-10 lg:py-14">
        <CitiesBrowser cities={cities} />
      </section>
      <CTASection
        eyebrow="Not on the list?"
        title="We may still be able to reach you."
        description="Home collection covers 180+ pincodes. Tell us where you are and we will confirm within an hour."
        primaryLabel="Check my pincode"
      />
    </>
  );
}
