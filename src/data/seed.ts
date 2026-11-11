import type { Modality } from './types';

/** [name, price, mrp, durationMinutes, reportHours, fastingHours, homeCollection, sample] */
export type SeedTest = readonly [
  string,
  number,
  number,
  number,
  number,
  number,
  boolean,
  'Blood' | 'Urine' | 'None',
];

export type ServiceSeed = {
  slug: string;
  name: string;
  shortName: string;
  modality: Modality;
  icon: string;
  tagline: string;
  description: string;
  price: number;
  mrp: number;
  duration: string;
  report: string;
  popular: boolean;
  highlights: string[];
  prep: string[];
  story: [string, string];
  benefits: string[];
  risks: string[];
  tests: SeedTest[];
  faqs: [string, string][];
  centers: number;
  scans: number;
};
