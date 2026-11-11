import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, Download } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { services } from '@/data/services';
import { NewsletterForm } from './NewsletterForm';

const SUPPORT = [
  { href: '/contact', label: 'Need help?' },
  { href: '/contact', label: 'Live chat' },
  { href: '/contact', label: 'Report an issue' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms & conditions' },
  { href: '/refund-policy', label: 'Cancellation & refund' },
];

const COMPANY = [
  { href: '/about-us', label: 'About us' },
  { href: '/partner', label: 'Partner with us' },
  { href: '/careers', label: 'Careers' },
  { href: '/blogs', label: 'Health insights' },
  { href: '/cities', label: 'Cities we serve' },
  { href: '/membership', label: 'Gold membership' },
  { href: '/corporate-wellness', label: 'Corporate wellness' },
];

export function Footer() {
  const topServices = services.slice(0, 8);
  const imaging = services.slice(0, 7);

  return (
    <footer className="surface-ink grain relative mt-24 overflow-hidden text-paper">
      <div className="shell relative py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/55">
              Diagnostics that respect your time and intelligence. 268 accredited centres, 48 cities,
              and a report you can actually understand.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {['NABL partner labs', 'NABH centres', 'ISO 27001'].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-paper/12 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-paper/60">
                  <ShieldCheck className="h-3 w-3 text-gold" /> {b}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              {[
                { label: 'Instagram', path: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.5.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .5 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.5 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.5a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.5-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.5-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.5C8.4 2.2 8.8 2.2 12 2.2Zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Zm0 2.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm6.6-2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z' },
                { label: 'LinkedIn', path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9Z' },
                { label: 'Facebook', path: 'M14 21v-8h2.7l.4-3.1H14V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.22V9.9H7.7V13h2.72v8H14Z' },
              ].map(({ label, path }) => (
                <a
                  key={label} href="https://www.instagram.com" target="_blank" rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-paper/12 text-paper/60 transition-colors hover:border-gold hover:text-gold"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d={path} /></svg>
                </a>
              ))}
            </div>

            <div className="mt-7">
              <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-gold">Health notes</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <FooterColumn title="Our services" links={[...topServices.map((s) => ({ href: `/services/${s.slug}`, label: s.name })), { href: '/services', label: 'View all 28 →' }]} />
            <FooterColumn title="Imaging" links={[...imaging.map((s) => ({ href: `/services/${s.slug}`, label: s.shortName })), { href: '/services?filter=Radiology', label: 'All imaging →' }]} />
            <FooterColumn title="Company" links={COMPANY} />
            <FooterColumn title="Support & help" links={SUPPORT} />
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-paper/10 pt-10 md:grid-cols-3">
          <div>
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-paper/35">Talk to us</p>
            <a href="tel:+918800580075" className="mt-2 flex items-center gap-2 text-sm text-paper/85 hover:text-gold">
              <Phone className="h-3.5 w-3.5 text-gold" /> +91 88005 80075
            </a>
            <a href="mailto:care@koyohealth.in" className="mt-2 flex items-center gap-2 text-sm text-paper/85 hover:text-gold">
              <Mail className="h-3.5 w-3.5 text-gold" /> care@koyohealth.in
            </a>
            <p className="mt-2 text-xs text-paper/40">Mon–Sun, 7 am – 10 pm IST</p>
          </div>
          <div>
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-paper/35">Registered office</p>
            <p className="mt-2 flex gap-2 text-xs leading-relaxed text-paper/55">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              9th Floor, Tower C, Nukleus, Logix Cyber Park, Sector 62, Noida, Uttar Pradesh 201309
            </p>
            <p className="mt-2 text-[0.625rem] text-paper/30">CIN U85110UP2019PTC118472 · GSTIN 09AAKCK8841P1ZQ</p>
          </div>
          <div>
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-paper/35">Get the app</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Google Play', 'App Store'].map((store) => (
                <span key={store} className="inline-flex items-center gap-2 rounded-lg border border-paper/15 px-3 py-2 text-[0.6875rem] text-paper/65">
                  <Download className="h-3.5 w-3.5" /> {store}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[0.625rem] text-paper/30">Reports, reminders and family profiles on the go.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-6 text-[0.625rem] text-paper/35 md:flex-row md:items-center md:justify-between">
          <p>© 2026 KOYO Health Diagnostics Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-paper/70">Privacy</Link>
            <Link href="/terms" className="hover:text-paper/70">Terms</Link>
            <Link href="/refund-policy" className="hover:text-paper/70">Refunds</Link>
            <Link href="/sitemap.xml" className="hover:text-paper/70">Sitemap</Link>
            <span className="rounded border border-paper/15 px-1.5 py-0.5">UPI</span>
            <span className="rounded border border-paper/15 px-1.5 py-0.5">VISA</span>
            <span className="rounded border border-paper/15 px-1.5 py-0.5">Mastercard</span>
          </div>
        </div>

        <p className="mt-4 text-[0.5625rem] leading-relaxed text-paper/20">
          KOYO Health is a diagnostic service platform, not a medical provider. Reports are interpreted by
          registered pathologists and radiologists; clinical decisions should always be made with a qualified
          physician. If you are experiencing a medical emergency, call 112 or visit the nearest emergency department.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-paper/35">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link href={link.href} className="text-[0.8125rem] text-paper/60 transition-colors hover:text-paper">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
