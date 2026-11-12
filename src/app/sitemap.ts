import type { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { packages } from '@/data/packages';
import { cities } from '@/data/cities';
import { blogs } from '@/data/blogs';
import { doctors } from '@/data/company';
import { disciplines } from '@/data/tests';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...disciplines.map<MetadataRoute.Sitemap[number]>((discipline) => ({
      url: `${SITE_URL}/tests/${discipline.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    })),
    { url: `${SITE_URL}/packages`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/membership`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/corporate-wellness`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/faqs`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/partner`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/sitemap`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal/refunds`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceUrls: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const packageUrls: MetadataRoute.Sitemap = packages.map((p) => ({
    url: `${SITE_URL}/packages/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const cityUrls: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${SITE_URL}/cities/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${SITE_URL}/blogs/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const doctorUrls: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${SITE_URL}/doctors/${d.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...core, ...serviceUrls, ...packageUrls, ...cityUrls, ...blogUrls, ...doctorUrls];
}
