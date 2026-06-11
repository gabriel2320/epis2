import { useQuery } from '@tanstack/react-query';
import { fetchPatientClinicalSummary } from '../../api/clinicalApi.js';
import { queryKeys } from '../queryKeys.js';

export function usePatientClinicalSummaryQuery(patientId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.patients.clinicalSummary(patientId ?? ''),
    queryFn: () => fetchPatientClinicalSummary(patientId!),
    enabled: Boolean(patientId) && enabled,
    staleTime: 60_000,
  });
}
