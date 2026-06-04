import type { Components, Theme } from '@mui/material/styles';

export const epis2Components: Components<Theme> = {
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 14,
      },
    },
  },
  MuiTextField: {
    defaultProps: { fullWidth: true, variant: 'outlined' },
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
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 24 },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 500 },
    },
  },
};
