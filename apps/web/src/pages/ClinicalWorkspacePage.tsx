import { copy } from '@epis2/design-system';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export type ClinicalWorkspacePageProps = {
  title: string;
  intentLabel?: string;
};

/** Destino tras resolver comando — formularios en EPIS2-06. */
export function ClinicalWorkspacePage({ title, intentLabel }: ClinicalWorkspacePageProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }} data-testid="epis2-clinical-workspace">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {intentLabel ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Comando: {intentLabel}
        </Typography>
      ) : null}
      <Typography variant="body2" color="text.secondary">
        Formulario generado en EPIS2-06. El comando ya fue enrutado correctamente.
      </Typography>
      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
        {copy.demoBadge}
      </Typography>
    </Paper>
  );
}
