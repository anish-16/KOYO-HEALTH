import type { Booking, FamilyMember, Notification, Report, Transaction } from './types';

export const demoUser = {
  id: 'usr_koyo_8841',
  name: 'Aarav Mehta',
  firstName: 'Aarav',
  phone: '9810124477',
  email: 'aarav.mehta@example.com',
  dob: '1987-03-14',
  age: 39,
  gender: 'Male',
  bloodGroup: 'B+',
  address: 'A-704, Ivory Towers, Sector 50, Noida, Uttar Pradesh 201301',
  memberTier: 'Gold',
  memberSince: '2023-04-18',
  memberRenewal: '2027-04-18',
  walletBalance: 1840,
  healthScore: 82,
  healthScoreDelta: 4,
  lastCheckup: '2026-09-12',
  nextAppointment: '2026-11-14',
  careManager: 'Ritika Sharma',
  careManagerPhone: '8800580075',
  emergencyContact: 'Ishita Mehta · 9810199821',
  loyaltyPoints: 2480,
  streakMonths: 14,
};

export const healthMetrics = [
  { id: 'bp', label: 'Blood pressure', value: '118/76', unit: 'mmHg', status: 'Normal', tone: 'good', detail: 'Down from 124/82 six months ago', trend: [128, 126, 124, 121, 120, 118] },
  { id: 'hba1c', label: 'HbA1c', value: '5.4', unit: '%', status: 'Normal', tone: 'good', detail: 'Pre-diabetes range ends at 5.7%', trend: [5.9, 5.8, 5.7, 5.6, 5.5, 5.4] },
  { id: 'ldl', label: 'LDL cholesterol', value: '112', unit: 'mg/dL', status: 'Borderline', tone: 'warn', detail: 'Target under 100 mg/dL', trend: [136, 132, 128, 122, 118, 112] },
  { id: 'vitd', label: 'Vitamin D', value: '34', unit: 'ng/mL', status: 'Sufficient', tone: 'good', detail: 'Up from 18 ng/mL after 12 weeks', trend: [18, 21, 24, 28, 31, 34] },
  { id: 'ferritin', label: 'Ferritin', value: '58', unit: 'ng/mL', status: 'Normal', tone: 'good', detail: 'Within 30–300 ng/mL', trend: [34, 38, 42, 49, 54, 58] },
  { id: 'egfr', label: 'eGFR', value: '96', unit: 'mL/min', status: 'Normal', tone: 'good', detail: 'Stable over 3 years', trend: [99, 98, 98, 97, 96, 96] },
];

