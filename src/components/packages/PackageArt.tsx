import type { HealthPackage } from '@/data/types';
import { packagePhoto } from '@/data/families';
import {
  Activity, Baby, Bone, Dna, Droplets, Flame, HeartPulse, Microscope, Ribbon,
  ShieldCheck, Stethoscope, Thermometer, Venus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A package visual is a person plus its discipline.
 *
 * The photograph carries the human story — a man for men's panels, a woman for
 * women's panels, a couple for fertility, a family for the full body check —
 * while the category tone, the discipline glyph and the parameter band make the
 * card unmistakably a clinical panel. Two packages may share a subject, but
 * they never look the same: the tint, the glyph and the numbers differ, and no
 * two neighbouring cards share a photograph. Equipment shots — a microscope, a
 * lab bench, an empty boardroom — never appear here; this card sells a checkup
 * to a person.
 */

type Tone = {
  wash: string;
  scrim: string;
  accent: string;
  hair: string;
};

const TONES: Record<HealthPackage['category'], Tone> = {
  Essential: {
    wash: 'bg-[#0C3A2D]/15',
    scrim: 'from-[#08201A]/92 via-[#08201A]/30',
    accent: 'text-[#F3D9A0]',
    hair: 'text-white/[0.14]',
  },
  Advanced: {
    wash: 'bg-[#0B2F26]/28',
    scrim: 'from-[#051813]/94 via-[#051813]/32',
    accent: 'text-[#F3D9A0]',
    hair: 'text-white/[0.14]',
  },
  Premium: {
    wash: 'bg-[#0E1513]/38',
    scrim: 'from-[#080C0B]/95 via-[#080C0B]/38',
    accent: 'text-[#E7C98A]',
    hair: 'text-white/[0.13]',
  },
  Focused: {
    wash: 'bg-[#4A2E18]/22',
    scrim: 'from-[#1E1208]/92 via-[#1E1208]/30',
    accent: 'text-[#F6DDB6]',
    hair: 'text-white/[0.14]',
  },
  Corporate: {
    wash: 'bg-[#0B2F26]/28',
    scrim: 'from-[#051813]/94 via-[#051813]/32',
    accent: 'text-[#F3D9A0]',
    hair: 'text-white/[0.14]',
  },
};

const GLYPH: { match: RegExp; Icon: typeof HeartPulse }[] = [
  { match: /heart|cardiac/i, Icon: HeartPulse },
  { match: /cancer|onco/i, Icon: Ribbon },
  { match: /fertility|pregnan|pcod|pcos/i, Icon: Dna },
  { match: /senior|bone|joint/i, Icon: Bone },
  { match: /gut|stool|liver/i, Icon: Microscope },
  { match: /fever|infection/i, Icon: Thermometer },
  { match: /diabet|sugar/i, Icon: Droplets },
  { match: /women|woman|female/i, Icon: Venus },
  { match: /full body|executive|basic/i, Icon: Stethoscope },
  { match: /child|kids|baby/i, Icon: Baby },
  { match: /thyroid|hormone/i, Icon: Flame },
  { match: /smoke|lung|respir/i, Icon: Activity },
];

function glyphFor(slug: string, name: string) {
  const haystack = `${slug} ${name}`;
  return GLYPH.find((g) => g.match.test(haystack))?.Icon ?? ShieldCheck;
}

export function PackageArt({
  pkg,
  className,
  size = 'card',
}: {
  pkg: HealthPackage;
  className?: string;
  size?: 'card' | 'hero';
}) {
  const tone = TONES[pkg.category];
  const Icon = glyphFor(pkg.slug, pkg.name);
  const photo = packagePhoto(pkg);
  const hero = size === 'hero';

  return (
    <div className={cn('relative isolate overflow-hidden bg-forest', className)}>
      {/* Person: the subject behind the price. */}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={hero ? undefined : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_32%]"
      />

      {/* Category: one tint per tier keeps the catalogue visually sorted. */}
      <div className={cn('absolute inset-0 mix-blend-multiply', tone.wash)} aria-hidden="true" />
      <div
        aria-hidden="true"
        className={cn('absolute inset-x-0 bottom-0 h-[86%] bg-gradient-to-t to-transparent', tone.scrim)}
      />

      <div
        aria-hidden="true"
        className={cn('absolute inset-0', tone.hair)}
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: hero ? '46px 46px' : '34px 34px',
        }}
      />

      <Icon
        aria-hidden="true"
        strokeWidth={0.9}
        className={cn('absolute -bottom-10 -right-8 text-white/[0.13]', hero ? 'h-64 w-64' : 'h-44 w-44')}
      />

      <div className={cn('relative flex h-full flex-col justify-between', hero ? 'gap-10 p-6 sm:p-8' : 'p-5')}>
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/25 bg-black/15 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-paper backdrop-blur">
            {pkg.category} · {pkg.forWhom}
          </span>
          {pkg.isPopular && (
            <span className={cn('text-[0.5625rem] font-semibold uppercase tracking-[0.12em]', tone.accent)}>
              Most booked
            </span>
          )}
        </div>

        <div className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]">
          <p className={cn('tabular font-display leading-[0.85] text-paper', hero ? 'text-[4rem]' : 'text-[2.7rem]')}>
            {pkg.testCount}
          </p>
          <p className="mt-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-paper/70">
            Parameters · {pkg.testsIncluded.length} tests
          </p>
          <p className="mt-1 text-[0.625rem] text-paper/60">{pkg.reportTime}</p>
        </div>
      </div>
    </div>
  );
}
