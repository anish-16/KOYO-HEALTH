import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/book', '/login', '/share/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/blogs/', '/services/', '/packages/'],
        disallow: ['/api/', '/dashboard/', '/book', '/login'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
