import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Award, Building2, Users, HeartPulse, Microscope } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { CTASection } from '@/components/site/CTASection';
import { SectionHeading, Stars, Badge } from '@/components/ui/Primitives';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import {
  doctors, milestones, values, accreditations, companyStats, testimonials, centers,
} from '@/data/company';
import { initials, formatDate } from '@/lib/utils';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const aboutTitle = metaTitle('About KOYO Health — clinical governance');
const aboutDescription = metaDescription(
  'KOYO Health runs 268 NABL and NABH accredited diagnostic centres across 48 Indian cities. Meet the clinicians, read our quality protocol and see how reports are released.',
);

export const metadata: Metadata = {
  title: aboutTitle,
  description: aboutDescription,
  alternates: { canonical: '/about-us' },
  ...socialCards({ title: aboutTitle, description: aboutDescription, path: '/about-us' }),
};

const stats = [
  { label: 'Patients served', value: companyStats.patients, suffix: '+', format: 'compact' },
  { label: 'Accredited centres', value: companyStats.centers, suffix: '' },
  { label: 'Cities', value: companyStats.cities, suffix: '' },
  { label: 'Tests & panels', value: companyStats.tests, suffix: '' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Since 2019"
        title="We started KOYO because a report should not require a second opinion to understand."
        description="Six years, 268 accredited centres and one million patients later, the premise has not changed: diagnostics should be fast, explainable and clinically governed."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About us' }]}
      />

      <section className="shell py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <p className="display text-3xl text-ink">
                <Counter to={s.value} suffix={s.suffix} />
                {s.format === 'compact' && '+'}
              </p>
              <p className="mt-1 text-2xs uppercase tracking-[0.12em] text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">The problem</p>
            <h2 className="display mt-3 text-[2.2rem] leading-[1.08]">
              India had plenty of labs. It had very few explanations.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-[1.85] text-ink/75 lg:col-span-7">
            <p>
              In 2018 our founders — a radiologist, a pathologist and a software engineer — audited
              40 diagnostic reports from eight cities. Thirty-one of them had at least one
              unexplained abnormal value. Nine had a reference range that did not match the
              patient's age or sex. Every single one ended with the same sentence: “consult your
              physician.”
            </p>
            <p>
              KOYO was built to fix the last mile. Every report we release carries a plain-language
              summary, an age-appropriate reference range and a recommended next step. When something
              is flagged, a consultant writes the sentence that follows the number — not a disclaimer.
            </p>
            <p>
              We do not own most of our centres. We audit them, equip them against a single protocol
              and hold them to turnaround and error thresholds. That model is why a scan in
              Coimbatore reads the same as one in South Delhi.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sand/60 py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="How we work"
            title="Four commitments we can be held to"
            description="These are published, measured and reported to our clinical board every quarter."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="card h-full p-6">
                  <span className="text-2xs font-semibold tracking-[0.14em] text-teal/60">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <SectionHeading eyebrow="Timeline" title="Six years, deliberately slowly" />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {milestones.map((m) => (
            <li key={m.year} className="rounded-2xl border border-line bg-white p-5">
              <p className="display text-2xl text-teal-deep">{m.year}</p>
              <h3 className="mt-1 text-sm font-semibold text-ink">{m.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{m.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="clinicians" className="scroll-mt-28 bg-ink py-16 text-paper">
        <div className="shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-gold">Clinicians</p>
              <h2 className="display mt-3 text-[2.1rem] leading-tight sm:text-[2.7rem]">
                The people who sign your report.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper/55">
                Every KOYO report names the consultant who released it. Here are a few of them.
              </p>
            </div>
            <Link href="/contact" className="btn btn-sm border border-paper/20 px-4 py-2 text-paper hover:bg-paper/10">
              Speak to clinical governance <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.slice(0, 8).map((d) => (
              <Link key={d.id} href={`/doctors/${d.id}`} className="group rounded-2xl border border-paper/10 bg-paper/[0.04] p-5 transition-colors hover:border-gold/40 hover:bg-paper/[0.07]">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-sm font-semibold text-gold">
                  {initials(d.name)}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{d.name}</h3>
                <p className="text-2xs text-paper/45">{d.speciality}</p>
                <p className="mt-2 text-2xs leading-relaxed text-paper/55">{d.qualifications}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-2xs font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Profile <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Quality</p>
            <h2 className="display mt-3 text-[2.1rem] leading-tight">Audited by people who have no incentive to be kind.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              External audits twice a year. Internal QC samples weekly. A centre that misses
              tolerance twice in a row is suspended, not coached.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: 'NABL accredited partners' },
                { icon: Award, label: 'NABH certified centres' },
                { icon: Microscope, label: 'ISO 15189 aligned labs' },
                { icon: Building2, label: 'ISO 27001 data security' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-3.5">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-xs font-medium text-ink/75">{item.label}</span>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-2 text-xs text-muted">
              {accreditations.map((a) => (
                <li key={a.label} className="flex justify-between gap-4 border-b border-line pb-2">
                  <span className="text-ink/70">{a.label}</span>
                  <span>{a.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="reviews" className="scroll-mt-28 lg:col-span-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow">Reviews</p>
                <h2 className="display mt-2 text-[2.1rem] leading-tight">
                  {companyStats.rating} out of 5, across {companyStats.reviews.toLocaleString('en-IN')} reviews.
                </h2>
              </div>
              <Stars rating={companyStats.rating} className="hidden sm:flex" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {testimonials.slice(0, 4).map((t) => (
                <figure key={t.id} className="card p-5">
                  <Stars rating={t.rating} />
                  <blockquote className="mt-2 text-xs leading-relaxed text-ink/75">“{t.quote}”</blockquote>
                  <figcaption className="mt-3 text-2xs text-muted">
                    {t.name} · {t.city} · {t.service} · {formatDate(t.date)}
                    {t.verified && <span className="ml-1.5 text-teal">✓ verified</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link href="/reviews" className="link-underline mt-5 inline-flex text-xs">Read more reviews</Link>
          </div>
        </div>
      </section>

      <section className="shell pb-16">
        <SectionHeading eyebrow="Network" title="Centres you can walk into" action={<Link href="/cities" className="btn-outline btn-sm">All cities</Link>} />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {centers.slice(0, 6).map((c) => (
            <div key={c.id} className="rounded-xl border border-line bg-white p-4">
              <p className="text-xs font-semibold text-ink">{c.name}</p>
              <p className="mt-0.5 text-2xs text-muted">{c.city} · {c.timings}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.accreditations.map((a) => <Badge key={a} tone="teal">{a}</Badge>)}
                <Badge>{c.rating} ★ · {c.reviews} reviews</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Join us"
        title="We are hiring clinicians, engineers and centre partners."
        description="If you believe diagnostics can be both rigorous and legible, we would like to meet you."
        primaryHref="/careers"
        primaryLabel="See open roles"
      />
    </>
  );
}
