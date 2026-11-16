import type { Metadata } from 'next';

/**
 * Portal surfaces are private workspaces and patient records. Keeping the
 * whole area noindex here means a new portal page cannot accidentally be
 * crawled, and it stays out of the sitemap by construction.
 */
export const metadata: Metadata = {
  title: {
    default: 'Portal',
    template: '%s | KOYO Portal',
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
