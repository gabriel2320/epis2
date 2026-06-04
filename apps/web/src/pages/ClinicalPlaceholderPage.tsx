import { copy } from '@epis2/design-system';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/** Placeholder del layout clínico — formularios en EPIS2-06. */
export function ClinicalPlaceholderPage() {
  return (
    <Paper variant="outlined" sx={{ p: 3 }} data-testid="epis2-clinical-layout">
      <Typography variant="h6" gutterBottom>
        Espacio clínico
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Layout de página clínica listo. Los formularios generados se conectarán en EPIS2-06.
      </Typography>
      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
        {copy.demoBadge}
      </Typography>
    </Paper>
  );
}
