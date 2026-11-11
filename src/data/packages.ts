import type { HealthPackage, PackagePanel, PackageTest } from './types';

/**
 * The catalogue is exactly the 18 packages from the clinical master sheet.
 *
 * Every package is described by the tests it contains, not by a marketing
 * total: `TEST` holds the reportable parameter count of each test using NABL
 * reporting conventions (a CBC reports 24 parameters, a lipid profile 8), and
 * `testCount` is the sum, so a package can never advertise a number its own
 * panel does not produce.
 */

type Group =
  | 'Haematology'
  | 'Biochemistry'
  | 'Hormones'
  | 'Vitamins & minerals'
  | 'Infection & immunity'
  | 'Urine & stool'
  | 'Cardiac & imaging'
  | 'Special';

const TEST = {
  cbc: { name: 'Complete Blood Count (CBC)', count: 24, group: 'Haematology' },
  esr: { name: 'ESR', count: 1, group: 'Haematology' },
  smear: { name: 'Peripheral Smear', count: 1, group: 'Haematology' },
  retic: { name: 'Reticulocyte Count', count: 1, group: 'Haematology' },
  hbep: { name: 'Hb Electrophoresis', count: 1, group: 'Haematology' },
  bloodGroup: { name: 'Blood Group & Rh Typing', count: 2, group: 'Haematology' },

  fbs: { name: 'Fasting Blood Glucose', count: 1, group: 'Biochemistry' },
  ppbs: { name: 'Post-Prandial Glucose', count: 1, group: 'Biochemistry' },
  rbs: { name: 'Random Blood Glucose', count: 1, group: 'Biochemistry' },
  hba1c: { name: 'HbA1c (Glycated Haemoglobin)', count: 1, group: 'Biochemistry' },
  insulin: { name: 'Fasting Insulin', count: 1, group: 'Biochemistry' },
  homa: { name: 'HOMA-IR (Insulin Resistance)', count: 1, group: 'Biochemistry' },
  lipid: { name: 'Lipid Profile', count: 8, group: 'Biochemistry' },
  lft: { name: 'Liver Function Test (LFT)', count: 11, group: 'Biochemistry' },
  kft: { name: 'Kidney Function Test (KFT)', count: 10, group: 'Biochemistry' },
  uric: { name: 'Uric Acid', count: 1, group: 'Biochemistry' },
  electrolytes: { name: 'Serum Electrolytes (Na, K, Cl)', count: 3, group: 'Biochemistry' },
  amylase: { name: 'Serum Amylase', count: 1, group: 'Biochemistry' },
  lipase: { name: 'Serum Lipase', count: 1, group: 'Biochemistry' },

  tsh: { name: 'Thyroid Stimulating Hormone (TSH)', count: 1, group: 'Hormones' },
  t3: { name: 'T3 (Total)', count: 1, group: 'Hormones' },
  t4: { name: 'T4 (Total)', count: 1, group: 'Hormones' },
  antiTpo: { name: 'Anti-TPO Antibodies', count: 1, group: 'Hormones' },
  fsh: { name: 'FSH', count: 1, group: 'Hormones' },
  lh: { name: 'LH', count: 1, group: 'Hormones' },
  prolactin: { name: 'Prolactin', count: 1, group: 'Hormones' },
  testosterone: { name: 'Total Testosterone', count: 1, group: 'Hormones' },
  amh: { name: 'AMH (Anti-Müllerian Hormone)', count: 1, group: 'Hormones' },
  estradiol: { name: 'Estradiol (E2)', count: 1, group: 'Hormones' },
  cortisol: { name: 'Morning Cortisol', count: 1, group: 'Hormones' },

  vitD: { name: 'Vitamin D (25-OH)', count: 1, group: 'Vitamins & minerals' },
  b12: { name: 'Vitamin B12', count: 1, group: 'Vitamins & minerals' },
  iron: { name: 'Serum Iron', count: 1, group: 'Vitamins & minerals' },
  tibc: { name: 'TIBC', count: 1, group: 'Vitamins & minerals' },
  tsat: { name: 'Transferrin Saturation', count: 1, group: 'Vitamins & minerals' },
  ferritin: { name: 'Ferritin', count: 1, group: 'Vitamins & minerals' },
  calcium: { name: 'Serum Calcium', count: 1, group: 'Vitamins & minerals' },
  phosphorus: { name: 'Serum Phosphorus', count: 1, group: 'Vitamins & minerals' },
  magnesium: { name: 'Serum Magnesium', count: 1, group: 'Vitamins & minerals' },

  hsCrp: { name: 'hs-CRP', count: 1, group: 'Infection & immunity' },
  crp: { name: 'CRP (Quantitative)', count: 1, group: 'Infection & immunity' },
  homocysteine: { name: 'Homocysteine', count: 1, group: 'Infection & immunity' },
  apob: { name: 'Apolipoprotein B', count: 1, group: 'Infection & immunity' },
  apoa1: { name: 'Apolipoprotein A1', count: 1, group: 'Infection & immunity' },
  lpa: { name: 'Lipoprotein (a)', count: 1, group: 'Infection & immunity' },
  ige: { name: 'Total IgE', count: 1, group: 'Infection & immunity' },
  hbsag: { name: 'HBsAg', count: 1, group: 'Infection & immunity' },
  hcv: { name: 'Anti-HCV', count: 1, group: 'Infection & immunity' },
  hiv: { name: 'HIV I & II', count: 1, group: 'Infection & immunity' },
  vdrl: { name: 'VDRL / Syphilis Screen', count: 1, group: 'Infection & immunity' },
  rubella: { name: 'Rubella IgG', count: 1, group: 'Infection & immunity' },
  dengueNs1: { name: 'Dengue NS1 Antigen', count: 1, group: 'Infection & immunity' },
  dengueIgm: { name: 'Dengue IgM', count: 1, group: 'Infection & immunity' },
  dengueIgg: { name: 'Dengue IgG', count: 1, group: 'Infection & immunity' },
  malariaAg: { name: 'Malaria Antigen', count: 1, group: 'Infection & immunity' },
  malariaSmear: { name: 'Malaria Smear', count: 1, group: 'Infection & immunity' },
  chikungunya: { name: 'Chikungunya IgM', count: 1, group: 'Infection & immunity' },
  typhidot: { name: 'Typhidot IgM', count: 1, group: 'Infection & immunity' },
  widal: { name: 'Widal (4 titres)', count: 4, group: 'Infection & immunity' },
  scrub: { name: 'Scrub Typhus IgM', count: 1, group: 'Infection & immunity' },
  lepto: { name: 'Leptospira IgM', count: 1, group: 'Infection & immunity' },
  psa: { name: 'PSA (Total)', count: 1, group: 'Infection & immunity' },
  freePsa: { name: 'Free PSA', count: 1, group: 'Infection & immunity' },
  ca125: { name: 'CA-125', count: 1, group: 'Infection & immunity' },
  cea: { name: 'CEA', count: 1, group: 'Infection & immunity' },
  afp: { name: 'AFP', count: 1, group: 'Infection & immunity' },
  ca199: { name: 'CA 19-9', count: 1, group: 'Infection & immunity' },

  urine: { name: 'Urine Routine & Microscopy', count: 18, group: 'Urine & stool' },
  microalbumin: { name: 'Urine Microalbumin', count: 1, group: 'Urine & stool' },
  stool: { name: 'Stool Routine & Microscopy', count: 12, group: 'Urine & stool' },
  occult: { name: 'Stool Occult Blood', count: 1, group: 'Urine & stool' },
  hPylori: { name: 'H. pylori Stool Antigen', count: 1, group: 'Urine & stool' },
  calprotectin: { name: 'Faecal Calprotectin', count: 1, group: 'Urine & stool' },

  ecg: { name: '12-Lead ECG', count: 1, group: 'Cardiac & imaging' },
  echo: { name: '2D Echocardiography', count: 1, group: 'Cardiac & imaging' },
  tmt: { name: 'Treadmill Test (TMT)', count: 1, group: 'Cardiac & imaging' },
  cxr: { name: 'Chest X-Ray', count: 1, group: 'Cardiac & imaging' },
  usg: { name: 'Ultrasound Whole Abdomen', count: 1, group: 'Cardiac & imaging' },
  usgPelvis: { name: 'Pelvic Ultrasound', count: 1, group: 'Cardiac & imaging' },
  usgBreast: { name: 'Breast Ultrasound', count: 1, group: 'Cardiac & imaging' },
  mammo: { name: 'Mammography (Bilateral)', count: 1, group: 'Cardiac & imaging' },
  dexa: { name: 'DEXA Bone Density', count: 1, group: 'Cardiac & imaging' },
  pft: { name: 'Spirometry (PFT)', count: 1, group: 'Cardiac & imaging' },

  semen: { name: 'Semen Analysis', count: 8, group: 'Special' },
  pap: { name: 'Pap Smear', count: 1, group: 'Special' },
  hpvDna: { name: 'HPV DNA (High-Risk)', count: 1, group: 'Special' },
} satisfies Record<string, { name: string; count: number; group: Group }>;

