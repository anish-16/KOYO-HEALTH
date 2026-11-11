import Link from 'next/link';
import { BadgeCheck, CalendarClock, Check, CreditCard, Sparkles, ArrowUpRight } from 'lucide-react';
import { getSession } from '@/lib/server/session';
import { demoUser } from '@/data/dashboard';
import { membershipTiers, memberUsage } from '@/data/membership';
import { Badge } from '@/components/ui/Primitives';
import { formatDate, formatINR } from '@/lib/utils';

export const metadata = { title: 'Membership', robots: { index: false, follow: false } };

export default async function DashboardMembership() {
  await getSession();
  const gold = membershipTiers[1];
  const platinum = membershipTiers[2];

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Membership</p>
          <h1 className="display mt-1 text-3xl">Your Gold plan</h1>
          <p className="mt-1 text-sm text-muted">Renews {formatDate(demoUser.memberRenewal)} · member since {formatDate(demoUser.memberSince)}</p>
        </div>
        <Link href="/membership" className="btn-outline btn-sm">Compare plans</Link>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c2b25] via-ink to-ink p-6 text-paper sm:p-8">
            <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-gold/20" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-2xs uppercase tracking-[0.16em] text-gold">
                  <BadgeCheck className="h-4 w-4" /> KOYO Gold
                </p>
                <p className="display mt-3 text-3xl">{demoUser.name}</p>
                <p className="mt-1 font-mono text-2xs text-paper/40">MEMBER · KG-{demoUser.id.slice(-4)}-2023</p>
              </div>
              <div className="text-right">
                <p className="text-2xs uppercase tracking-[0.12em] text-paper/40">Active until</p>
                <p className="mt-1 text-sm font-semibold">{formatDate(demoUser.memberRenewal)}</p>
              </div>
            </div>
            <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-paper/10 pt-4 text-2xs">
              {[
                ['Discount', `${gold.discount}%`],
                ['Home visits', 'Free'],
                ['Profiles', '5 of 5 used'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-paper/40">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {memberUsage.map((u) => (
              <div key={u.label} className="card p-4">
                <p className="display text-xl">{u.value}</p>
                <p className="text-2xs font-medium text-ink/70">{u.label}</p>
                <p className="mt-0.5 text-2xs text-muted">{u.detail}</p>
              </div>
            ))}
          </div>

          <section className="card p-5">
            <h2 className="text-sm font-semibold">Benefits in your plan</h2>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {gold.benefits.map((b) => (
                <li key={b} className="flex gap-2 text-xs leading-relaxed text-ink/75">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" /> {b}
                </li>
              ))}
            </ul>
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold">Billing history</h2>
              <span className="text-2xs text-muted">GST invoices attached</span>
            </div>
            <div className="overflow-x-auto">
            <table className="table-koyo min-w-[520px]">
              <thead>
                <tr><th>Date</th><th>Description</th><th>Method</th><th className="text-right">Amount</th></tr>
              </thead>
              <tbody>
                {[
                  ['2026-08-05', 'Gold membership renewal · 2026–27', 'Visa 4421', 1499],
                  ['2025-08-05', 'Gold membership renewal · 2025–26', 'UPI · HDFC', 1499],
                  ['2024-04-18', 'Gold membership · first year', 'UPI · ICICI', 1299],
                ].map(([date, desc, method, amount]) => (
                  <tr key={String(date)}>
                    <td className="whitespace-nowrap text-xs">{formatDate(String(date))}</td>
                    <td className="text-xs text-ink">{desc}</td>
                    <td className="text-2xs text-muted">{method}</td>
                    <td className="text-right text-xs font-medium">{formatINR(Number(amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Renewal</h2>
              <Badge tone="teal">Active</Badge>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-ink/75">
              <CalendarClock className="h-4 w-4 text-teal" /> Auto-renew off — we will email 30 days before.
            </p>
            <p className="mt-2 text-2xs text-muted">Next renewal {formatDate(demoUser.memberRenewal)} at {formatINR(gold.price)}.</p>
            <button type="button" className="btn-primary btn-sm mt-4 w-full">Turn on auto-renew</button>
            <button type="button" className="btn-ghost btn-sm mt-2 w-full text-ink/60">Manage payment method</button>
          </section>

          <section className="rounded-2xl border border-gold/40 bg-gold-soft/50 p-5">
            <p className="inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.12em] text-gold-deep">
              <Sparkles className="h-3.5 w-3.5" /> Upgrade
            </p>
            <h2 className="display mt-2 text-xl">Platinum for the whole family</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
              22% off, eight profiles, a dedicated care manager and a free annual full-body checkup.
              Upgrade now and pay only the difference.
            </p>
            <p className="mt-3 text-sm font-semibold text-ink">
              {formatINR(platinum.price - Math.round(gold.price * 0.4))} <span className="text-2xs font-normal text-muted">prorated for 5 months</span>
            </p>
            <button type="button" className="btn-gold btn-sm mt-3 w-full">Upgrade to Platinum</button>
          </section>

          <section className="card p-5">
            <h2 className="text-sm font-semibold">Membership help</h2>
            <ul className="mt-3 space-y-3 text-xs text-ink/70">
              {[
                ['Transfer to a family member', 'Once per year, free'],
                ['Pause for 3 months', 'Available after 12 months'],
                ['Cancel membership', 'Stays active until renewal'],
              ].map(([title, body]) => (
                <li key={title} className="flex items-start justify-between gap-2 border-b border-line pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-ink">{title}</p>
                    <p className="text-2xs text-muted">{body}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 text-ink/30" />
                </li>
              ))}
            </ul>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal-deep hover:underline">
              <CreditCard className="h-3.5 w-3.5" /> Talk to membership support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
