'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export type AccordionItem = { q: string; a: string };

export function Accordion({
  items,
  defaultOpen = 0,
  className,
  numbered = false,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
  numbered?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const reduce = useReducedMotion();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={`${baseId}-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start gap-4 py-5 text-left transition-colors hover:text-teal-deep"
              >
                {numbered && (
                  <span className="tabular mt-0.5 text-2xs font-semibold tracking-[0.12em] text-teal/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="flex-1 text-[0.98rem] font-medium leading-relaxed text-ink">{item.q}</span>
                <span
                  className={cn(
                    'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300',
                    isOpen
                      ? 'rotate-45 border-teal bg-teal text-white'
                      : 'border-ink/15 text-ink/60 group-hover:border-teal/50',
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${baseId}-panel-${i}`}
                  role="region"
                  aria-labelledby={`${baseId}-trigger-${i}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-10 text-sm leading-[1.75] text-muted md:pl-0">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
