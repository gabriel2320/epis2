import { Box, epis2PaperSectionTitleSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type PaperSectionProps = {
  title: string;
  children: ReactNode;
  testId?: string | undefined;
  minLines?: number | undefined;
};

/** Sección documento papel — banda navy + acento lateral (FichaPapel). */
export function PaperSection({ title, children, testId }: PaperSectionProps) {
  return (
    <Box className="epis2-paper-chart-section epis2-paper-section" data-testid={testId}>
      <Box component="h3" className="epis2-paper-section-title" sx={epis2PaperSectionTitleSx()}>
        {title}
      </Box>
      {children}
    </Box>
  );
}
