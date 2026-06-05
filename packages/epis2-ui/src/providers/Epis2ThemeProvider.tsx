import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ReactNode } from 'react';
import './../pickers/configureDayjs.js';
import { epis2Theme } from '../theme/theme.js';

export type Epis2ThemeProviderProps = {
  children: ReactNode;
};

export function Epis2ThemeProvider({ children }: Epis2ThemeProviderProps) {
  return (
    <ThemeProvider theme={epis2Theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
