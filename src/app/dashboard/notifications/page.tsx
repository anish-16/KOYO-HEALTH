import { getSession } from '@/lib/server/session';
import { notifications } from '@/data/dashboard';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';

export const metadata = { title: 'Notifications', robots: { index: false, follow: false } };

export default async function NotificationsPage() {
  await getSession();
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Updates</p>
        <h1 className="display mt-1 text-3xl">Notifications</h1>
        <p className="mt-1 text-sm text-muted">
          {unread} unread · report releases, appointment changes and offers you actually opted into.
        </p>
      </header>
      <NotificationCenter items={notifications} />
    </div>
  );
}
