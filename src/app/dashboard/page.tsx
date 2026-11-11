import Link from 'next/link';
import {
  ArrowUpRight, CalendarDays, FileText, Users, Wallet, HeartPulse, Clock,
  CheckCircle2, AlertTriangle, MapPin, Scan, Video, ChevronRight, Gift,
} from 'lucide-react';
import { getSession } from '@/lib/server/session';
import {
  demoUser, dashboardStats, healthMetrics, bookings, reports, healthTimeline, notifications, documents,
} from '@/data/dashboard';
import { Sparkline } from '@/components/dashboard/Sparkline';
import { Badge } from '@/components/ui/Primitives';
import { formatDate, formatINR, istGreeting } from '@/lib/utils';
import { packages } from '@/data/packages';

export const metadata = { title: 'Health dashboard', robots: { index: false, follow: false } };

const statTiles = [
  { label: 'Bookings', value: dashboardStats.totalBookings, icon: CalendarDays, href: '/dashboard/bookings', note: '2 upcoming' },
  { label: 'Reports ready', value: dashboardStats.reportsReady, icon: FileText, href: '/dashboard/reports', note: '1 processing' },
  { label: 'Family profiles', value: dashboardStats.familyProfiles, icon: Users, href: '/dashboard/family', note: '2 need a checkup' },
  { label: 'Saved this year', value: formatINR(dashboardStats.savedThisYear, { compact: true }), icon: Wallet, href: '/dashboard/wallet', note: `${formatINR(dashboardStats.walletBalance)} in wallet` },
];

