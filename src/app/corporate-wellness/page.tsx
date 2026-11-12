import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Building2, CalendarClock, Check, ClipboardList,
  Factory, GraduationCap, HardHat, HeartPulse, Landmark, Lock, Mail, MessageCircle, Phone,
  ShieldCheck, Stethoscope, Syringe, Truck, UserCheck, Users, Wallet,
} from 'lucide-react';
import { CTASection } from '@/components/site/CTASection';
import { PersonPhoto } from '@/components/media/PersonPhoto';
import { CorporateDashboard } from '@/components/corporate/CorporateDashboard';
import { CorporateEnquiryForm } from '@/components/corporate/CorporateEnquiryForm';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { SectionHeading, Badge } from '@/components/ui/Primitives';
import { people } from '@/data/people';
import {
  corporateContact, corporateEdge, corporateHeroChips, corporatePortal,
  corporateProgrammes, corporateSectors, corporateStats,
} from '@/data/corporate';
import { metaDescription, metaTitle, socialCards, SITE_URL } from '@/lib/seo';

const title = metaTitle('Corporate wellness & employee health checkups');
const description = metaDescription(
  'Employee health checkups, onsite camps, OHC compliance and pre-employment screening across 48 Indian cities. Custom proposal in 24 hours.',
);

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/corporate-wellness' },
  ...socialCards({ title, description, path: '/corporate-wellness' }),
};

const programmeIcon = {
  heart: HeartPulse,
  camp: Syringe,
  compliance: HardHat,
  safety: ShieldCheck,
} as const;

const sectorIcon = {
  it: ClipboardList,
  plant: Factory,
  executive: Landmark,
  logistics: Truck,
  insurance: Building2,
  campus: GraduationCap,
} as const;

const portalIcon = {
  roster: CalendarClock,
  analytics: Users,
  security: Lock,
} as const;

const edgeIcon = {
  manager: UserCheck,
  pricing: Wallet,
  quality: BadgeCheck,
  security: ShieldCheck,
} as const;

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'KOYO Health corporate wellness & employee health checkups',
      serviceType: 'Corporate health screening and occupational health',
      provider: { '@type': 'Organization', name: 'KOYO Health', url: SITE_URL },
      areaServed: { '@type': 'Country', name: 'India' },
      description,
      url: `${SITE_URL}/corporate-wellness`,
      audience: { '@type': 'BusinessAudience', name: 'Employers, TPAs and PSUs' },
    },
    {
      '@type': 'OfferCatalog',
      name: 'Corporate workforce programmes',
      itemListElement: corporateProgrammes.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: p.title, description: p.body },
      })),
    },
  ],
};

