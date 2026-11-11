import { redirect } from 'next/navigation';
import { getSession } from '@/lib/server/session';
import { SettingsForm } from '@/components/dashboard/SettingsForm';

export const metadata = { title: 'Account settings', robots: { index: false, follow: false } };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/settings');
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Account</p>
        <h1 className="display mt-1 text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">Profile, communication preferences, security and data controls.</p>
      </header>
      <SettingsForm user={session} />
    </div>
  );
}