type TestKey = keyof typeof TEST;

/** Clinical order of the groupings on a report. */
const GROUP_ORDER: Group[] = [
  'Haematology',
  'Biochemistry',
  'Hormones',
  'Vitamins & minerals',
  'Infection & immunity',
  'Urine & stool',
  'Cardiac & imaging',
  'Special',
];

type Seed = Omit<HealthPackage, 'panels' | 'testsIncluded' | 'testCount' | 'description' | 'reportTime' | 'fastingHours' | 'isPopular'> & {
  tests: TestKey[];
  fasting?: number;
  report?: string;
  description?: string;
  isPopular?: boolean;
};

function build(seed: Seed): HealthPackage {
  const { tests, fasting, report, description, ...rest } = seed;
  const entries: PackageTest[] = tests.map((key) => ({ name: TEST[key].name, count: TEST[key].count }));

  const panels: PackagePanel[] = GROUP_ORDER.map((group) => ({
    group,
    tests: tests
      .filter((key) => TEST[key].group === group)
      .map((key) => ({ name: TEST[key].name, count: TEST[key].count })),
  })).filter((panel) => panel.tests.length > 0);

  const testCount = entries.reduce((sum, test) => sum + test.count, 0);

  return {
    ...rest,
    panels,
    testsIncluded: entries.map((test) => test.name),
    testCount,
    isPopular: seed.isPopular ?? false,
    fastingHours: fasting ?? 10,
    reportTime: report ?? 'Within 24 hours',
    description:
      description ??
      `${seed.name} combines ${entries.length} tests and ${testCount} reportable parameters in one sitting, with a single consolidated report and a plain-language note from a clinician on any value that falls outside range.`,
  };
}

