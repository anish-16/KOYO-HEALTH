import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Clock, Stethoscope } from 'lucide-react';
import { blogs, getBlog, relatedBlogs } from '@/data/blogs';
import { BlogCard } from '@/components/cards/BlogCard';
import { Breadcrumbs, Badge } from '@/components/ui/Primitives';
import { CTASection } from '@/components/site/CTASection';
import { NewsletterForm } from '@/components/site/NewsletterForm';
import { formatDate, slugify } from '@/lib/utils';

import { metaDescription, metaTitle, socialCards, SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return { title: 'Article not found' };
  const title = metaTitle(post.title);
  const description = metaDescription(post.excerpt);

  return {
    title,
    description,
    alternates: { canonical: `/blogs/${post.slug}` },
    ...socialCards({
      title,
      description,
      path: `/blogs/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    }),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();

  const related = relatedBlogs(post.slug, 3);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author, jobTitle: post.authorRole },
    publisher: { '@id': `${SITE_URL}/#organization` },
    reviewedBy: { '@type': 'Person', name: 'Dr. Ananya Rao', jobTitle: 'Chief Medical Officer' },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
    articleSection: post.category,
    timeRequired: `PT${post.readTime}M`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="relative overflow-hidden border-b border-line bg-sand/60">
          <div className="shell max-w-4xl py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Health insights', href: '/blogs' },
                { label: post.category },
              ]}
            />
            <Badge tone="teal">{post.category}</Badge>
            <h1 className="display mt-4 text-[2.2rem] leading-[1.05] sm:text-[3rem]">{post.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-teal" /> {post.author} · {post.authorRole}
              </span>
              <span>{formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime} min read</span>
              <span>Medically reviewed</span>
            </div>
          </div>
        </header>

        <div className="shell grid max-w-6xl gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">In this article</p>
            <nav className="mt-3 space-y-2 border-l border-line pl-3">
              {post.sections.map((s) => (
                <a
                  key={s.heading}
                  href={`#${slugify(s.heading)}`}
                  className="block text-xs leading-snug text-muted transition-colors hover:text-teal-deep"
                >
                  {s.heading}
                </a>
              ))}
              <a href="#takeaways" className="block text-xs font-semibold text-teal-deep">Key takeaways</a>
            </nav>
            <div className="mt-6 rounded-xl bg-teal-mist p-4">
              <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-teal-deep">Suggested test</p>
              <p className="mt-1.5 text-xs leading-snug text-ink/75">
                {post.category === 'Heart health'
                  ? 'A lipid profile and ApoB give a far better picture than cholesterol alone.'
                  : post.category === 'Diabetes'
                    ? 'HbA1c plus fasting glucose is the standard pair for screening.'
                    : 'Start with a full-body checkup and let a physician interpret the panel.'}
              </p>
              <Link href="/packages" className="mt-2 inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep hover:underline">
                Browse packages <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          <div>
            <div className="prose-koyo">
              {post.sections.map((section) => (
                <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-28">
                  <h2>{section.heading}</h2>
                  {section.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {section.list && (
                    <ul>
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <div id="takeaways" className="scroll-mt-28 rounded-2xl border border-teal/20 bg-teal-mist/60 p-6">
                <h3 className="!mt-0 inline-flex items-center gap-2 text-base font-semibold text-teal-deep">
                  <CheckCircle2 className="h-4 w-4" /> Key takeaways
                </h3>
                <ul className="!mb-0 mt-3">
                  {post.takeaways.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sand text-teal-deep">
                  <Stethoscope className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{post.author}</p>
                  <p className="text-2xs text-muted">{post.authorRole} · reviewed by Dr. Ananya Rao</p>
                </div>
              </div>
              <Link href="/contact" className="btn-outline btn-sm">Ask a question</Link>
            </div>

            <div className="mt-8 rounded-2xl bg-sand p-6">
              <p className="eyebrow">Stay current</p>
              <h2 className="display mt-1 text-xl">Get the next article by email</h2>
              <div className="mt-3 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="shell pb-8">
        <h2 className="display text-2xl">Keep reading</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <BlogCard key={r.slug} post={r} />
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="From reading to knowing"
        title="Reading about it is step one. Testing is step two."
        description="Book a clinician-reviewed panel and get a report that tells you what to do next."
        primaryLabel="Book a test"
      />
    </>
  );
}