export default function CorporateWellnessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div className="pointer-events-none absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-teal-soft/50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:56px_56px] opacity-[0.4] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="shell relative grid items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-white px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-teal-deep">
              <Building2 className="h-3 w-3" /> Enterprise healthcare &amp; diagnostics
            </span>

            <h1 className="display mt-6 max-w-[17ch] text-[2.7rem] leading-[0.98] tracking-[-0.02em] sm:text-[3.4rem] lg:text-[4rem]">
              Empower a healthier, more productive workforce.
            </h1>

            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              End-to-end employee health screenings, onsite campus wellness camps, and statutory OHC compliance powered by India’s fastest-growing accredited diagnostic network.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="#proposal" className="btn-primary">
                Request corporate proposal <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={corporateContact.hotlineHref} className="btn-outline btn-sm">
                <Phone className="h-3.5 w-3.5" /> Schedule Discovery Call
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {corporateHeroChips.map((chip, i) => (
                <li
                  key={chip}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-1.5 text-[0.6875rem] text-ink/60 ${
                    i > 3 ? 'hidden sm:inline-flex' : ''
                  }`}
                >
                  <Check className="h-3 w-3 text-teal" /> {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <PersonPhoto
                photo={people.corporate}
                priority
                className="aspect-[4/5] rounded-[2rem] border border-line shadow-lift"
                imgClassName="object-[center_22%]"
                sizes="(min-width: 1024px) 460px, 92vw"
              />
              <div className="absolute -bottom-5 left-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
                <p className="text-[0.5rem] uppercase tracking-[0.14em] text-ink/35">Network</p>
                <p className="mt-0.5 text-sm font-semibold">Pan - India Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="surface-ink grain relative overflow-hidden py-14 text-paper lg:py-16">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
        <div className="shell relative grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {corporateStats.map((stat, i) => (
            <div key={stat.label} className={i > 0 ? 'lg:border-l lg:border-paper/10 lg:pl-8' : ''}>
              <p className="tabular font-display text-[2.4rem] leading-none sm:text-[2.9rem]">
                <Counter to={stat.to} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
              </p>
              <p className="mt-2 text-xs font-medium text-paper/80">{stat.label}</p>
              <p className="mt-0.5 text-[0.625rem] text-paper/35">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="shell py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Custom workforce programmes"
            title="Comprehensive Healthcare Tailored for Your Organization."
            description="Flexible health packages designed around your industry risks, budget, and statutory compliance needs."
          />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-2">
          {corporateProgrammes.map((programme) => {
            const Icon = programmeIcon[programme.icon];
            return (
              <RevealItem key={programme.title} className="h-full">
                <article className="group card flex h-full flex-col overflow-hidden">
                  <PersonPhoto
                    photo={programme.photo}
                    className="aspect-[16/9] w-full"
                    imgClassName="object-[center_35%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 45vw, 92vw"
                  />
                  <div className="flex flex-1 flex-col p-5 lg:p-6">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-mist text-teal-deep">
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                        {programme.tag}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug">{programme.title}</h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{programme.body}</p>
                    <ul className="mt-4 space-y-2 border-t border-line pt-4">
                      {programme.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-xs leading-relaxed text-ink/70">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" /> {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* DIGITAL PORTAL */}
      <section className="bg-sand/50 py-20 lg:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Smart health infrastructure</p>
            <h2 className="display mt-3 text-[2.1rem] leading-[1.05] sm:text-[2.6rem]">
              Digital-First Healthcare Portal for Modern HR Teams.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Stop reconciling spreadsheets. Upload a roster, watch every batch across every city,
              and download consolidated reports from one dashboard.
            </p>

            <ul className="mt-7 space-y-5">
              {corporatePortal.features.map((feature) => {
                const Icon = portalIcon[feature.icon];
                return (
                  <li key={feature.title} className="flex gap-3.5">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-teal-deep shadow-soft">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{feature.title}</p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{feature.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {corporatePortal.chips.map((chip) => (
                <Badge key={chip} tone="teal">{chip}</Badge>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6">
            <CorporateDashboard />
          </Reveal>
        </div>
      </section>

      {/* SECTORS */}
      <section className="shell py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Proven across sectors"
            title="Specialised protocols for every industry."
            description="Custom clinical protocols designed around the distinct operational risks and working environments of your workforce."
          />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {corporateSectors.map((sector) => {
            const Icon = sectorIcon[sector.icon];
            return (
              <RevealItem key={sector.title} className="h-full">
                <article className="card group flex h-full flex-col p-5 transition-colors hover:bg-teal-mist/40">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-paper transition-colors group-hover:bg-teal group-hover:text-white">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-ink/35">
                      {sector.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">{sector.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{sector.body}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* FROM THE FIELD */}
      <section className="shell pb-20 lg:pb-24">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { photo: people.manufacture, label: 'Plant screening', detail: 'Audiometry, spirometry and chemical exposure baselines' },
            { photo: people.logistics, label: 'Depot clearance', detail: 'Driver fitness, vision acuity and random testing' },
            { photo: people.vaccination, label: 'Onsite drives', detail: 'Flu, hepatitis-B and HPV vaccination at your campus' },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <figure className="group relative overflow-hidden rounded-2xl border border-line">
                <PersonPhoto
                  photo={item.photo}
                  className="aspect-[4/3] w-full"
                  imgClassName="object-[center_35%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  sizes="(min-width: 640px) 30vw, 92vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <figcaption className="absolute inset-x-4 bottom-3.5 text-paper">
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-gold">{item.label}</p>
                  <p className="mt-1 text-[0.8125rem] leading-snug text-paper/85">{item.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDGE */}
      <section className="border-y border-line bg-white py-20 lg:py-24">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="The KOYO enterprise edge"
              title="Built for scale, zero friction and clinical accuracy."
              description="What actually changes when a hundred organisations run their employee health through one network."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {corporateEdge.map((edge) => {
              const Icon = edgeIcon[edge.icon];
              return (
                <RevealItem key={edge.title} className="bg-white">
                  <div className="flex h-full flex-col p-6">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft text-gold-deep">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold">{edge.title}</h3>
                    <p className="mt-1.5 flex-1 text-[0.8125rem] leading-relaxed text-muted">{edge.body}</p>
                    <p className="mt-4 border-t border-line pt-3 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-teal-deep">
                      {edge.metric}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* PROPOSAL */}
      <section id="proposal" className="shell scroll-mt-28 py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow">Instant proposal</p>
            <h2 className="display mt-3 text-[2.1rem] leading-[1.05] sm:text-[2.6rem]">
              Get a custom corporate wellness plan.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Share your workforce requirement and an enterprise health specialist will send a costed
              proposal within 24 business hours.
            </p>

            <div className="mt-7 space-y-3">
              <a href={corporateContact.hotlineHref} className="card flex items-center gap-3 p-4 transition-colors hover:border-teal/40">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-mist text-teal-deep"><Phone className="h-4 w-4" /></span>
                <span>
                  <span className="block text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Corporate hotline</span>
                  <span className="text-sm font-semibold">{corporateContact.hotline}</span>
                </span>
              </a>
              <a href={corporateContact.emailHref} className="card flex items-center gap-3 p-4 transition-colors hover:border-teal/40">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-mist text-teal-deep"><Mail className="h-4 w-4" /></span>
                <span>
                  <span className="block text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Official inquiries</span>
                  <span className="text-sm font-semibold">{corporateContact.email}</span>
                </span>
              </a>
              <a
                href={corporateContact.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="card flex items-center gap-3 p-4 transition-colors hover:border-teal/40"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-mist text-teal-deep"><MessageCircle className="h-4 w-4" /></span>
                <span className="flex-1">
                  <span className="block text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">WhatsApp enterprise desk</span>
                  <span className="text-sm font-semibold">Chat directly with the corporate team</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink/30" />
              </a>
            </div>

          </div>

          <div className="lg:col-span-7">
            <CorporateEnquiryForm />
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Partner with KOYO"
        title="Ready to transform your organisation’s health?"
        description="Join the employers who run screening, camps and OHC compliance through one accredited network — with faster reports and lower medical overheads."
        primaryHref="#proposal"
        primaryLabel="Get a custom quote"
      />
    </>
  );
}
