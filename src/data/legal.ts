export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[] };
export type LegalDoc = {
  slug: 'privacy' | 'terms' | 'refunds';
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy policy',
    summary:
      'How KOYO Health collects, uses, stores and shares your health information — and the controls you have over it.',
    updated: '2026-09-01',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'We collect the information needed to deliver a diagnostic service and to keep a complete medical record. That includes identity and contact details (name, age, sex, phone, email, address), appointment details, the tests you book, your results, and payment records.',
          'We also collect limited technical data — device type, browser, IP address and pages visited — to keep the service secure and to understand where the booking flow fails.',
        ],
        list: [
          'Identity data: name, date of birth, sex, government ID where required by law',
          'Contact data: mobile number, email, collection address and pincode',
          'Clinical data: test orders, results, images, referring clinician notes',
          'Payment data: transaction references and GST details (card numbers are never stored by us)',
          'Usage data: device, browser, pages, and error logs',
        ],
      },
      {
        heading: 'Why we use it',
        paragraphs: [
          'We use your data to schedule and deliver tests, to produce and release reports, to contact you about your appointment, to process payments and insurance claims, and to meet our obligations under the NABL and NABH accreditation standards and Indian law.',
          'With your separate, explicit consent, we also use your contact details to send preventive reminders and occasional service updates. You can withdraw that consent at any time without affecting your care.',
        ],
      },
      {
        heading: 'Who can see your results',
        paragraphs: [
          'Your report is visible to you, to the clinician who ordered it, and to the KOYO consultants and laboratory staff involved in producing and releasing it. Access is logged.',
          'Employers and corporate clients never receive individual results. Corporate dashboards contain only aggregates, and cohorts smaller than ten people are suppressed.',
          'We share data with a small set of processors — laboratory information systems, payment gateways, SMS and email providers — under contracts that prohibit any secondary use.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'Clinical records, including reports and images, are retained for ten years from the date of the last test, as required by accreditation and medical-record rules. Account and marketing data are retained for three years after your last interaction, or until you ask us to delete them.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'Under India\'s Digital Personal Data Protection Act, 2023, you have the right to access, correct and erase your personal data, to withdraw consent, to nominate someone to act for you, and to complain to the Data Protection Board.',
          'Requests can be made from your dashboard under Settings → Your data, or by writing to privacy@koyohealth.in. We respond within 30 days. Erasure requests are honoured except where retention is legally required for clinical records.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'Data is encrypted in transit with TLS 1.3 and at rest with AES-256. Access to clinical records is role-based, logged and reviewed. Staff undergo annual privacy training, and we run third-party penetration tests at least twice a year.',
          'If a breach affects your data, we will notify you and the Data Protection Board within 72 hours of becoming aware of it, and publish a summary of what happened.',
        ],
      },
      {
        heading: 'Cookies and tracking',
        paragraphs: [
          'We use strictly necessary cookies for session and security, and a first-party analytics cookie to measure booking-flow performance. We do not run third-party advertising pixels on report pages, and we do not sell data.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Data Protection Officer, KOYO Health Diagnostics Pvt. Ltd., 9th Floor, Tower C, Nukleus, Logix Cyber Park, Sector 62, Noida 201309. Email privacy@koyohealth.in.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & conditions',
    summary: 'The agreement between you and KOYO Health when you book, pay for or receive a diagnostic service.',
    updated: '2026-09-01',
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [
          'KOYO Health Diagnostics Pvt. Ltd. (CIN U85110UP2019PTC118842) operates a network of partner diagnostic centres and provides home sample collection. KOYO is not a hospital and does not provide emergency care, surgery or inpatient treatment.',
        ],
      },
      {
        heading: 'Bookings',
        paragraphs: [
          'A booking is confirmed when you receive a reference number by SMS or email. Slot times are a window, not a guarantee; home collection is promised within 90 minutes of the booked slot, and imaging within 30 minutes of arrival.',
          'You are responsible for providing accurate identity, contact and clinical information, and for disclosing pregnancy, implants, contrast allergies or anticoagulant use before a scan.',
        ],
      },
      {
        heading: 'Preparation and cancellation',
        paragraphs: [
          'Some tests require fasting, stopping certain medication or arranging an escort. Instructions are shown before payment and repeated in the confirmation. If preparation is not followed, the test may need to be rebooked and a fresh slot fee may apply.',
          'Cancellation and refund terms are set out in the cancellation and refund policy, which forms part of these terms.',
        ],
      },
      {
        heading: 'Reports and clinical judgement',
        paragraphs: [
          'Reports are released by a qualified consultant after review. Reference ranges are age- and sex-specific where applicable. A report is an interpretation of the sample or images provided on the day; it is not a diagnosis and does not replace a consultation.',
          'If a result is critical, we will call you and, with your consent, your nominated clinician. We will also attempt contact twice and document the attempts.',
        ],
      },
      {
        heading: 'Pricing and payment',
        paragraphs: [
          'Prices shown include applicable taxes unless stated otherwise. Package prices apply when all tests in the package are performed in a single order; if you remove tests, individual pricing applies.',
          'Wallet credit and membership discounts cannot be combined with corporate prepaid rates unless expressly stated. Invoices carry GST and are available in your dashboard.',
        ],
      },
      {
        heading: 'Your responsibilities',
        list: [
          'Provide truthful identity and clinical information',
          'Follow preparation instructions and arrive within your slot window',
          'Do not share your one-time password or report access link',
          'Treat our staff and phlebotomists with respect — abuse ends the appointment',
        ],
      },
      {
        heading: 'Liability',
        paragraphs: [
          'Our liability for any claim arising from a service is limited to the amount you paid for that service, except where Indian law provides otherwise. We are not liable for delays caused by events outside our control, including equipment failure at a partner centre, transport disruption or a public emergency — though we will rebook at no cost.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          'These terms are governed by Indian law. Disputes are subject to the exclusive jurisdiction of the courts of Gautam Buddh Nagar, Uttar Pradesh, after a good-faith attempt at resolution through our grievance officer.',
        ],
      },
    ],
  },
  {
    slug: 'refunds',
    title: 'Cancellation & refund policy',
    summary: 'When you can cancel free of charge, how refunds are processed, and what happens if a sample fails.',
    updated: '2026-09-01',
    sections: [
      {
        heading: 'Free cancellation window',
        paragraphs: [
          'You can reschedule or cancel any pathology booking free of charge up to 4 hours before the slot. Imaging studies with contrast or sedation require 12 hours notice because preparation and slot blocking begin earlier.',
          'Cancellations inside the window are refunded to your KOYO wallet in full, and to the original payment method minus a ₹99 slot fee.',
        ],
      },
      {
        heading: 'If we cancel',
        paragraphs: [
          'If we cannot deliver your appointment — equipment downtime, staff unavailability, or a phlebotomist who does not arrive — you receive a full refund to the original payment method and a ₹200 wallet credit, without you needing to ask.',
        ],
      },
      {
        heading: 'Failed or rejected samples',
        paragraphs: [
          'If a sample is haemolysed, clotted, insufficient or rejected by the lab, the test is repeated free of charge. If a repeat is not possible within 7 days, you receive a full refund for that test.',
        ],
      },
      {
        heading: 'Refund timelines',
        list: [
          'UPI and netbanking: 3–5 working days',
          'Cards: 5–7 working days, depending on the issuer',
          'KOYO wallet: instant',
          'Cash at centre: refunded to bank within 5 working days',
        ],
      },
      {
        heading: 'Non-refundable items',
        paragraphs: [
          'Membership fees are refundable within 7 days if no benefit has been used. After that, membership remains active until the renewal date and is not pro-rated. Third-party charges already incurred — for example, a contrast agent drawn and administered — are not refundable.',
        ],
      },
      {
        heading: 'How to request',
        paragraphs: [
          'Request a cancellation from Dashboard → Bookings, or call 88005 80075. Every request gets a written confirmation with the refund reference within one working hour.',
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
