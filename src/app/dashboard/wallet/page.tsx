import { getSession } from '@/lib/server/session';
import { demoUser, transactions } from '@/data/dashboard';
import { WalletPanel } from '@/components/dashboard/WalletPanel';

export const metadata = { title: 'Wallet', robots: { index: false, follow: false } };

export default async function WalletPage() {
  await getSession();
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Payments</p>
        <h1 className="display mt-1 text-3xl">Wallet & billing</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          One balance for every booking. Top up once, pay instantly at any KOYO centre, and download
          GST invoices for insurance or employer reimbursement.
        </p>
      </header>
      <WalletPanel initialBalance={demoUser.walletBalance} transactions={transactions} />
    </div>
  );
}
