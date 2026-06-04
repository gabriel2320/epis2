import { epis2Theme } from '@epis2/design-system';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';

export function Epis2ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={epis2Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
