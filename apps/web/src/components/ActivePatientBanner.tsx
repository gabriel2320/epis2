import { copy } from '@epis2/design-system';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';

import {
  Chip,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
export function ActivePatientBanner() {
  const navigate = useClinicalNavigate();
  const { patient } = useActivePatient();

  if (!patient) {
    return (
      <Typography variant="caption" color="text.secondary" data-testid="epis2-no-active-patient">
        {copy.activePatient.none}
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      data-testid="epis2-active-patient-banner"
    >
      <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
      <Typography variant="body2" fontWeight={600}>
        {patient.displayName}
      </Typography>
      {patient.demoCaseCode ? (
        <Chip label={patient.demoCaseCode} size="small" variant="outlined" />
      ) : null}
      <Chip
        label={copy.activePatient.workspace}
        size="small"
        color="primary"
        clickable
        onClick={() =>
          navigate({
            to: '/espacio/ficha',
            search: { patientId: patient.id },
          })
        }
      />
    </Stack>
  );
}
