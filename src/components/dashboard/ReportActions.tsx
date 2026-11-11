'use client';

import { useState } from 'react';
import { Check, Copy, Download, Link2, Printer } from 'lucide-react';

export function ReportActions({ reportId }: { reportId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const token = Math.random().toString(36).slice(2, 10);
    setLink(`https://koyohealth.in/share/${reportId.toLowerCase()}-${token}`);
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => window.print()} className="btn-outline btn-sm">
        <Printer className="h-3.5 w-3.5" /> Print
      </button>
      <button type="button" className="btn-outline btn-sm">
        <Download className="h-3.5 w-3.5" /> Download PDF
      </button>
      <button type="button" onClick={generate} className="btn-primary btn-sm">
        <Link2 className="h-3.5 w-3.5" /> Share securely
      </button>
      {link && (
        <div className="flex w-full items-center gap-2 rounded-xl border border-teal/25 bg-teal-mist px-3 py-2">
          <span className="min-w-0 flex-1 truncate font-mono text-2xs text-teal-deep">{link}</span>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      {link && <p className="w-full text-2xs text-muted">Link expires in 24 hours. Anyone with it can view this report.</p>}
    </div>
  );
}
