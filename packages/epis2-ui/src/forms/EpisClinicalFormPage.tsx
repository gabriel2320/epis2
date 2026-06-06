import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Stack from '@mui/material/Stack';
import { epis2ClinicalFormCanvasSx } from './clinical-field-layout.js';
import { epis2M3FormLayout } from '../theme/m3-layout-tokens.js';

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
  return (
    <Box sx={epis2ClinicalFormCanvasSx} data-testid={testId}>
      <Stack spacing={epis2M3FormLayout.sectionGap}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          sx={{ minHeight: 32 }}
        >
          <EpisM3Text role="titleLarge" component="h1">
            {title}
          </EpisM3Text>
          {headerExtra}
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}
