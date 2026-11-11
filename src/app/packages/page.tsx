import type { Metadata } from 'next';
import { packages, packageStats } from '@/data/packages';
import { PageHeader } from '@/components/site/PageHeader';
import { PackagesBrowser } from '@/components/packages/PackagesBrowser';
import { FamilyStrip } from '@/components/packages/FamilyStrip';
import { familyCountWord } from '@/data/families';
import { PersonPhoto } from '@/components/media/PersonPhoto';
import { people } from '@/data/people';
import { CTASection } from '@/components/site/CTASection';
import { Badge } from '@/components/ui/Primitives';
import { formatINR } from '@/lib/utils';
import { ArrowRight, ShieldCheck, Wallet, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const packagesTitle = metaTitle('Health checkup packages — verified & clinician-led');
const packagesDescription = metaDescription(
  `${packages.length} preventive health packages from ${formatINR(Math.min(...packages.map((p) => p.price)))}. Full body, women's, men's, senior, heart, fertility, cancer and everyday panels with free home collection.`,
);

export const metadata: Metadata = {
  title: packagesTitle,
  description: packagesDescription,
  alternates: { canonical: '/packages' },
  ...socialCards({ title: packagesTitle, description: packagesDescription, path: '/packages' }),
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ for?: string; q?: string; family?: string }>;
}) {
  const { for: forParam, q, family: familyParam } = await searchParams;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'KOYO Health checkup packages',
    numberOfItems: packages.length,
    itemListElement: packages.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description,
        url: `https://koyohealth.in/packages/${p.slug}`,
        offers: { '@type': 'Offer', price: p.price, priceCurrency: 'INR' },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />        <PageHeader
        eyebrow="Health packages"
        title="Preventive panels designed by clinicians, not by marketing."
        description="Every package is reviewed by our clinical council for cost-effectiveness. If a test would not change a decision, it does not belong in the panel — no matter how good it looks on a brochure."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Health packages' }]}
        aside={
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {[
              { icon: Wallet, label: `From ${formatINR(packageStats.from)}`, detail: `${packageStats.count} packages` },
              { icon: ShieldCheck, label: `${packageStats.avgSaving}% average saving`, detail: 'versus individual tests' },
              { icon: Stethoscope, label: 'Physician review', detail: 'on every abnormal result' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-white px-4 py-3">
                <s.icon className="h-4 w-4 text-teal" />
                <p className="mt-2 text-[0.8125rem] font-semibold">{s.label}</p>
                <p className="text-[0.625rem] text-muted">{s.detail}</p>
              </div>
            ))}
          </div>
        }
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="teal">Free home collection</Badge>
          <Badge>Single consolidated report</Badge>
          <Badge>Free recheck on inconsistent values</Badge>
        </div>
      </PageHeader>

      <section className="shell pt-10 lg:pt-12">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white lg:grid-cols-2">
          <PersonPhoto
            photo={people.family}
            priority
            className="aspect-[4/3] w-full lg:aspect-auto"
            imgClassName="object-[center_38%]"
            sizes="(min-width: 1024px) 600px, 100vw"
          />
          <div className="flex flex-col justify-center gap-3 px-6 py-7 sm:px-10 sm:py-10">
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
              Booked by 1,00,000+ people across India
            </p>
            <p className="display text-[1.7rem] leading-tight sm:text-[2.1rem]">
              One appointment. The whole family covered.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              A trained phlebotomist comes to your home, collects every sample in one visit, and the
              reports land in one shared vault — no queues, no repeat trips to a centre.
            </p>
            <Link href="/book" className="btn-primary mt-2 w-fit">
              Book a home collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="display mt-2 text-[1.6rem] leading-tight sm:text-[1.9rem]">
              {familyCountWord()} categories drawn from the {packages.length} packages we actually run.
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted">
            Every tile filters the catalogue below. The count beside each one is the number of
            packages it returns — nothing here is decorative.
          </p>
        </div>
        <FamilyStrip active={familyParam} className="mt-5" />
      </section>

      <section className="shell pb-10 lg:pb-14" id="catalogue">
        <PackagesBrowser
          packages={packages}
          initialAudience={forParam}
          initialFamily={familyParam}
          initialQuery={q ?? ''}
        />
        <div className="mt-8 rounded-2xl border border-line bg-teal-mist/50 p-5 text-xs leading-relaxed text-ink/60">
          <strong className="text-ink">How we choose what is included:</strong> each panel must answer a
          question that has a treatment consequence. Parameters are counted the way NABL labs count them —
          a CBC is 24 parameters, not one line item. Prices include collection, reporting and a digital
          report vault. Fasting requirements are shown on each package page.
        </div>
      </section>

      <CTASection
        eyebrow="Not sure which panel?"
        title="Tell us your age, history and symptoms. We will build the smallest useful package."
        description="A 10-minute call with an internal medicine clinician, free of charge. No test is added unless it changes a decision."
        primaryHref="/contact"
        primaryLabel="Get a recommendation"
      />
    </>
  );
}
