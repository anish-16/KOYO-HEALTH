'use client';

import { useMemo, useState } from 'react';
import { Bell, FileText, CalendarDays, Gift, AlarmClock, CheckCheck, Circle } from 'lucide-react';
import type { Notification } from '@/data/types';
import { Badge } from '@/components/ui/Primitives';
import { cn, formatDateTime } from '@/lib/utils';

const kindMeta = {
  report: { icon: FileText, label: 'Reports', tone: 'bg-teal-mist text-teal-deep' },
  booking: { icon: CalendarDays, label: 'Bookings', tone: 'bg-gold-soft text-gold-deep' },
  offer: { icon: Gift, label: 'Offers', tone: 'bg-clay/10 text-clay' },
  reminder: { icon: AlarmClock, label: 'Reminders', tone: 'bg-sand text-ink/60' },
} as const;

export function NotificationCenter({ items: initial }: { items: Notification[] }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<'All' | Notification['kind']>('All');

  const filtered = useMemo(
    () => items.filter((n) => (filter === 'All' ? true : n.kind === filter)),
    [items, filter],
  );
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {(['All', 'report', 'booking', 'offer', 'reminder'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f ? 'bg-ink text-paper' : 'border border-line bg-white text-ink/60 hover:border-ink/25',
              )}
            >
              {f === 'All' ? 'All' : kindMeta[f].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          disabled={unread === 0}
          className="btn-outline btn-sm disabled:opacity-40"
        >
          <CheckCheck className="h-3.5 w-3.5" /> Mark all read ({unread})
        </button>
      </div>

      <ul className="card divide-y divide-line overflow-hidden">
        {filtered.map((n) => {
          const meta = kindMeta[n.kind];
          return (
            <li key={n.id} className={cn('flex items-start gap-3 p-4 transition-colors sm:p-5', !n.read && 'bg-teal-mist/30')}>
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', meta.tone)}>
                <meta.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn('text-sm', n.read ? 'font-medium text-ink/80' : 'font-semibold text-ink')}>{n.title}</p>
                  {!n.read && <Badge tone="teal">New</Badge>}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">{n.body}</p>
                <p className="mt-1.5 text-2xs text-muted">{formatDateTime(n.time)} · {meta.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)))}
                className="shrink-0 rounded-lg p-2 text-ink/30 hover:bg-sand hover:text-ink"
                aria-label={n.read ? 'Mark as unread' : 'Mark as read'}
              >
                {n.read ? <Circle className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5 text-teal" />}
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 && <p className="card p-10 text-center text-sm text-muted">Nothing here yet.</p>}
    </div>
  );
}
