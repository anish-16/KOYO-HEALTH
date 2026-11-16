'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck, Building2, CalendarDays, LayoutDashboard, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/portal/b2b', label: 'Overview', icon: LayoutDashboard },
  { href: '/portal/b2b/partners', label: 'Partners', icon: Building2, opsOnly: true },
  { href: '/portal/b2b/catalogue', label: 'Catalogue', icon: BookOpenCheck },
  { href: '/portal/b2b/employees', label: 'Employees', icon: Users },
  { href: '/portal/b2b/bookings', label: 'Bookings', icon: CalendarDays },
];

export function PortalNav({ role }: { role: 'ops' | 'partner' }) {
  const pathname = usePathname();
  const items = ITEMS.filter((item) => !item.opsOnly || role === 'ops');

  return (
    <nav aria-label="Partner portal" className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {items.map((item) => {
        const active =
          pathname === item.href || (item.href !== '/portal/b2b' && pathname.startsWith(item.href));
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
          </Link>
        );
      })}
    </nav>
  );
}
