import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, Home, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { CTASection } from '@/components/site/CTASection';
import { Badge } from '@/components/ui/Primitives';
import { TestsBrowser } from '@/components/tests/TestsBrowser';
import { disciplines, getDiscipline, formatReport } from '@/data/tests';
import { formatINR } from '@/lib/utils';
import { metaDescription, metaTitle, socialCards, SITE_URL as SITE } from '@/lib/seo';

export function generateStaticParams() {
  return disciplines.map((discipline) => ({ discipline: discipline.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ discipline: string }>;
}): Promise<Metadata> {
  const { discipline: slug } = await params;
  const discipline = getDiscipline(slug);
  if (!discipline) return { title: 'Tests not found' };

  const isLab = discipline.key === 'pathology';
  const title = metaTitle(
    isLab
      ? `Blood tests & pathology — ${discipline.tests.length} lab tests`
      : `Scans & imaging — MRI, CT, ultrasound, X-ray`,
  );
  const description = metaDescription(
    isLab
      ? `${discipline.tests.length} NABL-accredited blood tests with free home collection over ₹499. CBC, thyroid, diabetes, vitamins and screening with 12-hour reports.`
      : `MRI, CT, ultrasound, X-ray and heart studies at 268 NABH centres. Same-day slots, transparent prices and radiologist-signed reports.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/tests/${discipline.slug}` },
    keywords: isLab
      ? ['blood test at home', 'lab tests price', 'CBC test', 'thyroid profile', 'full body blood test']
      : ['MRI scan price', 'CT scan near me', 'ultrasound scan', 'X-ray at home', 'echo test'],
    ...socialCards({
      title: isLab ? 'Blood tests at KOYO Health' : 'Scans & imaging at KOYO Health',
      description,
      path: `/tests/${discipline.slug}`,
    }),
  };
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ discipline: string }>;
}) {
  const { discipline: slug } = await params;
  const discipline = getDiscipline(slug);
  if (!discipline) notFound();

  const isLab = discipline.key === 'pathology';
  const total = discipline.tests.length;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: discipline.label,
        description: discipline.blurb,
        url: `${SITE}/tests/${discipline.slug}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: total,
          itemListElement: discipline.featured.map((test, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: test.name,
            url: `${SITE}/services/${test.serviceSlug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Tests & scans', item: `${SITE}/services` },
          { '@type': 'ListItem', position: 3, name: discipline.label, item: `${SITE}/tests/${discipline.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHeader
        eyebrow={discipline.eyebrow}
        title={
          isLab ? (
            <>
              Blood tests, reported in <span className="text-teal-deep">12 hours</span>.
            </>
          ) : (
            <>
              Scans, read by the <span className="text-teal-deep">radiologist</span> who signs them.
            </>
          )
        }
        description={
          isLab
            ? `${total} accredited laboratory tests, grouped the way clinicians order them. Book one, or add several to a single home collection.`
            : `${total} imaging and cardiac studies at NABH & NABL centres. Pick the study, we confirm the slot and the preparation before you travel.`
        }
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tests & scans', href: '/services' },
          { label: discipline.label },
        ]}
        aside={
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {[
              { icon: ShieldCheck, label: `${total} individual ${isLab ? 'tests' : 'scans'}`, detail: `${discipline.groups.length} clinical groups` },
              { icon: Clock, label: `Reports in ${formatReport(discipline.fastestReport)}`, detail: 'fastest turnaround' },
              {
                icon: Home,
                label: isLab ? 'Free home collection' : 'Same-day slots',
                detail: `from ${formatINR(discipline.minPrice)}`,
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-4 py-3">
                <stat.icon className="h-4 w-4 shrink-0 text-teal" />
                <div className="min-w-0">
                  <p className="text-[0.8125rem] font-semibold leading-tight">{stat.label}</p>
                  <p className="text-[0.625rem] text-muted">{stat.detail}</p>
                </div>
              </div>
            ))}
          </div>
        }
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="teal">{discipline.reassurance}</Badge>
          <Badge>{discipline.groups.length} clinical groups</Badge>
          <Badge>Free cancellation up to 4 hours before</Badge>
        </div>
      </PageHeader>

      <section className="shell py-10 lg:py-14">
        <TestsBrowser slug={discipline.slug} />
      </section>

      {!isLab && (
        <section className="shell pb-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Dose recorded', detail: 'Low-dose protocols, dose logged per study' },
              { label: 'Double-read', detail: 'Spine, joints and oncology studies are double-read' },
              { label: 'DICOM access', detail: 'Full image series downloadable from your vault' },
              { label: 'Sedation available', detail: 'Paediatric and claustrophobic patients, on request' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-white p-4">
                <p className="text-[0.8125rem] font-medium">{item.label}</p>
                <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Need help choosing?"
        title={
          isLab
            ? 'One collection can cover every test on this page.'
            : 'Tell us the symptom. We will tell you the one scan that answers it.'
        }
        description={
          isLab
            ? 'Add the panels you need and a single phlebotomist visit covers all of them — no second prick, no second fasting day.'
            : 'Our clinicians know which study is worth the radiation and which is not. The guidance call is free and takes ten minutes.'
        }
        primaryHref="/contact"
        primaryLabel="Talk to a clinician"
      />
    </>
  );
}
