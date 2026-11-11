'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, FileText, Users, Wallet, BadgeCheck, Bell, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/family', label: 'Family', icon: Users },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/membership', label: 'Membership', icon: BadgeCheck },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const count = item.href === '/dashboard/notifications' ? unread : item.badge;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-white hover:text-ink',
            )}
          >
            <item.icon className={cn('h-4 w-4', active ? 'text-gold' : 'text-ink/40 group-hover:text-teal')} />
            <span>{item.label}</span>
            {count ? (
              <span
                className={cn(
                  'ml-auto rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold',
                  active ? 'bg-gold text-ink' : 'bg-clay/10 text-clay',
                )}
              >
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
