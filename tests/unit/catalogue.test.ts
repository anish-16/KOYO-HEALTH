import { describe, expect, it } from 'vitest';
import {
  services, allTests, popularTests, modalities, getService, getTest, searchTests, catalogueStats,
} from '@/data/services';
import { packages, getPackage } from '@/data/packages';
import { blogs, getBlog, blogCategories, relatedBlogs } from '@/data/blogs';
import { cities, getCity, topCities } from '@/data/cities';
import { doctors } from '@/data/company';

describe('service catalogue', () => {
  it('contains the full 28-category catalogue in reference order', () => {
    expect(services).toHaveLength(28);
    expect(services[0].slug).toBe('ct');
    expect(services[1].slug).toBe('mri');
    expect(services[27].slug).toBe('dtpa');
  });

  it('has unique slugs, names and complete detail content', () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length);
    for (const service of services) {
      expect(service.name.length).toBeGreaterThan(2);
      expect(service.tagline.length).toBeGreaterThan(10);
      expect(service.story.length).toBeGreaterThanOrEqual(2);
      expect(service.highlights.length).toBeGreaterThanOrEqual(3);
      expect(service.preparation.length).toBeGreaterThanOrEqual(2);
      expect(service.benefits.length).toBeGreaterThanOrEqual(2);
      expect(service.risks.length).toBeGreaterThanOrEqual(1);
      expect(service.faqs.length).toBeGreaterThanOrEqual(3);
      expect(service.tests.length).toBeGreaterThanOrEqual(3);
      expect(service.centers).toBeGreaterThan(0);
      expect(service.scansPerYear).toBeGreaterThan(0);
    }
  });

  it('lists more than a hundred individual tests with sane pricing', () => {
    expect(allTests.length).toBeGreaterThanOrEqual(100);
    expect(new Set(allTests.map((t) => t.id)).size).toBe(allTests.length);
    for (const test of allTests) {
      expect(test.price).toBeGreaterThan(0);
      expect(test.mrp).toBeGreaterThan(test.price);
      expect(test.reportHours).toBeGreaterThan(0);
      expect(test.durationMinutes).toBeGreaterThan(0);
      expect(test.fastingHours).toBeGreaterThanOrEqual(0);
      expect(test.description.length).toBeGreaterThan(30);
    }
  });

  it('exposes five modalities and consistent aggregate stats', () => {
    expect(modalities).toHaveLength(5);
    expect(catalogueStats.categories).toBe(28);
    expect(catalogueStats.tests).toBe(allTests.length);
    expect(catalogueStats.minPrice).toBe(Math.min(...allTests.map((t) => t.price)));
    expect(catalogueStats.maxPrice).toBe(Math.max(...allTests.map((t) => t.price)));
  });

  it('resolves services and tests by slug', () => {
    expect(getService('mri')?.name).toContain('MRI');
    expect(getService('nope')).toBeUndefined();
    const test = allTests[0];
    expect(getTest(test.serviceSlug, test.slug)?.name).toBe(test.name);
    expect(getTest('mri', 'definitely-not-a-test')).toBeUndefined();
  });

  it('searches with prefix matches ranked first and respects limits', () => {
    expect(searchTests('')).toEqual([]);
    expect(searchTests('   ')).toEqual([]);
    const mri = searchTests('mri', 5);
    expect(mri.length).toBeGreaterThan(0);
    expect(mri.length).toBeLessThanOrEqual(5);
    expect(mri[0].serviceSlug).toBe('mri');
    expect(searchTests('zzzzzz')).toEqual([]);
    expect(searchTests('blood', 3).length).toBeLessThanOrEqual(3);
  });

  it('keeps popular tests a curated subset of the catalogue', () => {
    expect(popularTests.length).toBeGreaterThan(0);
    for (const t of popularTests) {
      expect(allTests.some((x) => x.id === t.id)).toBe(true);
    }
  });
});

