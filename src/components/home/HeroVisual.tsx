'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Activity, Check, Clock3, Droplets, FlaskConical, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * The hero runs a live scene rather than a still.
 *
 * A sample moves through the network on a loop — collected, in the analyser,
 * verified, report out — while an ECG trace and a rotating scan ring keep the
 * panel alive. Everything is SVG/CSS, so it stays sharp at any size, weighs
 * nothing, and honours `prefers-reduced-motion` by freezing on a finished state.
 */

const STEPS = [
  { label: 'Sample collected', detail: 'Home visit · barcoded kit', icon: Droplets },
  { label: 'In the analyser', detail: 'NABL lab · 42 minutes', icon: FlaskConical },
  { label: 'Clinician verified', detail: 'MD pathologist sign-off', icon: ShieldCheck },
  { label: 'Report ready', detail: 'App, email and WhatsApp', icon: Check },
];

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? STEPS.length - 1 : 1);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="surface-ink grain relative aspect-[4/4.9] overflow-hidden rounded-[2rem] border border-ink/10 shadow-lift">
        {/* Instrument grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.06] px-3 py-1.5 text-[0.625rem] text-paper/80 backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full bg-gold"
                animate={{ scale: [1, 3.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className="relative h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          Live network · NABL accredited
        </div>

        {/* Scan stage */}
        <div className="absolute inset-x-0 top-[9%] flex justify-center">
          <div className="relative h-[15rem] w-[15rem]">
            <svg viewBox="0 0 320 320" className="h-full w-full" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#BF9B4F" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#BF9B4F" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#BF9B4F" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#BF9B4F" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="160" cy="160" r="150" stroke="#F7F4EE" strokeOpacity="0.08" />
              <circle cx="160" cy="160" r="112" stroke="#F7F4EE" strokeOpacity="0.16" strokeDasharray="1 8" />
              <circle cx="160" cy="160" r="74" stroke="#F7F4EE" strokeOpacity="0.1" />
              <circle cx="160" cy="160" r="74" fill="url(#core)" />

              {/* Rotating scan sweep */}
              <motion.g
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '160px 160px' }}
              >
                <path d="M160 160 L160 60 A100 100 0 0 1 236 231 Z" fill="url(#sweep)" />
              </motion.g>

              {/* Volume of live sample */}
              <motion.circle
                cx="160"
                cy="160"
                r="46"
                stroke="#BF9B4F"
                strokeOpacity="0.55"
                strokeWidth="1.2"
                fill="none"
                animate={reduce ? undefined : { r: [44, 50, 44], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="160" cy="160" r="3.5" fill="#BF9B4F" />
            </svg>

            {/* ECG trace across the dial */}
            <svg viewBox="0 0 300 80" className="absolute inset-x-4 top-1/2 -translate-y-1/2" fill="none" aria-hidden="true">
              <path
                d="M0 46h44l7-16 9 34 11-52 12 62 9-28h26l6-12 7 12h30l8-20 9 40 8-20h93"
                stroke="#F7F4EE"
                strokeOpacity="0.14"
                strokeWidth="1.4"
              />
              <motion.path
                d="M0 46h44l7-16 9 34 11-52 12 62 9-28h26l6-12 7 12h30l8-20 9 40 8-20h93"
                stroke="#BF9B4F"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
                transition={reduce ? undefined : { duration: 4.6, repeat: Infinity, times: [0, 0.55, 0.75, 1], ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>

        <div className="absolute left-1/2 top-[17%] -translate-x-1/2 text-center">
          <p className="text-[0.5rem] uppercase tracking-[0.3em] text-paper/35">Sample → report</p>
          <p className="mt-1 font-display text-xl text-paper/85">4 hours, end to end</p>
        </div>

        <motion.div
          className="absolute right-4 top-24 hidden items-center gap-2 rounded-xl border border-paper/12 bg-paper/[0.07] px-3 py-2 text-[0.625rem] text-paper/75 backdrop-blur sm:flex"
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <Clock3 className="h-3 w-3 text-gold" /> 24-hour average
        </motion.div>

        {/* Live tracker card */}
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-paper/10 bg-paper/[0.97] p-4 text-ink shadow-lift">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                KOYO report · 4471
              </p>
              <p className="mt-1 text-sm font-semibold">Full Body Checkup — Flagship</p>
            </div>
            <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-teal-deep">
              Live
            </span>
          </div>

          <ol className="relative mt-3 space-y-2">
            <span className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-line" aria-hidden="true" />
            {STEPS.map((item, i) => {
              const done = i < step;
              const active = i === step;
              const Icon = item.icon;
              return (
                <li key={item.label} className="relative flex items-start gap-3 pl-0.5">
                  <span
                    className={`relative z-10 mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                      done ? 'border-teal bg-teal text-white' : active ? 'border-teal bg-white text-teal-deep' : 'border-line bg-white text-ink/20'
                    }`}
                  >
                    {done ? <Check className="h-2 w-2" /> : <Icon className="h-2 w-2" />}
                  </span>
                  <span className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                    <span className={`text-[0.6875rem] transition-colors duration-500 ${active || done ? 'font-medium text-ink' : 'text-ink/40'}`}>
                      {item.label}
                    </span>
                    {active && !reduce && (
                      <motion.span
                        className="h-1 w-1 shrink-0 rounded-full bg-teal"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink/[0.06]">
            <motion.span
              className="block h-full rounded-full bg-teal"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={step}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 text-[0.5625rem] text-ink/45"
              >
                <Activity className="h-3 w-3 text-teal" /> {STEPS[step].detail}
              </motion.span>
            </AnimatePresence>
            <span className="text-[0.5625rem] font-semibold text-teal-deep">View report →</span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-line bg-white px-4 py-3 shadow-soft sm:block">
        <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-ink/35">Home collection</p>
        <p className="mt-0.5 text-sm font-semibold">In 48 cities, 7 days</p>
      </div>
    </div>
  );
}
