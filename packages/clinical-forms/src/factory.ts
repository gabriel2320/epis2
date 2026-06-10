import type { ClinicalFormBlueprint, FormField, FormFieldType, FormSection } from './types.js';

type BlueprintInput = Omit<ClinicalFormBlueprint, 'aiAssistMode' | 'approvalRequired'> & {
  aiAssistMode?: 'NONE';
  approvalRequired?: boolean;
};

export type FieldDefinition = {
  required?: boolean;
  options?: readonly string[];
  columnSpan?: number;
  readOnly?: boolean;
  clinicalTextBox?: boolean;
  clinicalTextBoxMode?: 'plain' | 'rich';
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
  requiredOrDef?: boolean | FieldDefinition,
  options?: readonly string[],
): FormField {
  let required = false;
  let opts: readonly string[] | undefined;
  let columnSpan: number | undefined;
  let readOnly: boolean | undefined;
  let clinicalTextBox: boolean | undefined;
  let clinicalTextBoxMode: 'plain' | 'rich' | undefined;

  if (typeof requiredOrDef === 'boolean') {
    required = requiredOrDef;
    opts = options;
  } else if (requiredOrDef !== undefined) {
    required = requiredOrDef.required ?? false;
    opts = requiredOrDef.options ?? options;
    columnSpan = requiredOrDef.columnSpan;
    readOnly = requiredOrDef.readOnly;
    clinicalTextBox = requiredOrDef.clinicalTextBox;
    clinicalTextBoxMode = requiredOrDef.clinicalTextBoxMode;
  }

  const base: FormField = { id, label, type, required };
  const withOpts = opts !== undefined ? { ...base, options: opts } : base;
  const withSpan = columnSpan !== undefined ? { ...withOpts, columnSpan } : withOpts;
  const withReadOnly = readOnly !== undefined ? { ...withSpan, readOnly } : withSpan;
  const withTextBox =
    clinicalTextBox !== undefined ? { ...withReadOnly, clinicalTextBox } : withReadOnly;
  return clinicalTextBoxMode !== undefined ? { ...withTextBox, clinicalTextBoxMode } : withTextBox;
}
