import {
  AssignmentIcon,
  BiotechIcon,
  HealthAndSafetyIcon,
  LocalHospitalIcon,
  MedicationIcon,
  MonitorHeartIcon,
  ScienceIcon,
  SummarizeIcon,
} from '@epis2/epis2-ui';
import type { ReactElement } from 'react';

export type ClinicalSummaryIconKey =
  | 'allergies'
  | 'alerts'
  | 'drafts'
  | 'events'
  | 'labs'
  | 'medications'
  | 'problems'
  | 'timeline'
  | 'vitals';

const ICONS: Record<ClinicalSummaryIconKey, ReactElement> = {
  allergies: <HealthAndSafetyIcon fontSize="small" aria-hidden />,
  alerts: <MonitorHeartIcon fontSize="small" aria-hidden />,
  drafts: <AssignmentIcon fontSize="small" aria-hidden />,
  events: <SummarizeIcon fontSize="small" aria-hidden />,
  labs: <ScienceIcon fontSize="small" aria-hidden />,
  medications: <MedicationIcon fontSize="small" aria-hidden />,
  problems: <LocalHospitalIcon fontSize="small" aria-hidden />,
  timeline: <BiotechIcon fontSize="small" aria-hidden />,
  vitals: <MonitorHeartIcon fontSize="small" aria-hidden />,
};

export function clinicalSummaryCardIcon(key: ClinicalSummaryIconKey): ReactElement {
  return ICONS[key];
}
