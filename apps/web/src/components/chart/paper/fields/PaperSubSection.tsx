import { Box, epis2PaperSubSectionTitleSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type PaperSubSectionProps = {
  title: string;
  children?: ReactNode;
  testId?: string | undefined;
};

/** Subsección A/B/C dentro de banda I–VII (FichaPapel SubTitle). */
export function PaperSubSection({ title, children, testId }: PaperSubSectionProps) {
  return (
    <Box data-testid={testId} className="epis2-paper-subsection" sx={{ px: 2, py: 1 }}>
      <Box component="h4" className="epis2-paper-subsection-title" sx={epis2PaperSubSectionTitleSx()}>
        {title}
      </Box>
      {children}
    </Box>
  );
}
