import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KOYO Health — diagnostics, imaging & preventive care',
    short_name: 'KOYO Health',
    description:
      'Book accredited diagnostic tests, scans and health packages across 48 Indian cities. Free home sample collection and clinician-reviewed reports.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBFAF7',
    theme_color: '#06191F',
    orientation: 'portrait',
    categories: ['health', 'medical', 'lifestyle'],
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    shortcuts: [
      { name: 'Book a test', url: '/book', description: 'Start a new booking' },
      { name: 'My reports', url: '/dashboard/reports', description: 'View released reports' },
      { name: 'Find a centre', url: '/cities', description: 'Browse centres by city' },
    ],
  };
}
