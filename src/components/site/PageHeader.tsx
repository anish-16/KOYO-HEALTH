import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Primitives';
import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  aside,
  compact = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section className={cn('relative overflow-hidden border-b border-line bg-paper', className)}>
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:56px_56px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className={cn('shell relative', compact ? 'py-10' : 'py-12 lg:py-16')}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={cn('grid gap-8', aside && 'lg:grid-cols-12 lg:items-end')}>
          <div className={aside ? 'lg:col-span-8' : 'max-w-3xl'}>
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h1 className="display max-w-3xl text-[2.4rem] leading-[1.02] sm:text-[3rem] lg:text-[3.4rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{description}</p>
            )}
            {children}
          </div>
          {aside && <div className="lg:col-span-4">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
