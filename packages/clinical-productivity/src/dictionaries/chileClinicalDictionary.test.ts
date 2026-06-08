import { describe, expect, it } from 'vitest';
import { findClinicalTerms, isWhitelistedClinicalTerm } from './chileClinicalDictionary.js';

describe('chileClinicalDictionary', () => {
  it('encuentra términos clínicos chilenos', () => {
    expect(findClinicalTerms('ceftri').length).toBeGreaterThan(0);
    expect(isWhitelistedClinicalTerm('UCI')).toBe(true);
  });
});
