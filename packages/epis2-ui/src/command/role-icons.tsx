import type { ReactElement } from 'react';
import {
  AssignmentIcon,
  LocalHospitalIcon,
  MedicationIcon,
  PersonIcon,
  ScienceIcon,
} from '../mui/index.js';
import { getRoleChipTone } from './intent-visual.js';

export function getRoleChipIcon(role: string): ReactElement {
  const tone = getRoleChipTone(role);
  const props = { fontSize: 'small' as const };
  switch (tone) {
    case 'physician':
      return <LocalHospitalIcon {...props} />;
    case 'nurse':
      return <MedicationIcon {...props} />;
    case 'pharmacist':
      return <ScienceIcon {...props} />;
    case 'auditor':
      return <AssignmentIcon {...props} />;
    case 'admin':
      return <PersonIcon {...props} />;
    default:
      return <PersonIcon {...props} />;
  }
}
