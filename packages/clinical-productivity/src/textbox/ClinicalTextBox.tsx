import { copy } from '@epis2/design-system';
import { Chip, EpisButton, EpisTextField, Stack, Typography } from '@epis2/epis2-ui';
import { createTextOrigin } from '../safety/textOrigin.js';
import type { ClinicalTextOrigin } from '../safety/textOrigin.js';
import { ClinicalTextBoxChrome } from './ClinicalTextBoxChrome.js';
import { ClinicalTextBoxMiniToolbar } from './ClinicalTextBoxMiniToolbar.js';
import { ClinicalTextBoxRichEditor } from './ClinicalTextBoxRichEditor.js';
import type { ClinicalSpellIssue, LanguageToolAdapter } from './clinicalSpellcheck.js';
import type { ClinicalTextBoxAiAssistHandler } from './useClinicalTextBoxState.js';
import { useClinicalTextBoxState } from './useClinicalTextBoxState.js';

export type ClinicalTextBoxMode = 'plain' | 'rich';

export type ClinicalTextBoxPatientContext = {
  displayName?: string;
  activeMedications?: readonly string[];
  recentLabs?: readonly string[];
  structuredSummary?: Readonly<Record<string, string>>;
};

export type ClinicalTextBoxChangeMeta = {
  origin: ClinicalTextOrigin;
  aiSuggestion?: boolean;
  pendingConfirmation?: 'medication' | 'dose' | 'unit' | 'allergy';
};

export type ClinicalTextBoxProps = {
  label: string;
  value: string;
  onChange: (value: string, meta?: ClinicalTextBoxChangeMeta) => void;
  error?: string;
  disabled?: boolean;
  minRows?: number;
  mode?: ClinicalTextBoxMode;
  patientContext?: ClinicalTextBoxPatientContext;
  spellcheckAdapter?: LanguageToolAdapter;
  onRequestAiAssist?: ClinicalTextBoxAiAssistHandler;
  testId?: string;
};

function ClinicalTextBoxMeta({
  testId,
  lastOrigin,
  hint,
  confirmPending,
  spellIssues,
  sensitiveTokenVisible,
  aiBusy,
  onConfirmInsert,
}: {
  testId: string;
  lastOrigin?: ClinicalTextOrigin;
  hint?: string;
  confirmPending?: string;
  spellIssues: ClinicalSpellIssue[];
  sensitiveTokenVisible: boolean;
  aiBusy: boolean;
  onConfirmInsert: () => void;
}) {
  return (
    <Stack spacing={1}>
      {lastOrigin?.kind === 'ai_suggestion' ? (
        <Chip
          size="small"
          color="secondary"
          variant="outlined"
          label={copy.clinicalProductivity.textBoxAiBadge}
          data-testid={`${testId}-ai-badge`}
        />
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

/** MF-CLINICAL-TEXTBOX-TOOLS — caja clínica MD3 con mini-toolbar y trazabilidad. */
export function ClinicalTextBox({
  label,
  value,
  onChange,
  error,
  disabled = false,
  minRows = 6,
  mode = 'plain',
  patientContext,
  spellcheckAdapter,
  onRequestAiAssist,
  testId = 'epis2-clinical-textbox',
}: ClinicalTextBoxProps) {
  const state = useClinicalTextBoxState({
    label,
    value,
    onChange,
    disabled,
    minRows,
    mode,
    ...(error ? { error } : {}),
    ...(patientContext ? { patientContext } : {}),
    ...(spellcheckAdapter ? { spellcheckAdapter } : {}),
    ...(onRequestAiAssist ? { onRequestAiAssist } : {}),
    testId,
  });

  const toolbar = {
    onCopy: () => void state.copyFragment(),
    onInsertPatient: () => state.insertBlock(state.buildPatientInsert(), 'Paciente'),
    onInsertMedications: () =>
      state.insertBlock(state.buildMedicationInsert(), 'Medicamentos', true),
    onInsertLabs: () => state.insertBlock(state.buildLabsInsert(), 'Exámenes', true),
    onInsertSnippet: state.onInsertSnippet,
    onSlashCommand: state.onSlashCommand,
    onReformulate: state.onReformulate,
    onSoapConvert: state.onSoapConvert,
    onDetectOmissions: state.onDetectOmissions,
  };

  const plainInput = (
    <div onPaste={state.handlePaste} data-testid={`${testId}-paste-zone`}>
      <EpisTextField
        inputRef={state.inputRef}
        label={label}
        value={value}
        onChange={(event) => state.handlePlainInput(event.target.value)}
        onFocus={() => state.setFocused(true)}
        onBlur={state.handleBlur}
        multiline
        minRows={minRows}
        fullWidth
        disabled={disabled}
        error={Boolean(error)}
        helperText={error ?? ' '}
        data-testid={`${testId}-input`}
      />
    </div>
  );

  const richInput = (
    <ClinicalTextBoxRichEditor
      value={value}
      disabled={disabled}
      minRows={minRows}
      testId={`${testId}-rich`}
      onFocus={() => state.setFocused(true)}
      onBlur={state.handleBlur}
      onPlainTextChange={(next) => {
        state.emitChange(next, createTextOrigin('manual', 'Teclado'));
      }}
      onPastePlain={state.pastePlainAtCursor}
      onCopySelection={(selection) => void state.copyFragment(selection)}
    />
  );

  if (mode === 'plain') {
    return (
      <Stack spacing={1} data-testid={testId}>
        {state.focused ? (
          <ClinicalTextBoxMiniToolbar
            disabled={disabled || state.aiBusy}
            {...toolbar}
            testId={`${testId}-toolbar`}
          />
        ) : null}
        {plainInput}
        <ClinicalTextBoxMeta
          testId={testId}
          {...(state.lastOrigin ? { lastOrigin: state.lastOrigin } : {})}
          {...(state.hint ? { hint: state.hint } : {})}
          {...(state.confirmPending ? { confirmPending: state.confirmPending } : {})}
          spellIssues={state.spellIssues}
          sensitiveTokenVisible={state.sensitiveTokenVisible}
          aiBusy={state.aiBusy}
          onConfirmInsert={state.confirmPendingInsert}
        />
      </Stack>
    );
  }

  return (
    <ClinicalTextBoxChrome
      testId={testId}
      label={label}
      {...(error ? { error } : {})}
      disabled={disabled}
      focused={state.focused}
      {...(state.lastOrigin ? { lastOrigin: state.lastOrigin } : {})}
      {...(state.hint ? { hint: state.hint } : {})}
      {...(state.confirmPending ? { confirmPending: state.confirmPending } : {})}
      spellIssues={state.spellIssues}
      sensitiveTokenVisible={state.sensitiveTokenVisible}
      aiBusy={state.aiBusy}
      onConfirmInsert={state.confirmPendingInsert}
      toolbar={toolbar}
      input={richInput}
    />
  );
}
