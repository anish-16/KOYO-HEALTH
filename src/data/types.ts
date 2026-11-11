export type Modality =
  | 'Radiology'
  | 'Pathology'
  | 'Cardiology'
  | 'Neurodiagnostics'
  | 'Specialist';

export type ServiceTest = {
  slug: string;
  name: string;
  price: number;
  mrp: number;
  durationMinutes: number;
  reportHours: number;
  fastingHours: number;
  homeCollection: boolean;
  sample: 'Blood' | 'Urine' | 'None';
  description: string;
};

export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  modality: Modality;
  icon: string;
  tagline: string;
  description: string;
  story: string[];
  startingPrice: number;
  mrp: number;
  duration: string;
  reportTime: string;
  isPopular: boolean;
  highlights: string[];
  preparation: string[];
  benefits: string[];
  risks: string[];
  tests: ServiceTest[];
  faqs: ServiceFaq[];
  centers: number;
  scansPerYear: number;
};

/** Catalogue families, derived from the packages the clinic actually sells. */
export type PackageFamily =
  | 'full-body'
  | 'women'
  | 'men'
  | 'fertility'
  | 'heart'
  | 'cancer'
  | 'senior'
  | 'everyday';

/** One named test and how many reportable parameters it covers. */
export type PackageTest = { name: string; count: number };

/** A clinical grouping of tests, the way a printed report is organised. */
export type PackagePanel = { group: string; tests: PackageTest[] };

export type HealthPackage = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  mrp: number;
  /** Flattened test names — used by search, cards and structured data. */
  testsIncluded: string[];
  /** Tests grouped by discipline, for the package detail page. */
  panels: PackagePanel[];
  testCount: number;
  forWhom: 'Women' | 'Men' | 'Couples' | 'Everyone' | 'Seniors' | 'Corporate';
  /** Drives the filter strip and the chips on the packages index. */
  family: PackageFamily;
  ageBand: string;
  fastingHours: number;
  reportTime: string;
  description: string;
  highlights: string[];
  isPopular: boolean;
  category: 'Essential' | 'Advanced' | 'Premium' | 'Focused' | 'Corporate';
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: number;
  heroTone: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
  takeaways: string[];
};

export type City = {
  slug: string;
  name: string;
  state: string;
  centers: number;
  tests: number;
  pincode: string;
  popular: boolean;
  localities: string[];
  launchYear: number;
};

export type Center = {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviews: number;
  accreditations: string[];
  modalities: string[];
  timings: string;
  homeCollection: boolean;
  distance: string;
};

export type Doctor = {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  experience: number;
  speciality: string;
  bio: string;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  rating: number;
  service: string;
  quote: string;
  date: string;
  verified: boolean;
};

export type Booking = {
  id: string;
  patient: string;
  tests: string[];
  center: string;
  city: string;
  date: string;
  slot: string;
  status: 'Upcoming' | 'Sample Collected' | 'Report Ready' | 'Completed' | 'Cancelled';
  mode: 'Home Collection' | 'Center Visit';
  amount: number;
  payment: 'Paid' | 'Pay at Center' | 'Refunded';
  technician?: string;
};

export type Report = {
  id: string;
  bookingId: string;
  title: string;
  patient: string;
  date: string;
  status: 'Ready' | 'Processing' | 'Awaiting Sample';
  doctor: string;
  pages: number;
  summary: string;
  biomarkers: { name: string; value: string; unit: string; range: string; flag: 'normal' | 'high' | 'low' }[];
};

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  lastTest: string;
  reports: number;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit' | 'Refund';
  balance: number;
  method: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: 'report' | 'booking' | 'offer' | 'reminder';
};
