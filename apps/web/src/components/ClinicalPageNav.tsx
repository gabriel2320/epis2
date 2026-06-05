import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { Link } from '@tanstack/react-router';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

export type ClinicalPageNavProps = {
  patientId?: string;
  showFicha?: boolean;
};

/** Enlaces de salida estándar en formularios y revisiones clínicas. */
export function ClinicalPageNav({ patientId, showFicha = true }: ClinicalPageNavProps) {
  const navigate = useClinicalNavigate();

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ pt: 2 }}>
      {showFicha && patientId ? (
        <EpisButton
          variant="outlined"
          size="small"
          onClick={() => void navigate({ to: '/espacio/ficha', search: { patientId } })}
        >
          {copy.forms.backToFicha}
        </EpisButton>
      ) : null}
      <EpisButton component={Link} to="/comando" variant="text" size="small">
        {copy.layout.backToCommand}
      </EpisButton>
    </Stack>
  );
}
