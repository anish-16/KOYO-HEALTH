import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, ShieldCheck } from 'lucide-react';
import { legalDocs, getLegalDoc } from '@/data/legal';
import { Breadcrumbs } from '@/components/ui/Primitives';
import { formatDate, slugify } from '@/lib/utils';

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: 'Document not found' };
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${doc.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <section className="shell grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-14">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Legal' }]} />
        <nav className="mt-4 space-y-1.5 border-l border-line pl-3">
          {legalDocs.map((d) => (
            <Link
              key={d.slug}
              href={`/legal/${d.slug}`}
              className={`block text-xs leading-snug transition-colors ${
                d.slug === doc.slug ? 'font-semibold text-ink' : 'text-muted hover:text-teal-deep'
              }`}
            >
              {d.title}
            </Link>
          ))}
        </nav>
        <div className="mt-6 rounded-xl bg-teal-mist p-4">
          <ShieldCheck className="h-4 w-4 text-teal-deep" />
          <p className="mt-2 text-2xs leading-relaxed text-ink/70">
            Plain-language summary available on request. Write to legal@koyohealth.in and we will
            explain any clause in the language you prefer.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-line bg-white p-4">
          <p className="text-2xs uppercase tracking-[0.1em] text-muted">Contents</p>
          <nav className="mt-2 space-y-1.5">
            {doc.sections.map((s) => (
              <a key={s.heading} href={`#${slugify(s.heading)}`} className="block text-2xs leading-snug text-muted hover:text-teal-deep">
                {s.heading}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <article className="max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-2 text-[2.3rem] leading-tight sm:text-[2.9rem]">{doc.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{doc.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-line pb-4 text-2xs text-muted">
          <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Version 4.2</span>
          <span>Last updated {formatDate(doc.updated)}</span>
          <span>Applies to all KOYO Health services in India</span>
        </div>

        <div className="prose-koyo mt-8">
          {doc.sections.map((section) => (
            <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-28">
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              {section.list && (
                <ul>
                  {section.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-white p-5">
          <p className="text-sm font-semibold text-ink">Questions about this document?</p>
          <p className="mt-1 text-xs text-muted">
            Write to <a href="mailto:legal@koyohealth.in" className="text-teal-deep underline">legal@koyohealth.in</a> or call
            88005 80075. For data requests, use Settings → Your data in your dashboard.
          </p>
        </div>
      </article>
    </section>
  );
}