export const bookings: Booking[] = [
  { id: 'KB-2611-4471', patient: 'Aarav Mehta', tests: ['MRI Brain (Plain)', 'Vitamin D (25-OH)'], center: 'KOYO Imaging — Sector 62', city: 'Noida', date: '2026-11-14', slot: '08:30 AM', status: 'Upcoming', mode: 'Center Visit', amount: 3898, payment: 'Paid' },
  { id: 'KB-2611-4392', patient: 'Ishita Mehta', tests: ['Thyroid Profile (T3, T4, TSH)', 'Complete Blood Count (CBC)'], center: 'Home Collection', city: 'Noida', date: '2026-11-09', slot: '07:15 AM', status: 'Upcoming', mode: 'Home Collection', amount: 898, payment: 'Paid' },
  { id: 'KB-2610-4108', patient: 'Aarav Mehta', tests: ['Full Body Checkup — Advanced'], center: 'KOYO Diagnostics — Sector 62', city: 'Noida', date: '2026-10-26', slot: '07:00 AM', status: 'Report Ready', mode: 'Center Visit', amount: 2999, payment: 'Paid', technician: 'Rakesh Kumar' },
  { id: 'KB-2610-3874', patient: 'Kabir Mehta', tests: ['Child Wellness Panel'], center: 'Home Collection', city: 'Noida', date: '2026-10-18', slot: '09:00 AM', status: 'Completed', mode: 'Home Collection', amount: 2499, payment: 'Paid', technician: 'Anita Yadav' },
  { id: 'KB-2609-3562', patient: 'Aarav Mehta', tests: ['DEXA Hip & Spine', 'FibroScan (Liver Elastography)'], center: 'KOYO Diagnostics — Saket', city: 'Delhi', date: '2026-09-12', slot: '10:30 AM', status: 'Completed', mode: 'Center Visit', amount: 3998, payment: 'Paid' },
  { id: 'KB-2609-3121', patient: 'Sunita Mehta', tests: ['Senior Citizen Comprehensive'], center: 'Home Collection', city: 'Noida', date: '2026-09-02', slot: '06:45 AM', status: 'Completed', mode: 'Home Collection', amount: 4999, payment: 'Paid', technician: 'Rakesh Kumar' },
  { id: 'KB-2608-2987', patient: 'Aarav Mehta', tests: ['2D Echocardiography'], center: 'KOYO Diagnostics — DLF Phase 3', city: 'Gurugram', date: '2026-08-22', slot: '11:00 AM', status: 'Completed', mode: 'Center Visit', amount: 1499, payment: 'Paid' },
  { id: 'KB-2608-2714', patient: 'Ishita Mehta', tests: ["Women's Health — Essential"], center: 'Home Collection', city: 'Noida', date: '2026-08-11', slot: '07:30 AM', status: 'Completed', mode: 'Home Collection', amount: 1899, payment: 'Paid', technician: 'Meena Rawat' },
  { id: 'KB-2607-2501', patient: 'Aarav Mehta', tests: ['X-Ray Chest (PA)'], center: 'KOYO Diagnostics — Sector 62', city: 'Noida', date: '2026-07-19', slot: '05:00 PM', status: 'Completed', mode: 'Center Visit', amount: 249, payment: 'Pay at Center' },
  { id: 'KB-2607-2288', patient: 'Kabir Mehta', tests: ['Vitamin D & B12 Check'], center: 'Home Collection', city: 'Noida', date: '2026-07-04', slot: '08:00 AM', status: 'Completed', mode: 'Home Collection', amount: 1499, payment: 'Paid', technician: 'Anita Yadav' },
  { id: 'KB-2606-2044', patient: 'Aarav Mehta', tests: ['Treadmill Test (TMT)'], center: 'KOYO Diagnostics — DLF Phase 3', city: 'Gurugram', date: '2026-06-15', slot: '09:30 AM', status: 'Cancelled', mode: 'Center Visit', amount: 1499, payment: 'Refunded' },
  { id: 'KB-2606-1988', patient: 'Sunita Mehta', tests: ['Thyroid Profile (T3, T4, TSH)', 'HbA1c (Glycated Haemoglobin)'], center: 'Home Collection', city: 'Noida', date: '2026-06-08', slot: '07:00 AM', status: 'Completed', mode: 'Home Collection', amount: 1048, payment: 'Paid', technician: 'Rakesh Kumar' },
  { id: 'KB-2605-1762', patient: 'Aarav Mehta', tests: ['Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'], center: 'Home Collection', city: 'Noida', date: '2026-05-27', slot: '06:30 AM', status: 'Completed', mode: 'Home Collection', amount: 1597, payment: 'Paid', technician: 'Meena Rawat' },
  { id: 'KB-2605-1541', patient: 'Ishita Mehta', tests: ['Pap + HPV DNA Co-test'], center: 'KOYO Diagnostics — Saket', city: 'Delhi', date: '2026-05-16', slot: '12:00 PM', status: 'Completed', mode: 'Center Visit', amount: 1899, payment: 'Paid' },
];

