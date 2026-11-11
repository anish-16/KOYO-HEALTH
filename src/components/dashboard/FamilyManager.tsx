'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Droplet, Plus, Search, UserRound, CalendarDays, FileText, Trash2, X } from 'lucide-react';
import type { FamilyMember } from '@/data/types';
import { Badge } from '@/components/ui/Primitives';
import { formatDate } from '@/lib/utils';

export function FamilyManager({ members: initial }: { members: FamilyMember[] }) {
  const [members, setMembers] = useState(initial);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', relation: 'Spouse', age: '', gender: 'Female', bloodGroup: 'O+' });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => (!q ? true : `${m.name} ${m.relation}`.toLowerCase().includes(q)));
  }, [members, query]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.age) return;
    setMembers((prev) => [
      {
        id: `fam-${Date.now()}`,
        name: form.name.trim(),
        relation: form.relation,
        age: Number(form.age),
        gender: form.gender as FamilyMember['gender'],
        bloodGroup: form.bloodGroup,
        phone: '—',
        lastTest: new Date().toISOString().slice(0, 10),
        reports: 0,
      },
      ...prev,
    ]);
    setForm({ name: '', relation: 'Spouse', age: '', gender: 'Female', bloodGroup: 'O+' });
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative sm:w-72">
          <span className="sr-only">Search family members</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or relation"
            className="field py-2.5 pl-9 text-xs"
          />
        </label>
        <button type="button" onClick={() => setAdding(true)} className="btn-teal btn-sm">
          <Plus className="h-3.5 w-3.5" /> Add family member
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <article key={member.id} className="card flex flex-col p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sand text-teal-deep">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink">{member.name}</h2>
                  <p className="text-2xs text-muted">{member.relation} · {member.age} yrs · {member.gender}</p>
                </div>
              </div>
              <Badge tone="teal" className="gap-1">
                <Droplet className="h-2.5 w-2.5" /> {member.bloodGroup}
              </Badge>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-2xs">
              <div className="rounded-lg bg-paper p-2.5">
                <dt className="text-muted">Last test</dt>
                <dd className="mt-0.5 font-medium text-ink">{formatDate(member.lastTest)}</dd>
              </div>
              <div className="rounded-lg bg-paper p-2.5">
                <dt className="text-muted">Reports</dt>
                <dd className="mt-0.5 font-medium text-ink">{member.reports} on file</dd>
              </div>
            </dl>

            <p className="mt-3 text-2xs text-muted">Phone: {member.phone}</p>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <Link href="/book" className="btn-outline btn-sm">Book test</Link>
              <Link href="/dashboard/reports" className="btn-ghost btn-sm">
                <FileText className="h-3.5 w-3.5" /> Reports
              </Link>
              <button
                type="button"
                onClick={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
                className="ml-auto rounded-lg p-2 text-ink/30 hover:bg-clay/10 hover:text-clay"
                aria-label={`Remove ${member.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center text-sm text-muted">No family member matches that name.</div>
      )}

      <div className="rounded-2xl border border-dashed border-line bg-white p-5 text-xs text-muted">
        <CalendarDays className="mb-2 h-4 w-4 text-teal" />
        Family profiles let you book, reschedule and view reports for up to eight people — including
        parents who live in another city. Every profile needs its own consent OTP.
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Add family member">
          <form onSubmit={add} className="w-full max-w-md rounded-3xl bg-paper p-6 shadow-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Family profile</p>
                <h2 className="display mt-1 text-2xl">Add someone</h2>
              </div>
              <button type="button" onClick={() => setAdding(false)} className="rounded-full p-2 text-ink/40 hover:bg-sand" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Full name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="e.g. Ishita Mehta" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Relation</span>
                  <select value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} className="field">
                    {['Spouse', 'Son', 'Daughter', 'Mother', 'Father', 'Sibling', 'Other'].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Age</span>
                  <input required type="number" min={0} max={120} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="field" placeholder="34" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Gender</span>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="field">
                    {['Female', 'Male', 'Other'].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Blood group</span>
                  <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="field">
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setAdding(false)} className="btn-outline btn-sm flex-1">Cancel</button>
              <button type="submit" className="btn-teal btn-sm flex-1">Add profile</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
