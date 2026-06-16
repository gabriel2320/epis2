import { copy } from '@epis2/design-system';
import { Alert } from '@epis2/epis2-ui';

/** Banner global DEMO — no dismissable; oculto al imprimir documentos clínicos. */
export function EpisDemoEnvironmentBanner() {
  return (
    <Alert
      severity="warning"
      variant="filled"
      data-testid="epis2-demo-environment-banner"
      sx={{
        borderRadius: 0,
        py: 0.35,
        '@media print': { display: 'none' },
        '& .MuiAlert-message': { width: '100%', textAlign: 'center', fontSize: '0.8125rem' },
      }}
    >
      {copy.demoEnvironmentBanner}
    </Alert>
  );
}