export const reports: Report[] = [
  {
    id: 'RPT-4471', bookingId: 'KB-2610-4108', title: 'Full Body Checkup — Advanced', patient: 'Aarav Mehta',
    date: '2026-10-27', status: 'Ready', doctor: 'Dr. Farah Qureshi', pages: 14,
    summary: 'Most parameters within range. LDL cholesterol mildly elevated at 112 mg/dL. Vitamin D improved to 34 ng/mL. Liver and kidney function normal. No action needed beyond dietary review.',
    biomarkers: [
      { name: 'Haemoglobin', value: '15.2', unit: 'g/dL', range: '13.0–17.0', flag: 'normal' },
      { name: 'Fasting glucose', value: '92', unit: 'mg/dL', range: '70–99', flag: 'normal' },
      { name: 'HbA1c', value: '5.4', unit: '%', range: '< 5.7', flag: 'normal' },
      { name: 'LDL cholesterol', value: '112', unit: 'mg/dL', range: '< 100', flag: 'high' },
      { name: 'HDL cholesterol', value: '48', unit: 'mg/dL', range: '> 40', flag: 'normal' },
      { name: 'Triglycerides', value: '128', unit: 'mg/dL', range: '< 150', flag: 'normal' },
      { name: 'ALT (SGPT)', value: '28', unit: 'U/L', range: '7–45', flag: 'normal' },
      { name: 'Creatinine', value: '0.92', unit: 'mg/dL', range: '0.7–1.3', flag: 'normal' },
      { name: 'eGFR', value: '96', unit: 'mL/min', range: '> 90', flag: 'normal' },
      { name: 'Vitamin D (25-OH)', value: '34', unit: 'ng/mL', range: '30–100', flag: 'normal' },
      { name: 'Vitamin B12', value: '412', unit: 'pg/mL', range: '200–900', flag: 'normal' },
      { name: 'TSH', value: '2.1', unit: 'mIU/L', range: '0.4–4.0', flag: 'normal' },
    ],
  },
  {
    id: 'RPT-4392', bookingId: 'KB-2611-4392', title: 'Thyroid Profile & CBC', patient: 'Ishita Mehta',
    date: '2026-11-09', status: 'Processing', doctor: 'Dr. Farah Qureshi', pages: 4,
    summary: 'Sample received at the Noida lab. Results are expected by 6:00 pm today.',
    biomarkers: [],
  },
  {
    id: 'RPT-3874', bookingId: 'KB-2610-3874', title: 'Child Wellness Panel', patient: 'Kabir Mehta',
    date: '2026-10-19', status: 'Ready', doctor: 'Dr. Ananya Rao', pages: 7,
    summary: 'Healthy growth parameters for age. Mild iron deficiency (ferritin 22 ng/mL) — dietary advice and a repeat test in three months recommended.',
    biomarkers: [
      { name: 'Haemoglobin', value: '12.4', unit: 'g/dL', range: '11.5–15.5', flag: 'normal' },
      { name: 'Ferritin', value: '22', unit: 'ng/mL', range: '30–150', flag: 'low' },
      { name: 'Vitamin D', value: '28', unit: 'ng/mL', range: '30–100', flag: 'low' },
      { name: 'TSH', value: '2.8', unit: 'mIU/L', range: '0.6–5.0', flag: 'normal' },
    ],
  },
  {
    id: 'RPT-3562', bookingId: 'KB-2609-3562', title: 'DEXA & FibroScan Report', patient: 'Aarav Mehta',
    date: '2026-09-13', status: 'Ready', doctor: 'Dr. Meera Krishnan', pages: 9,
    summary: 'Bone density normal (T-score −0.4). Liver stiffness 6.1 kPa suggests early fibrosis (F1); CAP 248 dB/m indicates moderate steatosis. Lifestyle programme recommended.',
    biomarkers: [
      { name: 'Lumbar spine T-score', value: '−0.4', unit: 'SD', range: '> −1.0', flag: 'normal' },
      { name: 'Femoral neck T-score', value: '−0.6', unit: 'SD', range: '> −1.0', flag: 'normal' },
      { name: 'Liver stiffness', value: '6.1', unit: 'kPa', range: '< 6.0', flag: 'high' },
      { name: 'CAP score', value: '248', unit: 'dB/m', range: '< 238', flag: 'high' },
    ],
  },
  {
    id: 'RPT-3121', bookingId: 'KB-2609-3121', title: 'Senior Citizen Comprehensive', patient: 'Sunita Mehta',
    date: '2026-09-03', status: 'Ready', doctor: 'Dr. Ananya Rao', pages: 18,
    summary: 'HbA1c 6.2% (pre-diabetes). Blood pressure well controlled on current medication. Mild Vitamin B12 deficiency — supplementation advised. Kidney function stable.',
    biomarkers: [
      { name: 'HbA1c', value: '6.2', unit: '%', range: '< 5.7', flag: 'high' },
      { name: 'Vitamin B12', value: '168', unit: 'pg/mL', range: '200–900', flag: 'low' },
      { name: 'Creatinine', value: '1.04', unit: 'mg/dL', range: '0.6–1.1', flag: 'normal' },
      { name: 'TSH', value: '3.6', unit: 'mIU/L', range: '0.4–4.0', flag: 'normal' },
      { name: 'LDL cholesterol', value: '96', unit: 'mg/dL', range: '< 100', flag: 'normal' },
    ],
  },
  {
    id: 'RPT-2987', bookingId: 'KB-2608-2987', title: '2D Echocardiography Report', patient: 'Aarav Mehta',
    date: '2026-08-22', status: 'Ready', doctor: 'Dr. Arjun Malhotra', pages: 5,
    summary: 'Normal left ventricular size and function. Ejection fraction 62%. No valvular stenosis or regurgitation. No pericardial effusion.',
    biomarkers: [
      { name: 'Ejection fraction', value: '62', unit: '%', range: '55–70', flag: 'normal' },
      { name: 'LV end-diastolic dimension', value: '48', unit: 'mm', range: '42–58', flag: 'normal' },
      { name: 'Aortic valve velocity', value: '1.3', unit: 'm/s', range: '< 2.0', flag: 'normal' },
    ],
  },
  {
    id: 'RPT-2714', bookingId: 'KB-2608-2714', title: "Women's Health — Essential", patient: 'Ishita Mehta',
    date: '2026-08-12', status: 'Ready', doctor: 'Dr. Sneha Kapoor', pages: 8,
    summary: 'Iron deficiency without anaemia (ferritin 18 ng/mL). Thyroid and lipid profile normal. Oral iron with Vitamin C recommended; recheck in 12 weeks.',
    biomarkers: [
      { name: 'Haemoglobin', value: '12.1', unit: 'g/dL', range: '12.0–15.5', flag: 'normal' },
      { name: 'Ferritin', value: '18', unit: 'ng/mL', range: '30–150', flag: 'low' },
      { name: 'TSH', value: '1.9', unit: 'mIU/L', range: '0.4–4.0', flag: 'normal' },
      { name: 'Vitamin D', value: '31', unit: 'ng/mL', range: '30–100', flag: 'normal' },
    ],
  },
  {
    id: 'RPT-1762', bookingId: 'KB-2605-1762', title: 'Lipid, Liver & Kidney Panel', patient: 'Aarav Mehta',
    date: '2026-05-27', status: 'Ready', doctor: 'Dr. Farah Qureshi', pages: 6,
    summary: 'Lipid profile shows borderline LDL. Liver enzymes normal. Kidney function normal with eGFR 97. Repeat lipids after 12 weeks of dietary change.',
    biomarkers: [
      { name: 'LDL cholesterol', value: '124', unit: 'mg/dL', range: '< 100', flag: 'high' },
      { name: 'ALT (SGPT)', value: '31', unit: 'U/L', range: '7–45', flag: 'normal' },
      { name: 'Creatinine', value: '0.89', unit: 'mg/dL', range: '0.7–1.3', flag: 'normal' },
    ],
  },
];

