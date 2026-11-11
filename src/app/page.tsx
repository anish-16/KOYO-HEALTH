import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, CalendarCheck, Check, Clock, Headset, MapPin,
  ShieldCheck, Sparkles, Star, Stethoscope, FileText, Wallet,
} from 'lucide-react';
import { HeroSearch } from '@/components/home/HeroSearch';
import { HeroVisual } from '@/components/home/HeroVisual';
import { CategoryExplorer, type ExplorerService } from '@/components/home/CategoryExplorer';
import { PackageCard } from '@/components/cards/PackageCard';
import { BlogCard } from '@/components/cards/BlogCard';
import { Counter } from '@/components/ui/Counter';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Accordion } from '@/components/ui/Accordion';
import { SectionHeading, Stars } from '@/components/ui/Primitives';
import { CallbackButton } from '@/components/site/CallbackButton';
import { FamilyStrip } from '@/components/packages/FamilyStrip';
import { familyCountWord } from '@/data/families';
import { PersonPhoto } from '@/components/media/PersonPhoto';
import { people } from '@/data/people';
import { services, allTests } from '@/data/services';
import { packages } from '@/data/packages';
import { blogs } from '@/data/blogs';
import { cities, topCities } from '@/data/cities';
import { testimonials, allFaqs, accreditations, companyStats, insurancePartners } from '@/data/company';
import { formatINR } from '@/lib/utils';
import { metaDescription } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KOYO Health — Diagnostic tests, scans & health packages in 48 cities',
  description: metaDescription(
    'Book NABL & NABH accredited diagnostic tests and scans with free home sample collection. 28 specialities, 120+ tests and 18 clinician-designed health packages.',
  ),
  alternates: { canonical: '/' },
};

const searchIndex = allTests.map((t) => ({
  id: t.id,
  name: t.name,
  serviceName: t.serviceName,
  serviceSlug: t.serviceSlug,
  price: t.price,
  aliases: `${t.serviceSlug} ${t.modality}`,
}));

const explorerItems: ExplorerService[] = services.map((s) => ({
  slug: s.slug,
  name: s.name,
  tagline: s.tagline,
  modality: s.modality,
  icon: s.icon,
  startingPrice: s.startingPrice,
  mrp: s.mrp,
  tests: s.tests.length,
  isPopular: s.isPopular,
}));

const popularPackages = packages.filter((p) => p.isPopular).slice(0, 3);

const WHY = [
  {
    icon: ShieldCheck,
    title: 'Accredited diagnostics',
    body: 'Every lab holds NABL accreditation; every imaging centre is NABH or NABL certified. Audited twice a year, with dose and quality logs.',
  },
  {
    icon: MapPin,
    title: 'Pan-India coverage',
    body: '268 partner centres across 48 cities, plus free home sample collection in 92% of our serviceable pincodes.',
  },
  {
    icon: CalendarCheck,
    title: 'Seamless booking',
    body: 'Pick a slot in under a minute. Home collection has a 90-minute arrival window and 97% first-attempt success.',
  },
  {
    icon: Headset,
    title: 'Expert assistance',
    body: 'A clinician-led care team answers in under 5 minutes — before booking, after a report, or when a result needs explaining.',
  },
];

