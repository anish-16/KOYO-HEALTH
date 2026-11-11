import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GraduationCap, BriefcaseMedical, ArrowRight, Quote } from 'lucide-react';
import { doctors } from '@/data/company';
import { blogs } from '@/data/blogs';
import { Breadcrumbs, Badge } from '@/components/ui/Primitives';
import { CTASection } from '@/components/site/CTASection';
import { initials } from '@/lib/utils';
import { metaDescription, metaTitle, socialCards } from '@/lib/seo';

export function generateStaticParams() {
  return doctors.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const doctor = doctors.find((d) => d.id === id);
  if (!doctor) return { title: 'Doctor not found' };
  const title = metaTitle(`${doctor.name} — ${doctor.speciality}`);
  const description = metaDescription(
    `${doctor.name}, ${doctor.role} at KOYO Health. ${doctor.experience} years in ${doctor.speciality}, ${doctor.qualifications}. Book a report review or consultation.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/doctors/${doctor.id}` },
    ...socialCards({ title: `${doctor.name} — ${doctor.speciality}`, description, path: `/doctors/${doctor.id}` }),
  };
}

export default async function DoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = doctors.find((d) => d.id === id);
  if (!doctor) notFound();
  const authored = blogs.filter((b) => b.author === doctor.name).slice(0, 3);
  const colleagues = doctors.filter((d) => d.id !== doctor.id).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-sand/50">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Our clinicians', href: '/about-us#clinicians' }, { label: doctor.name }]} />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-forest text-2xl font-semibold text-gold">
              {initials(doctor.name)}
            </span>
            <div>
              <Badge tone="teal">{doctor.role}</Badge>
              <h1 className="display mt-3 text-[2.2rem] leading-tight sm:text-[2.8rem]">{doctor.name}</h1>
              <p className="mt-1 text-sm text-ink/70">{doctor.qualifications}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5"><BriefcaseMedical className="h-3.5 w-3.5 text-teal" /> {doctor.experience} years experience</span>
                <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-teal" /> {doctor.speciality}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/book" className="btn-primary btn-sm">Book a test</Link>
                <Link href="/contact" className="btn-outline btn-sm">Ask a question</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-8 py-10 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-7">
          <h2 className="display text-2xl">About</h2>
          <p className="mt-3 text-sm leading-[1.8] text-ink/75">{doctor.bio}</p>
          <p className="mt-3 text-sm leading-[1.8] text-ink/75">
            At KOYO, {doctor.name.split(' ')[1] ?? 'the consultant'} reviews reports in {doctor.speciality.toLowerCase()} and
            contributes to our clinical protocols. Every scan or panel that touches this specialty
            gets a second read before release — a policy that has cut reporting errors by 38% since 2023.
          </p>

          <div className="mt-6 rounded-2xl border border-line bg-white p-6">
            <Quote className="h-5 w-5 text-gold" />
            <p className="mt-3 display text-xl leading-snug text-ink">
              “A report is not a result. It is an explanation — and it should end with something the
              patient can actually do.”
            </p>
            <p className="mt-3 text-2xs uppercase tracking-[0.12em] text-muted">{doctor.name} · {doctor.role}</p>
          </div>

          {authored.length > 0 && (
            <div className="mt-8">
              <h2 className="display text-2xl">Writing & guidance</h2>
              <ul className="mt-4 space-y-2">
                {authored.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blogs/${post.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-line p-4 text-sm text-ink hover:border-teal/40">
                      {post.title}
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink/25" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="card p-5">
            <p className="eyebrow">Focus areas</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {doctor.speciality.split('&').map((s) => (
                <li key={s} className="rounded-full bg-teal-mist px-3 py-1 text-2xs font-medium text-teal-deep">{s.trim()}</li>
              ))}
            </ul>
            <div className="mt-5 space-y-3 border-t border-line pt-4 text-xs">
              {[
                ['Qualifications', doctor.qualifications],
                ['Experience', `${doctor.experience} years`],
                ['Languages', 'English, Hindi, and one regional language'],
                ['Consults at', 'Noida · Delhi · Video'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted">{label}</span>
                  <span className="text-right font-medium text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-4 p-5">
            <p className="eyebrow">Other clinicians</p>
            <ul className="mt-3 space-y-3">
              {colleagues.map((c) => (
                <li key={c.id}>
                  <Link href={`/doctors/${c.id}`} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-teal-mist/50">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-sand text-2xs font-semibold text-teal-deep">{initials(c.name)}</span>
                    <span>
                      <span className="block text-xs font-medium text-ink">{c.name}</span>
                      <span className="text-2xs text-muted">{c.speciality}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <CTASection
        eyebrow="Book with confidence"
        title="A consultant reads every report before it reaches you."
        primaryLabel="Book a test"
      />
    </>
  );
}