export const familyMembers: FamilyMember[] = [
  { id: 'fam1', name: 'Ishita Mehta', relation: 'Spouse', age: 37, gender: 'Female', bloodGroup: 'O+', phone: '9810199821', lastTest: '2026-11-09', reports: 12 },
  { id: 'fam2', name: 'Kabir Mehta', relation: 'Son', age: 9, gender: 'Male', bloodGroup: 'B+', phone: '—', lastTest: '2026-10-18', reports: 6 },
  { id: 'fam3', name: 'Sunita Mehta', relation: 'Mother', age: 68, gender: 'Female', bloodGroup: 'A+', phone: '9810144520', lastTest: '2026-09-02', reports: 23 },
  { id: 'fam4', name: 'Ramesh Mehta', relation: 'Father', age: 71, gender: 'Male', bloodGroup: 'B+', phone: '9810144521', lastTest: '2026-04-11', reports: 19 },
  { id: 'fam5', name: 'Ananya Mehta', relation: 'Daughter', age: 5, gender: 'Female', bloodGroup: 'O+', phone: '—', lastTest: '2026-07-04', reports: 3 },
];

export const transactions: Transaction[] = [
  { id: 'TXN-98221', date: '2026-11-02', description: 'Wallet top-up via UPI', amount: 2000, type: 'Credit', balance: 1840, method: 'UPI · HDFC' },
  { id: 'TXN-98104', date: '2026-10-26', description: 'Full Body Checkup — Advanced', amount: 2999, type: 'Debit', balance: -160, method: 'KOYO Wallet' },
  { id: 'TXN-97990', date: '2026-10-20', description: 'Gold member 5% credit', amount: 150, type: 'Credit', balance: 2839, method: 'Membership benefit' },
  { id: 'TXN-97812', date: '2026-10-18', description: 'Child Wellness Panel', amount: 2499, type: 'Debit', balance: 2689, method: 'Credit card · Visa 4421' },
  { id: 'TXN-97550', date: '2026-09-30', description: 'Referral reward — 3 friends', amount: 750, type: 'Credit', balance: 5188, method: 'Referral programme' },
  { id: 'TXN-97401', date: '2026-09-12', description: 'DEXA & FibroScan', amount: 3998, type: 'Debit', balance: 4438, method: 'KOYO Wallet' },
  { id: 'TXN-97120', date: '2026-09-02', description: 'Senior Citizen Comprehensive', amount: 4999, type: 'Debit', balance: 8436, method: 'UPI · ICICI' },
  { id: 'TXN-96884', date: '2026-08-22', description: '2D Echocardiography', amount: 1499, type: 'Debit', balance: 13435, method: 'KOYO Wallet' },
  { id: 'TXN-96540', date: '2026-08-05', description: 'Gold membership renewal', amount: 1499, type: 'Debit', balance: 14934, method: 'Credit card · Visa 4421' },
  { id: 'TXN-96211', date: '2026-07-19', description: 'X-Ray Chest (PA)', amount: 249, type: 'Debit', balance: 16433, method: 'Pay at centre' },
  { id: 'TXN-96002', date: '2026-07-01', description: 'Refund — cancelled TMT', amount: 1499, type: 'Refund', balance: 16682, method: 'Original payment method' },
  { id: 'TXN-95730', date: '2026-06-15', description: 'Treadmill Test (TMT) — cancelled', amount: 1499, type: 'Debit', balance: 15183, method: 'UPI · HDFC' },
  { id: 'TXN-95404', date: '2026-05-27', description: 'Lipid, LFT & KFT panel', amount: 1597, type: 'Debit', balance: 16682, method: 'KOYO Wallet' },
  { id: 'TXN-95118', date: '2026-05-02', description: 'Corporate wellness credit', amount: 3000, type: 'Credit', balance: 18279, method: 'Employer benefit' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'MRI appointment confirmed', body: 'Your MRI Brain is scheduled for 14 Nov at 8:30 am at KOYO Imaging, Sector 62. Arrive 20 minutes early.', time: '2026-11-03T09:12:00', read: false, kind: 'booking' },
  { id: 'n2', title: 'Full body report is ready', body: 'Your 84-parameter report is available. LDL is mildly elevated — a physician summary is included.', time: '2026-10-27T16:40:00', read: false, kind: 'report' },
  { id: 'n3', title: 'Ishita\'s sample collected', body: 'Sample collected at 7:15 am by Rakesh Kumar. Report expected by 6:00 pm today.', time: '2026-11-09T07:22:00', read: true, kind: 'booking' },
  { id: 'n4', title: 'Free Vitamin D test unlocked', body: 'You have completed 3 referrals. Claim your free Vitamin D test before 30 November.', time: '2026-11-01T11:00:00', read: false, kind: 'offer' },
  { id: 'n5', title: 'Repeat lipid profile due', body: 'It has been 6 months since your last lipid test. Book a follow-up to track your progress.', time: '2026-10-30T08:00:00', read: true, kind: 'reminder' },
  { id: 'n6', title: 'Kabir\'s report needs attention', body: 'Ferritin is low at 22 ng/mL. Dr. Ananya Rao has added dietary guidance to the report.', time: '2026-10-19T10:15:00', read: true, kind: 'report' },
  { id: 'n7', title: 'Gold membership active', body: 'Your Gold benefits renewed until April 2027: 15% off, free home collection and priority reporting.', time: '2026-04-18T09:00:00', read: true, kind: 'offer' },
  { id: 'n8', title: 'Care manager assigned', body: 'Ritika Sharma is your care manager. Call 88005 80075 between 8 am and 8 pm for any help.', time: '2026-04-18T09:05:00', read: true, kind: 'reminder' },
];

