import Link from 'next/link';
import { ArrowRight, Search, Phone } from 'lucide-react';
import { popularTests } from '@/data/services';
import { formatINR } from '@/lib/utils';

export default function NotFound() {
  return (
    <section className="shell grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
      <div className="lg:col-span-6">
        <p className="eyebrow">404 · Page not found</p>
        <h1 className="display mt-3 text-[2.6rem] leading-[1.03] sm:text-[3.4rem]">
          This page has been discharged.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          The link may be old, or the test may have been renamed. Try the catalogue, or let a care
          advisor find it for you in under a minute.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/services" className="btn-primary">
            <Search className="h-4 w-4" /> Browse all tests
          </Link>
          <Link href="/" className="btn-outline">Back to home</Link>
          <a href="tel:+918800580075" className="btn-ghost">
            <Phone className="h-4 w-4" /> Call 88005 80075
          </a>
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="card p-5">
          <p className="eyebrow">Popular right now</p>
          <ul className="mt-3 divide-y divide-line">
            {popularTests.slice(0, 6).map((test) => (
              <li key={test.id}>
                <Link href={`/services/${test.serviceSlug}`} className="group flex items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block text-xs font-medium text-ink">{test.name}</span>
                    <span className="text-2xs text-muted">{test.serviceName}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-deep">
                    {formatINR(test.price)}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link href="/packages" className="rounded-xl border border-line bg-white p-4 text-xs font-medium text-ink hover:border-teal/40">
            Health packages
          </Link>
          <Link href="/cities" className="rounded-xl border border-line bg-white p-4 text-xs font-medium text-ink hover:border-teal/40">
            Find a centre
          </Link>
        </div>
      </div>
    </section>
  );
}