export const packages: HealthPackage[] = [
  build({
    slug: 'basic-health-screening-male',
    family: 'men',
    name: 'Basic Health Screening — Male (18–35)',
    tagline: 'The first annual baseline for men in their twenties and thirties.',
    price: 749, mrp: 899, category: 'Essential', forWhom: 'Men', ageBand: '18–35 years', fasting: 10,
    tests: ['cbc', 'esr', 'fbs', 'lipid', 'lft', 'kft', 'tsh', 'urine', 'uric'],
    highlights: ['Nine panels in one draw', 'Free home collection', 'Report in 24 hours'],
    description:
      'A deliberately short first screen: blood counts, sugar, cholesterol, liver, kidney, thyroid and urine. It catches the handful of things that genuinely drift in your twenties without billing you for markers that will not change a decision.',
  }),
  build({
    slug: 'basic-health-screening-female',
    family: 'women',
    name: 'Basic Health Screening — Female (18–35)',
    tagline: 'Baseline blood work plus the iron and vitamin gaps women actually develop.',
    price: 849, mrp: 999, category: 'Essential', forWhom: 'Women', ageBand: '18–35 years', fasting: 10,
    tests: ['cbc', 'esr', 'fbs', 'lipid', 'lft', 'kft', 'tsh', 'urine', 'iron', 'tibc', 'tsat', 'ferritin', 'vitD', 'b12'],
    highlights: ['Iron studies and ferritin included', 'Vitamin D and B12 included', 'Female phlebotomists on request'],
  }),
  build({
    slug: 'fertility-screening-male',
    family: 'fertility',
    name: 'Fertility Screening — Male',
    tagline: 'Semen analysis and the hormone panel behind male factor infertility.',
    price: 1149, mrp: 1299, category: 'Focused', forWhom: 'Men', ageBand: '25–40 years', fasting: 0,
    report: 'Within 48 hours',
    tests: ['semen', 'testosterone', 'fsh', 'lh', 'prolactin', 'tsh', 'hbsag', 'hcv', 'hiv', 'bloodGroup', 'vitD'],
    highlights: ['WHO-standard semen analysis', 'Hormones: FSH, LH, testosterone, prolactin', 'Private, home or centre collection'],
  }),
  build({
    slug: 'fertility-screening-female',
    family: 'fertility',
    name: 'Fertility Screening — Female',
    tagline: 'Ovarian reserve, ovulation and the screening tests before conception.',
    price: 1649, mrp: 1799, category: 'Focused', forWhom: 'Women', ageBand: '25–40 years', fasting: 10,
    report: 'Within 48 hours',
    tests: ['amh', 'fsh', 'lh', 'estradiol', 'prolactin', 'tsh', 'usgPelvis', 'cbc', 'bloodGroup', 'hiv', 'hbsag', 'hcv', 'rubella', 'vitD'],
    highlights: ['AMH for ovarian reserve', 'Antral follicle count on ultrasound', 'Rubella immunity checked'],
  }),
  build({
    slug: 'executive-health-check-male',
    family: 'men',
    name: 'Comprehensive Executive Health Check — Male (30–50)',
    tagline: 'The annual boardroom check: organs, heart, hormones and lifestyle risk.',
    price: 1449, mrp: 1599, category: 'Advanced', forWhom: 'Men', ageBand: '30–50 years', fasting: 12,
    isPopular: true,
    tests: ['cbc', 'esr', 'fbs', 'hba1c', 'lipid', 'lft', 'kft', 'tsh', 'urine', 'vitD', 'b12', 'hsCrp', 'ecg', 'cxr', 'psa', 'uric'],
    highlights: ['ECG and chest X-ray included', 'HbA1c plus fasting glucose', 'PSA from age 40'],
  }),
  build({
    slug: 'executive-health-check-female',
    family: 'women',
    name: 'Comprehensive Executive Health Check — Female (30–50)',
    tagline: 'Organ, heart and hormone screening with cervical and breast checks.',
    price: 1549, mrp: 1699, category: 'Advanced', forWhom: 'Women', ageBand: '30–50 years', fasting: 12,
    isPopular: true,
    tests: ['cbc', 'esr', 'fbs', 'hba1c', 'lipid', 'lft', 'kft', 'tsh', 'urine', 'vitD', 'b12', 'iron', 'tibc', 'tsat', 'ferritin', 'calcium', 'hsCrp', 'ecg', 'cxr', 'pap'],
    highlights: ['Pap smear included', 'Iron, ferritin and calcium', 'ECG and chest X-ray included'],
  }),
  build({
    slug: 'heart-risk-screening',
    family: 'heart',
    name: 'Heart Risk Screening',
    tagline: 'Beyond cholesterol — the markers that actually predict cardiac events.',
    price: 1249, mrp: 1399, category: 'Focused', forWhom: 'Everyone', ageBand: '35+ years', fasting: 12,
    isPopular: true,
    tests: ['lipid', 'apob', 'apoa1', 'lpa', 'homocysteine', 'hsCrp', 'hba1c', 'fbs', 'kft', 'lft', 'ecg', 'echo', 'tmt'],
    highlights: ['ApoB, Lp(a) and homocysteine', 'Echo and TMT in one visit', 'Cardiologist-signed report'],
    description:
      'Most heart risk is decided by numbers a standard lipid profile never shows. This panel adds ApoB, lipoprotein(a), homocysteine and hs-CRP to a full lipid profile, then puts an ECG, an echocardiogram and a treadmill test behind them — so the report ends in a risk category, not a shrug.',
  }),
  build({
    slug: 'gut-health-basic',
    family: 'everyday',
    name: 'Gut Health Basic',
    tagline: 'For bloating, irregular bowels and food that no longer agrees with you.',
    price: 649, mrp: 799, category: 'Focused', forWhom: 'Everyone', ageBand: '18+ years', fasting: 8,
    tests: ['stool', 'occult', 'hPylori', 'calprotectin', 'cbc', 'lft', 'esr', 'amylase', 'lipase'],
    highlights: ['H. pylori and calprotectin', 'Stool routine with occult blood', 'Gastroenterology review on abnormal'],
  }),
  build({
    slug: 'cancer-screening-male',
    family: 'cancer',
    name: 'Essential Cancer Screening — Male',
    tagline: 'Prostate, colorectal and liver markers for men over 40.',
    price: 1049, mrp: 1199, category: 'Premium', forWhom: 'Men', ageBand: '40+ years', fasting: 10,
    report: 'Within 48 hours',
    tests: ['psa', 'freePsa', 'cea', 'afp', 'ca199', 'cbc', 'lft', 'kft', 'esr', 'occult'],
    highlights: ['PSA total and free ratio', 'CEA, AFP and CA 19-9', 'Oncology nurse navigator'],
  }),
  build({
    slug: 'pcos-pcod-package',
    family: 'women',
    name: 'PCOS / PCOD Package',
    tagline: 'The hormone and insulin picture behind irregular cycles.',
    price: 1049, mrp: 1199, category: 'Focused', forWhom: 'Women', ageBand: '18–40 years', fasting: 12,
    isPopular: true,
    tests: ['lh', 'fsh', 'prolactin', 'testosterone', 'amh', 'tsh', 'insulin', 'fbs', 'homa', 'hba1c', 'lipid', 'usgPelvis', 'vitD', 'cbc'],
    highlights: ['LH:FSH ratio and AMH', 'Insulin resistance measured', 'Pelvic ultrasound included'],
  }),
  build({
    slug: 'womens-wellness-premium',
    family: 'women',
    name: "Women's Wellness Premium",
    tagline: 'Thyroid, iron, hormones, bone and cervical screening in one visit.',
    price: 1249, mrp: 1399, category: 'Premium', forWhom: 'Women', ageBand: '30+ years', fasting: 12,
    isPopular: true,
    tests: ['cbc', 'esr', 'lipid', 'lft', 'kft', 'tsh', 't3', 't4', 'fbs', 'hba1c', 'vitD', 'b12', 'iron', 'tibc', 'tsat', 'ferritin', 'calcium', 'urine', 'pap', 'usgPelvis', 'usgBreast', 'ecg'],
    highlights: ['Cervical and breast screening', 'Full thyroid profile', 'Anaemia work-up included'],
  }),
  build({
    slug: 'mens-wellness-premium',
    family: 'men',
    name: "Men's Wellness Premium",
    tagline: 'Heart, liver, prostate and metabolic risk for men past thirty.',
    price: 1249, mrp: 1399, category: 'Premium', forWhom: 'Men', ageBand: '30+ years', fasting: 12,
    tests: ['cbc', 'esr', 'lipid', 'lft', 'kft', 'tsh', 'fbs', 'hba1c', 'psa', 'freePsa', 'testosterone', 'vitD', 'b12', 'hsCrp', 'urine', 'ecg', 'cxr', 'uric'],
    highlights: ['PSA, free PSA and testosterone', 'ECG and chest X-ray', 'Uric acid and kidney panel'],
  }),
  build({
    slug: 'fever-profile',
    family: 'everyday',
    name: 'Fever Profile',
    tagline: 'Fever that will not settle — the five infections worth ruling out first.',
    price: 649, mrp: 799, category: 'Focused', forWhom: 'Everyone', ageBand: '5+ years', fasting: 0,
    report: 'Within 12 hours',
    tests: ['cbc', 'esr', 'dengueNs1', 'dengueIgm', 'dengueIgg', 'malariaAg', 'malariaSmear', 'chikungunya', 'typhidot', 'widal', 'scrub', 'lepto', 'crp', 'urine', 'lft'],
    highlights: ['Dengue, malaria, typhoid, chikungunya', 'Results in 12 hours', 'Same-day physician call on positive'],
  }),
  build({
    slug: 'pregnancy-planning',
    family: 'fertility',
    name: 'Pregnancy Planning Package',
    tagline: 'Screen for the things worth knowing before you try to conceive.',
    price: 1749, mrp: 1899, category: 'Advanced', forWhom: 'Couples', ageBand: '22–35 years', fasting: 10,
    report: 'Within 48 hours',
    tests: ['cbc', 'bloodGroup', 'hbep', 'hiv', 'hbsag', 'hcv', 'vdrl', 'rubella', 'tsh', 't3', 't4', 'fbs', 'amh', 'vitD', 'b12', 'iron', 'tibc', 'tsat', 'ferritin', 'calcium', 'urine'],
    highlights: ['Thalassaemia carrier screen', 'Rubella immunity and viral screen', 'AMH and thyroid included'],
  }),
  build({
    slug: 'senior-citizen-package',
    family: 'senior',
    name: 'Senior Citizen Package (60+)',
    tagline: 'Bone, heart, kidney and prostate or cervical screening after sixty.',
    price: 1449, mrp: 1599, category: 'Premium', forWhom: 'Seniors', ageBand: '60+ years', fasting: 12,
    isPopular: true,
    tests: ['cbc', 'esr', 'fbs', 'hba1c', 'lipid', 'lft', 'kft', 'tsh', 'vitD', 'b12', 'calcium', 'phosphorus', 'uric', 'psa', 'urine', 'ecg', 'echo', 'cxr', 'usg', 'dexa', 'occult'],
    highlights: ['Echo, ultrasound and DEXA', 'Bone density and vitamin D', 'Geriatric review call included'],
  }),
  build({
    slug: 'full-body-checkup',
    family: 'full-body',
    name: 'Full Body Checkup — Flagship',
    tagline: 'Ninety parameters, one draw, one report you can actually read.',
    price: 1649, mrp: 1799, category: 'Advanced', forWhom: 'Everyone', ageBand: '18+ years', fasting: 12,
    isPopular: true,
    tests: [
      'cbc', 'esr', 'fbs', 'hba1c', 'lipid', 'lft', 'kft', 'tsh', 't3', 't4', 'urine', 'vitD', 'b12',
      'iron', 'tibc', 'tsat', 'ferritin', 'calcium', 'hsCrp', 'uric', 'ecg', 'cxr', 'usg',
    ],
    highlights: ['Every major organ system covered', 'ECG, chest X-ray and ultrasound', 'Free home collection'],
    description:
      'The whole annual review in one appointment: blood counts, sugar control, cholesterol, liver, kidney, thyroid, vitamins, iron, inflammation and urine, plus an ECG, a chest X-ray and an abdominal ultrasound. One draw, one consolidated report, one clinician note on anything abnormal.',
  }),
  build({
    slug: 'diabetes-care-package',
    family: 'everyday',
    name: 'Diabetes Care Package',
    tagline: 'Sugar control, kidney protection and the lipid balance that follows.',
    price: 749, mrp: 899, category: 'Essential', forWhom: 'Everyone', ageBand: '30+ years', fasting: 12,
    tests: ['hba1c', 'fbs', 'ppbs', 'insulin', 'homa', 'lipid', 'kft', 'urine', 'microalbumin', 'cbc', 'lft', 'hsCrp', 'uric'],
    highlights: ['HbA1c plus insulin resistance', 'Microalbumin for early kidney damage', 'Endocrinologist review on abnormal'],
  }),
  build({
    slug: 'cancer-screening-female',
    family: 'cancer',
    name: 'Essential Cancer Screening — Female',
    tagline: 'Breast, cervical and ovarian screening for women over 40.',
    price: 1749, mrp: 1899, category: 'Premium', forWhom: 'Women', ageBand: '40+ years', fasting: 10,
    report: 'Within 48 hours',
    tests: ['ca125', 'cea', 'afp', 'ca199', 'pap', 'hpvDna', 'mammo', 'usgBreast', 'usgPelvis', 'cbc', 'lft', 'kft', 'esr', 'occult'],
    highlights: ['Mammography and breast ultrasound', 'Pap smear and HPV DNA', 'CA-125 tumour marker'],
  }),
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}

export const packageStats = {
  count: packages.length,
  from: Math.min(...packages.map((p) => p.price)),
  parameters: packages.reduce((sum, p) => sum + p.testCount, 0),
  avgSaving: Math.round(
    packages.reduce((sum, p) => sum + (1 - p.price / p.mrp), 0) / packages.length * 100,
  ),
};
