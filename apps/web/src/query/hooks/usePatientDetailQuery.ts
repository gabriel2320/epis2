import { useQuery } from '@tanstack/react-query';
import { fetchPatientDetail } from '../../api/clinicalApi.js';
import { queryKeys } from '../queryKeys.js';

export function usePatientDetailQuery(patientId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.patients.detail(patientId ?? ''),
    queryFn: () => fetchPatientDetail(patientId!),
    enabled: Boolean(patientId) && enabled,
  });
}