export const prescriptions = [
  { id: 'RX-8841', name: 'Dr. Meera Krishnan', speciality: 'Endocrinology', date: '2026-09-13', tests: ['FibroScan (repeat)', 'LFT', 'HbA1c'], notes: 'Repeat elastography after 6 months of lifestyle intervention. Continue Vitamin D 60,000 IU weekly for 8 weeks.' },
  { id: 'RX-8790', name: 'Dr. Arjun Malhotra', speciality: 'Cardiology', date: '2026-08-22', tests: ['Lipid Profile', 'ApoB', 'TMT'], notes: 'Borderline LDL with family history. Dietary trial for 12 weeks before considering statin. Repeat lipids in November.' },
  { id: 'RX-8612', name: 'Dr. Sneha Kapoor', speciality: 'Women\'s Health', date: '2026-08-12', tests: ['Ferritin', 'CBC'], notes: 'Ishita: oral iron alternate day with Vitamin C. Recheck ferritin after 12 weeks. Avoid tea with iron dose.' },
  { id: 'RX-8420', name: 'Dr. Ananya Rao', speciality: 'Internal Medicine', date: '2026-05-27', tests: ['Vitamin D', 'Lipid Profile'], notes: 'Annual review. Maintain current activity. Repeat full panel in 12 months.' },
];

