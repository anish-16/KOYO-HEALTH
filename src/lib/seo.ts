import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koyohealth.in';

/** One generated card for the whole site — a per-route image would need 130+ renders. */
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'KOYO Health — accredited diagnostic tests, scans and health packages across India',
};

/**
 * Search engines cut titles near 60 characters and descriptions near 160, and
 * the title template adds " | KOYO Health". Clamp at a word boundary so nothing
 * is truncated mid-word and no page ships a 300-character description.
 */
export function clampText(text: string, max: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const cut = slice.lastIndexOf(' ');
  const head = cut > max * 0.6 ? slice.slice(0, cut) : slice;
  return `${head.replace(/[\s,;:–—-]+$/, '')}…`;
}

/** Leaves room for the " | KOYO Health" template suffix. */
export function metaTitle(text: string) {
  return clampText(text, 56);
}

export function metaDescription(text: string) {
  return clampText(text, 158);
}

/**
 * Open Graph + Twitter metadata for a page. Next replaces the parent's
 * `openGraph` object wholesale when a child defines one, so every page that
 * sets social copy must repeat the image or it ships with no preview card.
 */
export function socialCards({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  authors,
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type,
      locale: 'en_IN',
      siteName: 'KOYO Health',
      url: `${SITE_URL}${path}`,
      title,
      description,
      images: [{ ...OG_IMAGE, alt: title }],
      ...(type === 'article' && publishedTime ? { publishedTime, authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
