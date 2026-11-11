import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { faqGroups, allFaqs } from '@/data/company';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';
import { CTASection } from '@/components/site/CTASection';

const faqTitle = metaTitle('FAQs — booking, reports and insurance');
const faqDescription = metaDescription(
  'Answers to common questions about booking a diagnostic test, home sample collection, report timelines, insurance claims, NABL accreditation and data privacy at KOYO Health.',
);

export const metadata: Metadata = {
  title: faqTitle,
  description: faqDescription,
  alternates: { canonical: '/faqs' },
  ...socialCards({ title: faqTitle, description: faqDescription, path: '/faqs' }),
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';

export default function FaqsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="Help centre"
        title="Questions we get asked every day."
        description={`${allFaqs.length} answers across ${faqGroups.length} topics. If yours is not here, a care advisor can answer it in under a minute.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]}
        aside={
          <div className="flex flex-col gap-2">
            <a href="tel:+918800580075" className="btn-primary btn-sm">
              <Phone className="h-3.5 w-3.5" /> Call 88005 80075
            </a>
            <a href="https://wa.me/918800580075" target="_blank" rel="noreferrer noopener" className="btn-outline btn-sm">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp us
            </a>
          </div>
        }
      />

      <section className="shell grid gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Topics</p>
          <nav className="mt-3 space-y-1.5 border-l border-line pl-3">
            {faqGroups.map((g) => (
              <a
                key={g.category}
                href={`#${g.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="block text-xs leading-snug text-muted transition-colors hover:text-teal-deep"
              >
                {g.category}
                <span className="ml-1 text-2xs text-ink/30">{g.items.length}</span>
              </a>
            ))}
          </nav>
          <div className="mt-6 rounded-xl bg-sand p-4">
            <HelpCircle className="h-4 w-4 text-teal" />
            <p className="mt-2 text-2xs leading-relaxed text-ink/70">
              Still stuck? <Link href="/contact" className="font-semibold text-teal-deep underline">Request a callback</Link> and
              we will call within five minutes.
            </p>
          </div>
        </aside>

        <div className="space-y-10">
          {faqGroups.map((group) => (
            <section key={group.category} id={group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-28">
              <h2 className="display text-2xl">{group.category}</h2>
              <div className="mt-4">
                <Accordion items={group.items} defaultOpen={null} />
              </div>
            </section>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Still deciding?"
        title="Talk to a clinician before you book."
        description="A 10-minute call can save you an unnecessary scan — and often does."
        primaryHref="/contact"
        primaryLabel="Speak to a care advisor"
      />
    </>
  );
}
