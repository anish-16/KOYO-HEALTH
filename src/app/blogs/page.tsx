import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { BlogCard } from '@/components/cards/BlogCard';
import { NewsletterForm } from '@/components/site/NewsletterForm';
import { blogs, blogCategories } from '@/data/blogs';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';


const blogsTitle = metaTitle('Health insights — articles from KOYO clinicians');
const blogsDescription = metaDescription(
  'Plain-language guides to blood tests, scans, cholesterol, thyroid, vitamin D, diabetes and preventive health, written and reviewed by KOYO Health consultants.',
);

export const metadata: Metadata = {
  title: blogsTitle,
  description: blogsDescription,
  alternates: { canonical: '/blogs' },
  ...socialCards({ title: 'KOYO Health insights', description: blogsDescription, path: '/blogs' }),
};

export default function BlogsPage() {
  const [featured, ...rest] = blogs;

  return (
    <>
      <PageHeader
        eyebrow="Health insights"
        title="What your numbers actually mean."
        description="Written by the consultants who sign off the reports. No listicles, no fear-mongering — just what the evidence supports and what it means for you."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Health insights' }]}
        aside={
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Articles', blogs.length],
              ['Clinician authors', '9'],
              ['Medical review', 'Every piece'],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-line bg-white p-3">
                <dd className="display text-2xl text-ink">{value}</dd>
                <dt className="text-2xs uppercase tracking-[0.1em] text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        }
      />

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-3">Editors' pick</p>
            <BlogCard post={featured} featured />
          </div>
          <aside className="lg:col-span-4">
            <div className="card h-full p-6">
              <p className="eyebrow">The KOYO brief</p>
              <h2 className="display mt-2 text-2xl leading-snug">One useful email a month.</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                New articles, seasonal health notes and the occasional myth we would like to retire.
                Edited by Dr. Ananya Rao, our chief medical officer.
              </p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-2xs text-muted">
                <li>· No sponsored content, ever</li>
                <li>· Unsubscribe in one click</li>
                <li>· 21,400 subscribers</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="shell pb-16">
        <h2 className="display text-2xl">All articles</h2>
        <div className="mt-5">
          <BlogIndex posts={rest} categories={blogCategories} />
        </div>
      </section>
    </>
  );
}
