import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PrintDemoWatermark } from './PrintDemoWatermark.js';

export type PrintA5DocumentProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
};

/** Vista documental A5 — separada de UI interactiva M3 (norma §2.3). */
export function PrintA5Document({
  title,
  subtitle,
  children,
  footer,
  testId = 'epis2-print-a5-document',
}: PrintA5DocumentProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        position: 'relative',
        width: '148mm',
        minHeight: '210mm',
        mx: 'auto',
        my: 2,
        p: '12mm',
        bgcolor: 'background.paper',
        color: 'text.primary',
        fontFamily: '"Times New Roman", Times, serif',
        border: 1,
        borderColor: 'divider',
        '@media print': {
          border: 'none',
          my: 0,
          width: '148mm',
          minHeight: '210mm',
        },
      }}
    >
      <PrintDemoWatermark />
      <Typography
        component="h1"
        variant="h6"
        sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 2, fontSize: '14pt' }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" sx={{ mb: 2, fontSize: '10pt' }}>
          {subtitle}
        </Typography>
      ) : null}
      <Box sx={{ fontSize: '11pt', lineHeight: 1.45 }}>{children}</Box>
      {footer ? (
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', fontSize: '9pt' }}>
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}

export type PrintFieldProps = {
  label: string;
  value?: string;
};

export function PrintField({ label, value }: PrintFieldProps) {
  if (!value?.trim()) return null;
  return (
    <Box sx={{ mb: 1.5 }} data-testid={`epis2-print-field-${label}`}>
      <Typography component="span" sx={{ fontWeight: 700, display: 'block', fontSize: '10pt' }}>
        {label}
      </Typography>
      <Typography component="span" sx={{ whiteSpace: 'pre-wrap' }}>
        {value}
      </Typography>
    </Box>
  );
}
