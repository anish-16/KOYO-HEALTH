import type { Center, Doctor, Testimonial } from './types';

export const doctors: Doctor[] = [
  {
    id: 'ananya-rao',
    name: 'Dr. Ananya Rao',
    role: 'Chief Medical Officer',
    qualifications: 'MBBS, MD (Internal Medicine)',
    experience: 14,
    speciality: 'Preventive & Internal Medicine',
    bio: 'Leads KOYO\'s clinical governance and annual health programme. Previously headed preventive medicine at a 400-bed tertiary hospital in Bengaluru.',
  },
  {
    id: 'vikram-sethi',
    name: 'Dr. Vikram Sethi',
    role: 'Head of Radiology',
    qualifications: 'MBBS, MD (Radiodiagnosis), FRCR',
    experience: 18,
    speciality: 'Neuroradiology & Body Imaging',
    bio: 'Double-reads every neuro and oncology study at KOYO. Trained at AIIMS and completed a fellowship in cross-sectional imaging in London.',
  },
  {
    id: 'arjun-malhotra',
    name: 'Dr. Arjun Malhotra',
    role: 'Consultant Cardiologist',
    qualifications: 'MBBS, MD, DM (Cardiology)',
    experience: 16,
    speciality: 'Interventional Cardiology',
    bio: 'Oversees cardiac diagnostics and the KOYO chest-pain pathway. Has performed more than 4,000 coronary interventions.',
  },
  {
    id: 'meera-krishnan',
    name: 'Dr. Meera Krishnan',
    role: 'Consultant Endocrinologist',
    qualifications: 'MBBS, MD, DM (Endocrinology)',
    experience: 11,
    speciality: 'Diabetes, Thyroid & Metabolic Health',
    bio: 'Designed KOYO\'s diabetes reversal and fatty liver programmes. Research interests include insulin resistance in South Asian populations.',
  },
  {
    id: 'sneha-kapoor',
    name: 'Dr. Sneha Kapoor',
    role: 'Consultant — Women\'s Health',
    qualifications: 'MBBS, MS (Obstetrics & Gynaecology)',
    experience: 12,
    speciality: 'Breast Imaging & Gynaecology',
    bio: 'Leads the women\'s screening pathway, including mammography audits and cervical cytology quality. Advocates for same-visit breast ultrasound.',
  },
  {
    id: 'rohan-iyer',
    name: 'Dr. Rohan Iyer',
    role: 'Consultant — Pulmonology',
    qualifications: 'MBBS, MD (Pulmonary Medicine)',
    experience: 13,
    speciality: 'Sleep Medicine & Interstitial Lung Disease',
    bio: 'Built KOYO\'s home sleep apnoea programme. Previously ran the sleep lab at a major Chennai teaching hospital.',
  },
  {
    id: 'farah-qureshi',
    name: 'Dr. Farah Qureshi',
    role: 'Consultant Pathologist',
    qualifications: 'MBBS, MD (Pathology), DNB',
    experience: 15,
    speciality: 'Haematology & Cytopathology',
    bio: 'Responsible for laboratory quality across 268 partner labs, including daily internal controls and external quality assurance cycles.',
  },
  {
    id: 'aditya-menon',
    name: 'Dr. Aditya Menon',
    role: 'Head of Clinical Operations',
    qualifications: 'MBBS, MBA (Healthcare Management)',
    experience: 17,
    speciality: 'Diagnostic Operations',
    bio: 'Runs the 90-minute home collection promise and the centre quality audit programme across 48 cities.',
  },
];

