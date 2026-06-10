import type { FormField } from '@epis2/clinical-forms';
import {
  ClinicalTextBox,
  type ClinicalTextBoxChangeMeta,
  type ClinicalTextBoxMode,
  type ClinicalTextBoxPatientContext,
  type ClinicalTextboxAiAction,
  type LanguageToolAdapter,
} from '@epis2/clinical-productivity';
import {
  episClinicalSpellcheckAdapter,
  requestClinicalTextboxAiAssist,
} from './clinicalTextBoxAssist.js';

export function renderClinicalTextBoxField(
  field: FormField,
  value: string,
  onChange: (value: string, meta?: ClinicalTextBoxChangeMeta) => void,
  opts?: {
    error?: string | undefined;
    patientContext?: ClinicalTextBoxPatientContext | undefined;
    patientId?: string | undefined;
    aiAvailable?: boolean | undefined;
    spellcheckAdapter?: LanguageToolAdapter | undefined;
  },
) {
  if (!field.clinicalTextBox || field.type !== 'textarea' || field.readOnly) return null;
  const mode: ClinicalTextBoxMode = field.clinicalTextBoxMode ?? 'plain';
  return (
    <ClinicalTextBox
      label={field.label}
      value={value}
      mode={mode}
      onChange={(next, meta) => onChange(next, meta)}
      spellcheckAdapter={opts?.spellcheckAdapter ?? episClinicalSpellcheckAdapter}
      {...(opts?.aiAvailable
        ? {
            onRequestAiAssist: (action: ClinicalTextboxAiAction, text: string) =>
              requestClinicalTextboxAiAssist(action, text, opts?.patientId),
          }
        : {})}
      {...(opts?.error ? { error: opts.error } : {})}
      {...(opts?.patientContext ? { patientContext: opts.patientContext } : {})}
      testId={`epis2-field-${field.id}`}
    />
  );
}

export function buildClinicalTextBoxPatientContext(input: {
  displayName?: string | undefined;
  summaryFields?: Record<string, string> | undefined;
  activeMedications?: readonly string[] | undefined;
  recentLabs?: readonly string[] | undefined;
}): ClinicalTextBoxPatientContext {
  return {
    ...(input.displayName ? { displayName: input.displayName } : {}),
    ...(input.summaryFields ? { structuredSummary: input.summaryFields } : {}),
    ...(input.activeMedications ? { activeMedications: input.activeMedications } : {}),
    ...(input.recentLabs ? { recentLabs: input.recentLabs } : {}),
  };
}
