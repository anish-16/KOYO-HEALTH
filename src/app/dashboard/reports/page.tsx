import { getSession } from '@/lib/server/session';
import { reports } from '@/data/dashboard';
import { ReportsBrowser } from '@/components/dashboard/ReportsBrowser';

export const metadata = { title: 'My reports', robots: { index: false, follow: false } };

export default async function ReportsPage() {
  await getSession();
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Records</p>
        <h1 className="display mt-1 text-3xl">Reports & documents</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Every result is reviewed by a consultant before release. Flagged values are explained in
          plain language, with the next step attached.
        </p>
      </header>
      <ReportsBrowser reports={reports} />
    </div>
  );
}