export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Priya Sharma', city: 'Gurugram', rating: 5, service: 'Full Body Checkup — Advanced', date: '2026-10-24', verified: true, quote: 'The phlebotomist arrived in 40 minutes, explained every tube, and my report was in the app before dinner. My physician said it was the clearest lab report he had seen in months.' },
  { id: 't2', name: 'Rahul Verma', city: 'Delhi', rating: 5, service: 'MRI Lumbar Spine', date: '2026-10-12', verified: true, quote: 'I was nervous about the MRI. The team let me bring my own playlist, explained every sequence, and the report was ready the same evening. My surgeon had the images before my consultation.' },
  { id: 't3', name: 'Anjali Nair', city: 'Bengaluru', rating: 5, service: "Women's Health — Advanced", date: '2026-09-30', verified: true, quote: 'Having the mammogram, ultrasound and Pap in one visit made a stressful week so much easier. The female technician was kind and the report arrived with a clear next step.' },
  { id: 't4', name: 'Sandeep Kulkarni', city: 'Pune', rating: 4, service: 'Cardiac Screening Advanced', date: '2026-09-18', verified: true, quote: 'Echo and TMT back to back, with the cardiologist calling me himself about a borderline finding. That call is why I trust them.' },
  { id: 't5', name: 'Meenakshi Iyer', city: 'Chennai', rating: 5, service: 'Sleep Study (Home)', date: '2026-09-05', verified: true, quote: 'I had no idea I was stopping breathing 31 times an hour. The home setup was unobtrusive and the sleep physician spent 25 minutes going through the report with me.' },
  { id: 't6', name: 'Imran Sheikh', city: 'Hyderabad', rating: 5, service: 'CT Abdomen & Pelvis', date: '2026-08-29', verified: true, quote: 'Booked at 9 pm for a 7 am slot. The centre was ready, the creatinine check was quick, and the report reached my urologist before lunch.' },
  { id: 't7', name: 'Kavita Menon', city: 'Mumbai', rating: 5, service: 'Senior Citizen Comprehensive', date: '2026-08-21', verified: true, quote: 'My father is 78 and cannot travel. KOYO sent a phlebotomist and a portable X-ray van on the same morning. The coordination was flawless.' },
  { id: 't8', name: 'Abhishek Ghosh', city: 'Kolkata', rating: 4, service: 'Full Body Checkup — Essential', date: '2026-08-14', verified: true, quote: 'Straightforward, no upsell, and the report flagged a ferritin issue my previous lab had missed. The follow-up call was genuinely useful rather than salesy.' },
  { id: 't9', name: 'Neha Bansal', city: 'Noida', rating: 5, service: 'PCOD & Hormone Panel', date: '2026-08-02', verified: true, quote: 'Finally a report that explained the LH:FSH ratio and what it meant for me, in plain language. The gynaecologist review was included, which I did not expect.' },
  { id: 't10', name: 'Vikram Chawla', city: 'Jaipur', rating: 5, service: 'Corporate Annual Wellness', date: '2026-07-26', verified: true, quote: 'We ran camps for 640 employees across three sites. KOYO handled scheduling, privacy and the aggregate dashboard. Participation was 89%, far above our previous vendor.' },
  { id: 't11', name: 'Sara Thomas', city: 'Kochi', rating: 5, service: 'Thyroid Profile', date: '2026-07-11', verified: true, quote: 'The home collection was on time to the minute, and the report included anti-TPO which my doctor had asked for. Zero friction.' },
  { id: 't12', name: 'Deepak Rawat', city: 'Dehradun', rating: 4, service: 'FibroScan + LFT', date: '2026-06-29', verified: true, quote: 'FibroScan was painless and the hepatologist explained my fibrosis stage without jargon. I have changed my diet and my six-month repeat already shows improvement.' },
];

