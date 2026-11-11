import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck, TrendingUp, Users, Microscope, Handshake } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { PartnerForm } from '@/components/site/PartnerForm';
import { CTASection } from '@/components/site/CTASection';
import { SectionHeading } from '@/components/ui/Primitives';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const partnerTitle = metaTitle('Partner with KOYO Health — centre & referral programmes');
const partnerDescription = metaDescription(
  'Join 268 accredited diagnostic centres in the KOYO network. Steady patient volume, quality support, unified reporting software and transparent settlement in 7 days.',
);

export const metadata: Metadata = {
  title: partnerTitle,
  description: partnerDescription,
  alternates: { canonical: '/partner' },
  ...socialCards({ title: partnerTitle, description: partnerDescription, path: '/partner' }),
};

const tracks = [
  {
    icon: Microscope,
    title: 'Diagnostic & imaging centres',
    body: 'Fill idle machine hours with booked patients. We handle demand, scheduling and payment; you handle the scan and the report.',
    points: ['NABL / NABH accreditation required', 'Settlement every 7 days', 'Free KOYO reporting software', 'Quality audit twice a year'],
  },
  {
    icon: Users,
    title: 'Phlebotomy partners',
    body: 'Run home collection in your pincode under the KOYO brand. Training, kits, cold chain and app included.',
    points: ['₹95–₹140 per successful visit', 'Certification and refresher training', 'Weekly kit replenishment', 'Insurance cover for visits'],
  },
  {
    icon: Handshake,
    title: 'Clinics & corporate referrers',
    body: 'Refer patients with transparent pricing and get the report back in your inbox, formatted for your records.',
    points: ['15% partner pricing', 'Priority slots for your patients', 'Report delivery by email + API', 'No exclusivity clause'],
  },
];

const numbers = [
  { icon: TrendingUp, value: '38%', label: 'Average utilisation lift in year one' },
  { icon: Users, value: '7 days', label: 'Settlement cycle, no deductions' },
  { icon: ShieldCheck, value: '2×', label: 'Quality audits per centre per year' },
];

export default function PartnerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partner programme"
        title="Your machines. Our demand. One quality standard."
        description="KOYO does not own most of its network. We bring booked patients, software and audit discipline to accredited centres that want to run fuller, better days."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Partner with us' }]}
        aside={
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="eyebrow">Currently onboarding</p>
            <p className="display mt-2 text-2xl">14 centres / quarter</p>
            <p className="mt-1 text-xs text-muted">Priority: Tier-2 imaging, north-east labs, home collection</p>
            <a href="#apply" className="btn-primary btn-sm mt-4 w-full">Apply to join</a>
          </div>
        }
      />

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {numbers.map((n) => (
            <div key={n.label} className="card p-5">
              <n.icon className="h-5 w-5 text-teal" />
              <p className="display mt-2 text-3xl">{n.value}</p>
              <p className="mt-1 text-2xs uppercase tracking-[0.1em] text-muted">{n.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="Tracks" title="Three ways to work with us" description="Each track has its own contract, pricing and quality bar. Nothing is bundled." />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {tracks.map((t) => (
              <article key={t.title} className="card flex flex-col p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-mist text-teal-deep">
                  <t.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.body}</p>
                <ul className="mt-4 flex-1 space-y-2 border-t border-line pt-4">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-2xs leading-relaxed text-ink/70">
                      <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 bg-sand/60 py-16">
        <div className="shell grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">The standard</p>
            <h2 className="display mt-3 text-[2.1rem] leading-tight">What we will ask of you.</h2>
            <ul className="mt-5 space-y-3">
              {[
                ['Accreditation', 'NABL for labs, NABH for imaging. If you are 6 months away, apply anyway.'],
                ['Turnaround', 'Pathology under 12 hours, imaging under 24, with a 98% on-time floor.'],
                ['Double read', 'Every neuro and oncology study is read by a KOYO consultant as well.'],
                ['Data handling', 'Reports go through KOYO systems, not WhatsApp. ISO 27001 aligned.'],
                ['Patient experience', 'A 90-minute slot window, not a four-hour queue.'],
                ['Transparent pricing', 'One price list. No centre-level upselling.'],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-2xs font-semibold text-gold">{i + 1}</span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-2xs leading-relaxed text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <PartnerForm />
            <div className="mt-4 grid gap-2 text-2xs text-muted sm:grid-cols-2">
              <p>· Site audit within 3 weeks of application</p>
              <p>· Go-live typically 6 weeks after audit</p>
              <p>· No joining fee, no exclusivity</p>
              <p>· Contract terminable with 60 days notice</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Network team"
        title="Have a centre we should see?"
        description="Send the address. If it is in a priority pincode, we will visit within two weeks."
        primaryHref="/contact"
        primaryLabel="Talk to the network team"
      />
    </>
  );
}
