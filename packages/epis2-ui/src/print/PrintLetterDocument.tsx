import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PrintDemoWatermark } from './PrintDemoWatermark.js';

export type PrintLetterDocumentProps = {
  title: string;
  /** Identificación esencial del paciente + contexto (norma §8.1). */
  subtitle?: string;
  /** Estado documental visible (BORRADOR / FIRMADO / COPIA — norma §14). */
  status?: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
};

/** Vista documental Carta vertical — documentos longitudinales (norma §2.1/§19). */
export function PrintLetterDocument({
  title,
  subtitle,
  status,
  children,
  footer,
  testId = 'epis2-print-letter-document',
}: PrintLetterDocumentProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        position: 'relative',
        width: '216mm',
        minHeight: '279mm',
        mx: 'auto',
        my: 2,
        px: '18mm',
        py: '16mm',
        bgcolor: 'background.paper',
        color: 'text.primary',
        fontFamily: '"Times New Roman", Times, serif',
        border: 1,
        borderColor: 'divider',
        '@media print': {
          border: 'none',
          my: 0,
          width: '216mm',
          minHeight: '279mm',
        },
      }}
    >
      <PrintDemoWatermark />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 2,
          mb: subtitle ? 0.5 : 2,
        }}
      >
        <Typography component="h1" variant="h6" sx={{ fontWeight: 700, fontSize: '16pt' }}>
          {title}
        </Typography>
        {status ? (
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: '10pt', letterSpacing: '0.06em' }}
            data-testid="epis2-print-document-status"
          >
            {status}
          </Typography>
        ) : null}
      </Box>
      {subtitle ? (
        <Typography variant="body2" sx={{ mb: 2, fontSize: '10pt' }}>
          {subtitle}
        </Typography>
      ) : null}
      <Box sx={{ fontSize: '10.5pt', lineHeight: 1.4 }}>{children}</Box>
      {footer ? (
        <Box sx={{ mt: 5, pt: 2, borderTop: 1, borderColor: 'divider', fontSize: '8.5pt' }}>
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}

export type PrintSectionProps = {
  title: string;
  children: ReactNode;
};

/** Sección documental plana — sin tarjetas ni superficies M3 (norma §11). */
export function PrintSection({ title, children }: PrintSectionProps) {
  return (
    <Box sx={{ mb: 2.5, breakInside: 'avoid' }} data-testid={`epis2-print-section-${title}`}>
      <Typography
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: '12pt',
          mb: 1,
          pb: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
