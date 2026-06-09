import { copy } from '@epis2/design-system';
import { COMMAND_CENTER_DENSITY } from '@epis2/command-registry';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { readRecentPatients } from '../../clinical/recentPatients.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';

/** Pacientes recientes compactos bajo la barra Google-like (máx. 4). */
export function CommandCenterRecentPatientsCompact() {
  const navigate = useClinicalNavigate();
  const { patient: activePatient } = useActivePatient();
  const recent = readRecentPatients().slice(0, COMMAND_CENTER_DENSITY.maxContinueWorkRows);

  if (recent.length === 0 && !activePatient) {
    return null;
  }

  const rows = recent.length > 0 ? recent : activePatient ? [activePatient] : [];

  return (
    <Stack spacing={0.75} sx={{ width: '100%' }} data-testid="epis2-command-recent-patients">
      <EpisM3Text role="labelMedium" color="text.secondary" sx={{ textAlign: 'center' }}>
        {copy.commandCenter.blockRecentPatients}
      </EpisM3Text>
      <Stack direction="row" flexWrap="wrap" gap={0.75} justifyContent="center">
        {rows.slice(0, 4).map((p) => (
          <EpisM3Text
            key={p.id}
            role="labelMedium"
            component="button"
            color="primary"
            data-testid={`epis2-command-recent-patient-${p.id}`}
            onClick={() =>
              void navigate({
                to: '/espacio/ficha',
                search: { patientId: p.id },
              })
            }
            sx={{
              border: 0,
              bgcolor: 'transparent',
              cursor: 'pointer',
              p: 0,
              font: 'inherit',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {p.displayName}
          </EpisM3Text>
        ))}
      </Stack>
    </Stack>
  );
}
