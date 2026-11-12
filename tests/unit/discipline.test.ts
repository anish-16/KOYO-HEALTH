import { describe, expect, it } from 'vitest';
import {
  disciplines, getDiscipline, testEntries, getTestEntry, testsInGroup, relatedTests,
  disciplineStats, formatReport, formatDuration,
} from '@/data/tests';
import { allTests } from '@/data/services';

describe('pathology and imaging taxonomy', () => {
  it('splits the catalogue into two disciplines with nothing lost or duplicated', () => {
    expect(disciplines).toHaveLength(2);
    expect(disciplines.map((d) => d.key)).toEqual(['pathology', 'imaging']);

    const buckets = disciplines.flatMap((d) => d.groups.flatMap((g) => g.ids));
    expect(buckets.length).toBe(buckets.length);
    // Every individual test belongs to exactly one group, and every test is covered.
    const unique = new Set(buckets);
    expect(unique.size).toBe(buckets.length);
    expect(unique.size).toBe(allTests.length);
    expect(new Set(buckets)).toEqual(new Set(allTests.map((t) => t.id)));
  });

  it('keeps blood work out of the scans and vice versa', () => {
    for (const discipline of disciplines) {
      for (const test of discipline.tests) {
        const isLab = test.modality === 'Pathology';
        expect(isLab, `${test.name} sits under ${discipline.key}`).toBe(discipline.key === 'pathology');
      }
    }
  });

  it('resolves every group to non-empty, priced studies with a group label', () => {
    for (const discipline of disciplines) {
      expect(discipline.groups.length).toBeGreaterThanOrEqual(6);
      for (const group of discipline.groups) {
        expect(group.ids.length, `${group.label} is empty`).toBeGreaterThan(0);
        const tests = testsInGroup(group);
        expect(tests).toHaveLength(group.ids.length);
        for (const test of tests) {
          expect(test.price).toBeGreaterThan(0);
          expect(test.groupLabel).toBe(group.label);
          expect(test.discipline).toBe(discipline.key);
          expect(test.preparation.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('shows at most six curated groups in the header menu', () => {
    for (const discipline of disciplines) {
      expect(discipline.menuGroups.length).toBeGreaterThan(0);
      expect(discipline.menuGroups.length).toBeLessThanOrEqual(6);
      expect(discipline.menuGroups.some((g) => g.key.endsWith(':more'))).toBe(false);
    }
  });

  it('offers featured studies and a cheap entry price per discipline', () => {
    for (const discipline of disciplines) {
      expect(discipline.featured.length).toBe(5);
      expect(discipline.minPrice).toBe(Math.min(...discipline.tests.map((t) => t.price)));
      expect(discipline.maxPrice).toBeGreaterThan(discipline.minPrice);
      expect(discipline.homeCollection).toBeGreaterThan(0);
      expect(discipline.tests.length).toBeGreaterThan(20);
    }
    expect(disciplineStats.bloodTests + disciplineStats.scans).toBe(disciplineStats.tests);
    expect(disciplineStats.tests).toBe(allTests.length);
  });

  it('looks up entries by id and never repeats the current test as related', () => {
    const entry = getTestEntry('pathology/complete-blood-count-cbc');
    expect(entry?.name).toBe('Complete Blood Count (CBC)');
    expect(getTestEntry('mri/not-a-test')).toBeUndefined();
    expect(getDiscipline('pathology')?.navLabel).toBe('Blood tests');
    expect(getDiscipline('nope')).toBeUndefined();

    const related = relatedTests(entry!, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.some((r) => r.id === entry!.id)).toBe(false);
    expect(testEntries.every((t) => t.groupKey.length > 0)).toBe(true);
  });

  it('formats turnaround times the way the interface shows them', () => {
    expect(formatReport(8)).toBe('8 h');
    expect(formatReport(1.5)).toBe('1.5 h');
    expect(formatReport(48)).toBe('2 days');
    expect(formatReport(24)).toBe('1 day');
    expect(formatDuration(10)).toBe('10 min');
    expect(formatDuration(150)).toBe('2.5 hr');
  });
});
