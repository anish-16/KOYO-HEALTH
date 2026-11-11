export type MembershipTier = {
  name: 'Basic' | 'Gold' | 'Platinum';
  price: number;
  mrp: number;
  tagline: string;
  discount: number;
  highlight: boolean;
  benefits: string[];
  limits: { label: string; value: string }[];
};

export const membershipTiers: MembershipTier[] = [
  {
    name: 'Basic',
    price: 0,
    mrp: 0,
    tagline: 'Pay per test, no commitment.',
    discount: 0,
    highlight: false,
    benefits: [
      'Book any test or package at list price',
      'Digital reports with 10-year storage',
      'Free rescheduling up to 12 hours before',
      'Home collection at ₹149 per visit',
    ],
    limits: [
      { label: 'Discount', value: '0%' },
      { label: 'Home collection', value: '₹149 / visit' },
      { label: 'Report turnaround', value: 'Standard' },
      { label: 'Physician call', value: '₹299' },
      { label: 'Family profiles', value: '2' },
      { label: 'Priority slots', value: '—' },
    ],
  },
  {
    name: 'Gold',
    price: 1499,
    mrp: 2999,
    tagline: 'For one person who tests every year.',
    discount: 15,
    highlight: true,
    benefits: [
      '15% off every test, scan and package',
      'Free unlimited home collection',
      'Priority reporting — half the standard turnaround',
      'Two free 15-minute physician calls a year',
      '5% wallet credit back on every booking',
      'Free annual Vitamin D & B12 check',
    ],
    limits: [
      { label: 'Discount', value: '15%' },
      { label: 'Home collection', value: 'Free, unlimited' },
      { label: 'Report turnaround', value: '50% faster' },
      { label: 'Physician call', value: '2 free / year' },
      { label: 'Family profiles', value: '5' },
      { label: 'Priority slots', value: 'Yes' },
    ],
  },
  {
    name: 'Platinum',
    price: 3999,
    mrp: 6999,
    tagline: 'For families and frequent testers.',
    discount: 22,
    highlight: false,
    benefits: [
      '22% off every test, scan and package',
      'Everything in Gold, for up to 8 family members',
      'Dedicated care manager with a direct line',
      'Free annual full-body checkup for the primary member',
      'Same-day radiology reporting',
      'Home visit by a phlebotomist within 90 minutes',
      'Insurance paperwork handled end to end',
    ],
    limits: [
      { label: 'Discount', value: '22%' },
      { label: 'Home collection', value: 'Free, 90-min slots' },
      { label: 'Report turnaround', value: 'Same day (imaging)' },
      { label: 'Physician call', value: 'Unlimited' },
      { label: 'Family profiles', value: '8' },
      { label: 'Priority slots', value: 'First access' },
    ],
  },
];

export const memberUsage = [
  { label: 'Tests discounted', value: '11 of 14', detail: '3 bookings before membership' },
  { label: 'Saved on bookings', value: '₹4,860', detail: '15% off across 11 orders' },
  { label: 'Home visits used', value: '9', detail: 'Worth ₹1,341 in fees' },
  { label: 'Physician calls', value: '1 of 2', detail: 'Dr. Farah Qureshi · 27 Oct' },
];

export const membershipFaqs: { q: string; a: string }[] = [
  {
    q: 'Does the discount stack with package prices?',
    a: 'Yes. The membership discount applies to the already-discounted package price, and the 5% wallet credit is calculated on what you actually pay.',
  },
  {
    q: 'Can I use one membership for my parents?',
    a: 'Gold covers five profiles and Platinum covers eight, including family members in another city. Each profile needs its own consent OTP the first time it is used.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You can cancel within 7 days for a full refund if you have not used a benefit. After that, the membership stays active until the renewal date and does not auto-renew unless you opt in.',
  },
  {
    q: 'Is membership worth it for a single test?',
    a: 'Gold pays for itself at about ₹10,000 of annual testing. On a single full-body package it already saves more than the fee, which is why most members join with a package.',
  },
  {
    q: 'Do corporate employees get membership?',
    a: 'Corporate wellness plans include Gold-equivalent benefits for covered employees. Personal memberships can be linked to the same account without duplicating profiles.',
  },
];
