import { copy } from '@epis2/design-system';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { getPrimaryNarrativeForDemoCode } from '../clinical/demoNarrativePresentation.js';
import {
  EpisChip,
  EpisDemoBadgeChip,
  EpisM3Text,
  PersonOutlineIcon,
  Stack,
} from '@epis2/epis2-ui';

/** Una línea de contexto activo — UX-B.1 above-the-fold. */
export function CommandCenterContextLine() {
  const navigate = useClinicalNavigate();
  const { patient } = useActivePatient();
  const narrative = patient?.demoCaseCode
    ? getPrimaryNarrativeForDemoCode(patient.demoCaseCode)
    : undefined;

  if (!patient) {
    return (
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        sx={{ width: '100%' }}
        data-testid="epis2-command-context-line"
      >
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.commandCenter.contextNoPatient}
        </EpisM3Text>
        <EpisChip
          label={copy.forms.searchPatient}
          size="small"
          variant="outlined"
          clickable
          onClick={() => void navigate({ to: '/espacio/buscar-paciente' })}
        />
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%' }}
      data-testid="epis2-command-context-line"
    >
      <PersonOutlineIcon fontSize="small" color="action" aria-hidden />
      <EpisM3Text role="labelLarge" data-testid="epis2-command-context-patient">
        {patient.displayName}
      </EpisM3Text>
      {patient.demoCaseCode ? (
        <EpisDemoBadgeChip label={patient.demoCaseCode} size="small" />
      ) : null}
      {narrative ? (
        <EpisM3Text role="labelMedium" color="text.secondary">
          {narrative.titleEs}
        </EpisM3Text>
      ) : null}
      <EpisChip
        label={copy.commandCenter.openPatientChart}
        size="small"
        variant="outlined"
        clickable
        onClick={() =>
          void navigate({ to: '/espacio/ficha', search: { patientId: patient.id } })
        }
      />
    </Stack>
  );
}
