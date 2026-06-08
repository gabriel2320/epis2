import { describe, expect, it } from 'vitest';
import { expandClinicalSnippet } from './clinicalSnippets.js';

describe('clinicalSnippets', () => {
  it('expande trigger .soap', () => {
    const { expanded, snippet } = expandClinicalSnippet('Nota .soap');
    expect(snippet?.trigger).toBe('.soap');
    expect(expanded).toContain('S:');
  });
});