export const centers: Center[] = [
  { id: 'c1', name: 'KOYO Diagnostics — Saket', city: 'Delhi', address: 'Ground Floor, Press Enclave Road, Saket, New Delhi 110017', rating: 4.8, reviews: 2140, accreditations: ['NABH', 'NABL'], modalities: ['CT', 'MRI', 'Ultrasound', 'X-Ray', 'Pathology'], timings: '7:00 am – 9:00 pm', homeCollection: true, distance: '2.4 km' },
  { id: 'c2', name: 'KOYO Diagnostics — DLF Phase 3', city: 'Gurugram', address: 'Unit 12, Cyber City, DLF Phase 3, Gurugram 122002', rating: 4.9, reviews: 1860, accreditations: ['NABH', 'NABL'], modalities: ['MRI', 'CT', 'Echo', 'Pathology'], timings: '6:30 am – 10:00 pm', homeCollection: true, distance: '1.1 km' },
  { id: 'c3', name: 'KOYO Imaging — Indiranagar', city: 'Bengaluru', address: '100 Feet Road, Indiranagar, Bengaluru 560038', rating: 4.7, reviews: 1540, accreditations: ['NABL'], modalities: ['MRI', 'CT', 'Mammography', 'DEXA'], timings: '7:00 am – 8:30 pm', homeCollection: true, distance: '3.2 km' },
  { id: 'c4', name: 'KOYO Diagnostics — Bandra West', city: 'Mumbai', address: 'Linking Road, Bandra West, Mumbai 400050', rating: 4.8, reviews: 2310, accreditations: ['NABH', 'NABL'], modalities: ['CT', 'MRI', 'PET-CT', 'Pathology'], timings: '24 × 7', homeCollection: true, distance: '1.8 km' },
  { id: 'c5', name: 'KOYO Diagnostics — Banjara Hills', city: 'Hyderabad', address: 'Road No. 12, Banjara Hills, Hyderabad 500034', rating: 4.6, reviews: 1280, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'Echo', 'Pathology'], timings: '7:00 am – 9:00 pm', homeCollection: true, distance: '4.0 km' },
  { id: 'c6', name: 'KOYO Diagnostics — Anna Nagar', city: 'Chennai', address: '2nd Avenue, Anna Nagar, Chennai 600040', rating: 4.7, reviews: 1420, accreditations: ['NABH', 'NABL'], modalities: ['MRI', 'CT', 'Mammography', 'Pathology'], timings: '6:00 am – 9:00 pm', homeCollection: true, distance: '2.9 km' },
  { id: 'c7', name: 'KOYO Diagnostics — Salt Lake', city: 'Kolkata', address: 'Sector V, Salt Lake, Kolkata 700091', rating: 4.6, reviews: 980, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'ECG', 'Pathology'], timings: '7:00 am – 8:00 pm', homeCollection: true, distance: '3.6 km' },
  { id: 'c8', name: 'KOYO Diagnostics — Koregaon Park', city: 'Pune', address: 'North Main Road, Koregaon Park, Pune 411001', rating: 4.8, reviews: 1120, accreditations: ['NABH', 'NABL'], modalities: ['MRI', 'CT', 'DEXA', 'Pathology'], timings: '7:00 am – 9:00 pm', homeCollection: true, distance: '2.1 km' },
  { id: 'c9', name: 'KOYO Imaging — Sector 62', city: 'Noida', address: 'Tower C, Nukleus, Logix Cyber Park, Sector 62, Noida 201309', rating: 4.9, reviews: 3040, accreditations: ['NABH', 'NABL'], modalities: ['MRI', 'CT', 'PET-CT', 'Sleep Lab', 'Pathology'], timings: '24 × 7', homeCollection: true, distance: '0.8 km' },
  { id: 'c10', name: 'KOYO Diagnostics — Satellite', city: 'Ahmedabad', address: 'Jodhpur Cross Road, Satellite, Ahmedabad 380015', rating: 4.5, reviews: 760, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'Pathology'], timings: '7:00 am – 8:30 pm', homeCollection: true, distance: '5.2 km' },
  { id: 'c11', name: 'KOYO Diagnostics — Malviya Nagar', city: 'Jaipur', address: 'Calgiri Road, Malviya Nagar, Jaipur 302017', rating: 4.6, reviews: 640, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'X-Ray', 'Pathology'], timings: '7:00 am – 8:00 pm', homeCollection: true, distance: '4.4 km' },
  { id: 'c12', name: 'KOYO Diagnostics — Gomti Nagar', city: 'Lucknow', address: 'Vibhuti Khand, Gomti Nagar, Lucknow 226010', rating: 4.5, reviews: 520, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'Echo', 'Pathology'], timings: '7:00 am – 8:00 pm', homeCollection: true, distance: '6.1 km' },
  { id: 'c13', name: 'KOYO Diagnostics — Vashi', city: 'Navi Mumbai', address: 'Sector 17, Vashi, Navi Mumbai 400703', rating: 4.7, reviews: 890, accreditations: ['NABH', 'NABL'], modalities: ['MRI', 'CT', 'Mammography', 'Pathology'], timings: '6:30 am – 9:00 pm', homeCollection: true, distance: '3.3 km' },
  { id: 'c14', name: 'KOYO Diagnostics — Kakkanad', city: 'Kochi', address: 'Seaport-Airport Road, Kakkanad, Kochi 682030', rating: 4.6, reviews: 610, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'Pathology'], timings: '7:00 am – 8:00 pm', homeCollection: true, distance: '5.7 km' },
  { id: 'c15', name: 'KOYO Diagnostics — Sector 17', city: 'Chandigarh', address: 'Madhya Marg, Sector 17, Chandigarh 160017', rating: 4.8, reviews: 720, accreditations: ['NABH', 'NABL'], modalities: ['MRI', 'CT', 'Echo', 'Pathology'], timings: '7:00 am – 9:00 pm', homeCollection: true, distance: '2.0 km' },
  { id: 'c16', name: 'KOYO Diagnostics — Vijay Nagar', city: 'Indore', address: 'AB Road, Vijay Nagar, Indore 452010', rating: 4.5, reviews: 480, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'X-Ray', 'Pathology'], timings: '7:00 am – 8:00 pm', homeCollection: true, distance: '4.8 km' },
  { id: 'c17', name: 'KOYO Diagnostics — MVP Colony', city: 'Visakhapatnam', address: 'Sector 4, MVP Colony, Visakhapatnam 530017', rating: 4.4, reviews: 390, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'Pathology'], timings: '7:00 am – 8:00 pm', homeCollection: true, distance: '6.4 km' },
  { id: 'c18', name: 'KOYO Diagnostics — Panaji', city: 'Goa', address: '18th June Road, Panaji, Goa 403001', rating: 4.7, reviews: 310, accreditations: ['NABL'], modalities: ['CT', 'Ultrasound', 'X-Ray', 'Pathology'], timings: '7:30 am – 8:00 pm', homeCollection: true, distance: '1.5 km' },
];

