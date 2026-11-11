import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight, ArrowUpRight, Check, Clock, FileText, MapPin, ShieldCheck, TriangleAlert, Home,
} from 'lucide-react';
import { getService, services } from '@/data/services';
import { cities } from '@/data/cities';
import { PageHeader } from '@/components/site/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { Badge, Stars } from '@/components/ui/Primitives';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { TestTable } from '@/components/services/TestTable';
import { AddToBooking } from '@/components/services/AddToBooking';
import { CallbackButton } from '@/components/site/CallbackButton';
import { CTASection } from '@/components/site/CTASection';
import { discountPct, formatINR } from '@/lib/utils';

import { metaDescription, metaTitle, socialCards, SITE_URL as SITE } from '@/lib/seo';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: 'Service not found' };

  const title = metaTitle(`${service.name} — price & report time`);
  const description = metaDescription(
    `${service.shortName} from ${formatINR(service.startingPrice)} at NABL & NABH accredited centres. ${service.tests.length} studies, ${service.reportTime.toLowerCase()} reports, clinician-reviewed.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    keywords: [service.name, `${service.name} price`, `${service.name} near me`, service.shortName, service.modality],
    ...socialCards({ title: `${service.name} at KOYO Health`, description, path: `/services/${service.slug}` }),
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const cheapest = [...service.tests].sort((a, b) => a.price - b.price)[0];
  const related = services
    .filter((s) => s.slug !== service.slug)
    .sort((a, b) => Number(b.modality === service.modality) - Number(a.modality === service.modality))
    .slice(0, 3);

  const faqs = [
    ...service.faqs,
    {
      q: `What does ${service.shortName} cost at KOYO?`,
      a: `${service.shortName} starts at ${formatINR(service.startingPrice)}. The exact price depends on the specific study and whether contrast is needed; every test price is listed on this page with no add-on charges at the centre.`,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalTest',
        name: service.name,
        description: service.description,
        bodyLocation: 'Multiple',
        usedToDiagnose: service.tagline,
        url: `${SITE}/services/${service.slug}`,
        offers: {
          '@type': 'Offer',
          price: service.startingPrice,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'MedicalBusiness', name: 'KOYO Health' },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Test categories', item: `${SITE}/services` },
          { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE}/services/${service.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHeader
        eyebrow={`${service.modality} · ${service.tests.length} tests`}
        title={service.name}
        description={service.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Test categories', href: '/services' },
          { label: service.shortName },
        ]}
        aside={
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {service.highlights.map((h) => (
              <span key={h} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[0.6875rem] text-ink/65">
                <Check className="h-3 w-3 text-teal" /> {h}
              </span>
            ))}
          </div>
        }
      />

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="teal"><ShieldCheck className="h-3 w-3" /> NABL &amp; NABH centres</Badge>
              <Badge><Clock className="h-3 w-3" /> {service.reportTime}</Badge>
              <Badge><FileText className="h-3 w-3" /> Consultant-reviewed</Badge>
              <span className="ml-auto flex items-center gap-2 text-[0.6875rem] text-muted">
                <Stars rating={4.8} /> 4.8 · 38k reviews
              </span>
            </div>

            <div className="prose-koyo mt-8">
              {service.story.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-teal-mist/50 p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><Check className="h-4 w-4 text-teal" /> What it helps diagnose</h2>
                <ul className="mt-3 space-y-2">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex gap-2 text-[0.8125rem] leading-relaxed text-ink/70">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-gold/25 bg-gold-soft/30 p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><TriangleAlert className="h-4 w-4 text-gold-deep" /> Risks &amp; limitations</h2>
                <ul className="mt-3 space-y-2">
                  {service.risks.map((r) => (
                    <li key={r} className="flex gap-2 text-[0.8125rem] leading-relaxed text-ink/70">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-deep" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="display text-[1.8rem] leading-tight">Tests &amp; pricing</h2>
                  <p className="mt-1 text-sm text-muted">Every price includes taxes, reporting and digital copies. No add-ons at the centre.</p>
                </div>
                <span className="text-[0.625rem] text-ink/40">Prices updated Nov 2026</span>
              </div>
              <div className="mt-4">
                <TestTable serviceSlug={service.slug} serviceName={service.name} tests={service.tests} />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="display text-[1.8rem] leading-tight">How to prepare</h2>
              <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.preparation.map((p, i) => (
                  <li key={p} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                    <span className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[0.625rem] font-bold text-white">{i + 1}</span>
                    <p className="text-[0.8125rem] leading-relaxed text-ink/70">{p}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-xs text-muted">
                <Home className="h-3.5 w-3.5 text-teal" />
                {cheapest.homeCollection
                  ? 'This test is available as a home collection in 48 cities, free on orders above ₹499.'
                  : 'This is an imaging study and requires a centre visit. Home service is not available for scans.'}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="display text-[1.8rem] leading-tight">Questions people ask</h2>
              <p className="mt-1 text-sm text-muted">Answered by KOYO radiologists and pathologists.</p>
              <div className="mt-4"><Accordion items={faqs} /></div>
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-teal" /> {service.shortName} by city
              </h2>
              <p className="mt-1 text-xs text-muted">{service.centers} accredited centres offer this study. Popular locations:</p>
              <div className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {cities.slice(0, 12).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    className="group flex items-center justify-between border-b border-line py-2 text-[0.8125rem] text-ink/70 transition-colors hover:text-teal-deep"
                  >
                    {service.shortName} in {city.name}
                    <ArrowUpRight className="h-3 w-3 text-ink/20 group-hover:text-teal" />
                  </Link>
                ))}
              </div>
              <Link href="/cities" className="link-underline mt-4 inline-flex text-xs">All 48 cities <ArrowRight className="h-3 w-3" /></Link>
            </div>
          </div>

          {/* STICKY BOOKING CARD */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <div className="surface-ink grain relative px-5 py-5 text-paper">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper/10 text-gold">
                      <ServiceIcon name={service.icon} />
                    </span>
                    <span className="rounded-full border border-paper/15 px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.1em] text-paper/60">
                      {service.modality}
                    </span>
                  </div>
                  <p className="mt-5 text-[0.5625rem] uppercase tracking-[0.14em] text-paper/40">Starting from</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="tabular font-display text-4xl">{formatINR(service.startingPrice)}</span>
                    <span className="tabular pb-1 text-sm text-paper/35 line-through">{formatINR(service.mrp)}</span>
                    <span className="mb-1 rounded-full bg-gold px-2 py-0.5 text-[0.5625rem] font-bold text-ink">
                      {discountPct(service.startingPrice, service.mrp)}% off
                    </span>
                  </div>
                  <p className="mt-1 text-[0.625rem] text-paper/45">{service.tests.length} tests · {service.duration} · {service.reportTime}</p>
                </div>

                <div className="space-y-4 p-5">
                  <div className="space-y-2.5 text-xs text-ink/60">
                    <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-teal" /> Next slot: today, 6:30 pm</p>
                    <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-teal" /> Reports reviewed by a consultant</p>
                    <p className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-teal" /> Digital report in your vault</p>
                  </div>

                  <AddToBooking
                    item={{
                      id: `${service.slug}/${cheapest.slug}`,
                      serviceSlug: service.slug,
                      serviceName: service.name,
                      testName: cheapest.name,
                      price: cheapest.price,
                      mrp: cheapest.mrp,
                      fastingHours: cheapest.fastingHours,
                      homeCollection: cheapest.homeCollection,
                      sample: cheapest.sample,
                    }}
                    label={`Add ${cheapest.name}`}
                  />
                  <Link href="/book" className="btn-outline w-full">Go to booking</Link>
                  <CallbackButton
                    label="Ask about this test"
                    variant="ghost"
                    className="w-full justify-center border border-line text-xs"
                  />
                  <p className="text-center text-[0.625rem] leading-relaxed text-ink/35">
                    Free cancellation up to 4 hours before · No payment needed to reserve
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-teal-mist/60 p-5">
                <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-teal-deep">Care team</p>
                <p className="mt-2 text-sm font-medium">Not sure this is the right test?</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Our clinicians answer in under 5 minutes and will tell you if a cheaper or safer test answers the same question.
                </p>
                <a href="tel:+918800580075" className="mt-3 flex items-center gap-2 text-sm font-semibold text-teal-deep">
                  +91 88005 80075 <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-white py-14">
        <div className="shell">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-[1.8rem] leading-tight">Related diagnostics</h2>
            <Link href="/services" className="link-underline text-sm">All categories <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/services/${r.slug}`} className="group rounded-2xl border border-line bg-paper p-5 transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-teal-deep ring-1 ring-line">
                    <ServiceIcon name={r.icon} />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink/20 group-hover:text-teal" />
                </div>
                <p className="mt-4 text-sm font-semibold">{r.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">{r.tagline}</p>
                <p className="mt-3 text-xs font-medium text-teal-deep">From {formatINR(r.startingPrice)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Book your ${service.shortName} with a team that explains the result.`}
        description="Pick a slot in two minutes. Reports are reviewed by a consultant and delivered to your vault with a plain-language summary."
      />
    </>
  );
}