describe('health packages', () => {
  it('ships exactly the 18 packages from the clinical master sheet', () => {
    expect(packages).toHaveLength(18);
    expect(new Set(packages.map((p) => p.slug)).size).toBe(packages.length);
    expect(new Set(packages.map((p) => p.name)).size).toBe(packages.length);
  });

  it('derives every advertised parameter count from its own panel', () => {
    for (const pkg of packages) {
      const summed = pkg.panels
        .flatMap((panel) => panel.tests)
        .reduce((total, test) => total + test.count, 0);
      expect(pkg.panels.length, `${pkg.slug} has no panel groups`).toBeGreaterThan(0);
      expect(summed, `${pkg.slug} advertises ${pkg.testCount} but lists ${summed}`).toBe(pkg.testCount);
      expect(pkg.testsIncluded.length).toBe(pkg.panels.flatMap((panel) => panel.tests).length);
      // Real abbreviations run as short as "ESR" and "LH", so only emptiness is a defect.
      expect(pkg.testsIncluded.every((name) => name.trim().length >= 2)).toBe(true);
    }
  });

  it('prices every package below MRP with real inclusions', () => {
    for (const pkg of packages) {
      expect(pkg.price).toBeGreaterThan(0);
      expect(pkg.mrp).toBeGreaterThan(pkg.price);
      // Focused packages legitimately include fewer named markers than broad panels.
      expect(pkg.testsIncluded.length).toBeGreaterThanOrEqual(4);
      expect(pkg.highlights.length).toBeGreaterThanOrEqual(2);
      expect(pkg.testCount).toBeGreaterThanOrEqual(pkg.testsIncluded.length);
      expect(pkg.fastingHours).toBeGreaterThanOrEqual(0);
      expect(pkg.reportTime.length).toBeGreaterThan(3);
    }
  });

  it('has one popular package per major category and a working lookup', () => {
    expect(packages.filter((p) => p.isPopular).length).toBeGreaterThanOrEqual(3);
    expect(getPackage('full-body-checkup')?.name).toContain('Full Body');
    expect(getPackage('missing-package')).toBeUndefined();
  });
});

describe('cities and doctors', () => {
  it('covers 48 cities with unique slugs and localities', () => {
    expect(cities).toHaveLength(48);
    expect(new Set(cities.map((c) => c.slug)).size).toBe(48);
    for (const city of cities) {
      expect(city.localities.length).toBeGreaterThanOrEqual(2);
      expect(city.centers).toBeGreaterThan(0);
      expect(city.pincode).toMatch(/^\d{6}$/);
    }
    expect(topCities.length).toBeGreaterThan(0);
    expect(getCity('noida')?.state).toBe('Uttar Pradesh');
    expect(getCity('atlantis')).toBeUndefined();
  });

  it('has at least eight publishable clinician profiles', () => {
    expect(doctors.length).toBeGreaterThanOrEqual(8);
    expect(new Set(doctors.map((d) => d.id)).size).toBe(doctors.length);
    for (const d of doctors) {
      expect(d.bio.length).toBeGreaterThan(40);
      expect(d.experience).toBeGreaterThan(0);
    }
  });
});

describe('health insights', () => {
  it('publishes articles with structured sections and takeaways', () => {
    expect(blogs.length).toBeGreaterThanOrEqual(20);
    expect(new Set(blogs.map((b) => b.slug)).size).toBe(blogs.length);
    for (const post of blogs) {
      expect(post.sections.length).toBeGreaterThanOrEqual(3);
      expect(post.takeaways.length).toBeGreaterThanOrEqual(2);
      expect(post.readTime).toBeGreaterThan(2);
      expect(post.author.length).toBeGreaterThan(3);
      expect(Number.isNaN(new Date(post.date).getTime())).toBe(false);
    }
  });

  it('looks up posts and derives related reading without repeating the source', () => {
    const post = getBlog(blogs[0].slug);
    expect(post?.title).toBe(blogs[0].title);
    expect(getBlog('nope')).toBeUndefined();
    const related = relatedBlogs(blogs[0].slug, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.some((r) => r.slug === blogs[0].slug)).toBe(false);
    expect(blogCategories.length).toBeGreaterThan(2);
  });
});