const PROCESS = [
  { step: '01', title: 'Select test & location', body: 'Choose from 120+ tests, or let a clinician build the right panel. Home or centre, 7 days a week.', icon: Stethoscope },
  { step: '02', title: 'Book your appointment', body: 'Pick a slot, add family profiles, and pay only when you are ready. Free cancellation up to 4 hours prior.', icon: CalendarCheck },
  { step: '03', title: 'Get your reports', body: 'Reports in 12 hours for labs, 4 hours for CT. Every abnormal value carries a plain-language next step.', icon: FileText },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-teal-soft/50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:56px_56px] opacity-[0.45] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="shell relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-white px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-teal-deep">
                <ShieldCheck className="h-3 w-3" /> NABL &amp; NABH partner network
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3 py-1.5 text-[0.625rem] text-ink/60">
                <Stars rating={4.8} /> 4.8 · 38,000 reviews
              </span>
            </div>

            <h1 className="display mt-6 max-w-[16ch] text-[3rem] leading-[0.96] tracking-[-0.02em] sm:text-[3.8rem] lg:text-[4.35rem]">
              Book diagnostics at <span className="relative whitespace-nowrap text-teal-deep">accredited<svg viewBox="0 0 220 12" className="absolute -bottom-1 left-0 h-2.5 w-full text-gold" preserveAspectRatio="none" aria-hidden="true"><path d="M2 9C40 3 90 2 218 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg></span> centres near you.
            </h1>

            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              28 specialities, 120+ individual tests and 268 accredited centres in 48 cities.
              Free home collection, radiologist-reviewed reports, and a care team that answers
              within five minutes.
            </p>

            <HeroSearch index={searchIndex} />

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.6875rem] text-ink/45">
              <span className="font-medium text-ink/55">Popular:</span>
              {['MRI Brain', 'Full body checkup', 'Thyroid profile', 'CT chest', 'HbA1c'].map((term) => (
                <Link key={term} href={`/services?q=${encodeURIComponent(term)}`} className="transition-colors hover:text-teal-deep">
                  {term}
                </Link>
              ))}
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-5 border-t border-line pt-6">
              {[
                { value: '12 hrs', label: 'Typical lab report' },
                { value: '90 min', label: 'Home collection window' },
                { value: '4 hrs', label: 'CT report turnaround' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="tabular font-display text-2xl text-ink">{s.value}</p>
                  <p className="mt-0.5 text-[0.625rem] uppercase tracking-[0.08em] text-ink/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ACCREDITATION MARQUEE */}
      <div className="border-b border-line bg-white/60 py-4">
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 pr-10 hover:[animation-play-state:paused]">
            {[...accreditations, ...accreditations].map((a, i) => (
              <span key={`${a.label}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-[0.625rem] uppercase tracking-[0.14em] text-ink/40">
                <Check className="h-3 w-3 text-teal/60" />
                {a.label} <span className="text-ink/20">·</span> {a.detail}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CARE THAT COMES HOME */}
      <section className="shell py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative pb-10 pr-8 sm:pb-12 sm:pr-12">
              <PersonPhoto
                photo={people.phlebotomy}
                priority
                className="aspect-[4/3] rounded-[1.75rem] border border-line shadow-soft"
                imgClassName="object-[center_35%]"
                sizes="(min-width: 1024px) 560px, 92vw"
              />
              <div className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1.5 text-[0.625rem] font-semibold text-ink shadow-soft backdrop-blur">
                90-minute arrival window
              </div>
              <div className="absolute bottom-0 right-0 w-36 overflow-hidden rounded-2xl border-4 border-paper shadow-lift sm:w-52">
                <PersonPhoto
                  photo={people.mother}
                  className="aspect-square"
                  sizes="(min-width: 640px) 208px, 144px"
                />
              </div>
              <div className="absolute -bottom-1 left-2 hidden rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-soft sm:block">
                <p className="text-[0.5rem] uppercase tracking-[0.14em] text-ink/35">Same visit</p>
                <p className="mt-0.5 text-xs font-semibold">Family of 4 · 1 draw</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6">
            <p className="eyebrow">Care that comes home</p>
            <h2 className="display mt-3 text-[2.2rem] leading-[1.05] sm:text-[2.7rem]">
              A real person at your door, not a courier handoff.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              A background-verified phlebotomist arrives inside your window with a sealed, barcoded
              kit, collects every sample for every family member in one sitting, and the sample
              reaches the accredited lab within two hours.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                ['97% first-attempt success', 'trained on difficult and paediatric draws'],
                ['Female phlebotomists on request', 'for women and children, always'],
                ['One visit for the whole family', 'samples barcoded to each person separately'],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-deep">
                    <Check className="h-3 w-3" />
                  </span>
                  <p className="text-sm text-ink/75"><span className="font-semibold text-ink">{title}</span> — {body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/book" className="btn-primary">Book a home collection <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/faqs" className="btn-outline btn-sm">How collection works</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="shell py-20 lg:py-28" id="categories">
        <Reveal>
          <SectionHeading
            eyebrow="Test catalogue"
            title={<>28 specialities. One standard of care.</>}
            description="From a ₹99 CBC to a whole-body PET-CT, every study follows the same protocol: accredited equipment, consultant review, and a report written for humans."
            action={<Link href="/services" className="btn-outline btn-sm">All categories <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
          />
        </Reveal>
        <div className="mt-9">
          <CategoryExplorer items={explorerItems} />
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-sand/50 py-20 lg:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Preventive care"
              title="Health packages built around real risk."
              description="Not a 100-parameter brochure. Panels designed by our clinical council, priced without the markup, and reviewed by a physician when something needs attention."
              action={<Link href="/packages" className="btn-outline btn-sm">All {packages.length} packages <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
            />
          </Reveal>
          <RevealGroup className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularPackages.map((pkg) => (
              <RevealItem key={pkg.slug} className="h-full"><PackageCard pkg={pkg} /></RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-5 text-center text-xs text-muted">
            Every package includes free home collection, a digital report vault, and a free recheck if a value looks inconsistent.
          </p>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="shell pb-4 pt-14 lg:pb-6 lg:pt-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Shop by category</p>
              <h2 className="display mt-2 text-[1.9rem] leading-tight sm:text-[2.3rem]">
                {familyCountWord()} categories, {packages.length} packages, no filler.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Each tile is a real filter over the catalogue — the count is how many packages you
                will see, not a marketing number.
              </p>
            </div>
            <Link href="/packages#catalogue" className="link-underline text-sm">
              Browse all {packages.length} packages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        <FamilyStrip className="mt-6" />
      </section>

      {/* EXPLORE BANNER */}
      <section className="shell pt-20 lg:pt-24">
        <Link href="/services" className="group relative block overflow-hidden rounded-3xl bg-forest px-7 py-9 text-paper transition-colors hover:bg-teal-deep sm:px-10 lg:py-12">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border border-paper/10" />
          <div className="pointer-events-none absolute -right-4 -top-10 h-44 w-44 rounded-full border border-gold/20" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow text-gold">Explore services</p>
              <p className="display mt-2 max-w-2xl text-[1.9rem] leading-tight sm:text-[2.4rem]">
                Browse all 120+ individual tests — from a 10-minute blood draw to a 3T MRI.
              </p>
              <p className="mt-3 max-w-xl text-sm text-paper/60">
                Transparent pricing, preparation instructions, and the exact report turnaround for every study.
              </p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-paper/20 bg-paper/5 transition-all duration-300 group-hover:bg-gold group-hover:text-ink">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </section>

      {/* MEMBERSHIP */}
      <section className="shell py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="absolute inset-6 -z-10 rounded-[2rem] bg-gold-soft/60 blur-2xl" />
              <div className="grain relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1c2a22] via-[#12211c] to-[#071410] p-7 text-paper shadow-lift">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[0.5625rem] uppercase tracking-[0.24em] text-gold/80">KOYO Health</p>
                    <p className="mt-1 font-display text-3xl">GOLD</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>

                <div className="mt-10 flex items-center gap-3">
                  <div className="h-9 w-12 rounded-md bg-gradient-to-br from-gold/80 to-gold-deep/60 ring-1 ring-gold/40" />
                  <p className="tabular tracking-[0.18em] text-paper/60">•••• 8841</p>
                </div>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.18em] text-paper/35">Member</p>
                    <p className="mt-1 text-sm tracking-wide">AARAV MEHTA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.5rem] uppercase tracking-[0.18em] text-paper/35">Valid thru</p>
                    <p className="tabular mt-1 text-sm">04/27</p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-2 border-t border-paper/10 pt-4 text-[0.5625rem] text-paper/50">
                  <span>15% off tests</span>
                  <span>Free collection</span>
                  <span>Priority reports</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-3 rounded-xl border border-line bg-white px-4 py-3 shadow-soft">
                <p className="text-[0.5rem] uppercase tracking-[0.14em] text-ink/35">Average annual saving</p>
                <p className="tabular mt-0.5 font-display text-xl">₹4,820</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">KOYO Gold</p>
            <h2 className="display mt-3 text-[2.2rem] leading-[1.05] sm:text-[2.8rem]">
              Gold pays for itself in two visits.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              ₹1,499 a year. 15% off every test, free home collection, two free physician
              teleconsults, and 5% wallet credit back on every order. No auto-renewal traps.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                ['15% off', 'every test and package, including imaging'],
                ['Free home collection', 'on every order, no ₹499 minimum'],
                ['2 free teleconsults', 'with internal medicine specialists'],
                ['5% wallet credit', 'back on every completed booking'],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-deep">
                    <Check className="h-3 w-3" />
                  </span>
                  <p className="text-sm text-ink/75"><span className="font-semibold text-ink">{title}</span> — {body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/membership" className="btn-primary">See membership plans <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/membership#compare" className="btn-outline btn-sm">Compare benefits</Link>
            </div>
            <p className="mt-3 text-[0.625rem] text-ink/40">10,000+ members · Cancel anytime · No hidden renewal</p>
          </Reveal>
        </div>
      </section>

      {/* WHY KOYO */}
      <section className="bg-white py-20 lg:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Why KOYO"
              title="The difference is in the details you never see."
              description="Accreditation is the floor, not the ceiling. These are the operating choices that change what your report says — and what happens after it."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item) => (
              <RevealItem key={item.title} className="bg-white">
                <div className="group h-full p-6 transition-colors hover:bg-teal-mist/50 lg:p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-paper transition-colors group-hover:bg-teal group-hover:text-white">
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-[0.9375rem] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* REACH & IMPACT */}
      <section className="surface-ink grain relative overflow-hidden py-16 text-paper lg:py-20">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />
        <div className="shell relative">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-gold">Our reach and impact</p>
              <h2 className="display mt-3 max-w-lg text-[2rem] leading-tight sm:text-[2.5rem]">
                Scale, without diluting the standard.
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-paper/45">
              Figures as of October 2026. Quality metrics are audited quarterly by an independent
              clinical governance panel and published to partner hospitals.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-y-9 border-t border-paper/10 pt-9 lg:grid-cols-4">
            {[
              { to: 268, suffix: '+', label: 'Accredited centres', sub: 'NABL labs & NABH imaging' },
              { to: 1_000_000, suffix: '+', label: 'Patients served', sub: 'Since 2019, across India' },
              { to: 48, suffix: '', label: 'Cities', sub: '22 states and 3 UTs' },
              { to: 98.4, suffix: '%', label: 'Reports on time', sub: 'Against published SLAs', decimals: 1 },
            ].map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'lg:border-l lg:border-paper/10 lg:pl-8' : ''}>
                <p className="tabular font-display text-[2.5rem] leading-none text-paper sm:text-[3rem]">
                  <Counter to={stat.to} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </p>
                <p className="mt-2 text-xs font-medium text-paper/80">{stat.label}</p>
                <p className="mt-0.5 text-[0.625rem] text-paper/35">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERT GUIDANCE */}
      <section className="shell py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Get expert guidance</p>
            <h2 className="display mt-3 text-[2.2rem] leading-[1.05] sm:text-[2.7rem]">
              Not sure what you need? Start with a conversation.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Most people arrive with a symptom, not a test name. Our clinicians help you
              choose the smallest panel that answers the question — and tell you when no test
              is needed at all.
            </p>
            <PersonPhoto
              photo={people.clinician}
              className="mt-6 aspect-[16/10] rounded-2xl border border-line"
              imgClassName="object-[center_25%]"
              sizes="(min-width: 1024px) 380px, 92vw"
            />
            <CallbackButton label="Talk to a clinician" variant="primary" className="mt-6" />
            <p className="mt-3 flex items-center gap-2 text-[0.625rem] text-ink/40">
              <Clock className="h-3 w-3" /> Average response 3 min 12 sec · 8 am – 8 pm
            </p>
          </Reveal>

          <div className="lg:col-span-8">
            <ol className="divide-y divide-line border-y border-line">
              {[
                { n: '01', title: 'Leave your details', body: 'Name, number and a sentence about what is going on. No payment, no commitment.' },
                { n: '02', title: 'Get expert guidance', body: 'A clinician calls within 5 minutes and explains which tests answer your question — and which do not.' },
                { n: '03', title: 'Personalised solution', body: 'We build the panel, find the earliest slot, and assign a care manager for the report follow-up.' },
              ].map((step, i) => (
                <Reveal key={step.n} delay={i * 0.05}>
                  <li className="flex gap-5 py-7 sm:gap-8">
                    <span className="tabular font-display text-3xl text-gold/60">{step.n}</span>
                    <div>
                      <h3 className="text-base font-semibold">{step.title}</h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* BOOKING PROCESS */}
      <section className="border-y border-line bg-white py-20 lg:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Simple booking process"
              title="Three steps. Under two minutes."
              description="No phone tag, no hidden charges, no “report will come”. The slot you pick is the slot you get."
              align="center"
            />
          </Reveal>
          <div className="relative mt-12 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16.6%] right-[16.6%] top-7 hidden border-t border-dashed border-ink/15 md:block" />
            {PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-line bg-paper text-teal-deep shadow-soft">
                    <step.icon className="h-5 w-5" strokeWidth={1.5} />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.5625rem] font-bold text-paper">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-[0.8125rem] leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/book" className="btn-primary">Start a booking <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="shell py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Patient stories"
            title="4.8 out of 5, across 38,000 reviews."
            description="Verified reviews from patients who booked, showed up, and read their reports. We publish the one-star reviews too."
            action={<Link href="/about-us#reviews" className="btn-outline btn-sm">All reviews <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
          />
        </Reveal>
        <RevealGroup className="mt-9 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <RevealItem key={t.id} className="h-full">
              <figure className="card flex h-full flex-col p-6">
                <Stars rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-[0.6875rem] text-muted">{t.city} · {t.service}</p>
                  </div>
                  <span className="rounded-full bg-teal-soft px-2 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-teal-deep">
                    Verified
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* BLOGS */}
      <section className="bg-sand/50 py-20 lg:py-24">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Health insights"
              title="Written by clinicians. Reviewed by clinicians."
              description="No listicles, no miracle cures. Evidence-based explanations of the tests you are booking and the numbers you are reading."
              action={<Link href="/blogs" className="btn-outline btn-sm">All articles <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
            />
          </Reveal>
          <RevealGroup className="mt-9 grid gap-4 md:grid-cols-3">
            {blogs.slice(0, 3).map((post) => (
              <RevealItem key={post.slug} className="h-full"><BlogCard post={post} /></RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section className="shell py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Questions, answered</p>
            <h2 className="display mt-3 text-[2.1rem] leading-[1.05] sm:text-[2.6rem]">
              The things people ask before their first test.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Still unsure? Our care desk answers in under five minutes, seven days a week.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <CallbackButton label="Ask a question" variant="outline" />
              <Link href="/faqs" className="link-underline text-sm">Read all 30 FAQs <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="mt-8 rounded-2xl border border-line bg-white p-4">
              <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ink/35">Insurance partners</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                {insurancePartners.slice(0, 6).map((p) => (
                  <span key={p} className="text-[0.6875rem] text-ink/55">{p}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={allFaqs.slice(0, 6)} />
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="border-t border-line bg-white py-16 lg:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Diagnostics by city</p>
              <h2 className="display mt-2 text-[1.9rem] leading-tight sm:text-[2.3rem]">
                Accredited centres, close to home.
              </h2>
            </div>
            <Link href="/cities" className="link-underline text-sm">All 48 cities <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="group flex items-center justify-between border-b border-line py-3.5 transition-colors hover:text-teal-deep"
              >
                <span className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-ink/25 transition-colors group-hover:text-teal" />
                  {city.name}
                </span>
                <span className="text-[0.625rem] text-ink/35">{city.centers} centres</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="shell py-16 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-7 py-12 text-paper sm:px-12 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-paper/10" />
          <div className="pointer-events-none absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-gold">Ready when you are</p>
              <h2 className="display mt-3 max-w-2xl text-[2.3rem] leading-[1.03] sm:text-[3.2rem]">
                Ready to book your diagnostic test today?
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/55">
                Book online in two minutes, or let a clinician help you choose. Free cancellation
                up to four hours before your appointment.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 lg:col-span-4 lg:items-end">
              <Link href="/book" className="btn-gold w-full justify-center sm:w-auto">
                Book a test <ArrowRight className="h-4 w-4" />
              </Link>
              <CallbackButton label="Get a call back" variant="outline" className="w-full justify-center border-paper/20 text-paper hover:bg-paper/10 sm:w-auto" />
              <a href="tel:+918800580075" className="mt-1 flex items-center justify-center gap-2 text-xs text-paper/50 hover:text-paper lg:justify-end">
                <Wallet className="h-3.5 w-3.5" /> 10% off with wallet + Gold
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
