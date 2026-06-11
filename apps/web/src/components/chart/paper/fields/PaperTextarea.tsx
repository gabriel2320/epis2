import { Box, epis2PaperChartTokens } from '@epis2/epis2-ui';

export type PaperTextareaProps = {
  value: string;
  onChange?: ((value: string) => void) | undefined;
  minRows?: number | undefined;
  ariaLabel: string;
  testId?: string | undefined;
  readOnly?: boolean | undefined;
  /** Borrador IA — subrayado punteado (MF-PAPER-03) */
  aiDraft?: boolean | undefined;
};

/** Área clínica tipo máquina de escribir — líneas pautadas (FichaPapel). */
export function PaperTextarea({
  value,
  onChange,
  minRows = 5,
  ariaLabel,
  testId,
  readOnly = false,
  aiDraft = false,
}: PaperTextareaProps) {
  const t = epis2PaperChartTokens;
  const editable = Boolean(onChange) && !readOnly;

  return (
    <Box
      component="textarea"
      className={`epis2-paper-textarea${aiDraft ? ' epis2-paper-ai-draft' : ''}`}
      value={value}
      readOnly={!editable}
      rows={minRows}
      aria-label={ariaLabel}
      data-testid={testId}
      onChange={editable ? (e) => onChange?.(e.target.value) : undefined}
      sx={{
        display: 'block',
        width: '100%',
        minHeight: `calc(var(--epis2-paper-baseline, 6mm) * ${minRows})`,
        border: 0,
        outline: 0,
        resize: 'vertical',
        bgcolor: 'transparent',
        color: t.paperInk,
        fontFamily: t.typography.body,
        fontSize: '12px',
        lineHeight: 'var(--epis2-paper-baseline, 6mm)',
        padding: '2px 4px',
        margin: 0,
        ...(aiDraft
          ? {
              textDecorationLine: 'underline',
              textDecorationStyle: 'dotted',
              textDecorationColor: t.aiDraftUnderline,
              textUnderlineOffset: '2px',
            }
          : {}),
      }}
    />
  );
}
