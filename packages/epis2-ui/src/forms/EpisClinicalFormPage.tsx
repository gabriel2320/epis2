import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type EpisClinicalFormPageProps = {
  title: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  testId?: string;
};

/** Shell de página de formulario clínico generado. */
export function EpisClinicalFormPage({
  title,
  children,
  headerExtra,
  testId = 'epis2-generated-clinical-page',
}: EpisClinicalFormPageProps) {
  return (
    <EpisCard variant="outlined" sx={{ p: 3 }} data-testid={testId}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" component="h1">
            {title}
          </Typography>
          {headerExtra}
        </Stack>
        {children}
      </Stack>
    </EpisCard>
  );
}
