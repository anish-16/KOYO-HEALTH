import type { PackageFamily } from './types';
import { packages } from './packages';
import { people, type PersonPhoto } from './people';

/**
 * The filter matrix is derived from the catalogue, not hand-written.
 *
 * Every package carries a `family`, and the strip, the chips and the counts on
 * the packages index all read from this file — so adding or removing a package
 * updates the navigation instead of leaving a dead filter behind.
 */

export const FAMILY_LABELS: Record<PackageFamily, { label: string; blurb: string; photo: PersonPhoto }> = {
  'full-body': {
    label: 'Full body',
    blurb: 'One draw, every organ system',
    photo: people.family,
  },
  women: {
    label: "Women's health",
    blurb: 'Hormones, iron, thyroid and screening',
    photo: people.women,
  },
  men: {
    label: "Men's health",
    blurb: 'Heart, liver and metabolic baseline',
    photo: people.corporate,
  },
  fertility: {
    label: 'Fertility & pregnancy',
    blurb: 'Before conception and early planning',
    photo: people.coupleYoung,
  },
  heart: {
    label: 'Heart health',
    blurb: 'ApoB, Lp(a), echo and TMT',
    photo: people.clinician,
  },
  cancer: {
    label: 'Cancer screening',
    blurb: 'Breast, cervical, prostate and markers',
    photo: people.coupleMature,
  },
  senior: {
    label: 'Senior care',
    blurb: 'Bone, heart and kidney after sixty',
    photo: people.senior,
  },
  everyday: {
    label: 'Everyday care',
    blurb: 'Fever, gut and diabetes',
    photo: people.phlebotomy,
  },
};

/** Ordered by how many packages each family holds, so the busiest comes first. */
export const packageFamilies = (Object.keys(FAMILY_LABELS) as PackageFamily[])
  .map((key) => {
    const members = packages.filter((p) => p.family === key);
    return {
      key,
      ...FAMILY_LABELS[key],
      count: members.length,
      from: members.length ? Math.min(...members.map((p) => p.price)) : 0,
    };
  })
  .filter((family) => family.count > 0)
  .sort((a, b) => b.count - a.count);

export function getFamily(key?: string) {
  return packageFamilies.find((family) => family.key === key);
}

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/**
 * The number of category tiles, spelled out for headings. Copy reads "Eight
 * categories" from the catalogue instead of hard-coding it, so the sentence can
 * never claim more categories than the packages actually produce.
 */
export function familyCountWord() {
  return COUNT_WORDS[packageFamilies.length] ?? String(packageFamilies.length);
}

/**
 * A person — never a machine — for every package.
 *
 * The subject has to match the panel: a man for a men's screen, a woman for a
 * women's panel, a couple for fertility, an older man for cancer screening, a
 * family for the full body check. Laboratory benches, microscopes and meeting
 * rooms belong in editorial sections, not on a card that is selling a checkup
 * to a person. Photographs repeat only where the subject is right, and never
 * within four catalogue positions, so no two neighbouring cards in a row (or
 * two cards stacked in the same column of a three-column grid) show the same
 * face. `PackageArt` then layers the tier tone, glyph and parameters on top.
 */
const PACKAGE_PHOTO: Record<string, keyof typeof people> = {
  'basic-health-screening-male': 'corporate',
  'basic-health-screening-female': 'women',
  'fertility-screening-male': 'coupleYoung',
  'fertility-screening-female': 'mother',
  'executive-health-check-male': 'corporate',
  'executive-health-check-female': 'women',
  'heart-risk-screening': 'coupleMature',
  'gut-health-basic': 'clinician',
  'cancer-screening-male': 'senior',
  'pcos-pcod-package': 'mother',
  'womens-wellness-premium': 'women',
  'mens-wellness-premium': 'corporate',
  'fever-profile': 'pediatrician',
  'pregnancy-planning': 'coupleYoung',
  'senior-citizen-package': 'senior',
  'full-body-checkup': 'family',
  'diabetes-care-package': 'phlebotomy',
  'cancer-screening-female': 'coupleMature',
};

/** Fallback for a new package: the category's own person, then the audience's. */
export function packagePhoto(pkg: { slug: string; forWhom: string; family?: PackageFamily }): PersonPhoto {
  const key = PACKAGE_PHOTO[pkg.slug];
  if (key) return people[key];
  if (pkg.family) return FAMILY_LABELS[pkg.family].photo;
  if (pkg.forWhom === 'Women') return people.women;
  if (pkg.forWhom === 'Men') return people.corporate;
  if (pkg.forWhom === 'Seniors') return people.senior;
  if (pkg.forWhom === 'Couples') return people.coupleYoung;
  return people.family;
}
