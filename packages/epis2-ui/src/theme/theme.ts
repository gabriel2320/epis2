import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { epis2Components } from './components.js';
import { epis2Palette } from './palette.js';
import { epis2Typography } from './typography.js';

export const epis2Theme = createTheme(
  {
    cssVariables: true,
    palette: epis2Palette,
    shape: { borderRadius: 16 },
    typography: epis2Typography,
    components: epis2Components,
  },
  esES,
);
