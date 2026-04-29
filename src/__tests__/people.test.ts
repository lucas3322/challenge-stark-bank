import { getRandomPeople, randomBetween } from '../utils/people';

describe('getRandomPeople', () => {
  it('returns the requested number of people', () => {
    const people = getRandomPeople(5);
    expect(people).toHaveLength(5);
  });

  it('returns unique people (no duplicates)', () => {
    const people = getRandomPeople(8);
    const taxIds = people.map((p) => p.taxId);
    expect(new Set(taxIds).size).toBe(people.length);
  });

  it('never returns more people than the pool', () => {
    const people = getRandomPeople(999);
    expect(people.length).toBeLessThanOrEqual(12);
  });
});

describe('randomBetween', () => {
  it('returns a value within the inclusive range', () => {
    for (let i = 0; i < 50; i++) {
      const val = randomBetween(8, 12);
      expect(val).toBeGreaterThanOrEqual(8);
      expect(val).toBeLessThanOrEqual(12);
    }
  });

  it('returns an integer', () => {
    const val = randomBetween(1, 100);
    expect(Number.isInteger(val)).toBe(true);
  });
});
