import {
  Activity, AudioWaveform, Bone, Brain, Crosshair, Droplets, Ear, Eye, Footprints,
  HeartPulse, Microscope, Moon, Radio, Ribbon, Scan, Stethoscope, Watch, Waves, Wind, Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  Activity, AudioWaveform, Bone, Brain, Crosshair, Droplets, Ear, Eye, Footprints,
  HeartPulse, Microscope, Moon, Radio, Ribbon, Scan, Stethoscope, Watch, Waves, Wind, Zap,
};

export function ServiceIcon({
  name,
  className,
  strokeWidth = 1.4,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Activity;
  return <Icon className={cn('h-5 w-5', className)} strokeWidth={strokeWidth} aria-hidden="true" />;
}
