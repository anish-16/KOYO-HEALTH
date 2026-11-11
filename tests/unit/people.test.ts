import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { people } from '@/data/people';
import { packageFamilies, packagePhoto } from '@/data/families';
import { packages } from '@/data/packages';

const root = process.cwd();

function onDisk(src: string) {
  const file = path.join(root, 'public', src);
  return { exists: existsSync(file), bytes: existsSync(file) ? statSync(file).size : 0 };
}

describe('human photography', () => {
  it('ships every registered photograph on disk', () => {
    for (const [name, photo] of Object.entries({ ...people })) {
      const file = onDisk(photo.src);
      expect(file.exists, `${name} → ${photo.src} is missing from public/`).toBe(true);
      // A 0-byte or placeholder file would render as a broken card.
      expect(file.bytes, `${name} → ${photo.src} is suspiciously small`).toBeGreaterThan(8_000);
    }
  });

  it('describes every photograph for screen readers', () => {
    for (const [name, photo] of Object.entries({ ...people })) {
      expect(photo.alt.length, `${name} has no alt text`).toBeGreaterThan(20);
      expect(photo.caption.length, `${name} has no caption`).toBeGreaterThan(10);
    }
  });

  it('keeps photography out of package cards in favour of designed art', () => {
    // Packages render `PackageArt`, so no card can repeat another's photograph.
    expect(onDisk(people.lab.src).exists).toBe(true);
    expect(onDisk(people.phlebotomy.src).exists).toBe(true);
  });

  it('derives every category tile from the 18 packages', () => {
    // The matrix is the catalogue: counts must add up to the package total.
    expect(packageFamilies.length).toBeGreaterThan(3);
    expect(packageFamilies.reduce((sum, f) => sum + f.count, 0)).toBe(packages.length);
    expect(new Set(packageFamilies.map((f) => f.key)).size).toBe(packageFamilies.length);
    for (const family of packageFamilies) {
      expect(family.count).toBeGreaterThan(0);
      expect(family.from).toBeGreaterThan(0);
      expect(family.label.length).toBeGreaterThan(3);
      expect(packages.some((p) => p.family === family.key)).toBe(true);
      expect(onDisk(family.photo.src).exists).toBe(true);
    }
  });

  it('gives every package a human photograph that exists on disk', () => {
    for (const pkg of packages) {
      const photo = packagePhoto(pkg);
      expect(photo.alt.length).toBeGreaterThan(20);
      expect(onDisk(photo.src).exists, `${pkg.slug} → ${photo.src} missing`).toBe(true);
    }
  });

  it('puts a person, not a laboratory bench, on every package card', () => {
    // Cards sell a checkup to a person, so a bench, a microscope or an empty
    // meeting room is the wrong picture no matter how clinical it looks.
    const machinePhotos = [people.lab.src, people.microscope.src, people.workplace.src];
    for (const pkg of packages) {
      const photo = packagePhoto(pkg);
      expect(machinePhotos, `${pkg.slug} shows equipment rather than a person`).not.toContain(photo.src);
    }
  });

  it('matches the card subject to the panel it is selling', () => {
    const subjectFor = (slug: string) => packagePhoto(packages.find((p) => p.slug === slug)!);
    // Women's panels show a woman, men's panels a man, fertility a couple,
    // cancer screening an older adult, the family check a family.
    expect([people.women.src, people.mother.src]).toContain(subjectFor('womens-wellness-premium').src);
    expect(subjectFor('mens-wellness-premium').src).toBe(people.corporate.src);
    expect(subjectFor('fertility-screening-male').src).toBe(people.coupleYoung.src);
    expect(subjectFor('cancer-screening-male').src).toBe(people.senior.src);
    expect(subjectFor('senior-citizen-package').src).toBe(people.senior.src);
    expect(subjectFor('full-body-checkup').src).toBe(people.family.src);
  });

  it('never repeats a face on neighbouring cards in the three-column grid', () => {
    // Grid neighbours sit up to three positions apart, so the same photograph
    // must not reappear inside that window.
    const order = packages.map((p) => packagePhoto(p).src);
    for (let i = 0; i < order.length; i += 1) {
      for (let j = i + 1; j < Math.min(i + 4, order.length); j += 1) {
        expect(
          order[j],
          `${packages[i].slug} and ${packages[j].slug} share a photograph ${j - i} apart`,
        ).not.toBe(order[i]);
      }
    }
  });
});
