import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import {
  loadEpisModePreferences,
  setDefaultPatientView,
  type ClassicPatientViewMode,
} from '../../modes/index.js';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';

/** Preferencia de vista paciente — modo clásico vs moderno. */
export function ClassicMd3PreferencesSection() {
  const navigate = useClinicalNavigate();
  const [view, setView] = useState<ClassicPatientViewMode>(
    () => loadEpisModePreferences().defaultPatientView,
  );

  const selectView = (mode: ClassicPatientViewMode) => {
    setView(mode);
    setDefaultPatientView(mode);
  };

  return (
    <Stack spacing={1.5} data-testid="epis2-classic-md3-preferences">
      <Typography variant="subtitle2">{copy.classicMd3.defaultPatientView}</Typography>
      <Typography variant="body2" color="text.secondary">
        {copy.classicMd3.defaultPatientViewHint}
      </Typography>
      <Stack direction="row" spacing={1}>
        <EpisButton
          appearance={view === 'modern' ? 'filled' : 'outlined'}
          size="small"
          onClick={() => selectView('modern')}
        >
          {copy.classicMd3.modernMode}
        </EpisButton>
        <EpisButton
          appearance={view === 'classic' ? 'filled' : 'outlined'}
          size="small"
          onClick={() => selectView('classic')}
        >
          {copy.classicMd3.classicMode}
        </EpisButton>
      </Stack>
      <EpisButton
        appearance="outlined"
        size="small"
        onClick={() =>
          void navigate({
            to: '/espacio/ficha',
            search: { mode: 'classic' },
          })
        }
      >
        {copy.classicMd3.classicMode}
      </EpisButton>
    </Stack>
  );
}
