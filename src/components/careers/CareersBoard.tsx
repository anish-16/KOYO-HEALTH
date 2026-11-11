'use client';

import { useMemo, useState } from 'react';
import { MapPin, Clock, Briefcase, ArrowUpRight, X, CheckCircle2, Search } from 'lucide-react';
import { careers } from '@/data/company';
import { Badge } from '@/components/ui/Primitives';
import { cn, formatDate } from '@/lib/utils';

type Job = (typeof careers)[number];

export function CareersBoard() {
  const [department, setDepartment] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);

  const departments = useMemo(() => ['All', ...Array.from(new Set(careers.map((c) => c.department)))], []);

  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return careers
      .filter((j) => (department === 'All' ? true : j.department === department))
      .filter((j) => (!q ? true : `${j.title} ${j.location} ${j.skills.join(' ')}`.toLowerCase().includes(q)));
  }, [department, query]);

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelected(null);
    }, 2200);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {departments.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDepartment(d)}
              aria-pressed={department === d}
              className={cn(
                'rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors',
                department === d ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink/60 hover:border-ink/25',
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <label className="relative lg:w-64">
          <span className="sr-only">Search roles</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or skill" className="field py-2.5 pl-9 text-xs" />
        </label>
      </div>

      <ul className="mt-5 space-y-3">
        {jobs.map((job) => (
          <li key={job.id} className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-ink">{job.title}</h2>
                  <Badge tone="teal">{job.department}</Badge>
                  <Badge>{job.type}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-2xs text-muted">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.experience}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {formatDate(job.posted)}</span>
                  <span className="font-medium text-ink/70">{job.salary}</span>
                </div>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink/65">{job.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills.map((s) => <span key={s} className="rounded bg-sand px-1.5 py-0.5 text-2xs text-ink/60">{s}</span>)}
                </div>
              </div>
              <button type="button" onClick={() => setSelected(job)} className="btn-primary btn-sm shrink-0 self-start">
                Apply <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {jobs.length === 0 && <p className="card mt-4 p-10 text-center text-sm text-muted">No open roles in this filter. Send a speculative application instead.</p>}

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Apply for ${selected.title}`}>
          <form onSubmit={apply} className="w-full max-w-lg rounded-3xl bg-paper p-6 shadow-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">{selected.department} · {selected.location}</p>
                <h2 className="display mt-1 text-2xl">{selected.title}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full p-2 text-ink/40 hover:bg-sand" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            {applied ? (
              <p className="mt-6 flex items-center gap-2 rounded-xl bg-teal-mist p-4 text-sm font-medium text-teal-deep">
                <CheckCircle2 className="h-4 w-4" /> Application received. Our talent team replies within 5 working days.
              </p>
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Full name</span>
                    <input required className="field" placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Email</span>
                    <input required type="email" className="field" placeholder="you@example.com" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Phone</span>
                    <input required className="field" placeholder="98XXXXXXXX" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Years of experience</span>
                    <input required type="number" min={0} max={40} className="field" placeholder="6" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Portfolio or LinkedIn</span>
                    <input className="field" placeholder="https://" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Why this role?</span>
                    <textarea rows={3} className="field resize-none" placeholder="Two or three sentences is plenty." />
                  </label>
                </div>
                <button type="submit" className="btn-teal mt-4 w-full">Submit application</button>
                <p className="mt-2 text-center text-2xs text-muted">Demo form — no data leaves this page.</p>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
