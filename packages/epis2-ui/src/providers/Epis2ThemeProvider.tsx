import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { epis2Theme } from '../theme/theme.js';

export type Epis2ThemeProviderProps = {
  children: ReactNode;
};

export function Epis2ThemeProvider({ children }: Epis2ThemeProviderProps) {
  return (
    <ThemeProvider theme={epis2Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
