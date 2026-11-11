import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Minus, Wallet, Clock, Users, Stethoscope } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { MembershipPlans } from '@/components/membership/MembershipPlans';
import { Accordion } from '@/components/ui/Accordion';
import { CTASection } from '@/components/site/CTASection';
import { SectionHeading, Stars } from '@/components/ui/Primitives';
import { membershipTiers, membershipFaqs } from '@/data/membership';
import { testimonials } from '@/data/company';
import { formatINR } from '@/lib/utils';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

const membershipTitle = metaTitle('Gold membership — 15% off every test');
const membershipDescription = metaDescription(
  'KOYO Health membership: 15% off every diagnostic test and scan, unlimited free home collection, priority reporting and two physician calls a year for ₹1,499.',
);

export const metadata: Metadata = {
  title: membershipTitle,
  description: membershipDescription,
  alternates: { canonical: '/membership' },
  ...socialCards({ title: membershipTitle, description: membershipDescription, path: '/membership' }),
};

const perks = [
  { icon: Wallet, title: 'Discount on everything', body: '15% off tests, scans and packages — including ones already on offer.' },
  { icon: Clock, title: 'Reports in half the time', body: 'Priority queue for pathology and radiology, backed by a real turnaround SLA.' },
  { icon: Users, title: 'One plan, five people', body: 'Add your parents in another city. Each profile gets its own consent OTP.' },
  { icon: Stethoscope, title: 'A doctor, on call', body: 'Two free 15-minute calls a year to walk through your results.' },
];

const compareRows = [
  { label: 'Discount on all bookings', values: ['—', '15%', '22%'] },
  { label: 'Home collection visits', values: ['₹149 each', 'Free, unlimited', 'Free, 90-min slots'] },
  { label: 'Report turnaround', values: ['Standard', '50% faster', 'Same-day imaging'] },
  { label: 'Physician call', values: ['₹299', '2 free / year', 'Unlimited'] },
  { label: 'Family profiles', values: ['2', '5', '8'] },
  { label: 'Care manager', values: ['—', 'Shared', 'Dedicated'] },
  { label: 'Annual full-body checkup', values: ['—', '—', 'Included'] },
  { label: 'Insurance paperwork', values: ['Self-serve', 'Assisted', 'Handled end to end'] },
];

export default function MembershipPage() {
  const gold = membershipTiers[1];
  const samplePackage = 2999;
  const sampleSaving = Math.round(samplePackage * 0.15);

  return (
    <>
      <PageHeader
        eyebrow="KOYO Gold"
        title="Membership that pays for itself on the first scan."
        description="One annual fee. A permanent discount, free home visits and a clinician who knows your history — across every test, every centre and everyone in your family."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Membership' }]}
        aside={
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="eyebrow">Gold, most chosen</p>
            <p className="display mt-2 text-3xl">{formatINR(gold.price)}<span className="ml-1 text-sm font-sans text-muted">/year</span></p>
            <p className="mt-1 text-xs text-muted">
              Pays back at {formatINR(sampleSaving)} on a single {formatINR(samplePackage)} package.
            </p>
            <button type="button" className="btn-gold btn-sm mt-4 w-full">Join Gold</button>
            <p className="mt-2 text-center text-2xs text-muted">7-day refund · no auto-renewal</p>
          </div>
        }
      />

      <section className="shell py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-mist text-teal-deep">
                <perk.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-sm font-semibold text-ink">{perk.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{perk.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <SectionHeading
            align="center"
            eyebrow="Plans"
            title="Three ways to pay for care"
            description="Stay on Basic if you test once in a while. Gold is built for annual checkups. Platinum is for households that test often."
          />
          <div className="mt-8">
            <MembershipPlans />
          </div>
        </div>
      </section>

      <section id="compare" className="shell scroll-mt-28 pb-16">
        <SectionHeading eyebrow="Compare" title="Every benefit, side by side" />
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="table-koyo min-w-[640px]">
            <thead>
              <tr>
                <th className="w-[40%]">Benefit</th>
                {membershipTiers.map((t) => (
                  <th key={t.name} className="text-center">{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.label}>
                  <td className="font-medium text-ink">{row.label}</td>
                  {row.values.map((value, i) => (
                    <td key={i} className="text-center text-xs">
                      {value === '—' ? (
                        <Minus className="mx-auto h-3.5 w-3.5 text-ink/25" />
                      ) : (
                        <span className={i === 1 ? 'inline-flex items-center gap-1 font-semibold text-teal-deep' : 'text-ink/75'}>
                          {i === 1 && <Check className="h-3 w-3" />}
                          {value}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-2xs text-muted">Prices include GST. Corporate wellness credits can be combined with Gold benefits.</p>
      </section>

      <section className="shell pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <p className="eyebrow">The maths</p>
            <h2 className="display mt-2 text-2xl">What a Gold member saves in a typical year</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ['Full-body checkup', 2999, 450],
                ['Two pathology panels', 3498, 525],
                ['One MRI scan', 6499, 975],
                ['Home collection fees', 1341, 1341],
                ['Physician call', 598, 598],
              ].map(([label, price, saved]) => (
                <li key={String(label)} className="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0">
                  <span className="text-ink/75">{label}</span>
                  <span className="text-right text-xs">
                    <span className="text-muted line-through">{formatINR(Number(price))}</span>
                    <span className="ml-2 font-semibold text-teal-deep">−{formatINR(Number(saved))}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-paper">
              <span className="text-xs">Total saved</span>
              <span className="display text-2xl text-gold">{formatINR(450 + 525 + 975 + 1341 + 598)}</span>
            </div>
            <p className="mt-2 text-2xs text-muted">
              Against a {formatINR(gold.price)} membership — a net benefit of{' '}
              {formatINR(450 + 525 + 975 + 1341 + 598 - gold.price)} before wallet credits.
            </p>
          </div>

          <div className="rounded-2xl bg-sand p-6 sm:p-8">
            <p className="eyebrow">Member reviews</p>
            <h2 className="display mt-2 text-2xl">1.2 lakh memberships, audited renewals</h2>
            <ul className="mt-5 space-y-4">
              {testimonials.slice(0, 3).map((t) => (
                <li key={t.id} className="rounded-xl bg-white p-4">
                  <Stars rating={t.rating} />
                  <p className="mt-2 text-xs leading-relaxed text-ink/75">“{t.quote}”</p>
                  <p className="mt-2 text-2xs text-muted">{t.name} · {t.city} · {t.service}</p>
                </li>
              ))}
            </ul>
            <Link href="/reviews" className="link-underline mt-4 inline-flex text-xs">
              Read all 18,400 reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="shell pb-16">
        <SectionHeading eyebrow="Questions" title="Membership FAQs" />
        <div className="mt-6 max-w-3xl">
          <Accordion items={membershipFaqs} />
        </div>
      </section>

      <CTASection
        eyebrow="Start today"
        title="Join Gold and book your first test at 15% off."
        description="Membership activates instantly. Your discount applies to the booking in your cart right now."
        primaryLabel="Join Gold"
      />
    </>
  );
}
