import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { ReviewsBrowser } from '@/components/reviews/ReviewsBrowser';
import { CTASection } from '@/components/site/CTASection';
import { Stars } from '@/components/ui/Primitives';
import { companyStats, testimonials } from '@/data/company';

export const metadata: Metadata = {
  title: 'Patient reviews — 4.8 from 38,000 ratings',
  description:
    'Read verified patient reviews of KOYO Health diagnostic centres, home collection and report experience across Delhi NCR, Mumbai, Bengaluru and 45 more cities.',
  alternates: { canonical: '/reviews' },
};

export default function ReviewsPage() {
  const distribution = [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 12 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="Measured, not curated."
        description="Every review below is tied to a completed booking. We publish the low ones too — and reply to them."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reviews' }]}
        aside={
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="display text-4xl">{companyStats.rating}</p>
            <Stars rating={companyStats.rating} className="mt-1" />
            <p className="mt-1 text-2xs text-muted">{companyStats.reviews.toLocaleString('en-IN')} verified ratings</p>
          </div>
        }
      />

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-4">
            <p className="eyebrow">Distribution</p>
            <ul className="mt-3 space-y-2">
              {distribution.map((d) => (
                <li key={d.stars} className="flex items-center gap-3 text-2xs">
                  <span className="w-8 text-muted">{d.stars}★</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${d.pct}%` }} />
                  </span>
                  <span className="w-8 text-right text-muted">{d.pct}%</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-line pt-4 text-2xs text-muted">
              <p><span className="font-semibold text-ink">96%</span> would recommend KOYO</p>
              <p><span className="font-semibold text-ink">92%</span> rated home collection 5★</p>
              <p><span className="font-semibold text-ink">98.4%</span> reports delivered on time</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ReviewsBrowser />
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ['4.9', 'Noida · Sector 62', '3,040 reviews'],
            ['4.8', 'Delhi · Saket', '2,140 reviews'],
            ['4.8', 'Mumbai · Bandra West', '2,310 reviews'],
          ].map(([score, centre, count]) => (
            <div key={centre} className="rounded-xl border border-line bg-white p-4">
              <p className="display text-xl">{score}</p>
              <p className="text-xs font-medium text-ink">{centre}</p>
              <p className="text-2xs text-muted">{count}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-2xs text-muted">
          {testimonials.length} reviews shown out of {companyStats.reviews.toLocaleString('en-IN')}. Reviews are collected
          by SMS after report delivery and moderated only for abuse.
        </p>
      </section>

      <CTASection
        eyebrow="Your turn"
        title="Book the appointment you have been putting off."
        description="Two minutes to book, free cancellation, and a report that tells you what to do next."
      />
    </>
  );
}
