import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CallbackButton } from './CallbackButton';

export function CTASection({
  eyebrow = 'Ready when you are',
  title = 'Ready to book your diagnostic test today?',
  description = 'Book online in two minutes, or let a clinician help you choose. Free cancellation up to four hours before your appointment.',
  primaryHref = '/book',
  primaryLabel = 'Book a test',
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="shell py-16 lg:py-20">
      <div className="surface-ink grain relative overflow-hidden rounded-[2rem] px-7 py-12 text-paper sm:px-12 lg:px-16 lg:py-16">
        <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-paper/10" />
        <div className="pointer-events-none absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-gold/10 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-gold">{eyebrow}</p>
            <h2 className="display mt-3 max-w-2xl text-[2.3rem] leading-[1.03] sm:text-[3.2rem]">{title}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/55">{description}</p>
          </div>
          <div className="flex flex-col gap-2.5 lg:col-span-4 lg:items-end">
            <Link href={primaryHref} className="btn-gold w-full justify-center sm:w-auto">
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryHref && secondaryLabel && (
              <Link
                href={secondaryHref}
                className="btn w-full justify-center border border-paper/20 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10 sm:w-auto"
              >
                {secondaryLabel}
              </Link>
            )}
            <CallbackButton
              label="Get a call back"
              variant="outline"
              className="w-full justify-center border-paper/20 text-paper hover:bg-paper/10 sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
