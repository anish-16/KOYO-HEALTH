import type { Metadata } from 'next';
import { HeartPulse, GraduationCap, Laptop, Users, Plane, Baby, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { CareersBoard } from '@/components/careers/CareersBoard';
import { CTASection } from '@/components/site/CTASection';
import { SectionHeading } from '@/components/ui/Primitives';
import { careers } from '@/data/company';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const careersTitle = metaTitle('Careers at KOYO Health');
const careersDescription = metaDescription(
  'Open roles in clinical operations, radiology, engineering, product and corporate partnerships. Remote-friendly, clinician-led, and unhurried about hiring.',
);

export const metadata: Metadata = {
  title: careersTitle,
  description: careersDescription,
  alternates: { canonical: '/careers' },
  ...socialCards({ title: careersTitle, description: careersDescription, path: '/careers' }),
};

const benefits = [
  { icon: HeartPulse, title: 'Health cover that includes parents', body: '₹10 lakh family floater from day one, plus free annual KOYO panels for you and your dependents.' },
  { icon: Laptop, title: 'Remote where it makes sense', body: 'Engineering, design and analytics are remote-first. Clinical roles are on-site by necessity.' },
  { icon: GraduationCap, title: '₹60,000 learning budget', body: 'Conferences, certifications and courses — no approval theatre. Use it or lose it each year.' },
  { icon: Baby, title: '26 weeks parental leave', body: 'For primary caregivers of any gender, plus phased return-to-work for the first three months.' },
  { icon: Plane, title: 'Unlimited leave, minimum 18', body: 'We mean it: a minimum of 18 days off a year, tracked publicly by team.' },
  { icon: ShieldCheck, title: 'No individual health data access', body: 'Employees get the same privacy guarantee as patients. HR never sees individual results.' },
];

const process = [
  { step: 'Application review', detail: 'A human reads every application. You hear back within five working days, either way.' },
  { step: 'Intro conversation', detail: '30 minutes with the hiring manager about the work, not a quiz on trivia.' },
  { step: 'Craft exercise', detail: 'A paid, time-boxed exercise based on real work. Two hours, not a weekend.' },
  { step: 'Team & clinical round', detail: 'Meet two people you would work with, including a clinician for clinical roles.' },
  { step: 'Offer', detail: 'Transparent band, no negotiation theatre. We tell you the range in the first call.' },
];

export default function CareersPage() {
  const departments = new Set(careers.map((c) => c.department));

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build the diagnostics layer India actually deserves."
        description="We hire slowly and keep people for years. If you want to ship clinical software with real consequences, this is the place."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
        aside={
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Open roles', careers.length],
              ['Departments', departments.size],
              ['Avg. tenure', '3.4 yrs'],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-line bg-white p-3">
                <dd className="display text-2xl">{value}</dd>
                <dt className="text-2xs uppercase tracking-[0.1em] text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        }
      />

      <section className="shell py-10 lg:py-14">
        <SectionHeading eyebrow="Open roles" title="Where we need help right now" description="Salaries are listed because hiding them wastes everyone's time." />
        <div className="mt-6">
          <CareersBoard />
        </div>
      </section>

      <section className="bg-sand/60 py-16">
        <div className="shell">
          <SectionHeading eyebrow="Benefits" title="What we actually offer" description="Not a ping-pong table in sight. These are the things people tell us keep them here." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="card p-5">
                <b.icon className="h-5 w-5 text-teal" />
                <h3 className="mt-3 text-sm font-semibold text-ink">{b.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Hiring</p>
            <h2 className="display mt-3 text-[2.1rem] leading-tight">Five steps. No ghosting.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The whole process takes two to three weeks. Every candidate gets a reason if we say no —
              and permission to ask for more detail.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p className="text-xs leading-relaxed text-ink/70">
                No take-home assignments longer than two hours, and they are always paid. We do not use
                trick questions or whiteboard algorithms for roles that will never need them.
              </p>
            </div>
          </div>
          <ol className="space-y-3 lg:col-span-7">
            {process.map((p, i) => (
              <li key={p.step} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-2xs font-semibold text-gold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.step}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, title: 'Clinician-led', body: 'Our CMO sits on the hiring panel for every clinical role and reviews clinical product decisions.' },
            { icon: GraduationCap, title: 'Teaching culture', body: 'Monthly case reviews are open to everyone. Registrars present to engineers; engineers present to clinicians.' },
            { icon: ShieldCheck, title: 'No data shortcuts', body: 'If a feature requires exposing individual health data, it does not ship. That is a hard rule, not a value on a wall.' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-ink p-6 text-paper">
              <c.icon className="h-5 w-5 text-gold" />
              <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-paper/60">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Not seeing your role?"
        title="Send a speculative application — we read all of them."
        description="Tell us what you would build or fix, and attach something you are proud of."
        primaryHref="/contact"
        primaryLabel="Get in touch"
      />
    </>
  );
}
