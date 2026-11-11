import type { PersonPhoto } from './people';
import { people } from './people';

/**
 * Corporate wellness content model.
 *
 * The copy follows the enterprise-health structure used by the reference
 * (workforce programmes → digital portal → sectors → service edge → proposal),
 * rewritten for KOYO's own network numbers so nothing contradicts the
 * individual-facing pages (268 accredited centres across 48 cities).
 */

export type CorporateProgramme = {
  tag: string;
  title: string;
  body: string;
  icon: 'heart' | 'camp' | 'compliance' | 'safety';
  photo: PersonPhoto;
  bullets: string[];
};

export const corporateHeroChips = [
  'NABL & NABH partner network',
  '48 cities pan-India',
  '100% tax benefit u/s 80D',
  'Dedicated key account manager',
  '99.2% screening SLA',
  'Zero employee work downtime',
  'Custom executive panels',
  'Built for MSMEs & enterprises',
];

export const corporateStats = [
  { to: 268, suffix: '+', label: 'Accredited centres', sub: 'NABL labs & NABH imaging' },
  { to: 48, suffix: '', label: 'Cities pan-India', sub: 'Tier 1, 2 and 3 coverage' },
  { to: 99.2, suffix: '%', label: 'On-time digital reports', sub: 'Verified by MD pathologists', decimals: 1 },
  { to: 40, suffix: '%', label: 'Cost optimisation', sub: 'Consolidated group pricing' },
];

export const corporateProgrammes: CorporateProgramme[] = [
  {
    tag: 'Mandatory & preventive',
    title: 'Health checkups & preventive care',
    body: 'Fitness-to-work screening and annual master health checks, designed around the risks your workforce actually carries.',
    icon: 'heart',
    photo: people.phlebotomy,
    bullets: [
      'Pre-employment candidate verification across 268 centres',
      'Age- and gender-specific annual executive full-body profiles',
      'Free doorstep phlebotomy for remote and work-from-home teams',
    ],
  },
  {
    tag: 'Zero downtime',
    title: 'Onsite campus wellness & vaccination camps',
    body: 'Turn your office or plant into a temporary clinic for a morning — staff are screened at their desk, not across town.',
    icon: 'camp',
    photo: people.vaccination,
    bullets: [
      'Certified phlebotomists and nursing personnel at client campus',
      'Seasonal flu, hepatitis-B and cervical cancer vaccination drives',
      'Instant vitals, random blood sugar and 12-lead ECG setups',
    ],
  },
  {
    tag: 'Statutory compliance',
    title: 'Occupational health centres & audits',
    body: 'On-premise medical rooms run to The Factories Act, 1948 and OSHA expectations, with the paperwork kept audit-ready.',
    icon: 'compliance',
    photo: people.clinician,
    bullets: [
      'Full-time or visiting certified Occupational Health Physicians (AFIH)',
      'Onsite audiometry, spirometry and vision screening',
      'Medical inventory, AED defibrillators and emergency SOPs',
    ],
  },
  {
    tag: 'Workplace safety',
    title: 'Drug testing & health risk profiling',
    body: 'Confidential multi-panel screening for logistics, transport and safety-critical operations, with chain-of-custody intact.',
    icon: 'safety',
    photo: people.microscope,
    bullets: [
      '5-panel to 10-panel chain-of-custody toxicology screening',
      'Biometric health risk assessments and lifestyle profiling',
      'Aggregate anonymous audit reports for HR leadership',
    ],
  },
];

export const corporatePortal = {
  features: [
    {
      icon: 'roster',
      title: 'Automated batch scheduling & roster sync',
      body: 'Upload an employee roster by CSV or API. Booking invites go out over SMS and WhatsApp, and no-shows are re-slotted automatically.',
    },
    {
      icon: 'analytics',
      title: 'Workforce health analytics & risk insights',
      body: 'Anonymised, aggregate views of cardiac, diabetic and ergonomic trends — enough to shape next year’s programme, never enough to identify a person.',
    },
    {
      icon: 'security',
      title: 'HIPAA & ISO 27001 data confidentiality',
      body: 'Employees see their full private report; HR receives a verified fit-to-work certificate. The separation is contractual, technical and audited.',
    },
  ],
  chips: ['Real-time batch status', 'Automated WhatsApp PDFs', 'Single GST billing'],
} as const;

export const corporateSectors = [
  {
    tag: 'Sedentary health',
    title: 'IT, GCCs & tech startups',
    body: 'Sedentary-lifestyle risks, ergonomic strain and lipid/cardiac biomarkers, with doorstep collection for distributed teams.',
    icon: 'it',
  },
  {
    tag: 'Factories Act 1948',
    title: 'Manufacturing & heavy plants',
    body: 'Statutory compliance, hazardous chemical exposure monitoring, audiometry for hearing and spirometry for lung health.',
    icon: 'plant',
    photo: people.manufacture,
  },
  {
    tag: 'Executive health',
    title: 'BFSI, consulting & fintech',
    body: 'Executive master health checkups, senior-leadership cardiac risk profiling and mental-wellness sessions.',
    icon: 'executive',
  },
  {
    tag: 'Driver fitness',
    title: 'Logistics & supply chain',
    body: 'Multi-city driver fitness screening, random drug and alcohol testing, vision acuity and zero-wait pre-employment clearance.',
    icon: 'logistics',
    photo: people.logistics,
  },
  {
    tag: 'Cashless PPMC',
    title: 'Insurers, brokers & TPAs',
    body: 'Cashless diagnostic fulfilment, pre-policy medical checkups and tamper-proof digital pathology reports across India.',
    icon: 'insurance',
  },
  {
    tag: 'Campus health',
    title: 'Universities, PSUs & government',
    body: 'Campus-wide health drives, student admission medical evaluations and tender-compliant statutory programmes.',
    icon: 'campus',
  },
] as const;

export const corporateEdge = [
  {
    title: 'Dedicated account manager',
    body: 'One named contact for batch coordination, custom panel formulation and priority escalation.',
    metric: '100% dedicated KAM',
    icon: 'manager',
  },
  {
    title: 'Standardised pan-India rates',
    body: 'Uniform pricing across Tier 1, 2 and 3 cities, with one consolidated monthly GST invoice.',
    metric: 'Up to 40% savings',
    icon: 'pricing',
  },
  {
    title: 'NABL & NABH gold standards',
    body: 'Temperature-controlled sample cold chain, read by experienced MD pathologists and radiologists.',
    metric: '268 verified centres',
    icon: 'quality',
  },
  {
    title: 'HIPAA & ISO data security',
    body: 'End-to-end encryption with strict role-based access to every clinical record.',
    metric: 'ISO 27001 aligned',
    icon: 'security',
  },
] as const;

export const corporateContact = {
  hotline: '+91 88005 80075',
  hotlineHref: 'tel:+918800580075',
  email: 'corporate@koyohealth.in',
  emailHref: 'mailto:corporate@koyohealth.in',
  whatsapp: 'https://wa.me/918800580075?text=Hi%20KOYO%2C%20I%27d%20like%20a%20corporate%20wellness%20proposal.',
};
