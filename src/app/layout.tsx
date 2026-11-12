import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/instrument-serif';
import './globals.css';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { BookingProvider } from '@/components/booking/BookingProvider';
import { CallbackButton } from '@/components/site/CallbackButton';
import { TestDetailProvider } from '@/components/tests/TestDetailProvider';
import { allTests } from '@/data/services';
import { packages } from '@/data/packages';
import { packageFamilies } from '@/data/families';
import { companyStats } from '@/data/company';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KOYO Health — Diagnostic tests, scans & health packages',
    template: '%s | KOYO Health',
  },
  description:
    'Book NABL & NABH accredited diagnostic tests, scans and full-body health packages across 48 Indian cities. Free home sample collection, reports in 12 hours, clinician-reviewed results.',
  applicationName: 'KOYO Health',
  keywords: [
    'diagnostic tests', 'MRI scan', 'CT scan', 'blood test at home', 'full body checkup',
    'health packages', 'NABL labs', 'NABH centres', 'radiology India', 'home sample collection',
    'KOYO Health',
  ],
  authors: [{ name: 'KOYO Health' }],
  creator: 'KOYO Health',
  publisher: 'KOYO Health Diagnostics Pvt. Ltd.',
  category: 'health',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'KOYO Health',
    title: 'KOYO Health — Diagnostics that respect your time',
    description: `${packageFamilies.length} health-package categories, ${allTests.length} individual tests and ${packages.length} packages. Accredited centres in 48 cities with free home collection and clinician-reviewed reports.`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'KOYO Health — diagnostics and preventive care' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOYO Health — Diagnostics that respect your time',
    description: 'Accredited diagnostic tests, scans and health packages across 48 Indian cities.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: true, address: true, email: true },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBFAF7' },
    { media: '(prefers-color-scheme: dark)', color: '#06191F' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

const searchIndex = allTests.map((test) => ({
  id: test.id,
  name: test.name,
  serviceName: test.serviceName,
  serviceSlug: test.serviceSlug,
  price: test.price,
  aliases: `${test.serviceSlug} ${test.modality} ${test.sample}`,
}));

const organisationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'KOYO Health',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  image: `${SITE_URL}/opengraph-image`,
  description:
    'KOYO Health is a diagnostic platform offering radiology, pathology and preventive health packages through NABL and NABH accredited partners across India.',
  telephone: '+91-88005-80075',
  email: 'care@koyohealth.in',
  priceRange: '₹99 – ₹24,999',
  medicalSpecialty: ['Radiology', 'Pathology', 'Cardiology', 'Neurology'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9th Floor, Tower C, Nukleus, Logix Cyber Park, Sector 62',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201309',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'Country', name: 'India' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: companyStats.rating,
    reviewCount: companyStats.reviews,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '06:00',
    closes: '22:00',
  },
  sameAs: ['https://www.instagram.com', 'https://www.linkedin.com'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'KOYO Health',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/services?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organisationSchema, websiteSchema]) }}
        />
      </head>
      <body>
        <BookingProvider>
          <TestDetailProvider>
            <Header searchIndex={searchIndex} />
            <main id="main">{children}</main>
            <Footer />
            <div className="fixed bottom-5 right-5 z-40 hidden md:block">
              <CallbackButton
                label="Need help?"
                className="bg-ink text-white shadow-lift hover:bg-teal-deep"
                variant="ghost"
              />
            </div>
          </TestDetailProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
