/**
 * @vitest-environment jsdom
 */
import { CLINICAL_QUERY_DEFAULTS, createEpis2QueryClient } from './queryClient.js';
import { describe, expect, it } from 'vitest';

describe('createEpis2QueryClient', () => {
  it('aplica defaults clínicos conservadores', () => {
    const client = createEpis2QueryClient();
    const defaults = client.getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(CLINICAL_QUERY_DEFAULTS.staleTime);
    expect(defaults?.gcTime).toBe(CLINICAL_QUERY_DEFAULTS.gcTime);
    expect(defaults?.refetchOnWindowFocus).toBe(true);
    expect(defaults?.retry).toBe(1);
  });
});
