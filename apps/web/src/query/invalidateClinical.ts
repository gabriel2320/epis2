import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys.js';

/** Tras crear, actualizar o aprobar borrador: invalidar lecturas clínicas relacionadas. */
export function invalidateClinicalDraftQueries(
  queryClient: QueryClient,
  options: { patientId?: string; draftId?: string },
) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.drafts.all() });
  if (options.draftId) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.drafts.detail(options.draftId) });
  }
  if (options.patientId) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.patients.detail(options.patientId) });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.patients.longitudinal(options.patientId),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.patients.clinicalAlerts(options.patientId),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.patient(options.patientId),
    });
  }
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
}

/** Alias histórico — preferir `invalidateClinicalDraftQueries`. */
export const invalidateAfterDraftApproval = invalidateClinicalDraftQueries;
