import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { epis2Shape } from '../theme/shape.js';

export type EpisClinicalFormPageProps = {
  title: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  testId?: string;
};

/** Shell M3 Standard — canvas clínico tipo documento. */
export function EpisClinicalFormPage({
  title,
  children,
  headerExtra,
  testId = 'epis2-generated-clinical-page',
}: EpisClinicalFormPageProps) {
  const theme = useTheme();
  const surfaces = theme.epis2?.surfaces;

  return (
    <EpisCard
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: epis2Shape.extraLarge,
        bgcolor: surfaces?.surface ?? 'background.paper',
        borderColor: surfaces?.outlineVariant ?? 'divider',
      }}
      data-testid={testId}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <EpisM3Text role="headlineMedium" component="h1">
            {title}
          </EpisM3Text>
          {headerExtra}
        </Stack>
        {children}
      </Stack>
    </EpisCard>
  );
}
