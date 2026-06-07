import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { invalidateClinicalDraftQueries } from './invalidateClinical.js';
import { queryKeys } from './queryKeys.js';

describe('invalidateClinicalDraftQueries', () => {
  it('invalida borradores, ficha y dashboard del paciente', () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    invalidateClinicalDraftQueries(queryClient, {
      patientId: 'p1',
      draftId: 'd1',
    });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.drafts.all() });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.drafts.detail('d1') });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.patients.detail('p1') });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.dashboard.all() });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.dashboard.patient('p1') });
  });
});
