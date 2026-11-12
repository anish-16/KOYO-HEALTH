import { services, type FlatTest } from './services';

/**
 * The catalogue has one axis (28 categories) but customers shop on another:
 * blood work or a scan. This module draws that second axis explicitly, so the
 * header, the home page and the listing pages all read from one grouping and
 * cannot drift apart.
 *
 * Groups are curated by name so the order inside a column is clinically
 * sensible, and every test that a group does not name is collected into an
 * `other` bucket at the end. Nothing can silently fall out of the taxonomy.
 */
export type DisciplineKey = 'pathology' | 'imaging';

export type DisciplineGroup = {
  key: string;
  label: string;
  icon: string;
  blurb: string;
  ids: string[];
};

export type TestEntry = FlatTest & {
  discipline: DisciplineKey;
  groupKey: string;
  groupLabel: string;
  groupIcon: string;
  serviceShortName: string;
  preparation: string[];
  centers: number;
  reportTime: string;
};

export type Discipline = {
  key: DisciplineKey;
  slug: string;
  label: string;
  navLabel: string;
  menuTitle: string;
  menuBlurb: string;
  eyebrow: string;
  headline: string;
  blurb: string;
  icon: string;
  noun: string;
  reassurance: string;
  groups: DisciplineGroup[];
  /** Groups shown in the header panel — the catch-all bucket stays on the page. */
  menuGroups: DisciplineGroup[];
  tests: TestEntry[];
  featured: TestEntry[];
  minPrice: number;
  maxPrice: number;
  fastestReport: number;
  homeCollection: number;
};

type GroupSeed = {
  key: string;
  label: string;
  icon: string;
  blurb: string;
  /** [service slug, exact test name] — resolved against the catalogue below. */
  picks: [string, string][];
};

function serviceBySlug(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Discipline taxonomy references unknown service "${slug}"`);
  return service;
}

function idOf(serviceSlug: string, testName: string) {
  const service = serviceBySlug(serviceSlug);
  const test = service.tests.find((t) => t.name === testName);
  if (!test) throw new Error(`Discipline taxonomy references unknown test "${testName}" in ${serviceSlug}`);
  return `${service.slug}/${test.slug}`;
}

/** "12 h" reads better than "12 hours" in a price row; days for long studies. */
export function formatReport(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`;
}

const PATHOLOGY_SEEDS: GroupSeed[] = [
  {
    key: 'everyday',
    label: 'Everyday & organ function',
    icon: 'Stethoscope',
    blurb: 'The panel a physician starts with — blood counts, liver, kidney and urine.',
    picks: [
      ['pathology', 'Complete Blood Count (CBC)'],
      ['pathology', 'Erythrocyte Sedimentation Rate (ESR)'],
      ['pathology', 'Liver Function Test (LFT)'],
      ['pathology', 'Kidney Function Test (KFT)'],
      ['pathology', 'Urine Routine & Microscopy'],
      ['pathology', 'Blood Group & Rh Typing'],
    ],
  },
  {
    key: 'diabetes',
    label: 'Diabetes & metabolism',
    icon: 'Droplets',
    blurb: 'Sugar control over three months, plus the lipid panel that travels with it.',
    picks: [
      ['pathology', 'HbA1c (Glycated Haemoglobin)'],
      ['pathology', 'Fasting Blood Sugar (FBS)'],
      ['pathology', 'Post-Prandial Blood Sugar (PPBS)'],
      ['pathology', 'Lipid Profile'],
    ],
  },
  {
    key: 'hormones',
    label: 'Thyroid & hormones',
    icon: 'Activity',
    blurb: 'Thyroid, fertility and androgen markers, with same-day accessioning.',
    picks: [
      ['pathology', 'Thyroid Profile (T3, T4, TSH)'],
      ['pathology', 'Thyroid Stimulating Hormone (TSH)'],
      ['pathology', 'Testosterone Total'],
      ['pathology', 'Prolactin (Serum)'],
    ],
  },
  {
    key: 'vitamins',
    label: 'Vitamins & minerals',
    icon: 'Sun',
    blurb: 'The deficiencies behind fatigue, hair loss and bone pain — measured, not guessed.',
    picks: [
      ['pathology', 'Vitamin D (25-OH)'],
      ['pathology', 'Vitamin B12'],
      ['pathology', 'Iron Studies (Ferritin, Iron, TIBC)'],
      ['pathology', 'Calcium (Serum)'],
    ],
  },
  {
    key: 'infection',
    label: 'Fever & infection',
    icon: 'Thermometer',
    blurb: 'Seasonal fevers, typhoid and urinary infection, reported the same day.',
    picks: [
      ['pathology', 'Dengue NS1 Antigen'],
      ['pathology', 'Malaria Parasite (Smear + Antigen)'],
      ['pathology', 'Widal (Typhoid Antibodies)'],
      ['pathology', 'Urine Culture & Sensitivity'],
    ],
  },
  {
    key: 'screening',
    label: 'Screening & markers',
    icon: 'ShieldCheck',
    blurb: 'Cancer screening and inflammation markers, with gynaecopathology review.',
    picks: [
      ['pathology', 'Prostate Specific Antigen (PSA)'],
      ['pathology', 'CA-125 (Ovarian Marker)'],
      ['pathology', 'C-Reactive Protein (hs-CRP)'],
      ['pap-smear', 'Pap Smear (Conventional)'],
      ['pap-smear', 'Liquid-Based Cytology (LBC)'],
      ['pap-smear', 'Pap + HPV DNA Co-test'],
      ['pap-smear', 'HPV DNA Genotyping (16/18)'],
    ],
  },
];

