'use client';

import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, Receipt, Wallet, CheckCircle2 } from 'lucide-react';
import type { Transaction } from '@/data/types';
import { Badge } from '@/components/ui/Primitives';
import { cn, formatDate, formatINR } from '@/lib/utils';

const presets = [500, 1000, 2000, 5000];

export function WalletPanel({ initialBalance, transactions }: { initialBalance: number; transactions: Transaction[] }) {
  const [balance, setBalance] = useState(initialBalance);
  const [amount, setAmount] = useState(1000);
  const [filter, setFilter] = useState<'All' | 'Credit' | 'Debit' | 'Refund'>('All');
  const [topped, setTopped] = useState<number | null>(null);
  const [ledger, setLedger] = useState(transactions);

  const rows = useMemo(
    () => ledger.filter((t) => (filter === 'All' ? true : t.type === filter)),
    [ledger, filter],
  );

  const spent = ledger.filter((t) => t.type === 'Debit').reduce((s, t) => s + t.amount, 0);
  const added = ledger.filter((t) => t.type !== 'Debit').reduce((s, t) => s + t.amount, 0);

  const topUp = () => {
    if (!Number.isFinite(amount) || amount < 100) return;
    setBalance((b) => b + amount);
    setLedger((prev) => [
      {
        id: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
        date: new Date().toISOString().slice(0, 10),
        description: 'Wallet top-up via UPI',
        amount,
        type: 'Credit',
        balance: balance + amount,
        method: 'UPI · HDFC',
      },
      ...prev,
    ]);
    setTopped(amount);
    setTimeout(() => setTopped(null), 4000);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.5fr]">
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-ink to-ink p-6 text-paper">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="inline-flex items-center gap-2 text-2xs uppercase tracking-[0.14em] text-paper/50">
                <Wallet className="h-3.5 w-3.5" /> KOYO wallet
              </p>
              <Badge tone="gold">Gold · 5% back</Badge>
            </div>
            <p className="display mt-4 text-4xl">{formatINR(balance)}</p>
            <p className="mt-1 text-2xs text-paper/50">Usable on any test, scan or package. Never expires.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-paper/10 pt-4 text-2xs">
              <div>
                <p className="text-paper/40">Added (14 months)</p>
                <p className="mt-0.5 text-sm font-semibold">{formatINR(added)}</p>
              </div>
              <div>
                <p className="text-paper/40">Spent (14 months)</p>
                <p className="mt-0.5 text-sm font-semibold">{formatINR(spent)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold">Add money</h2>
          <p className="mt-1 text-2xs text-muted">UPI, cards and netbanking. Instant credit, 18% GST invoice emailed.</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p)}
                aria-pressed={amount === p}
                className={cn(
                  'rounded-xl border py-2 text-xs font-semibold transition-colors',
                  amount === p ? 'border-teal bg-teal-mist text-teal-deep' : 'border-line text-ink/60 hover:border-ink/25',
                )}
              >
                {formatINR(p)}
              </button>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted">Custom amount</span>
            <input
              type="number"
              min={100}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="field"
            />
          </label>
          <button type="button" onClick={topUp} className="btn-teal mt-3 w-full">
            <Plus className="h-4 w-4" /> Add {formatINR(amount)}
          </button>
          {topped !== null && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-mist px-3 py-2 text-2xs font-medium text-teal-deep">
              <CheckCircle2 className="h-3.5 w-3.5" /> {formatINR(topped)} added. Receipt sent to your email.
            </p>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold">Ways to earn</h2>
          <ul className="mt-3 space-y-2.5 text-xs text-ink/70">
            {[
              ['Refer a friend', '₹250 after their first report'],
              ['Gold membership', '5% back on every booking'],
              ['Corporate credit', 'Employer wellness allocation'],
              ['Annual checkup', '₹500 loyalty bonus'],
            ].map(([title, body]) => (
              <li key={title} className="flex items-start justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="text-2xs text-muted">{body}</p>
                </div>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 text-teal" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
            <Receipt className="h-4 w-4 text-teal" /> Transaction history
          </h2>
          <div className="flex gap-1">
            {(['All', 'Credit', 'Debit', 'Refund'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  'rounded-full px-2.5 py-1 text-2xs font-semibold transition-colors',
                  filter === f ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-koyo min-w-[560px]">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Method</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td className="whitespace-nowrap text-xs">{formatDate(t.date)}</td>
                  <td>
                    <p className="text-xs font-medium text-ink">{t.description}</p>
                    <p className="font-mono text-2xs text-muted">{t.id}</p>
                  </td>
                  <td className="whitespace-nowrap text-2xs text-muted">{t.method}</td>
                  <td className="whitespace-nowrap text-right">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        t.type === 'Debit' ? 'text-ink' : 'text-teal-deep',
                      )}
                    >
                      {t.type === 'Debit' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      {formatINR(t.amount)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-right text-xs text-muted">{formatINR(Math.max(t.balance, 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="p-8 text-center text-xs text-muted">No transactions in this filter.</p>}
        <div className="border-t border-line px-4 py-3 text-2xs text-muted">
          {rows.length} transactions · GST invoices available for every debit
        </div>
      </div>
    </div>
  );
}