export const documents = [
  { id: 'DOC-1', name: 'Full Body Report — Oct 2026', type: 'PDF', size: '2.4 MB', date: '2026-10-27' },
  { id: 'DOC-2', name: 'MRI Brain — Nov 2026 (pending)', type: 'DICOM', size: '—', date: '2026-11-14' },
  { id: 'DOC-3', name: 'DEXA & FibroScan — Sep 2026', type: 'PDF', size: '1.8 MB', date: '2026-09-13' },
  { id: 'DOC-4', name: 'Echo Report — Aug 2026', type: 'PDF', size: '940 KB', date: '2026-08-22' },
  { id: 'DOC-5', name: 'Insurance pre-authorisation', type: 'PDF', size: '310 KB', date: '2026-08-20' },
];

export const healthTimeline = [
  { date: '2026-11-14', title: 'MRI Brain', detail: 'KOYO Imaging, Sector 62 · 8:30 am', kind: 'upcoming' },
  { date: '2026-10-26', title: 'Full body checkup', detail: '84 parameters · LDL borderline', kind: 'report' },
  { date: '2026-09-12', title: 'DEXA & FibroScan', detail: 'Early fibrosis F1 · lifestyle programme', kind: 'report' },
  { date: '2026-08-22', title: 'Echocardiography', detail: 'EF 62% · normal study', kind: 'report' },
  { date: '2026-05-27', title: 'Lipid, LFT & KFT', detail: 'LDL 124 mg/dL · dietary trial started', kind: 'report' },
  { date: '2026-04-18', title: 'Gold membership', detail: 'Renewed until April 2027', kind: 'milestone' },
];

export const dashboardStats = {
  totalBookings: bookings.length,
  reportsReady: reports.filter((r) => r.status === 'Ready').length,
  familyProfiles: familyMembers.length,
  savedThisYear: 12480,
  walletBalance: demoUser.walletBalance,
};