const IMAGING_SEEDS: GroupSeed[] = [
  {
    key: 'mri',
    label: 'MRI',
    icon: 'Brain',
    blurb: '3T wide-bore scanners, radiologist double-read on spine and joints.',
    picks: [
      ['mri', 'MRI Brain (Plain)'],
      ['mri', 'MRI Lumbar Spine'],
      ['mri', 'MRI Knee Joint'],
      ['mri', 'MRI Whole Abdomen'],
      ['mri', 'MRCP (Biliary Study)'],
    ],
  },
  {
    key: 'ct',
    label: 'CT scan',
    icon: 'Scan',
    blurb: 'Low-dose protocols with the dose recorded for every study.',
    picks: [
      ['ct', 'CT Brain (Plain)'],
      ['ct', 'CT Chest (HRCT)'],
      ['ct', 'CT Abdomen & Pelvis (Contrast)'],
      ['ct', 'CT KUB (Stone Study)'],
      ['ct', 'CT Angiography — Head & Neck'],
    ],
  },
  {
    key: 'ultrasound',
    label: 'Ultrasound & Doppler',
    icon: 'Waves',
    blurb: 'Sonologist-reported scans, including home visits in 22 cities.',
    picks: [
      ['ultrasound', 'USG Abdomen & Pelvis'],
      ['ultrasound', 'USG Whole Abdomen'],
      ['ultrasound', 'USG KUB (Kidney, Ureter, Bladder)'],
      ['ultrasound', 'USG Obstetric (Growth Scan)'],
      ['ultrasound', 'USG Thyroid with Doppler'],
      ['doppler', 'Carotid Doppler'],
    ],
  },
  {
    key: 'xray',
    label: 'X-ray & bone density',
    icon: 'Bone',
    blurb: 'Digital radiography in minutes, plus DEXA for bone loss.',
    picks: [
      ['x-ray', 'X-Ray Chest (PA)'],
      ['x-ray', 'X-Ray Spine (AP & Lateral)'],
      ['x-ray', 'X-Ray Knee (Both Views)'],
      ['dexa', 'DEXA Hip & Spine'],
      ['dexa', 'DEXA with FRAX Risk Score'],
    ],
  },
  {
    key: 'heart',
    label: 'Heart & rhythm',
    icon: 'HeartPulse',
    blurb: 'Echo, stress tests and rhythm monitoring, signed by a cardiologist.',
    picks: [
      ['echo', 'Transthoracic Echo (2D)'],
      ['ecg', '12-Lead ECG (Resting)'],
      ['tmt', 'Treadmill Test (Bruce Protocol)'],
      ['stress-echo', 'Treadmill Stress Echo'],
      ['holter', 'Holter Monitor (24 hours)'],
    ],
  },
  {
    key: 'other',
    label: 'Other scans',
    icon: 'Radio',
    blurb: 'Oncology, breast, liver and dental imaging under one booking.',
    picks: [
      ['pet-scan', 'FDG Whole Body PET-CT'],
      ['nuclear-medicine', 'Whole Body Bone Scan'],
      ['mammography', 'Digital Mammography (Bilateral)'],
      ['fibroscan', 'FibroScan (Liver Elastography)'],
      ['cbct', 'Dental CBCT (Single Arch)'],
      ['dtpa', 'DTPA Renal Scan (Split Function)'],
    ],
  },
];

