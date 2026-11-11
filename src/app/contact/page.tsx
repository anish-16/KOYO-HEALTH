import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Clock, Building2, ShieldCheck, Stethoscope } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { ContactForm } from '@/components/site/ContactForm';
import { centers } from '@/data/company';
import { Badge } from '@/components/ui/Primitives';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const contactTitle = metaTitle('Contact KOYO Health — support & centres');
const contactDescription = metaDescription(
  'Call 88005 80075, chat on WhatsApp, or request a callback. Support runs 7 am to 10 pm daily. Find centre addresses in Delhi, Mumbai, Bengaluru and 45 more cities.',
);

export const metadata: Metadata = {
  title: contactTitle,
  description: contactDescription,
  alternates: { canonical: '/contact' },
  ...socialCards({ title: contactTitle, description: contactDescription, path: '/contact' }),
};

const channels = [
  {
    icon: Phone,
    label: 'Call us',
    value: '88005 80075',
    detail: '7 am – 10 pm, all days · average wait 4 min',
    href: 'tel:+918800580075',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '88005 80075',
    detail: 'Reports, reschedules and quick questions',
    href: 'https://wa.me/918800580075',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'care@koyohealth.in',
    detail: 'Replies within 4 working hours',
    href: 'mailto:care@koyohealth.in',
  },
  {
    icon: ShieldCheck,
    label: 'Clinical governance',
    value: 'quality@koyohealth.in',
    detail: 'Report errors, adverse events or audit requests',
    href: 'mailto:quality@koyohealth.in',
  },
];

const departments = [
  { name: 'Booking & appointments', details: 'New bookings, slot changes, home visit tracking', phone: '88005 80075', ext: '1' },
  { name: 'Reports & clinical queries', details: 'Report delays, corrections, physician call-backs', phone: '88005 80076', ext: '2' },
  { name: 'Insurance & TPA', details: 'Pre-authorisation, claims, reimbursement documents', phone: '88005 80077', ext: '3' },
  { name: 'Corporate wellness', details: 'Camps, employee onboarding, aggregate dashboards', phone: '88005 80078', ext: '4' },
  { name: 'Membership', details: 'Gold and Platinum benefits, upgrades, refunds', phone: '88005 80079', ext: '5' },
  { name: 'Partner with us', details: 'Centre partnerships, phlebotomy network, referrals', phone: '88005 80080', ext: '6' },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="A person answers. Usually in under a minute."
        description="No phone trees, no chatbot loops. Our care team sits in Noida and Hyderabad, and they can see your booking while you are on the call."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        aside={
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="eyebrow">Right now</p>
            <p className="display mt-2 text-2xl">Open · closes 10 pm</p>
            <p className="mt-1 text-xs text-muted">18 advisors online · average wait 4 min</p>
            <a href="tel:+918800580075" className="btn-primary btn-sm mt-4 w-full">
              <Phone className="h-3.5 w-3.5" /> Call 88005 80075
            </a>
          </div>
        }
      />

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <a key={c.label} href={c.href} className="card group p-5 transition-shadow hover:shadow-lift">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-mist text-teal-deep">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-2xs uppercase tracking-[0.12em] text-muted">{c.label}</p>
              <p className="mt-1 text-sm font-semibold text-ink group-hover:text-teal-deep">{c.value}</p>
              <p className="mt-1 text-2xs leading-snug text-muted">{c.detail}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactForm />
            <div className="mt-4 rounded-2xl border border-line bg-white p-5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-ink">
                <Clock className="h-4 w-4 text-teal" /> Escalation path
              </p>
              <ol className="mt-2 space-y-1.5 text-2xs leading-relaxed text-muted">
                <li>1. Care advisor — resolves 86% of queries on first contact.</li>
                <li>2. Care manager — named person for complex or clinical issues.</li>
                <li>3. Clinical governance — report errors reviewed within 24 hours.</li>
                <li>4. Grievance officer — written response within 7 working days.</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="display text-2xl">Departments</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
              <div className="overflow-x-auto">
              <table className="table-koyo min-w-[520px]">
                <thead>
                  <tr><th>Team</th><th>What they handle</th><th className="text-right">Direct line</th></tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.name}>
                      <td className="font-medium text-ink">{d.name}</td>
                      <td className="text-xs text-muted">{d.details}</td>
                      <td className="whitespace-nowrap text-right text-xs">
                        {d.phone}
                        <span className="block text-2xs text-muted">ext. {d.ext}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <h2 className="display mt-8 text-2xl">Registered office</h2>
            <div className="card mt-4 p-5">
              <p className="inline-flex items-start gap-2 text-sm text-ink">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                9th Floor, Tower C, Nukleus, Logix Cyber Park, Sector 62, Noida, Uttar Pradesh 201309
              </p>
              <p className="mt-2 pl-6 text-2xs text-muted">
                CIN U85110UP2019PTC118842 · GSTIN 09AABCK1234M1Z5 · NABH applicant
              </p>
              <div className="mt-3 flex flex-wrap gap-2 pl-6">
                <Badge tone="teal">NABL partners</Badge>
                <Badge tone="teal">NABH centres</Badge>
                <Badge>ISO 27001</Badge>
              </div>
            </div>

            <h2 className="display mt-8 text-2xl">Walk-in centres</h2>
            <ul className="mt-4 space-y-2">
              {centers.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-white p-4">
                  <div>
                    <p className="text-xs font-semibold text-ink">{c.name}</p>
                    <p className="mt-1 inline-flex items-start gap-1.5 text-2xs text-muted">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {c.address}
                    </p>
                    <p className="mt-1 text-2xs text-muted">{c.timings} · {c.rating} ★ ({c.reviews} reviews)</p>
                  </div>
                  <Link href="/cities" className="shrink-0 text-2xs font-semibold text-teal-deep hover:underline">All centres</Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-teal-mist p-5">
              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" />
              <p className="text-xs leading-relaxed text-ink/75">
                <strong className="font-semibold">Clinical emergency?</strong> Call 112 or go to the nearest
                emergency department. KOYO is a diagnostic service and does not provide emergency care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