export default async function DashboardOverview() {
  const session = await getSession();
  const firstName = (session?.name ?? demoUser.name).split(' ')[0];
  const { dayLabel, greeting } = istGreeting();
  const upcoming = bookings.filter((b) => b.status === 'Upcoming');
  const nextBooking = upcoming[0];
  const readyReports = reports.filter((r) => r.status === 'Ready');
  const processing = reports.filter((r) => r.status !== 'Ready');
  const unread = notifications.filter((n) => !n.read);
  const suggestedPackage = packages.find((p) => p.slug === 'full-body-checkup') ?? packages[0];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-paper sm:p-8">
        <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-teal/25 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-gold">{dayLabel}</p>
            <h1 className="display mt-2 text-[2.1rem] leading-tight sm:text-[2.6rem]">
              {greeting}, {firstName}.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper/60">
              Your health score is up {demoUser.healthScoreDelta} points this quarter. One lipid
              value still needs attention, and your MRI is confirmed for 14 November.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/book" className="btn-gold btn-sm">
              Book a test <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/dashboard/reports" className="btn btn-sm border border-paper/20 px-4 py-2 text-paper hover:bg-paper/10">
              Latest report
            </Link>
          </div>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-4">
            <p className="text-2xs uppercase tracking-[0.12em] text-paper/40">Health score</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="display text-3xl">{demoUser.healthScore}</span>
              <span className="pb-1 text-xs text-teal-soft">+{demoUser.healthScoreDelta} pts</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper/10">
              <div className="h-full rounded-full bg-gradient-to-r from-teal to-gold" style={{ width: `${demoUser.healthScore}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-4">
            <p className="text-2xs uppercase tracking-[0.12em] text-paper/40">Next appointment</p>
            <p className="mt-1 text-sm font-semibold">MRI Brain · 14 Nov</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-paper/50">
              <Clock className="h-3 w-3" /> 8:30 am · Sector 62
            </p>
          </div>
          <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-4">
            <p className="text-2xs uppercase tracking-[0.12em] text-paper/40">Care streak</p>
            <p className="mt-1 text-sm font-semibold">{demoUser.streakMonths} months on track</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-paper/50">
              <Gift className="h-3 w-3" /> {demoUser.loyaltyPoints.toLocaleString('en-IN')} points
            </p>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statTiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="card group p-4 transition-shadow hover:shadow-lift">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-mist text-teal-deep">
                <tile.icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-ink/20 transition-colors group-hover:text-teal" />
            </div>
            <p className="display mt-3 text-2xl text-ink">{tile.value}</p>
            <p className="text-xs font-medium text-ink/70">{tile.label}</p>
            <p className="mt-0.5 text-2xs text-muted">{tile.note}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-6">
          {/* Health metrics */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Biomarker trends</p>
                <h2 className="display mt-1 text-2xl">Six numbers that matter</h2>
              </div>
              <Link href="/dashboard/reports/rpt-4471" className="link-underline text-xs">
                Full report <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="rounded-xl border border-line bg-paper/60 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-ink/70">{metric.label}</p>
                    <Badge tone={metric.tone === 'good' ? 'teal' : 'clay'} className="px-2 py-0.5">
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <div>
                      <span className="display text-xl text-ink">{metric.value}</span>
                      <span className="ml-1 text-2xs text-muted">{metric.unit}</span>
                      <p className="mt-1 max-w-[170px] text-2xs leading-snug text-muted">{metric.detail}</p>
                    </div>
                    <Sparkline values={metric.trend} tone={metric.tone === 'good' ? 'teal' : 'clay'} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming bookings */}
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Upcoming appointments</h2>
              <Link href="/dashboard/bookings" className="link-underline text-xs">All bookings</Link>
            </div>
            <ul className="divide-y divide-line">
              {upcoming.map((booking) => (
                <li key={booking.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-mist text-teal-deep">
                      {booking.mode === 'Home Collection' ? <MapPin className="h-4 w-4" /> : <Scan className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{booking.tests.join(' · ')}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {booking.patient} · {booking.center} · {formatDate(booking.date)} at {booking.slot}
                      </p>
                      <p className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge tone="teal">{booking.mode}</Badge>
                        <Badge>{booking.payment}</Badge>
                        {booking.technician && <Badge>Technician {booking.technician.split(' ')[0]}</Badge>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <button type="button" className="btn-outline btn-sm">Reschedule</button>
                    <Link href={`/dashboard/bookings`} className="btn-primary btn-sm">Prepare</Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Reports */}
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Reports</h2>
              <Link href="/dashboard/reports" className="link-underline text-xs">All {reports.length} reports</Link>
            </div>
            <ul className="divide-y divide-line">
              {readyReports.slice(0, 3).map((report) => (
                <li key={report.id}>
                  <Link href={`/dashboard/reports/${report.id.toLowerCase()}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-teal-mist/50">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-soft text-gold-deep">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{report.title}</p>
                      <p className="text-2xs text-muted">{report.patient} · {formatDate(report.date)} · {report.pages} pages</p>
                    </div>
                    <Badge tone="teal">Ready</Badge>
                    <ChevronRight className="h-4 w-4 text-ink/25" />
                  </Link>
                </li>
              ))}
              {processing.map((report) => (
                <li key={report.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sand text-ink/50">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{report.title}</p>
                    <p className="text-2xs text-muted">{report.patient} · sample received</p>
                  </div>
                  <Badge tone="gold">{report.status}</Badge>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          {/* Timeline */}
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Care timeline</h2>
              <HeartPulse className="h-4 w-4 text-clay" />
            </div>
            <ol className="mt-4 space-y-4 border-l border-line pl-4">
              {healthTimeline.map((item) => (
                <li key={`${item.date}-${item.title}`} className="relative">
                  <span
                    className={`absolute -left-[1.32rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      item.kind === 'upcoming' ? 'bg-gold' : item.kind === 'report' ? 'bg-teal' : 'bg-ink/30'
                    }`}
                  />
                  <p className="text-2xs uppercase tracking-[0.1em] text-muted">{formatDate(item.date)}</p>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Action queue */}
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Needs your attention</h2>
            <ul className="mt-3 space-y-3">
              {[
                { icon: AlertTriangle, tone: 'text-clay', title: 'LDL cholesterol 112 mg/dL', body: 'Repeat lipids in 3 weeks or start the 12-week nutrition programme.', href: '/packages/heart-health' },
                { icon: FileText, tone: 'text-gold-deep', title: 'MRI pre-scan checklist', body: 'Remove metal, carry prior imaging, arrive 20 minutes early.', href: '/services/mri' },
                { icon: Video, tone: 'text-teal-deep', title: 'Free physician call included', body: '15-minute report walkthrough with Dr. Farah Qureshi.', href: '/dashboard/reports/rpt-4471' },
                { icon: Users, tone: 'text-mauve', title: 'Kabir: low ferritin', body: 'Repeat ferritin test recommended after 12 weeks of iron-rich diet.', href: '/dashboard/family' },
              ].map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="flex items-start gap-3 rounded-xl border border-line p-3 transition-colors hover:border-teal/40 hover:bg-teal-mist/40">
                    <item.icon className={`mt-0.5 h-4 w-4 shrink-0 ${item.tone}`} />
                    <div>
                      <p className="text-xs font-semibold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-2xs leading-snug text-muted">{item.body}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Documents */}
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Documents</h2>
            <ul className="mt-3 divide-y divide-line">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-sand text-2xs font-semibold text-ink/60">
                    {doc.type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink">{doc.name}</p>
                    <p className="text-2xs text-muted">{formatDate(doc.date)} · {doc.size}</p>
                  </div>
                  <button type="button" className="text-2xs font-semibold uppercase tracking-[0.1em] text-teal-deep hover:underline">
                    Open
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Notifications preview */}
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Unread updates</h2>
              <Badge tone="clay">{unread.length} new</Badge>
            </div>
            <ul className="mt-3 space-y-3">
              {unread.map((n) => (
                <li key={n.id} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <div>
                    <p className="text-xs font-semibold text-ink">{n.title}</p>
                    <p className="mt-0.5 text-2xs leading-snug text-muted">{n.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/notifications" className="mt-4 inline-flex text-xs font-semibold text-teal-deep hover:underline">
              View all notifications
            </Link>
          </section>

          {/* Recommendation */}
          <section className="overflow-hidden rounded-2xl bg-forest p-5 text-paper">
            <p className="eyebrow text-gold">Recommended for you</p>
            <h2 className="display mt-2 text-xl leading-snug">{suggestedPackage.name}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-paper/60">{suggestedPackage.tagline}</p>
            <p className="mt-3 text-sm font-semibold">
              {formatINR(suggestedPackage.price)}{' '}
              <span className="text-xs font-normal text-paper/40 line-through">{formatINR(suggestedPackage.mrp)}</span>
            </p>
            <Link href={`/packages/${suggestedPackage.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
              View package <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
