
/**
 * Human photography used across the site.
 *
 * Files live in `public/images/people/` and are pre-cropped by the CDN at the
 * exact aspect each placement needs, so no runtime resizing is required and the
 * CSP `img-src 'self'` rule stays intact. Sourced from Pexels under the Pexels
 * licence (free for commercial use, no attribution required); the source photo
 * ids are recorded in `public/images/people/README.md`.
 */
export type PersonPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export const people = {
  family: {
    src: '/images/people/hero-family.jpg',
    alt: 'Parents sitting in a car with their smiling toddler on a family outing',
    caption: 'Families book together — one visit, reports for everyone',
    width: 1600,
    height: 1067,
  },
  mother: {
    src: '/images/people/care-mother.jpg',
    alt: 'A mother holding her baby daughter, who is reaching for her hand',
    caption: 'Postpartum, paediatric and fertility panels',
    width: 1000,
    height: 750,
  },
  phlebotomy: {
    src: '/images/people/sample-collection.jpg',
    alt: 'A phlebotomist in gloves drawing blood from a patient’s arm into a collection tube',
    caption: 'Home collection by a trained, background-verified phlebotomist',
    width: 1000,
    height: 750,
  },
  clinician: {
    src: '/images/people/clinician.jpg',
    alt: 'A physician in scrubs with a stethoscope, reviewing a patient’s chart',
    caption: 'Every abnormal value is reviewed by a physician',
    width: 900,
    height: 900,
  },
  senior: {
    src: '/images/people/senior-care.jpg',
    alt: 'A doctor checking the chest of an elderly man wearing a turban',
    caption: 'Senior care plans include a geriatric review call',
    width: 1000,
    height: 750,
  },
  coupleMature: {
    src: '/images/people/couple-mature.jpg',
    alt: 'An older couple sitting together in a park, smiling at each other',
    caption: 'Couples screening is one appointment for two people',
    width: 1000,
    height: 750,
  },
  coupleYoung: {
    src: '/images/people/couple-young.jpg',
    alt: 'A young couple laughing together outdoors',
    caption: 'Pre-marital and fertility panels for couples',
    width: 1000,
    height: 750,
  },
  kids: {
    src: '/images/people/kids.jpg',
    alt: 'Two young children smiling at the camera',
    caption: 'Paediatric panels with child-sized collection kits',
    width: 1000,
    height: 750,
  },
  pediatrician: {
    src: '/images/people/pediatrician.jpg',
    alt: 'A paediatrician listening to a child’s chest with a stethoscope',
    caption: 'Paediatricians review every child’s report',
    width: 1000,
    height: 750,
  },
  women: {
    src: '/images/people/women.jpg',
    alt: 'A smiling woman in a red saree with traditional jewellery',
    caption: 'Female phlebotomists are available on request',
    width: 900,
    height: 900,
  },
  corporate: {
    src: '/images/people/corporate.jpg',
    alt: 'A smiling man in a blue blazer holding a document at his workplace',
    caption: 'Men’s health panels include PSA and cardiac risk markers',
    width: 900,
    height: 900,
  },
  workplace: {
    src: '/images/people/meeting.jpg',
    alt: 'Colleagues working together around a table with laptops',
    caption: 'Corporate screening on-site, with aggregate reports for HR',
    width: 1000,
    height: 750,
  },
  manufacture: {
    src: '/images/people/corporate-manufacturing.jpg',
    alt: 'A worker in a blue uniform folding finished fabric in a garment factory',
    caption: 'Factory-floor screening built around The Factories Act, 1948',
    width: 1000,
    height: 750,
  },
  logistics: {
    src: '/images/people/corporate-logistics.jpg',
    alt: 'A warehouse supervisor checking blue crates in a distribution centre',
    caption: 'Driver fitness and pre-employment clearance across depots',
    width: 1000,
    height: 750,
  },
  vaccination: {
    src: '/images/people/corporate-vaccination.jpg',
    alt: 'A health worker pressing a cotton swab onto a patient’s arm after a vaccination',
    caption: 'Seasonal flu, hepatitis-B and HPV drives at your campus',
    width: 1000,
    height: 750,
  },
  lab: {
    src: '/images/people/lab-researcher.jpg',
    alt: 'Laboratory scientists working at a microscope and analyser',
    caption: 'NABL-accredited laboratories, audited twice a year',
    width: 1000,
    height: 750,
  },
  microscope: {
    src: '/images/people/lab-microscope.jpg',
    alt: 'Gloved hands adjusting a laboratory microscope',
    caption: 'Every sample is barcoded and tracked end to end',
    width: 1000,
    height: 750,
  },
} satisfies Record<string, PersonPhoto>;

/*
 * Category cards are derived from the catalogue itself — see `src/data/families.ts`,
 * which maps each of the 18 packages to a family and a person-centred photograph.
 */
