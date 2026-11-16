import { randomBytes } from 'node:crypto';
import { allTests } from '@/data/services';
import { getPackage } from '@/data/packages';
import type {
  BookingHistoryEntry,
  BookingStatus,
  CatalogueItem,
  CatalogueKind,
  CollectionMode,
  Employee,
  PartnerBooking,
  PortalActivity,
  PortalData,
  StoredPartner,
} from './portal';
import { STATUS_FLOW } from './portal';

/**
 * Demo workspace content for the B2B portal, written on first read when no
 * `.data/portal.json` exists. It is intentionally shaped like a live book:
 * three partners at different stages, negotiated rates, a partial roster,
 * bookings in every status and two reports already released.
 */

const ALL_MODES: CollectionMode[] = ['Home Collection', 'On-site', 'Centre Visit'];

function randomId(prefix: string) {
  return `${prefix}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

function isoDay(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function isoAt(dateIso: string, hour: number, extraDays = 0) {
  const date = new Date(`${dateIso}T${String(hour).padStart(2, '0')}:00:00`);
  date.setDate(date.getDate() + extraDays);
  return date.toISOString();
}

function stamp(offsetDays = 0) {
  return isoAt(isoDay(offsetDays), 10);
}

function testItem(
  partnerId: string,
  serviceSlug: string,
  testName: string,
  factor: number,
  modes: CollectionMode[] = ALL_MODES,
): CatalogueItem | null {
  const test = allTests.find((entry) => entry.serviceSlug === serviceSlug && entry.name === testName);
  if (!test) return null;
  const kind: CatalogueKind = test.modality === 'Pathology' ? 'Pathology' : 'Radiology & imaging';
  return {
    id: randomId('CAT'),
    partnerId,
    kind,
    name: test.name,
    refId: test.id,
    listPrice: test.price,
    rate: Math.max(50, Math.round((test.price * factor) / 10) * 10),
    modes,
    tatHours: test.reportHours,
    active: true,
    createdAt: stamp(-120),
  };
}

function packageItem(
  partnerId: string,
  slug: string,
  factor: number,
  modes: CollectionMode[] = ALL_MODES,
): CatalogueItem | null {
  const pkg = getPackage(slug);
  if (!pkg) return null;
  return {
    id: randomId('CAT'),
    partnerId,
    kind: 'Health package',
    name: pkg.name,
    refId: `package/${pkg.slug}`,
    listPrice: pkg.price,
    rate: Math.round((pkg.price * factor) / 10) * 10,
    modes,
    tatHours: 24,
    active: true,
    createdAt: stamp(-120),
  };
}

function customItem(
  partnerId: string,
  name: string,
  includes: string[],
  listPrice: number,
  rate: number,
  modes: CollectionMode[] = ALL_MODES,
): CatalogueItem {
  return {
    id: randomId('CAT'),
    partnerId,
    kind: 'Custom package',
    name,
    includes,
    listPrice,
    rate,
    modes,
    tatHours: 24,
    active: true,
    createdAt: stamp(-120),
  };
}

function employee(
  partnerId: string,
  code: string,
  name: string,
  age: number,
  gender: Employee['gender'],
  department: string,
  location: string,
  phone: string,
): Employee {
  return {
    id: randomId('EST'),
    partnerId,
    code,
    name,
    age,
    gender,
    department,
    location,
    phone,
    email: `${name.split(' ')[0].toLowerCase()}.${code.toLowerCase()}@partner.example`,
    addedAt: stamp(-90),
  };
}

function historyFor(
  status: BookingStatus,
  date: string,
  partnerContact: string,
): BookingHistoryEntry[] {
  const flow = STATUS_FLOW;
  if (status === 'Cancelled') {
    return [
      { at: isoAt(date, 9, -4), status: 'Scheduled', actor: 'KOYO Client Services', role: 'KOYO' },
      { at: isoAt(date, 11, -1), status: 'Cancelled', actor: partnerContact, role: 'Partner' },
    ];
  }
  const last = flow.indexOf(status);
  return flow.slice(0, Math.max(0, last) + 1).map((step, index) => ({
    at: isoAt(date, 9 + index * 3, index === 0 ? -4 : -1),
    status: step,
    actor: index === 0 ? 'KOYO Client Services' : index >= 3 ? 'KOYO Labs' : partnerContact,
    role: index === 0 || index >= 3 ? 'KOYO' : 'Partner',
  }));
}

export function buildPortalSeed(): PortalData {
  const partners: StoredPartner[] = [
    {
      id: 'PTR-01',
      name: 'Meridian Tech',
      code: 'MRC-4417',
      city: 'Bengaluru',
      state: 'Karnataka',
      contactName: 'Ananya Rao',
      contactEmail: 'ananya.rao@meridiantech.example',
      contactPhone: '9810124477',
      gstin: '29AABCM1234F1Z5',
      status: 'Active',
      since: '2024-02-19',
      headcount: 412,
      accountManager: 'Ritika Menon',
      modes: ALL_MODES,
      billingCycle: 'Monthly',
      accessKey: 'MERC-2026',
      createdAt: stamp(-400),
    },
    {
      id: 'PTR-02',
      name: 'Northline Motors',
      code: 'NLM-9021',
      city: 'Pune',
      state: 'Maharashtra',
      contactName: 'Ganesh Shinde',
      contactEmail: 'ganesh.shinde@northline.example',
      contactPhone: '9820145520',
      gstin: '27AABCN9876G1Z2',
      status: 'Active',
      since: '2023-08-04',
      headcount: 268,
      accountManager: 'Arjun Patel',
      modes: ['On-site', 'Centre Visit'],
      billingCycle: 'Per batch',
      accessKey: 'NORTH-2026',
      createdAt: stamp(-500),
    },
    {
      id: 'PTR-03',
      name: 'Arcadia Finance Group',
      code: 'ARC-7734',
      city: 'Mumbai',
      state: 'Maharashtra',
      contactName: 'Riya Sethi',
      contactEmail: 'riya.sethi@arcadia.example',
      contactPhone: '9820331144',
      gstin: '27AABCA4567H1Z9',
      status: 'Active',
      since: '2025-01-12',
      headcount: 96,
      accountManager: 'Ritika Menon',
      modes: ['Home Collection', 'Centre Visit'],
      billingCycle: 'Quarterly',
      accessKey: 'ARCA-2026',
      createdAt: stamp(-220),
    },
    {
      id: 'PTR-04',
      name: 'Selene Logistics',
      code: 'SEL-2210',
      city: 'Gurugram',
      state: 'Haryana',
      contactName: 'Vivek Chauhan',
      contactEmail: 'vivek.chauhan@selene.example',
      contactPhone: '9811167744',
      status: 'Onboarding',
      since: isoDay(-12),
      headcount: 540,
      accountManager: 'Arjun Patel',
      modes: ALL_MODES,
      billingCycle: 'Monthly',
      accessKey: 'SELE-2026',
      createdAt: stamp(-12),
    },
  ];

  const meridianId = 'PTR-01';
  const northlineId = 'PTR-02';
  const arcadiaId = 'PTR-03';

  const catalogue: CatalogueItem[] = [
    testItem(meridianId, 'pathology', 'Complete Blood Count (CBC)', 0.8),
    testItem(meridianId, 'pathology', 'Lipid Profile', 0.8),
    testItem(meridianId, 'pathology', 'HbA1c (Glycated Haemoglobin)', 0.8),
    testItem(meridianId, 'pathology', 'Liver Function Test (LFT)', 0.82),
    testItem(meridianId, 'pathology', 'Kidney Function Test (KFT)', 0.82),
    testItem(meridianId, 'pathology', 'Thyroid Profile (T3, T4, TSH)', 0.82),
    testItem(meridianId, 'pathology', 'Vitamin D (25-OH)', 0.85),
    testItem(meridianId, 'pathology', 'Vitamin B12', 0.85),
    testItem(meridianId, 'pathology', 'Urine Routine & Microscopy', 0.8),
    testItem(meridianId, 'ecg', '12-Lead ECG (Resting)', 0.8),
    testItem(meridianId, 'x-ray', 'X-Ray Chest (PA)', 0.82),
    testItem(meridianId, 'ultrasound', 'USG Abdomen & Pelvis', 0.85),
    packageItem(meridianId, 'full-body-checkup', 0.8),
    packageItem(meridianId, 'executive-health-check-male', 0.8),
    packageItem(meridianId, 'womens-wellness-premium', 0.82),
    customItem(
      meridianId,
      'Meridian Pre-employment Panel',
      ['CBC', 'LFT', 'KFT', 'Urine routine', 'Chest X-ray (PA)', 'Vision acuity'],
      1450,
      1090,
      ['Centre Visit', 'On-site'],
    ),
    testItem(northlineId, 'pathology', 'Complete Blood Count (CBC)', 0.72, ['On-site', 'Centre Visit']),
    testItem(northlineId, 'pathology', 'Liver Function Test (LFT)', 0.72, ['On-site', 'Centre Visit']),
    testItem(northlineId, 'pathology', 'Kidney Function Test (KFT)', 0.72, ['On-site', 'Centre Visit']),
    testItem(northlineId, 'pathology', 'Lipid Profile', 0.72, ['On-site', 'Centre Visit']),
    testItem(northlineId, 'pathology', 'Urine Routine & Microscopy', 0.72, ['On-site', 'Centre Visit']),
    testItem(northlineId, 'pathology', 'Blood Group & Rh Typing', 0.75, ['On-site', 'Centre Visit']),
    testItem(northlineId, 'x-ray', 'X-Ray Chest (PA)', 0.75, ['Centre Visit']),
    testItem(northlineId, 'ecg', '12-Lead ECG (Resting)', 0.75, ['Centre Visit']),
    testItem(northlineId, 'echo', 'Transthoracic Echo (2D)', 0.8, ['Centre Visit']),
    customItem(
      northlineId,
      'Factory Fitness Panel (Factories Act)',
      ['CBC', 'LFT', 'KFT', 'Urine routine', 'Chest X-ray (PA)', 'Audiometry', 'Vision acuity'],
      2350,
      1690,
      ['On-site', 'Centre Visit'],
    ),
    testItem(arcadiaId, 'pathology', 'Lipid Profile', 0.78, ['Home Collection', 'Centre Visit']),
    testItem(arcadiaId, 'pathology', 'HbA1c (Glycated Haemoglobin)', 0.78, ['Home Collection', 'Centre Visit']),
    testItem(arcadiaId, 'pathology', 'Thyroid Profile (T3, T4, TSH)', 0.8, ['Home Collection', 'Centre Visit']),
    testItem(arcadiaId, 'pathology', 'Vitamin D (25-OH)', 0.82, ['Home Collection', 'Centre Visit']),
    testItem(arcadiaId, 'ecg', '12-Lead ECG (Resting)', 0.8, ['Centre Visit']),
    testItem(arcadiaId, 'tmt', 'Treadmill Test (Bruce Protocol)', 0.82, ['Centre Visit']),
    testItem(arcadiaId, 'echo', 'Transthoracic Echo (2D)', 0.82, ['Centre Visit']),
    packageItem(arcadiaId, 'executive-health-check-male', 0.78, ['Home Collection', 'Centre Visit']),
    packageItem(arcadiaId, 'executive-health-check-female', 0.78, ['Home Collection', 'Centre Visit']),
  ].filter(Boolean) as CatalogueItem[];

  const employees: Employee[] = [
    employee(meridianId, 'EMP-2041', 'Aarav Sharma', 34, 'Male', 'Engineering', 'Bengaluru — Whitefield', '9810124401'),
    employee(meridianId, 'EMP-2042', 'Diya Nair', 29, 'Female', 'Product', 'Bengaluru — Indiranagar', '9810124402'),
    employee(meridianId, 'EMP-2043', 'Rohan Iyer', 41, 'Male', 'Finance', 'Bengaluru — Koramangala', '9810124403'),
    employee(meridianId, 'EMP-2044', 'Sneha Kulkarni', 26, 'Female', 'Design', 'Bengaluru — HSR Layout', '9810124404'),
    employee(meridianId, 'EMP-2045', 'Vikram Desai', 38, 'Male', 'Engineering', 'Bengaluru — Whitefield', '9810124405'),
    employee(meridianId, 'EMP-2046', 'Meera Krishnan', 45, 'Female', 'People', 'Bengaluru — Jayanagar', '9810124406'),
    employee(meridianId, 'EMP-2047', 'Aditya Bose', 31, 'Male', 'Sales', 'Bengaluru — Indiranagar', '9810124407'),
    employee(meridianId, 'EMP-2048', 'Nisha Verma', 36, 'Female', 'Engineering', 'Bengaluru — Marathahalli', '9810124408'),
    employee(meridianId, 'EMP-2049', 'Karthik Reddy', 52, 'Male', 'Leadership', 'Bengaluru — Koramangala', '9810124409'),
    employee(meridianId, 'EMP-2050', 'Priya Menon', 28, 'Female', 'Marketing', 'Bengaluru — HSR Layout', '9810124410'),
    employee(northlineId, 'NLM-1101', 'Suresh Pawar', 44, 'Male', 'Assembly', 'Pune — Chakan Plant', '9820145501'),
    employee(northlineId, 'NLM-1102', 'Anita Jadhav', 33, 'Female', 'Quality', 'Pune — Chakan Plant', '9820145502'),
    employee(northlineId, 'NLM-1103', 'Ganesh Shinde', 39, 'Male', 'Maintenance', 'Pune — Chakan Plant', '9820145503'),
    employee(northlineId, 'NLM-1104', 'Pooja Deshmukh', 27, 'Female', 'Stores', 'Pune — Ranjangaon', '9820145504'),
    employee(northlineId, 'NLM-1105', 'Rahul Kulkarni', 46, 'Male', 'Logistics', 'Pune — Ranjangaon', '9820145505'),
    employee(northlineId, 'NLM-1106', 'Farhan Shaikh', 31, 'Male', 'Paint shop', 'Pune — Chakan Plant', '9820145506'),
    employee(northlineId, 'NLM-1107', 'Snehal More', 35, 'Female', 'Human Resources', 'Pune — Head office', '9820145507'),
    employee(northlineId, 'NLM-1108', 'Deepak Patil', 50, 'Male', 'Safety', 'Pune — Chakan Plant', '9820145508'),
    employee(arcadiaId, 'ARC-3301', 'Ishaan Kapoor', 42, 'Male', 'Trading', 'Mumbai — BKC', '9820331101'),
    employee(arcadiaId, 'ARC-3302', 'Riya Sethi', 34, 'Female', 'Compliance', 'Mumbai — BKC', '9820331102'),
    employee(arcadiaId, 'ARC-3303', 'Manav Bhatia', 47, 'Male', 'Wealth', 'Mumbai — Lower Parel', '9820331103'),
    employee(arcadiaId, 'ARC-3304', 'Kavya Shetty', 30, 'Female', 'Risk', 'Mumbai — BKC', '9820331104'),
    employee(arcadiaId, 'ARC-3305', 'Arjun Malhotra', 55, 'Male', 'Leadership', 'Mumbai — BKC', '9820331105'),
    employee(arcadiaId, 'ARC-3306', 'Tanvi Joshi', 26, 'Female', 'Operations', 'Mumbai — Lower Parel', '9820331106'),
  ];

  const catalogByName = new Map(catalogue.map((item) => [`${item.partnerId}:${item.name}`, item]));
  const employeeByCode = new Map(employees.map((entry) => [entry.code, entry]));

  type BookingSpec = {
    partnerId: string;
    employeeCode: string;
    items: string[];
    day: number;
    mode: CollectionMode;
    location: string;
    status: BookingStatus;
    note?: string;
    notes?: string;
  };

  const specs: BookingSpec[] = [
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2041',
      items: ['Complete Blood Count (CBC)', 'HbA1c (Glycated Haemoglobin)', 'Lipid Profile'],
      day: -18,
      mode: 'Home Collection',
      location: 'Whitefield, Bengaluru 560066',
      status: 'Completed',
      note: 'All parameters within reference range. HbA1c 5.6% — no action needed. Repeat annual panel in 12 months.',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2042',
      items: ['Full Body Checkup — Flagship'],
      day: -12,
      mode: 'Home Collection',
      location: 'Indiranagar, Bengaluru 560038',
      status: 'Completed',
      note: 'Vitamin D insufficiency (18 ng/mL, reference 30–100). Supplementation advised; retest in 12 weeks. Everything else normal.',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2043',
      items: ['Comprehensive Executive Health Check — Male (30–50)', '12-Lead ECG (Resting)'],
      day: -6,
      mode: 'Centre Visit',
      location: 'KOYO Centre — Koramangala, Bengaluru',
      status: 'Report ready',
      note: 'Borderline LDL (138 mg/dL). ECG normal. Cardiology review recommended if family history is positive.',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2044',
      items: ['Thyroid Profile (T3, T4, TSH)', 'Vitamin D (25-OH)'],
      day: -2,
      mode: 'Home Collection',
      location: 'HSR Layout, Bengaluru 560102',
      status: 'In lab',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2045',
      items: ['Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Urine Routine & Microscopy'],
      day: 0,
      mode: 'On-site',
      location: 'Meridian Tech — Whitefield campus, Bengaluru',
      status: 'Sample collected',
      notes: 'Camp desk 2, ground floor. 24 employees in this batch.',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2046',
      items: ['Meridian Pre-employment Panel'],
      day: 1,
      mode: 'On-site',
      location: 'Meridian Tech — Whitefield campus, Bengaluru',
      status: 'Scheduled',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2047',
      items: ['X-Ray Chest (PA)', '12-Lead ECG (Resting)'],
      day: 2,
      mode: 'Centre Visit',
      location: 'KOYO Centre — Indiranagar, Bengaluru',
      status: 'Scheduled',
    },
    {
      partnerId: meridianId,
      employeeCode: 'EMP-2048',
      items: ['Complete Blood Count (CBC)', 'Lipid Profile'],
      day: 3,
      mode: 'Home Collection',
      location: 'Marathahalli, Bengaluru 560037',
      status: 'Scheduled',
    },
    {
      partnerId: northlineId,
      employeeCode: 'NLM-1101',
      items: ['Factory Fitness Panel (Factories Act)'],
      day: -9,
      mode: 'On-site',
      location: 'Northline — Chakan Plant, Pune',
      status: 'Completed',
      note: 'Fit for duty. Hearing threshold within limits at 3 kHz. Chest X-ray normal.',
    },
    {
      partnerId: northlineId,
      employeeCode: 'NLM-1102',
      items: ['Complete Blood Count (CBC)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'],
      day: -4,
      mode: 'On-site',
      location: 'Northline — Chakan Plant, Pune',
      status: 'Report ready',
      note: 'Mild anaemia (Hb 11.4 g/dL). Iron studies advised; no workplace restriction.',
    },
    {
      partnerId: northlineId,
      employeeCode: 'NLM-1103',
      items: ['X-Ray Chest (PA)', '12-Lead ECG (Resting)', 'Lipid Profile'],
      day: 0,
      mode: 'Centre Visit',
      location: 'KOYO Centre — Chinchwad, Pune',
      status: 'In lab',
    },
    {
      partnerId: northlineId,
      employeeCode: 'NLM-1104',
      items: ['Complete Blood Count (CBC)', 'Urine Routine & Microscopy'],
      day: 2,
      mode: 'On-site',
      location: 'Northline — Ranjangaon Plant, Pune',
      status: 'Scheduled',
    },
    {
      partnerId: arcadiaId,
      employeeCode: 'ARC-3301',
      items: ['Comprehensive Executive Health Check — Male (30–50)'],
      day: -20,
      mode: 'Home Collection',
      location: 'Bandra West, Mumbai 400050',
      status: 'Completed',
      note: 'All parameters normal except mild dyslipidaemia. Lifestyle plan shared with the employee directly.',
    },
    {
      partnerId: arcadiaId,
      employeeCode: 'ARC-3302',
      items: ['Lipid Profile', 'HbA1c (Glycated Haemoglobin)', 'Thyroid Profile (T3, T4, TSH)'],
      day: 1,
      mode: 'Centre Visit',
      location: 'KOYO Centre — BKC, Mumbai',
      status: 'Scheduled',
    },
    {
      partnerId: arcadiaId,
      employeeCode: 'ARC-3304',
      items: ['Treadmill Test (Bruce Protocol)', 'Transthoracic Echo (2D)'],
      day: 4,
      mode: 'Centre Visit',
      location: 'KOYO Centre — Lower Parel, Mumbai',
      status: 'Scheduled',
    },
    {
      partnerId: arcadiaId,
      employeeCode: 'ARC-3306',
      items: ['Vitamin D (25-OH)', '12-Lead ECG (Resting)'],
      day: -3,
      mode: 'Home Collection',
      location: 'Lower Parel, Mumbai 400013',
      status: 'Cancelled',
      notes: 'Employee travelling; partner asked to re-schedule next month.',
    },
  ];

  const bookings: PartnerBooking[] = specs.map((spec) => {
    const partner = partners.find((entry) => entry.id === spec.partnerId)!;
    const person = employeeByCode.get(spec.employeeCode)!;
    const items = spec.items
      .map((name) => catalogByName.get(`${spec.partnerId}:${name}`))
      .filter(Boolean)
      .map((item) => ({
        id: item!.id,
        name: item!.name,
        kind: item!.kind,
        rate: item!.rate,
      }));
    const date = isoDay(spec.day);
    const total = items.reduce((sum, item) => sum + item.rate, 0);
    const history = historyFor(spec.status, date, partner.contactName);
    const statusBy = history[history.length - 1]?.role ?? 'KOYO';

    return {
      id: randomId('PB'),
      partnerId: spec.partnerId,
      employeeId: person.id,
      employeeName: person.name,
      employeeCode: person.code,
      department: person.department,
      items,
      total,
      date,
      mode: spec.mode,
      location: spec.location,
      notes: spec.notes,
      status: spec.status,
      statusBy,
      history,
      report: spec.note
        ? { uploadedAt: isoAt(date, 17, 1), uploadedBy: 'KOYO Labs', note: spec.note }
        : undefined,
      patientToken: randomBytes(12).toString('hex'),
      createdAt: isoAt(date, 9, -4),
    };
  });

  const activity: PortalActivity[] = bookings
    .filter((booking) => booking.status !== 'Scheduled')
    .slice(0, 8)
    .map((booking) => {
      const partner = partners.find((entry) => entry.id === booking.partnerId)!;
      return {
        id: randomId('ACT'),
        at: booking.history[booking.history.length - 1]?.at ?? booking.createdAt,
        partnerId: booking.partnerId,
        actor: booking.history[booking.history.length - 1]?.actor ?? 'KOYO Labs',
        role: booking.history[booking.history.length - 1]?.role ?? 'KOYO',
        action: booking.status,
        detail: `${booking.employeeName} · ${booking.employeeCode} · ${partner.name}`,
      };
    });

  return {
    version: 1,
    partners,
    catalogue,
    employees,
    bookings,
    activity,
  };
}
