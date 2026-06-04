import type {
  ClinicalFormBlueprint,
  FormField,
  FormFieldType,
  FormSection,
} from './types.js';

type BlueprintInput = Omit<ClinicalFormBlueprint, 'aiAssistMode' | 'approvalRequired'> & {
  aiAssistMode?: 'NONE';
  approvalRequired?: boolean;
};

export function defineBlueprint(input: BlueprintInput): ClinicalFormBlueprint {
  return {
    ...input,
    aiAssistMode: 'NONE',
    approvalRequired: input.approvalRequired ?? input.outputKind !== 'SEARCH',
  };
}

export function section(
  id: string,
  label: string,
  fieldIds: string[],
  initialVisibility: FormSection['initialVisibility'] = 'visible',
): FormSection {
  return { id, label, fieldIds, initialVisibility };
}

export function field(
  id: string,
  label: string,
  type: FormFieldType,
  required = false,
  options?: readonly string[],
): FormField {
  const base: FormField = { id, label, type, required };
  if (options !== undefined) {
    return { ...base, options };
  }
  return base;
}
