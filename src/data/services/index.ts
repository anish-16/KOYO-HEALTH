import { slugify } from '@/lib/utils';
import type { Modality, Service, ServiceTest } from '../types';
import { radiologySeeds } from './radiology';
import { neuroSpecialistSeeds } from './neuro-specialist';
import { cardioPathologySeeds } from './cardio-pathology';
import type { ServiceSeed } from '../seed';

/** Reference-catalogue ordering: imaging → neuro → cardiac → specialist → lab. */
const ORDER = [
  'ct', 'mri', 'ultrasound', 'x-ray', 'doppler', 'pet-scan', 'nuclear-medicine',
  'dexa', 'mammography', 'emg', 'ncv', 'cbct', 'pft', 'audiometry', 'sleep-study',
  'ver-vep', 'echo', 'stress-echo', 'fibroscan', 'ecg', 'eeg', 'tmt', 'holter',
  'endoscopy', 'colonoscopy', 'pap-smear', 'pathology', 'dtpa',
];

const SAMPLE_COPY: Record<ServiceTest['sample'], string> = {
  Blood: 'A venous blood sample is collected in a barcoded tube and processed the same day.',
  Urine: 'A clean-catch urine sample is analysed for cells, protein, sugar and infection markers.',
  None: 'No sample is needed — this is an imaging or functional study performed on site.',
};

function expand(seed: ServiceSeed): Service {
  return {
    slug: seed.slug,
    name: seed.name,
    shortName: seed.shortName,
    modality: seed.modality,
    icon: seed.icon,
    tagline: seed.tagline,
    description: seed.description,
    story: [...seed.story],
    startingPrice: seed.price,
    mrp: seed.mrp,
    duration: seed.duration,
    reportTime: seed.report,
    isPopular: seed.popular,
    highlights: [...seed.highlights],
    preparation: [...seed.prep],
    benefits: [...seed.benefits],
    risks: [...seed.risks],
    tests: seed.tests.map(([name, price, mrp, durationMinutes, reportHours, fastingHours, homeCollection, sample]) => ({
      slug: slugify(name),
      name,
      price,
      mrp,
      durationMinutes,
      reportHours,
      fastingHours,
      homeCollection,
      sample,
      description: `${name} at KOYO Health. ${SAMPLE_COPY[sample]} Reviewed by a senior ${
        seed.modality === 'Pathology' ? 'pathologist' : 'consultant'
      } before release.`,
    })),
    faqs: seed.faqs.map(([q, a]) => ({ q, a })),
    centers: seed.centers,
    scansPerYear: seed.scans,
  };
}

const seeds = [...radiologySeeds, ...neuroSpecialistSeeds, ...cardioPathologySeeds];

export const services: Service[] = ORDER.map((slug) => {
  const seed = seeds.find((s) => s.slug === slug);
  if (!seed) throw new Error(`Missing service seed: ${slug}`);
  return expand(seed);
});

export const modalities: { key: Modality; label: string; blurb: string }[] = [
  { key: 'Radiology', label: 'Radiology & Imaging', blurb: 'CT, MRI, ultrasound, X-ray and nuclear studies.' },
  { key: 'Cardiology', label: 'Cardiac Diagnostics', blurb: 'Echo, stress tests and rhythm monitoring.' },
  { key: 'Neurodiagnostics', label: 'Neurodiagnostics', blurb: 'EEG, EMG, NCV and evoked potentials.' },
  { key: 'Specialist', label: 'Specialist Studies', blurb: 'Sleep, lung, liver, hearing and endoscopy.' },
  { key: 'Pathology', label: 'Pathology & Labs', blurb: 'Blood, urine and cervical cytology.' },
];

export type FlatTest = ServiceTest & {
  id: string;
  serviceSlug: string;
  serviceName: string;
  modality: Modality;
  icon: string;
};

export const allTests: FlatTest[] = services.flatMap((service) =>
  service.tests.map((test) => ({
    ...test,
    id: `${service.slug}/${test.slug}`,
    serviceSlug: service.slug,
    serviceName: service.name,
    modality: service.modality,
    icon: service.icon,
  })),
);

export const popularTests = allTests
  .filter((t) => ['pathology', 'mri', 'ct', 'echo', 'pft', 'ultrasound'].includes(t.serviceSlug))
  .slice(0, 10);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getTest(serviceSlug: string, testSlug: string): FlatTest | undefined {
  return allTests.find((t) => t.serviceSlug === serviceSlug && t.slug === testSlug);
}

export function searchTests(query: string, limit = 8): FlatTest[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = allTests.map((test) => {
    const haystack = `${test.name} ${test.serviceName} ${test.modality} ${test.serviceSlug}`.toLowerCase();
    const score = tokens.reduce((acc, token) => {
      if (test.name.toLowerCase().startsWith(token)) return acc + 4;
      if (haystack.includes(token)) return acc + 2;
      return acc;
    }, 0);
    return { test, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.test.price - b.test.price)
    .slice(0, limit)
    .map((s) => s.test);
}

export const catalogueStats = {
  categories: services.length,
  tests: allTests.length,
  centers: services.reduce((max, s) => Math.max(max, s.centers), 0),
  studies: services.reduce((sum, s) => sum + s.scansPerYear, 0),
  modalities: modalities.length,
  minPrice: Math.min(...allTests.map((t) => t.price)),
  maxPrice: Math.max(...allTests.map((t) => t.price)),
};
