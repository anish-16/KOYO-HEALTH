import { getSession } from '@/lib/server/session';
import { familyMembers } from '@/data/dashboard';
import { FamilyManager } from '@/components/dashboard/FamilyManager';

export const metadata = { title: 'Family profiles', robots: { index: false, follow: false } };

export default async function FamilyPage() {
  await getSession();
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Household</p>
        <h1 className="display mt-1 text-3xl">Family profiles</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          {familyMembers.length} people, {familyMembers.reduce((sum, m) => sum + m.reports, 0)} reports and one shared
          calendar. Book for a parent in another city without switching accounts.
        </p>
      </header>
      <FamilyManager members={familyMembers} />
    </div>
  );
}
