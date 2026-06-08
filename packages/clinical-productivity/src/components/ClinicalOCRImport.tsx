import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';

export type ClinicalOCRImportProps = {
  onImport?: (text: string) => void;
  testId?: string;
};

/** OCR Fase E — Tesseract.js pendiente; texto preliminar revisable. */
export function ClinicalOCRImport({ onImport, testId = 'epis2-clinical-ocr' }: ClinicalOCRImportProps) {
  return (
    <Stack spacing={1} data-testid={testId}>
      <Typography variant="body2" color="text.secondary">
        {copy.clinicalProductivity.ocrHint}
      </Typography>
      <EpisButton
        appearance="outlined"
        size="small"
        onClick={() => onImport?.(copy.clinicalProductivity.ocrPlaceholder)}
      >
        {copy.clinicalProductivity.ocrImport}
      </EpisButton>
    </Stack>
  );
}
