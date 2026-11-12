'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock, Home, ShieldCheck } from 'lucide-react';
import { ServiceIcon } from '@/components/brand/ServiceIcon';
import { SectionHeading } from '@/components/ui/Primitives';
import { TestTrigger } from '@/components/tests/TestDetailProvider';
import { formatINR } from '@/lib/utils';
import {
  disciplines, formatReport, testsInGroup, type Discipline, type DisciplineGroup,
} from '@/data/tests';

/**
 * Pathology and imaging are different purchases — one is a blood draw at home,
 * the other is a scanner you travel to — so they get two separate sections
 * rather than one filter chip apart. Both open the same detail panel.
 */
export function DisciplineSections() {
  const [pathology, imaging] = disciplines;

  return (
    <>
      <LabSection discipline={pathology} />
      <ScanSection discipline={imaging} />
    </>
  );
}

function LabSection({ discipline }: { discipline: Discipline }) {
  const rows = discipline.featured;

  return (
    <section id="blood-tests" className="border-y border-line bg-sand/40 py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={discipline.eyebrow}
          title={discipline.headline}
          description={discipline.blurb}
          action={
            <Link href={`/tests/${discipline.slug}`} className="btn-outline btn-sm">
              All {discipline.tests.length} blood tests <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink/40">
              Six groups · {discipline.tests.length} tests
            </p>
            <ul className="mt-3 border-t border-line">
              {discipline.groups.slice(0, 6).map((group) => (
                <li key={group.key} className="border-b border-line">
                  <Link
                    href={`/tests/${discipline.slug}#${group.key.split(':')[1]}`}
                    className="group flex items-center gap-3 py-3 transition-colors hover:text-teal-deep"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-teal-deep ring-1 ring-line transition-colors group-hover:bg-teal group-hover:text-white">
                      <ServiceIcon name={group.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.8125rem] font-medium">{group.label}</span>
                      <span className="block truncate text-[0.6875rem] text-muted">{group.blurb}</span>
                    </span>
                    <span className="tabular text-[0.625rem] text-ink/35">{group.ids.length}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-ink/20 transition-transform group-hover:translate-x-0.5 group-hover:text-teal" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[0.625rem] text-ink/60">
                <Home className="h-3 w-3 text-teal" /> Free home collection over ₹499
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[0.625rem] text-ink/60">
                <Clock className="h-3 w-3 text-teal" /> Reports in {discipline.fastestReport} h
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between text-2xs font-semibold uppercase tracking-[0.14em] text-ink/40">
              <span>Booked most often</span>
              <span className="hidden sm:inline">From {formatINR(discipline.minPrice)}</span>
            </div>
            <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              {rows.map((test) => (
                <li key={test.id} className="border-b border-line last:border-0">
                  <div className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-teal-mist/40 sm:px-5">
                    <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-mist text-teal-deep sm:grid">
                      <ServiceIcon name={test.groupIcon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <TestTrigger
                        id={test.id}
                        className="block max-w-full truncate text-left text-[0.875rem] font-medium text-ink hover:text-teal-deep"
                      >
                        {test.name}
                      </TestTrigger>
                      <p className="mt-0.5 truncate text-[0.6875rem] text-muted">
                        {test.groupLabel} · {test.homeCollection ? 'Home or centre' : 'Centre only'} ·
                        report {formatReport(test.reportHours)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tabular text-[0.875rem] font-semibold">{formatINR(test.price)}</p>
                      <p className="text-[0.625rem] text-ink/35 line-through">{formatINR(test.mrp)}</p>
                    </div>
                    <TestTrigger
                      id={test.id}
                      className="ml-1 shrink-0 rounded-full border border-teal/25 bg-white px-3 py-1.5 text-[0.6875rem] font-semibold text-teal-deep transition-colors hover:bg-teal hover:text-white"
                    >
                      Book
                    </TestTrigger>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-teal" /> {discipline.reassurance}
              </span>
              <Link href={`/tests/${discipline.slug}`} className="link-underline font-medium text-teal-deep">
                Browse the full lab menu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScanSection({ discipline }: { discipline: Discipline }) {
  const groups = discipline.menuGroups;

  return (
    <section id="scans" className="surface-ink grain relative overflow-hidden py-20 text-paper lg:py-28">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full border border-paper/10" />
      <div className="shell relative">
        <SectionHeading
          tone="light"
          eyebrow={discipline.eyebrow}
          title={discipline.headline}
          description={discipline.blurb}
          action={
            <Link
              href={`/tests/${discipline.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-paper/25 px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              All {discipline.tests.length} scans <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <ScanGroup key={group.key} group={group} slug={discipline.slug} />
          ))}
        </div>

        <div className="mt-8 grid gap-3 border-t border-paper/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Same-day slots', detail: 'Booked until 9 pm, 7 days a week' },
            { label: `${discipline.fastestReport} h fastest report`, detail: 'Radiologist-signed, not a template' },
            { label: 'DICOM vault', detail: 'Full series downloadable, free' },
            { label: '268 centres', detail: 'NABH & NABL accredited' },
          ].map((fact) => (
            <div key={fact.label}>
              <p className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-paper">
                <Check className="h-3.5 w-3.5 text-gold" /> {fact.label}
              </p>
              <p className="mt-0.5 pl-5 text-[0.6875rem] text-paper/50">{fact.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScanGroup({ group, slug }: { group: DisciplineGroup; slug: string }) {
  const tests = testsInGroup(group);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-paper/12 bg-paper/[0.04] p-5 transition-colors hover:border-gold/40">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-gold">
          <ServiceIcon name={group.icon} className="h-3.5 w-3.5" strokeWidth={1.6} />
          {group.label}
        </p>
        <span className="tabular text-[0.625rem] text-paper/30">{group.ids.length}</span>
      </div>
      <p className="mt-2 text-[0.6875rem] leading-relaxed text-paper/45">{group.blurb}</p>

      <ul className="mt-3 flex-1 space-y-px">
        {tests.slice(0, 3).map((test) => (
          <li key={test.id}>
            <TestTrigger
              id={test.id}
              className="group flex w-full items-baseline justify-between gap-2 rounded-md py-1.5 text-left transition-colors hover:text-gold"
            >
              <span className="truncate text-[0.8125rem] text-paper/80 group-hover:text-paper">
                {test.name}
              </span>
              <span className="tabular shrink-0 text-[0.625rem] text-paper/40">
                {formatINR(test.price)}
              </span>
            </TestTrigger>
          </li>
        ))}
      </ul>

      <Link
        href={`/tests/${slug}#${group.key.split(':')[1]}`}
        className="mt-3 inline-flex items-center gap-1 text-[0.625rem] font-medium text-paper/50 transition-colors hover:text-paper"
      >
        {tests.length > 3 ? `${tests.length - 3} more` : 'View group'} <ArrowRight className="h-3 w-3" />
      </Link>
    </article>
  );
}
