import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { EpisClinicalScrollspy, type EpisClinicalScrollspySection } from './EpisClinicalScrollspy.js';

export type EpisClinicalScrollspyLayoutProps = {
  sections: EpisClinicalScrollspySection[];
  children: ReactNode;
  /** Espacio inferior para no ocultar contenido bajo el FAB. */
  bottomPadding?: number;
  testId?: string;
};

/** Nivel 3 — formulario con índice lateral scrollspy + área de trabajo scrollable. */
export function EpisClinicalScrollspyLayout({
  sections,
  children,
  bottomPadding = 96,
  testId = 'epis2-clinical-scrollspy-layout',
}: EpisClinicalScrollspyLayoutProps) {
  return (
    <Box
      data-testid={testId}
      sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: `${bottomPadding}px` }}
    >
      <EpisClinicalScrollspy sections={sections} />
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
