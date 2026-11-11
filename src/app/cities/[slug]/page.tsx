import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, ArrowRight, ShieldCheck, Home as HomeIcon } from 'lucide-react';
import { cities, getCity, topCities } from '@/data/cities';
import { centers } from '@/data/company';
import { services, popularTests } from '@/data/services';
import { packages } from '@/data/packages';
import { Breadcrumbs, Badge, Stars } from '@/components/ui/Primitives';
import { PageHeader } from '@/components/site/PageHeader';
import { CTASection } from '@/components/site/CTASection';
import { formatINR } from '@/lib/utils';

import { metaDescription, metaTitle, socialCards, SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: 'City not found' };
  const title = metaTitle(`Diagnostics & home collection in ${city.name}`);
  const description = metaDescription(
    `Book MRI, CT, blood tests and health packages in ${city.name}: ${city.centers} accredited centres, free home collection, 12-hour reports.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/cities/${city.slug}` },
    ...socialCards({ title: `Diagnostics in ${city.name}`, description, path: `/cities/${city.slug}` }),
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const localCenters = centers.filter((c) => c.city === city.name);
  const displayCenters = localCenters.length
    ? localCenters
    : centers.slice(0, Math.min(3, city.centers)).map((c) => ({
        ...c,
        name: c.name.replace(/—.*/, `— ${city.localities[0] ?? city.name}`),
        city: city.name,
        distance: `${(1 + (c.id.charCodeAt(1) % 5) * 0.7).toFixed(1)} km`,
      }));

  const cityPackages = packages.filter((p) => p.isPopular).slice(0, 4);
  const cityTests = popularTests.slice(0, 6);
  const nearby = topCities.filter((c) => c.slug !== city.slug).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: `KOYO Health — ${city.name}`,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'City', name: city.name },
    url: `${SITE_URL}/cities/${city.slug}`,
    telephone: '+91-88005-80075',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      postalCode: city.pincode,
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow={`${city.state} · since ${city.launchYear}`}
        title={`Diagnostics in ${city.name}, without the queue.`}
        description={`${city.centers} accredited centres, ${city.tests} tests and free home collection across ${city.localities.slice(0, 4).join(', ')}. Reports are released by a consultant, not just a machine.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cities', href: '/cities' }, { label: city.name }]}
        aside={
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="eyebrow">Next available slot</p>
            <p className="display mt-2 text-2xl">Today, 6:30 pm</p>
            <p className="mt-1 text-xs text-muted">Home collection in {city.localities[0] ?? city.name} · phlebotomist within 90 min</p>
            <Link href="/book" className="btn-teal btn-sm mt-4 w-full">Book in {city.name}</Link>
          </div>
        }
      />

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Centres', city.centers, 'NABL / NABH audited'],
            ['Tests available', city.tests, 'Pathology & imaging'],
            ['Home collection', '90 min', 'Free with Gold'],
            ['Report time', '12 hrs', 'Pathology median'],
          ].map(([label, value, note]) => (
            <div key={String(label)} className="card p-5">
              <p className="display text-2xl">{value}</p>
              <p className="text-xs font-medium text-ink/70">{label}</p>
              <p className="mt-0.5 text-2xs text-muted">{note}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display text-2xl">Centres in {city.name}</h2>
            <ul className="mt-4 space-y-3">
              {displayCenters.map((center) => (
                <li key={center.id} className="card p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{center.name}</h3>
                      <p className="mt-1 inline-flex items-start gap-1.5 text-xs text-muted">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" /> {center.address}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {center.accreditations.map((a) => <Badge key={a} tone="teal">{a}</Badge>)}
                        {center.modalities.slice(0, 4).map((m) => <Badge key={m}>{m}</Badge>)}
                      </div>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <Stars rating={center.rating} /> {center.rating}
                      </span>
                      <p className="mt-0.5 text-2xs text-muted">{center.reviews.toLocaleString('en-IN')} reviews</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-2xs text-muted">
                        <Clock className="h-3 w-3" /> {center.timings}
                      </p>
                      {center.homeCollection && (
                        <p className="mt-1 inline-flex items-center gap-1 text-2xs text-teal-deep">
                          <HomeIcon className="h-3 w-3" /> Home collection
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                    <Link href="/book" className="btn-primary btn-sm">Book here</Link>
                    <button type="button" className="btn-outline btn-sm">Directions</button>
                    <span className="ml-auto self-center text-2xs text-muted">{center.distance} from city centre</span>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="display mt-10 text-2xl">Most booked tests in {city.name}</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
              <div className="overflow-x-auto">
              <table className="table-koyo min-w-[440px]">
                <thead>
                  <tr><th>Test</th><th>Modality</th><th>Report</th><th className="text-right">Price</th></tr>
                </thead>
                <tbody>
                  {cityTests.map((test) => (
                    <tr key={test.id}>
                      <td>
                        <Link href={`/services/${test.serviceSlug}`} className="font-medium text-ink hover:text-teal-deep">
                          {test.name}
                        </Link>
                      </td>
                      <td className="text-xs text-muted">{test.modality}</td>
                      <td className="text-xs text-muted">{test.reportHours} hrs</td>
                      <td className="text-right text-xs font-semibold">{formatINR(test.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="card p-5">
              <h2 className="text-sm font-semibold">Areas we cover</h2>
              <p className="mt-1 text-2xs text-muted">Home collection pincodes in {city.name} ({city.pincode} and nearby).</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {city.localities.map((l) => (
                  <span key={l} className="rounded-full border border-line px-2.5 py-1 text-2xs text-ink/65">{l}</span>
                ))}
              </div>
            </div>

            <div className="card mt-4 p-5">
              <h2 className="text-sm font-semibold">Popular packages</h2>
              <ul className="mt-3 space-y-3">
                {cityPackages.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/packages/${p.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border border-line p-3 transition-colors hover:border-teal/40">
                      <div>
                        <p className="text-xs font-semibold text-ink">{p.name}</p>
                        <p className="text-2xs text-muted">{p.testCount} parameters · {p.reportTime}</p>
                      </div>
                      <span className="text-xs font-semibold text-teal-deep">{formatINR(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/packages" className="link-underline mt-3 inline-flex text-xs">All packages <ArrowRight className="h-3 w-3" /></Link>
            </div>

            <div className="mt-4 rounded-2xl bg-ink p-5 text-paper">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <p className="mt-2 text-sm font-semibold">Same standard, every city</p>
              <p className="mt-1 text-xs leading-relaxed text-paper/60">
                QC samples are couriered to our Noida reference lab every week. Any centre outside
                tolerance is suspended pending re-audit.
              </p>
            </div>

            <div className="card mt-4 p-5">
              <h2 className="text-sm font-semibold">Also in {city.state}</h2>
              <ul className="mt-3 space-y-2">
                {nearby.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/cities/${c.slug}`} className="flex items-center justify-between text-xs text-ink/75 hover:text-teal-deep">
                      {c.name} <span className="text-2xs text-muted">{c.centers} centres</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <CTASection
        eyebrow={city.name}
        title={`Book a test in ${city.name} today.`}
        description={`Free cancellation up to 4 hours before your slot. Home collection across ${city.localities.slice(0, 3).join(', ')}.`}
        primaryLabel={`Book in ${city.name}`}
      />
    </>
  );
}
