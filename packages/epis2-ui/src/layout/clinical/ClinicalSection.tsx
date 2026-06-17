import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { EpisM3Text } from '../../primitives/EpisM3Text.js';
import { clinicalSectionSx } from './clinicalLayoutSx.js';

export type ClinicalSectionProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  testId?: string;
  /** Profundidad visual (1 = sección raíz). Máx. recomendado: 2. */
  depth?: 1 | 2;
};

/** Sección clínica — sin cards anidadas profundas (máx. 2 niveles). */
export function ClinicalSection({
  title,
  subtitle,
  children,
  testId,
  depth = 1,
}: ClinicalSectionProps) {
  return (
    <Box
      data-testid={testId ?? `clinical-section-depth-${depth}`}
      data-clinical-depth={depth}
      sx={clinicalSectionSx()}
      className="epis2-clinical-section"
    >
      {title ? (
        <EpisM3Text role="titleMedium" component="h2">
          {title}
        </EpisM3Text>
      ) : null}
      {subtitle ? (
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {subtitle}
        </EpisM3Text>
      ) : null}
      {children}
    </Box>
  );
}
