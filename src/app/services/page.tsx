import type { Metadata } from 'next';
import { services, catalogueStats } from '@/data/services';
import { PageHeader } from '@/components/site/PageHeader';
import { ServicesBrowser, type ServiceSummary } from '@/components/services/ServicesBrowser';
import { CTASection } from '@/components/site/CTASection';
import { Badge } from '@/components/ui/Primitives';
import { formatINR } from '@/lib/utils';
import { ShieldCheck, Clock, Microscope } from 'lucide-react';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const servicesTitle = metaTitle('Diagnostic services — lab tests & imaging');
const servicesDescription = metaDescription(
  'Browse 28 diagnostic categories: CT, MRI, ultrasound, X-ray, PET-CT, pathology, cardiology and more. Transparent prices, accredited centres, 12-hour reports.',
);

export const metadata: Metadata = {
  title: servicesTitle,
  description: servicesDescription,
  alternates: { canonical: '/services' },
  ...socialCards({
    title: 'Diagnostic services — 28 categories, 120+ tests',
    description: servicesDescription,
    path: '/services',
  }),
};

// The catalogue is fully static: filters and search run in the browser, so the
// page is served from the CDN instead of being re-rendered per request.
export default function ServicesPage() {
  const items: ServiceSummary[] = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    description: s.description,
    modality: s.modality,
    icon: s.icon,
    startingPrice: s.startingPrice,
    mrp: s.mrp,
    tests: s.tests.length,
    reportTime: s.reportTime,
    duration: s.duration,
    isPopular: s.isPopular,
    highlights: s.highlights,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Diagnostic services at KOYO Health',
    description: 'A catalogue of radiology, pathology, cardiology and specialist diagnostic services.',
    url: 'https://koyohealth.in/services',
    hasPart: services.slice(0, 12).map((s) => ({
      '@type': 'MedicalTest',
      name: s.name,
      description: s.description,
      url: `https://koyohealth.in/services/${s.slug}`,
      offers: { '@type': 'Offer', price: s.startingPrice, priceCurrency: 'INR' },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHeader
        eyebrow="Test categories"
        title="Every test, with the price and the turnaround in plain sight."
        description="Explore our full diagnostic catalogue. Each category page lists individual tests, preparation instructions, and what the report will tell you — written by the clinicians who read it."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Test categories' }]}
        aside={
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {[
              { icon: Microscope, label: `${catalogueStats.tests} individual tests`, detail: 'across 28 categories' },
              { icon: ShieldCheck, label: 'NABL & NABH', detail: 'all partner centres' },
              { icon: Clock, label: '12-hour reports', detail: `from ${formatINR(catalogueStats.minPrice)}` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-white px-4 py-3">
                <stat.icon className="h-4 w-4 text-teal" />
                <p className="mt-2 text-[0.8125rem] font-semibold">{stat.label}</p>
                <p className="text-[0.625rem] text-muted">{stat.detail}</p>
              </div>
            ))}
          </div>
        }
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="teal">Free home collection over ₹499</Badge>
          <Badge>Same-day imaging slots</Badge>
          <Badge>Free cancellation</Badge>
        </div>
      </PageHeader>

      <section className="shell py-10 lg:py-14">
        <ServicesBrowser items={items} />
      </section>

      <CTASection
        eyebrow="Need help choosing?"
        title="A clinician can narrow 130 tests down to the three you actually need."
        description="Free guidance call, no obligation. We will tell you when a test is unnecessary — that is part of the service."
        primaryHref="/contact"
        primaryLabel="Talk to a clinician"
      />
    </>
  );
}
