import { copy } from '@epis2/design-system';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';

import {
  Chip,
  ScienceIcon,
  Stack,
  Typography,
} from '@epis2/epis2-ui';

export function ActivePatientBanner() {
  const navigate = useClinicalNavigate();
  const { patient } = useActivePatient();

  if (!patient) {
    return (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        useFlexGap
        flexWrap="wrap"
        data-testid="epis2-no-active-patient"
      >
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.55 }}>
          {copy.activePatient.none}
        </Typography>
        <Chip
          label={copy.activePatient.pickPatient}
          size="small"
          variant="outlined"
          clickable
          onClick={() => void navigate({ to: '/espacio/ficha' })}
        />
        <Chip
          label={copy.forms.searchPatient}
          size="small"
          color="primary"
          clickable
          onClick={() => void navigate({ to: '/espacio/buscar-paciente' })}
        />
      </Stack>
    );
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      useFlexGap
      flexWrap="wrap"
      data-testid="epis2-active-patient-banner"
      sx={{ width: '100%' }}
    >
      <Chip
        icon={<ScienceIcon />}
        label={copy.demoBadge}
        size="small"
        variant="outlined"
        sx={{ flexShrink: 0, borderColor: 'warning.main', color: 'warning.dark', bgcolor: 'warning.light' }}
      />
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          flex: { sm: '1 1 auto' },
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: { xs: 'normal', sm: 'nowrap' },
        }}
      >
        {patient.displayName}
      </Typography>
      {patient.demoCaseCode ? (
        <Chip label={patient.demoCaseCode} size="small" variant="outlined" sx={{ flexShrink: 0 }} />
      ) : null}
      <Chip
        label={copy.activePatient.workspace}
        size="small"
        color="primary"
        clickable
        sx={{ flexShrink: 0 }}
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
