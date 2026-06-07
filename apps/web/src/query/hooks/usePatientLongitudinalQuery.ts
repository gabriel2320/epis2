import { useQuery } from '@tanstack/react-query';
import { fetchPatientLongitudinal } from '../../api/clinicalApi.js';
import { queryKeys } from '../queryKeys.js';

export function usePatientLongitudinalQuery(patientId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.patients.longitudinal(patientId ?? ''),
    queryFn: () => fetchPatientLongitudinal(patientId!),
    enabled: Boolean(patientId) && enabled,
  });
}