function resolveGroups(discipline: DisciplineKey, seeds: GroupSeed[]): DisciplineGroup[] {
  return seeds.map((seed) => ({
    key: `${discipline}:${seed.key}`,
    label: seed.label,
    icon: seed.icon,
    blurb: seed.blurb,
    ids: seed.picks.map(([service, name]) => idOf(service, name)),
  }));
}

const baseEntries: TestEntry[] = services.flatMap((service) => {
  const discipline: DisciplineKey = service.modality === 'Pathology' ? 'pathology' : 'imaging';
  return service.tests.map<TestEntry>((test) => ({
    ...test,
    id: `${service.slug}/${test.slug}`,
    serviceSlug: service.slug,
    serviceName: service.name,
    serviceShortName: service.shortName,
    modality: service.modality,
    icon: service.icon,
    discipline,
    groupKey: '',
    groupLabel: '',
    groupIcon: service.icon,
    preparation: service.preparation.slice(0, 3),
    centers: service.centers,
    reportTime: service.reportTime,
  }));
});

const entryById = new Map(baseEntries.map((entry) => [entry.id, entry]));

function groupEntries(groups: DisciplineGroup[], discipline: DisciplineKey): DisciplineGroup[] {
  const claimed = new Set<string>();
  const resolved = groups.map((group) => {
    const ids = group.ids.filter((id) => {
      const entry = entryById.get(id);
      if (!entry || entry.discipline !== discipline || claimed.has(id)) return false;
      claimed.add(id);
      return true;
    });
    for (const id of ids) {
      const entry = entryById.get(id)!;
      entry.groupKey = group.key;
      entry.groupLabel = group.label;
      entry.groupIcon = group.icon;
    }
    return { ...group, ids };
  });

  // Everything a curated group did not name still gets a home, bucketed by the
  // modality it belongs to — one honest "more" pile rather than a 77-test
  // catch-all that hides neuro, endoscopy and PET studies behind one label.
  const leftovers = baseEntries.filter((e) => e.discipline === discipline && !claimed.has(e.id));
  const buckets: Record<string, { label: string; icon: string; blurb: string }> = {
    Pathology: { label: 'Add-on laboratory tests', icon: 'FlaskConical', blurb: 'Reflex and add-on tests the lab can run from the same sample.' },
    Radiology: { label: 'More imaging', icon: 'Scan', blurb: 'Doppler, DEXA, mammography, PET and nuclear studies beyond the headline groups.' },
    Cardiology: { label: 'Cardiac & rhythm', icon: 'HeartPulse', blurb: 'Stress, rhythm and monitoring studies not listed above.' },
    Neurodiagnostics: { label: 'Neurodiagnostics', icon: 'Brain', blurb: 'EEG, EMG, nerve conduction and evoked potentials.' },
    Specialist: { label: 'Lung, sleep & endoscopy', icon: 'Stethoscope', blurb: 'Breathing, hearing, sleep, liver and endoscopy studies.' },
  };

  for (const [modality, meta] of Object.entries(buckets)) {
    const members = leftovers.filter((entry) => entry.modality === modality);
    if (!members.length) continue;
    const key = `${discipline}:${modality.toLowerCase()}`;
    for (const entry of members) {
      entry.groupKey = key;
      entry.groupLabel = meta.label;
      entry.groupIcon = meta.icon;
    }
    resolved.push({ key, label: meta.label, icon: meta.icon, blurb: meta.blurb, ids: members.map((e) => e.id) });
  }

  return resolved.filter((group) => group.ids.length > 0);
}

const pathologyGroups = groupEntries(resolveGroups('pathology', PATHOLOGY_SEEDS), 'pathology');
const imagingGroups = groupEntries(resolveGroups('imaging', IMAGING_SEEDS), 'imaging');

