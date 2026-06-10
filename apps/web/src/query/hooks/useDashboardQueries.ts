import { useQuery } from '@tanstack/react-query';
import {
  fetchApsDashboard,
  fetchDashboardWork,
  fetchEmergencyDashboard,
  fetchIcuDashboard,
  fetchNursingDashboard,
  fetchOrDashboard,
  fetchPatientDashboard,
  fetchPharmacyDashboard,
  fetchReceptionDashboard,
  fetchServiceDashboard,
  fetchSpecialtyDashboard,
} from '../../api/dashboardApi.js';
import { fetchQualityDashboard } from '../../api/opsApi.js';
import type { DashboardTab } from '../../routes/clinicalNavigate.js';
import { queryKeys } from '../queryKeys.js';

type DashboardPermissions = {
  canQuality: boolean;
  canNursing: boolean;
  canPharmacy: boolean;
  canReception: boolean;
  canEmergency: boolean;
  canIcu: boolean;
  canOr: boolean;
  canAps: boolean;
  canSpecialty: boolean;
};

type UseDashboardQueriesOptions = DashboardPermissions & {
  tab: DashboardTab;
  patientId?: string | undefined;
};

export function useDashboardQueries(options: UseDashboardQueriesOptions) {
  const { tab, patientId } = options;

  const work = useQuery({
    queryKey: queryKeys.dashboard.work(),
    queryFn: () => fetchDashboardWork(),
    enabled: tab === 'work',
  });

  const service = useQuery({
    queryKey: queryKeys.dashboard.service(),
    queryFn: () => fetchServiceDashboard(),
    enabled: tab === 'service',
  });

  const nursing = useQuery({
    queryKey: queryKeys.dashboard.nursing(),
    queryFn: () => fetchNursingDashboard(),
    enabled: tab === 'nursing' && options.canNursing,
  });

  const pharmacy = useQuery({
    queryKey: queryKeys.dashboard.pharmacy(),
    queryFn: () => fetchPharmacyDashboard(),
    enabled: tab === 'pharmacy' && options.canPharmacy,
  });

  const quality = useQuery({
    queryKey: queryKeys.dashboard.quality(),
    queryFn: () => fetchQualityDashboard(),
    enabled: tab === 'quality' && options.canQuality,
  });

  const reception = useQuery({
    queryKey: queryKeys.dashboard.reception(),
    queryFn: () => fetchReceptionDashboard(),
    enabled: tab === 'reception' && options.canReception,
  });

  const emergency = useQuery({
    queryKey: queryKeys.dashboard.emergency(),
    queryFn: () => fetchEmergencyDashboard(),
    enabled: tab === 'emergency' && options.canEmergency,
  });

  const icu = useQuery({
    queryKey: queryKeys.dashboard.icu(),
    queryFn: () => fetchIcuDashboard(),
    enabled: tab === 'icu' && options.canIcu,
  });

  const or = useQuery({
    queryKey: queryKeys.dashboard.or(),
    queryFn: () => fetchOrDashboard(),
    enabled: tab === 'or' && options.canOr,
  });

  const aps = useQuery({
    queryKey: queryKeys.dashboard.aps(),
    queryFn: () => fetchApsDashboard(),
    enabled: tab === 'aps' && options.canAps,
  });

  const specialty = useQuery({
    queryKey: queryKeys.dashboard.specialty(),
    queryFn: () => fetchSpecialtyDashboard(),
    enabled: tab === 'specialty' && options.canSpecialty,
  });

  const patient = useQuery({
    queryKey: queryKeys.dashboard.patient(patientId ?? ''),
    queryFn: () => fetchPatientDashboard(patientId!),
    enabled: tab === 'patient' && Boolean(patientId),
  });

  const active = (() => {
    switch (tab) {
      case 'work':
        return work;
      case 'service':
        return service;
      case 'nursing':
        return nursing;
      case 'pharmacy':
        return pharmacy;
      case 'quality':
        return quality;
      case 'reception':
        return reception;
      case 'emergency':
        return emergency;
      case 'icu':
        return icu;
      case 'or':
        return or;
      case 'aps':
        return aps;
      case 'specialty':
        return specialty;
      case 'patient':
        return patient;
      default:
        return work;
    }
  })();

  return {
    work,
    service,
    nursing,
    pharmacy,
    quality,
    reception,
    emergency,
    icu,
    or,
    aps,
    specialty,
    patient,
    active,
  };
}