export const faqGroups: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: 'Booking & Appointments',
    items: [
      { q: 'How do I book a test at KOYO Health?', a: 'Search for a test, add it to your booking, choose home collection or a centre visit, and pick a slot. You will receive a confirmation on WhatsApp and email within a minute. No payment is needed to reserve a home collection slot.' },
      { q: 'Can I reschedule or cancel without a fee?', a: 'Yes. Reschedule or cancel free of charge up to 4 hours before a home visit or centre appointment. Scans with contrast or sedation need 12 hours notice because of preparation and slot blocking.' },
      { q: 'How quickly can I get an appointment?', a: 'Most pathology slots are available within 90 minutes. Imaging typically has same-day or next-morning availability, with urgent slots reserved for clinician referrals.' },
      { q: 'Do I need a doctor\'s prescription?', a: 'Most lab tests and routine scans do not require one. Contrast studies, sedation, PET-CT and interventional procedures do require a referral for safety.' },
      { q: 'Can I book for a family member?', a: 'Yes. Add them as a family profile during booking or from your dashboard. Reports are shared only with profiles you control, and you can revoke access at any time.' },
    ],
  },
  {
    category: 'Home Collection',
    items: [
      { q: 'Which tests are available at home?', a: 'All pathology tests, ECG, Holter, home sleep studies, portable X-ray in selected cities, and echocardiography in 14 cities. MRI, CT, PET and endoscopic procedures require a centre visit.' },
      { q: 'Is home collection really free?', a: 'Home collection is free on orders above ₹499 and always free for KOYO Gold members. Below ₹499, a ₹99 logistics fee applies, shown before you confirm.' },
      { q: 'How is the sample transported?', a: 'Samples travel in a temperature-controlled, barcoded transport box and reach the NABL lab within 90 minutes. Cold-chain tests such as cortisol and ACTH use ice packs with a logger.' },
      { q: 'What if I miss my collection window?', a: 'Call the care desk. We will rebook the next available slot at no charge, usually within 2 hours. Repeated no-shows may incur a ₹149 visit fee.' },
    ],
  },
  {
    category: 'Reports & Results',
    items: [
      { q: 'When will my report be ready?', a: 'Pathology reports in 12 hours (most in 6), ultrasound in 2 hours, CT in 4 hours, MRI in 8 hours, and PET-CT within 24 hours. The exact estimate is shown on every test page and in your booking.' },
      { q: 'How do I access my reports?', a: 'Reports appear in your KOYO dashboard and are sent by email and WhatsApp. You can download a PDF, share a time-limited link with a doctor, or request a printed copy at any centre.' },
      { q: 'Can someone else collect my report?', a: 'Reports are private by default. You can grant time-limited access to a family member or doctor from the dashboard, and revoke it whenever you want.' },
      { q: 'What if a result looks wrong?', a: 'Contact the care desk within 7 days. We arrange a free recheck on the retained sample where possible, and a pathologist review. If the error is ours, the test is refunded in full.' },
    ],
  },
  {
    category: 'Payments, Insurance & Membership',
    items: [
      { q: 'What payment methods do you accept?', a: 'UPI, credit and debit cards, net banking, and pay-at-centre. Home collection can be paid after the sample is drawn. Corporate employees can bill through their employer where enabled.' },
      { q: 'Do you accept insurance?', a: 'We work with 22 insurers and TPAs for diagnostic claims. Our insurance desk prepares pre-authorisation paperwork and coordinates directly with the TPA. Reimbursement is also supported with GST invoices.' },
      { q: 'What does KOYO Gold include?', a: 'Gold costs ₹1,499 per year and includes 15% off all tests, free home collection, priority reporting, two free doctor teleconsults, and a 5% wallet credit on every order.' },
      { q: 'Can I use multiple offers together?', a: 'One discount offer can be combined with wallet credit and Gold member pricing, but not with another coupon. The best available combination is applied automatically at checkout.' },
    ],
  },
  {
    category: 'Quality & Safety',
    items: [
      { q: 'Are your labs accredited?', a: 'Every partner lab holds NABL accreditation, and imaging centres hold NABH or NABL imaging accreditation. We audit each centre twice a year and publish adverse-event rates internally.' },
      { q: 'How do you ensure scan safety?', a: 'Contrast studies require a recent creatinine check, pregnancy screening and allergy history. Every scanner is calibrated quarterly, and dose is recorded per study. A radiologist is available on call at all times.' },
      { q: 'Who reads my scan?', a: 'A consultant radiologist reads every study. Neuro, oncology and complex abdominal studies are double-read. You can request a second opinion from a KOYO specialist at no extra cost within 30 days.' },
      { q: 'How do you protect my data?', a: 'Reports are encrypted at rest and in transit, access is role-based, and every view is logged. We never sell data, and employer dashboards are aggregated with a minimum cohort of 10 employees.' },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);

export const careers: {
  id: string; title: string; department: string; location: string; type: string;
  experience: string; salary: string; posted: string; description: string; skills: string[];
}[] = [
  { id: 'j1', title: 'Senior Radiologist (Neuro)', department: 'Clinical', location: 'Noida / Delhi NCR', type: 'Full-time', experience: '8+ years', salary: '₹45–65 LPA', posted: '2026-10-22', description: 'Lead neuroimaging reporting across 12 partner centres, mentor registrars, and own our double-read quality protocol.', skills: ['MD Radiodiagnosis', 'Neuro MRI', 'FRCR preferred'] },
  { id: 'j2', title: 'Clinical Operations Manager', department: 'Operations', location: 'Bengaluru', type: 'Full-time', experience: '5–8 years', salary: '₹18–26 LPA', posted: '2026-10-18', description: 'Own the 90-minute home collection promise across 4 cities, manage 60+ phlebotomists, and drive first-attempt success above 97%.', skills: ['Healthcare ops', 'Lean Six Sigma', 'Team leadership'] },
  { id: 'j3', title: 'Product Designer — Patient Experience', department: 'Product', location: 'Remote (India)', type: 'Full-time', experience: '4+ years', salary: '₹22–34 LPA', posted: '2026-10-14', description: 'Design the booking and report experience for 200,000 monthly patients. You will own research, flows and the design system with engineering.', skills: ['Figma', 'Design systems', 'User research'] },
  { id: 'j4', title: 'Staff Frontend Engineer', department: 'Engineering', location: 'Remote (India)', type: 'Full-time', experience: '7+ years', salary: '₹38–55 LPA', posted: '2026-10-09', description: 'Own the Next.js platform, performance budgets and accessibility. You will work closely with design on motion and interaction quality.', skills: ['React', 'Next.js', 'TypeScript', 'Core Web Vitals'] },
  { id: 'j5', title: 'Laboratory Quality Lead', department: 'Clinical', location: 'Mumbai', type: 'Full-time', experience: '6+ years', salary: '₹16–24 LPA', posted: '2026-10-02', description: 'Run internal and external quality assurance across 40 NABL labs, investigate deviations, and prepare for accreditation audits.', skills: ['NABL audits', 'EQAS', 'Haematology'] },
  { id: 'j6', title: 'Corporate Partnerships Manager', department: 'Sales', location: 'Gurugram', type: 'Full-time', experience: '4–7 years', salary: '₹18–28 LPA + variable', posted: '2026-09-27', description: 'Build wellness programmes with 200–5,000 employee companies. You will own the full cycle from pitch to annual renewal.', skills: ['B2B sales', 'HR tech', 'Consultative selling'] },
  { id: 'j7', title: 'Phlebotomist — Home Collection', department: 'Operations', location: 'Delhi NCR', type: 'Full-time', experience: '1+ year', salary: '₹3.6–5.2 LPA', posted: '2026-09-21', description: 'Collect samples at patients\' homes with a 90-minute window and a 97% first-attempt success target. Training and certification provided.', skills: ['Phlebotomy certification', 'Patient empathy', 'Two-wheeler'] },
  { id: 'j8', title: 'Data Analyst — Clinical Outcomes', department: 'Analytics', location: 'Bengaluru', type: 'Full-time', experience: '3+ years', salary: '₹14–22 LPA', posted: '2026-09-15', description: 'Build the outcome dashboards that tell us whether follow-up actually happens. SQL, dbt and a strong sense of clinical context.', skills: ['SQL', 'Python', 'dbt', 'Healthcare data'] },
  { id: 'j9', title: 'Insurance & TPA Specialist', department: 'Revenue Cycle', location: 'Noida', type: 'Full-time', experience: '3+ years', salary: '₹8–13 LPA', posted: '2026-09-08', description: 'Manage pre-authorisation and claims across 22 insurers, reduce denial rates, and build the playbook for new payer partnerships.', skills: ['TPA workflows', 'ICD-10', 'Negotiation'] },
  { id: 'j10', title: 'Content Strategist — Health', department: 'Marketing', location: 'Remote (India)', type: 'Contract', experience: '3+ years', salary: '₹10–16 LPA', posted: '2026-08-30', description: 'Turn clinical evidence into clear, medically reviewed content. You will work with our CMO and a panel of specialists on every piece.', skills: ['Health writing', 'SEO', 'Medical review'] },
  { id: 'j11', title: 'Customer Care Lead', department: 'Support', location: 'Hyderabad', type: 'Full-time', experience: '5+ years', salary: '₹12–18 LPA', posted: '2026-08-24', description: 'Lead a 45-person care team handling 6,000 conversations a day across WhatsApp, phone and chat, with a CSAT target above 92%.', skills: ['Contact centre ops', 'CRM', 'Coaching'] },
  { id: 'j12', title: 'Biomedical Engineer', department: 'Operations', location: 'Chennai', type: 'Full-time', experience: '3+ years', salary: '₹9–14 LPA', posted: '2026-08-16', description: 'Maintain CT, MRI and ultrasound equipment across partner centres, manage calibration schedules, and reduce unplanned downtime below 2%.', skills: ['Imaging equipment', 'Calibration', 'Preventive maintenance'] },
];

export const corporateClients = [
  'Meridian Technologies', 'Northwind Financial', 'Aster Pharmaceuticals', 'Bluepeak Logistics',
  'Vantage Consulting', 'Orchid Manufacturing', 'Sunrise Retail Group', 'Cobalt Energy',
  'Kestrel Airlines', 'Halcyon Media', 'Ironwood Realty', 'Lumen Insurance',
];

export const corporatePlans = [
  {
    name: 'Essential Workforce',
    price: '₹1,199',
    unit: 'per employee / year',
    tagline: 'For teams of 50–500.',
    features: ['Annual health check for every employee', 'On-site camp in 3 cities', 'Aggregate health dashboard', 'Email support within 24 hours'],
    highlight: false,
  },
  {
    name: 'Advanced Workforce',
    price: '₹2,499',
    unit: 'per employee / year',
    tagline: 'For teams of 200–2,000.',
    features: ['Everything in Essential', 'Home collection for all employees', 'Dependent cover at 40% off', 'Quarterly wellness campaigns', 'Dedicated account manager'],
    highlight: true,
  },
  {
    name: 'Executive Health',
    price: '₹5,999',
    unit: 'per leader / year',
    tagline: 'For leadership teams.',
    features: ['Premium 360 panel with imaging', 'Concierge scheduling', 'Annual physician consultation', 'Travel health support', 'Family add-on available'],
    highlight: false,
  },
  {
    name: 'Enterprise Custom',
    price: 'Custom',
    unit: 'multi-site programmes',
    tagline: 'For 2,000+ employees.',
    features: ['Multi-city camp orchestration', 'Custom panel design', 'On-site clinic integration', 'API + HRMS integration', 'Quarterly clinical governance review'],
    highlight: false,
  },
];

export const corporateCaseStudies = [
  {
    client: 'Meridian Technologies',
    sector: 'IT Services · 4,200 employees',
    headline: 'Participation rose from 31% to 87% in one cycle',
    body: 'Meridian had run health camps for six years with falling attendance. We moved testing to paid work hours, added home collection for remote staff, and separated individual results from HR entirely. Follow-up within 30 days rose to 74% for abnormal findings.',
    metrics: [
      { label: 'Participation', value: '87%' },
      { label: 'Abnormal findings followed up', value: '74%' },
      { label: 'Employee satisfaction', value: '4.8/5' },
    ],
  },
  {
    client: 'Aster Pharmaceuticals',
    sector: 'Pharma · 1,850 employees',
    headline: '14 undiagnosed diabetics found in the first 60 days',
    body: 'Aster wanted a preventive programme for a largely desk-based workforce. Baseline HbA1c screening flagged 14 previously undiagnosed diabetics and 212 employees with pre-diabetes. All 14 entered treatment; 61% of the pre-diabetic cohort reduced HbA1c at six months.',
    metrics: [
      { label: 'New diabetes diagnoses', value: '14' },
      { label: 'Pre-diabetes identified', value: '212' },
      { label: 'HbA1c improvement at 6 months', value: '61%' },
    ],
  },
  {
    client: 'Bluepeak Logistics',
    sector: 'Logistics · 6,700 employees',
    headline: 'A 22% drop in musculoskeletal sick days',
    body: 'Bluepeak\'s warehouse workforce had high rates of back pain and hypertension. We combined annual screening with physiotherapy-led ergonomic training and on-site blood pressure checks every quarter. Musculoskeletal sick days fell 22% year on year.',
    metrics: [
      { label: 'Sick days reduced', value: '22%' },
      { label: 'Hypertension controlled', value: '68%' },
      { label: 'Sites covered', value: '11' },
    ],
  },
];

export const milestones = [
  { year: '2019', title: 'Founded in Noida', body: 'Started with three partner labs and a promise: reports in 12 hours, or the test is free.' },
  { year: '2020', title: 'Home collection launches', body: 'Built our own cold-chain logistics during the pandemic, delivering 40,000 home visits in year one.' },
  { year: '2021', title: 'Imaging network', body: 'Partnered with NABH-accredited imaging centres across 9 cities, adding CT, MRI and ultrasound.' },
  { year: '2022', title: 'KOYO Gold membership', body: 'Launched the membership programme; 10,000 members joined in the first eight months.' },
  { year: '2023', title: 'Corporate wellness', body: 'Onboarded our first 100 corporate clients, covering 180,000 employees.' },
  { year: '2024', title: '48 cities', body: 'Expanded to 48 cities and 268 partner labs with a unified quality audit programme.' },
  { year: '2025', title: 'AI-assisted reporting', body: 'Deployed structured reporting and abnormality flagging across pathology and radiology.' },
  { year: '2026', title: '1 million patients', body: 'Crossed one million patients served, with a 4.8 average rating across 38,000 reviews.' },
];

export const values = [
  { title: 'Evidence over marketing', body: 'Every panel is reviewed by our clinical council. We remove tests that do not change management, even when they sell well.', icon: 'ShieldCheck' },
  { title: 'The report is the product', body: 'A number without context is noise. Every abnormal value carries a plain-language explanation and a recommended next step.', icon: 'FileText' },
  { title: 'Access without compromise', body: 'Home collection in 48 cities, reports in 12 hours, and the same quality audit whether you are in Noida or Nashik.', icon: 'MapPin' },
  { title: 'Privacy is non-negotiable', body: 'Employers never see individual results. Your data is encrypted, access-logged and never sold.', icon: 'Lock' },
];

export const accreditations = [
  { label: 'NABL Accredited', detail: 'All partner laboratories' },
  { label: 'NABH Certified', detail: 'Imaging & hospital partners' },
  { label: 'ISO 9001:2015', detail: 'Quality management' },
  { label: 'CAP Participant', detail: 'External quality assurance' },
  { label: 'ISO 27001', detail: 'Information security' },
  { label: 'AERB Licensed', detail: 'Radiation safety' },
];

export const insurancePartners = [
  'Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Niva Bupa', 'Aditya Birla Health',
  'Tata AIG', 'Bajaj Allianz', 'Care Health', 'New India Assurance', 'Oriental Insurance',
  'MediAssist', 'Paramount TPA',
];

export const companyStats = {
  patients: 1_000_000,
  centers: 268,
  cities: 48,
  tests: 1712,
  rating: 4.8,
  reviews: 38000,
  reportsOnTime: 98.4,
  homeCollection: 92,
};
