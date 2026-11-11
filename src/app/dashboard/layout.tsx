import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { getSession } from '@/lib/server/session';
import { demoUser, notifications } from '@/data/dashboard';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Badge } from '@/components/ui/Primitives';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard');

  const unread = notifications.filter((n) => !n.read).length;
  const initials = session.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-sand/40">
      <div className="shell py-6 lg:py-10">
        {/* minmax(0,1fr) at every width: the implicit auto track would size itself to
            the widest table below and push the whole shell sideways on a phone. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          <aside className="min-w-0 space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-sm font-semibold text-gold">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{session.name}</p>
                  <p className="text-2xs text-muted">+91 {session.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-teal-mist px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.1em] text-teal-deep">
                  <Sparkles className="h-3.5 w-3.5" /> {demoUser.memberTier} member
                </span>
                <Badge tone="gold">{demoUser.healthScore} health score</Badge>
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <DashboardNav unread={unread} />
              </div>
            </div>

            <div className="card p-5">
              <p className="eyebrow">Your care manager</p>
              <p className="mt-2 text-sm font-semibold text-ink">{demoUser.careManager}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                One person for bookings, reports and insurance paperwork. 8 am – 8 pm, all days.
              </p>
              <a
                href={`tel:+91${demoUser.careManagerPhone}`}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-deep hover:underline"
              >
                <Phone className="h-3.5 w-3.5" /> {demoUser.careManagerPhone.replace(/(\d{5})(\d{5})/, '$1 $2')}
              </a>
            </div>

            <div className="hidden rounded-2xl bg-ink p-5 text-paper lg:block">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <p className="mt-3 text-sm font-semibold">Records stay yours</p>
              <p className="mt-1.5 text-xs leading-relaxed text-paper/60">
                Reports are encrypted, shareable with a 24-hour link, and never sold. NABH & NABL
                audited.
              </p>
              <Link href="/legal/privacy" className="mt-3 inline-block text-2xs font-semibold uppercase tracking-[0.12em] text-gold hover:underline">
                Read policy
              </Link>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
