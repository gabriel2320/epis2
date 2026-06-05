import type { ReactElement } from 'react';
import type { ClinicalIntent } from '@epis2/command-registry';
import {
  AssignmentIcon,
  AutoAwesomeIcon,
  BiotechIcon,
  DashboardIcon,
  ImageSearchIcon,
  LocalHospitalIcon,
  MedicationIcon,
  PersonSearchIcon,
  SearchIcon,
  SummarizeIcon,
} from '../mui/index.js';
import { getIntentChipTone } from './intent-visual.js';

export function getIntentChipIcon(intent: ClinicalIntent, aiAssisted?: boolean): ReactElement {
  const tone = getIntentChipTone(intent, aiAssisted);
  const props = { fontSize: 'small' as const };
  switch (tone) {
    case 'ai':
      return aiAssisted ? <AutoAwesomeIcon {...props} /> : <SummarizeIcon {...props} />;
    case 'search':
      return <PersonSearchIcon {...props} />;
    case 'evolution':
      return <AssignmentIcon {...props} />;
    case 'discharge':
      return <LocalHospitalIcon {...props} />;
    case 'rx':
      return <MedicationIcon {...props} />;
    case 'labs':
      return <BiotechIcon {...props} />;
    case 'imaging':
      return <ImageSearchIcon {...props} />;
    case 'nursing':
      return <MedicationIcon {...props} />;
    case 'pharmacy':
      return <MedicationIcon {...props} />;
    case 'dashboard':
      return <DashboardIcon {...props} />;
    default:
      return <SearchIcon {...props} />;
  }
}
