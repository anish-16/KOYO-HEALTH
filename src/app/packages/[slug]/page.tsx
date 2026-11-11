import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck, Check, Clock, FileText, ShieldCheck, Utensils } from 'lucide-react';
import { getPackage, packages } from '@/data/packages';
import { PageHeader } from '@/components/site/PageHeader';
import { Badge } from '@/components/ui/Primitives';
import { Accordion } from '@/components/ui/Accordion';
import { PackageCard } from '@/components/cards/PackageCard';
import { AddPackageButton } from '@/components/packages/AddPackageButton';
import { PersonPhoto } from '@/components/media/PersonPhoto';
import { PackageArt } from '@/components/packages/PackageArt';
import { people } from '@/data/people';
import { CallbackButton } from '@/components/site/CallbackButton';
import { CTASection } from '@/components/site/CTASection';
import { discountPct, formatINR } from '@/lib/utils';

import { metaDescription, metaTitle, socialCards, SITE_URL as SITE } from '@/lib/seo';

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: 'Package not found' };
  const title = metaTitle(`${pkg.name} — ${pkg.testCount} parameters`);
  const description = metaDescription(
    `${pkg.name}: ${pkg.testCount} parameters for ${formatINR(pkg.price)}, ${pkg.fastingHours > 0 ? `${pkg.fastingHours}h fasting` : 'no fasting'}. Free home collection and a clinician-written summary.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/packages/${pkg.slug}` },
    ...socialCards({ title: `${pkg.name} — ${formatINR(pkg.price)}`, description, path: `/packages/${pkg.slug}` }),
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const related = packages.filter((p) => p.slug !== pkg.slug && p.category === pkg.category).slice(0, 3);
  const faqs = [
    {
      q: `What is included in the ${pkg.name}?`,
      a: `The package includes ${pkg.testsIncluded.length} tests covering ${pkg.testCount} parameters: ${pkg.testsIncluded.slice(0, 10).join(', ')}${pkg.testsIncluded.length > 10 ? ` and ${pkg.testsIncluded.length - 10} more` : ''}. A consolidated report with reference ranges and a plain-language summary is included.`,
    },
    {
      q: 'Do I need to fast?',
      a: pkg.fastingHours > 0
        ? `Yes — fast for ${pkg.fastingHours} hours before the sample collection. Water is allowed. If you are diabetic and on insulin, speak to your physician about timing.`
        : 'No fasting is required for this package. You can eat normally and take your regular medicines.',
    },
    {
      q: 'Is home collection available?',
      a: 'Yes. A trained phlebotomist visits within a 90-minute window with a sealed, barcoded kit. Home collection is free on orders above ₹499 and always free for Gold members. Imaging components, where included, require a centre visit.',
    },
    {
      q: 'What happens if a result is abnormal?',
      a: 'A KOYO physician reviews every abnormal value and adds a plain-language note with next steps. You can also book a free 10-minute teleconsult with an internal medicine specialist to discuss the report.',
    },
    {
      q: 'Can I share the package with a family member?',
      a: 'The package is priced per person. You can book it for any family profile, and reports stay attached to that person. Couples packages cover two people in one booking.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: pkg.name,
        description: pkg.description,
        brand: { '@type': 'Brand', name: 'KOYO Health' },
        category: 'Health checkup package',
        url: `${SITE}/packages/${pkg.slug}`,
        offers: {
          '@type': 'Offer',
          price: pkg.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${SITE}/packages/${pkg.slug}`,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHeader
        eyebrow={`${pkg.category} package · ${pkg.forWhom}`}
        title={pkg.name}
        description={pkg.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Health packages', href: '/packages' },
          { label: pkg.name },
        ]}
        aside={
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Badge tone="teal">{pkg.testCount} parameters</Badge>
            <Badge>{pkg.ageBand}</Badge>
            <Badge>{pkg.reportTime}</Badge>
          </div>
        }
      />

      <section className="shell pt-8 lg:pt-10">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white lg:grid-cols-2">
          <PackageArt pkg={pkg} size="hero" className="aspect-[4/3] w-full lg:aspect-auto lg:h-full" />
          <div className="flex flex-col justify-center gap-3 px-6 py-7 sm:px-9 sm:py-9">
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
              {pkg.forWhom === 'Everyone' ? 'For adults of every age' : `Designed for ${pkg.forWhom.toLowerCase()}`}
            </p>
            <p className="display text-[1.4rem] leading-snug sm:text-[1.7rem]">
              {pkg.testsIncluded.length} tests. {pkg.testCount} parameters. One report.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Every test below runs on the same sample where the discipline allows it, so the whole
              panel is usually a single draw. Collection takes about ten minutes and the sample
              reaches an NABL-accredited lab within two hours.
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-ink/55">
              <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Free home collection · one visit · paid only after booking is confirmed
            </p>
          </div>
        </div>
      </section>

      <section className="shell pb-10 pt-8 lg:pb-14 lg:pt-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: FileText, label: `${pkg.testsIncluded.length} tests`, detail: `${pkg.testCount} parameters` },
                { icon: Utensils, label: pkg.fastingHours > 0 ? `${pkg.fastingHours}-hour fast` : 'No fasting', detail: 'water is allowed' },
                { icon: Clock, label: pkg.reportTime, detail: 'digital + email' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line bg-white p-4">
                  <item.icon className="h-4 w-4 text-teal" />
                  <p className="mt-2 text-[0.8125rem] font-semibold">{item.label}</p>
                  <p className="text-[0.625rem] text-muted">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-9">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="display text-[1.9rem] leading-tight">What is included</h2>
                  <p className="mt-1 text-sm text-muted">
                    {pkg.testsIncluded.length} tests across {pkg.panels.length} disciplines · {pkg.testCount} reportable parameters.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge tone="teal">{pkg.testsIncluded.length} tests</Badge>
                  <Badge>{pkg.testCount} parameters</Badge>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-line">
                {pkg.panels.map((panel) => (
                  <div key={panel.group}>
                    <div className="flex items-center justify-between gap-3 bg-sand/60 px-4 py-2.5">
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink/55">
                        {panel.group}
                      </p>
                      <p className="text-[0.625rem] text-ink/40">
                        {panel.tests.length} test{panel.tests.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <ul className="divide-y divide-line bg-white">
                      {panel.tests.map((test) => (
                        <li key={test.name} className="flex items-center justify-between gap-4 px-4 py-2.5">
                          <span className="flex items-start gap-2.5 text-[0.8125rem] text-ink/75">
                            <Check className="mt-[3px] h-3 w-3 shrink-0 text-teal" />
                            {test.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-teal-mist px-2 py-0.5 text-[0.5625rem] font-medium text-teal-deep">
                            {test.count} param{test.count === 1 ? '' : 's'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.625rem] text-ink/40">
                Parameter counts follow NABL reporting conventions. A CBC reports 24 parameters, a lipid profile 8, and so on. Everything listed is performed at an NABL-accredited lab; imaging, where present, is at a NABH centre.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {pkg.highlights.map((h) => (
                <div key={h} className="rounded-xl border border-line bg-teal-mist/40 px-4 py-4">
                  <ShieldCheck className="h-4 w-4 text-teal" />
                  <p className="mt-2 text-[0.8125rem] font-medium leading-relaxed">{h}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="display text-[1.9rem] leading-tight">Who it is for</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-teal-deep">Ideal for</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    Adults aged {pkg.ageBand}, particularly {pkg.forWhom === 'Everyone' ? 'anyone due for an annual review' : pkg.forWhom.toLowerCase() + ' with a family history or lifestyle risk'}.
                    Best repeated every 12 months, or as advised after an abnormal result.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-teal-deep">Preparation</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
                    <li className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" /> {pkg.fastingHours > 0 ? `Fast for ${pkg.fastingHours} hours` : 'No fasting required'}</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" /> Carry a photo ID and prior reports</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" /> Continue regular medicines unless advised otherwise</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="display text-[1.9rem] leading-tight">Questions about this package</h2>
              <div className="mt-4"><Accordion items={faqs} /></div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <div className="border-b border-line bg-sand/50 px-5 py-4">
                  <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-clay">
                    {discountPct(pkg.price, pkg.mrp) >= 25
                      ? `${discountPct(pkg.price, pkg.mrp)}% off · save ${formatINR(pkg.mrp - pkg.price)}`
                      : `Save ${formatINR(pkg.mrp - pkg.price)} · all-inclusive price`}
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="tabular font-display text-4xl">{formatINR(pkg.price)}</span>
                    <span className="tabular pb-1.5 text-sm text-ink/35 line-through">{formatINR(pkg.mrp)}</span>
                  </div>
                  <p className="mt-1 text-[0.625rem] text-muted">All tests, collection and reporting included</p>
                </div>
                <div className="space-y-3 p-5">
                  <div className="space-y-2 text-xs text-ink/60">
                    <p className="flex items-center gap-2"><CalendarCheck className="h-3.5 w-3.5 text-teal" /> Home collection, 7 days a week</p>
                    <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-teal" /> NABL-accredited laboratories</p>
                    <p className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-teal" /> Physician review of abnormal values</p>
                  </div>
                  <AddPackageButton pkg={pkg} />
                  <Link href="/book" className="btn-outline w-full">Book with a slot</Link>
                  <CallbackButton label="Ask about this package" variant="ghost" className="w-full justify-center border border-line text-xs" />
                  <p className="text-center text-[0.625rem] leading-relaxed text-ink/35">
                    Free cancellation up to 4 hours before collection
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <PersonPhoto
                  photo={people.phlebotomy}
                  className="aspect-[16/9] w-full"
                  imgClassName="object-[center_35%]"
                  sizes="(min-width: 1024px) 380px, 92vw"
                />
                <div className="px-5 py-4">
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                    Who comes to you
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
                    A background-verified phlebotomist arrives with a sealed, barcoded kit inside
                    your 90-minute window. Female phlebotomists are available on request.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gold/25 bg-gold-soft/30 p-5 text-xs leading-relaxed text-ink/65">
                <p className="font-semibold text-ink">Gold members save an extra 15%</p>
                <p className="mt-1">At ₹1,499 a year, membership pays for itself on this package alone. Free home collection is included on every order.</p>
                <Link href="/membership" className="link-underline mt-2 inline-flex text-xs">See membership <ArrowRight className="h-3 w-3" /></Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-14">
          <div className="shell">
            <div className="flex items-end justify-between gap-4">
              <h2 className="display text-[1.8rem] leading-tight">Other {pkg.category.toLowerCase()} packages</h2>
              <Link href="/packages" className="link-underline text-sm">All packages <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <PackageCard key={r.slug} pkg={r} compact />)}
            </div>
          </div>
        </section>
      )}

      <CTASection title="One appointment. One report. No surprises." />
    </>
  );
}
