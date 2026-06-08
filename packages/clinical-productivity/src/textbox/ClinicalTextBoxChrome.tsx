import { copy } from '@epis2/design-system';
import { Chip, EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import type { ClinicalTextOrigin } from '../safety/textOrigin.js';
import type { ClinicalSpellIssue } from './clinicalSpellcheck.js';
import { ClinicalTextBoxMiniToolbar } from './ClinicalTextBoxMiniToolbar.js';

export type ClinicalTextBoxChromeProps = {
  testId: string;
  label: string;
  error?: string;
  disabled?: boolean;
  focused: boolean;
  lastOrigin?: ClinicalTextOrigin;
  hint?: string;
  confirmPending?: string;
  spellIssues: ClinicalSpellIssue[];
  sensitiveTokenVisible: boolean;
  aiBusy?: boolean;
  onConfirmInsert: () => void;
  toolbar: {
    onCopy: () => void;
    onInsertPatient: () => void;
    onInsertMedications: () => void;
    onInsertLabs: () => void;
    onInsertSnippet: (body: string, trigger: string) => void;
    onSlashCommand: (command: string) => void;
    onReformulate: () => void;
    onSoapConvert: () => void;
    onDetectOmissions: () => void;
  };
  input: ReactNode;
};

/** Chrome compartido plain/rich — mini-toolbar, badges, spell hints. */
export function ClinicalTextBoxChrome({
  testId,
  label,
  error,
  disabled = false,
  focused,
  lastOrigin,
  hint,
  confirmPending,
  spellIssues,
  sensitiveTokenVisible,
  aiBusy = false,
  onConfirmInsert,
  toolbar,
  input,
}: ClinicalTextBoxChromeProps) {
  return (
    <Stack spacing={1} data-testid={testId}>
      {focused ? (
        <ClinicalTextBoxMiniToolbar
          disabled={disabled || aiBusy}
          onCopy={toolbar.onCopy}
          onInsertPatient={toolbar.onInsertPatient}
          onInsertMedications={toolbar.onInsertMedications}
          onInsertLabs={toolbar.onInsertLabs}
          onInsertSnippet={toolbar.onInsertSnippet}
          onSlashCommand={toolbar.onSlashCommand}
          onReformulate={toolbar.onReformulate}
          onSoapConvert={toolbar.onSoapConvert}
          onDetectOmissions={toolbar.onDetectOmissions}
          testId={`${testId}-toolbar`}
        />
      ) : null}

      <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
        {label}
      </Typography>

      {lastOrigin?.kind === 'ai_suggestion' ? (
        <Chip
          size="small"
          color="secondary"
          variant="outlined"
          label={copy.clinicalProductivity.textBoxAiBadge}
          data-testid={`${testId}-ai-badge`}
        />
      ) : null}

      {input}

      {error ? (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      ) : null}

      {confirmPending ? (
        <Stack direction="row" spacing={1} alignItems="center" data-testid={`${testId}-confirm`}>
          <Typography variant="caption" color="warning.main">
            {copy.clinicalProductivity.confirmMedication}
          </Typography>
          <EpisButton size="small" appearance="text" onClick={onConfirmInsert}>
            {copy.clinicalProductivity.textBoxConfirmInsert}
          </EpisButton>
        </Stack>
      ) : null}

      {hint ? (
        <Typography variant="caption" color="text.secondary" data-testid={`${testId}-hint`}>
          {hint}
        </Typography>
      ) : null}

      {aiBusy ? (
        <Typography variant="caption" color="text.secondary" data-testid={`${testId}-ai-busy`}>
          {copy.clinicalProductivity.textBoxAiBusy}
        </Typography>
      ) : null}

      {spellIssues.length > 0 ? (
        <Typography variant="caption" color="text.secondary" data-testid={`${testId}-spell`}>
          {copy.clinicalProductivity.spellSuggestions}:{' '}
          {spellIssues
            .map((i) => (i.suggestions[0] ? `${i.token} → ${i.suggestions[0]}` : i.token))
            .join(' · ')}
        </Typography>
      ) : null}

      {sensitiveTokenVisible ? (
        <Typography variant="caption" color="text.secondary">
          {copy.clinicalProductivity.textBoxSensitiveToken}
        </Typography>
      ) : null}
    </Stack>
  );
}