export const testEntries: TestEntry[] = baseEntries;
export const testById = entryById;

export function getTestEntry(id: string) {
  return entryById.get(id);
}

function summarise(key: DisciplineKey, groups: DisciplineGroup[]) {
  // Group order is the curated order, so the listing reads like the menu
  // (CBC before Pap smear) instead of following the raw service ordering.
  const tests = groups.flatMap((group) => group.ids.map((id) => entryById.get(id)!)).filter(Boolean);
  const featuredIds =
    key === 'pathology'
      ? [
          idOf('pathology', 'Complete Blood Count (CBC)'),
          idOf('pathology', 'HbA1c (Glycated Haemoglobin)'),
          idOf('pathology', 'Thyroid Profile (T3, T4, TSH)'),
          idOf('pathology', 'Lipid Profile'),
          idOf('pathology', 'Vitamin D (25-OH)'),
        ]
      : [
          idOf('mri', 'MRI Brain (Plain)'),
          idOf('ct', 'CT Chest (HRCT)'),
          idOf('ultrasound', 'USG Abdomen & Pelvis'),
          idOf('x-ray', 'X-Ray Chest (PA)'),
          idOf('echo', 'Transthoracic Echo (2D)'),
        ];

  return {
    groups,
    menuGroups: groups.slice(0, 6),
    tests,
    featured: featuredIds.map((id) => entryById.get(id)!).filter(Boolean),
    minPrice: Math.min(...tests.map((t) => t.price)),
    maxPrice: Math.max(...tests.map((t) => t.price)),
    fastestReport: Math.min(...tests.map((t) => t.reportHours)),
    homeCollection: tests.filter((t) => t.homeCollection).length,
  };
}

export const disciplines: Discipline[] = [
  {
    key: 'pathology',
    slug: 'pathology',
    label: 'Blood tests & pathology',
    navLabel: 'Blood tests',
    menuTitle: 'Blood tests & lab',
    menuBlurb: 'CBC, thyroid, diabetes, vitamins and screening markers — NABL labs',
    eyebrow: 'Pathology & labs',
    headline: 'Blood tests, with the report before your next meal.',
    blurb:
      'One collection covers every lab discipline. Free home sample collection over ₹499, a 90-minute arrival window, and reports with reference ranges and trend arrows instead of a wall of numbers.',
    icon: 'Droplets',
    noun: 'blood test',
    reassurance: 'Free home collection · NABL-accredited labs',
    ...summarise('pathology', pathologyGroups),
  },
  {
    key: 'imaging',
    slug: 'imaging',
    label: 'Scans & imaging',
    navLabel: 'Scans',
    menuTitle: 'Scans & imaging',
    menuBlurb: 'MRI, CT, ultrasound, X-ray and heart studies — NABH centres',
    eyebrow: 'Radiology & imaging',
    headline: 'Scans read by the radiologist who signs them.',
    blurb:
      'Same-day slots at 268 accredited centres, low-dose protocols with the dose recorded, and a report that names the next step. Images stay downloadable as DICOM for as long as you need them.',
    icon: 'Scan',
    noun: 'scan',
    reassurance: 'Same-day slots · NABH & NABL imaging centres',
    ...summarise('imaging', imagingGroups),
  },
];

export function getDiscipline(slug: string) {
  return disciplines.find((discipline) => discipline.slug === slug);
}

export function testsInGroup(group: DisciplineGroup): TestEntry[] {
  return group.ids.map((id) => entryById.get(id)!).filter(Boolean);
}

/** Sibling studies inside the same group, used by the detail panel. */
export function relatedTests(entry: TestEntry, limit = 4): TestEntry[] {
  const group = [...pathologyGroups, ...imagingGroups].find((g) => g.key === entry.groupKey);
  if (!group) return [];
  return group.ids
    .filter((id) => id !== entry.id)
    .map((id) => entryById.get(id)!)
    .slice(0, limit);
}
export const disciplineStats = {
  tests: testEntries.length,
  bloodTests: testEntries.filter((t) => t.discipline === 'pathology').length,
  scans: testEntries.filter((t) => t.discipline === 'imaging').length,
  homeCollection: testEntries.filter((t) => t.homeCollection).length,
};
