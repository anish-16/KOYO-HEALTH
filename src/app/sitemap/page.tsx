import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/data/services';
import { packages } from '@/data/packages';
import { cities } from '@/data/cities';
import { blogs } from '@/data/blogs';
import { legalDocs } from '@/data/legal';
import { PageHeader } from '@/components/site/PageHeader';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Every page on koyohealth.in: tests, packages, cities, articles, company and legal pages.',
  alternates: { canonical: '/sitemap' },
};

const groups = (): { title: string; links: { href: string; label: string }[] }[] => [
  {
    title: 'Company',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about-us', label: 'About KOYO' },
      { href: '/contact', label: 'Contact' },
      { href: '/careers', label: 'Careers' },
      { href: '/partner', label: 'Partner with us' },
      { href: '/reviews', label: 'Reviews' },
      { href: '/faqs', label: 'FAQs' },
      { href: '/corporate-wellness', label: 'Corporate wellness' },
      { href: '/membership', label: 'Gold membership' },
    ],
  },
  {
    title: 'Tests & scans',
    links: [
      { href: '/services', label: 'All tests & scans' },
      ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
    ],
  },
  {
    title: 'Health packages',
    links: [
      { href: '/packages', label: 'All packages' },
      ...packages.map((p) => ({ href: `/packages/${p.slug}`, label: p.name })),
    ],
  },
  {
    title: 'Cities',
    links: cities.map((c) => ({ href: `/cities/${c.slug}`, label: `${c.name}, ${c.state}` })),
  },
  {
    title: 'Health insights',
    links: blogs.map((b) => ({ href: `/blogs/${b.slug}`, label: b.title })),
  },
  {
    title: 'Legal',
    links: legalDocs.map((d) => ({ href: `/legal/${d.slug}`, label: d.title })),
  },
];

export default function SiteMapPage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="Sitemap"
        title="Everything on koyohealth.in"
        description="A plain HTML index for people who prefer it to a search box. The machine-readable version lives at /sitemap.xml."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]}
      />
      <section className="shell grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:py-14">
        {groups().map((group) => (
          <div key={group.title}>
            <h2 className="eyebrow">{group.title}</h2>
            <ul className="mt-3 space-y-1.5">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-muted transition-colors hover:text-teal-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
