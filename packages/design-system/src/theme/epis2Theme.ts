import { createTheme } from '@mui/material/styles';

/** Tema EPIS2 — identidad propia (referencia visual EPIS, sin Carbon). */
export const epis2Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      dark: '#0D47A1',
      light: '#E3F2FD',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
    error: { main: '#C62828' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", system-ui, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600 },
    body1: { fontSize: '0.9375rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 14, backgroundColor: '#FFFFFF' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
  },
});
