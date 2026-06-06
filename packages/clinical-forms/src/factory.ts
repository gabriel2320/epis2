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

export type FieldDefinition = {
  required?: boolean;
  options?: readonly string[];
  columnSpan?: number;
  readOnly?: boolean;
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

  if (typeof requiredOrDef === 'boolean') {
    required = requiredOrDef;
    opts = options;
  } else if (requiredOrDef !== undefined) {
    required = requiredOrDef.required ?? false;
    opts = requiredOrDef.options ?? options;
    columnSpan = requiredOrDef.columnSpan;
    readOnly = requiredOrDef.readOnly;
  }

  const base: FormField = { id, label, type, required };
  const withOpts = opts !== undefined ? { ...base, options: opts } : base;
  const withSpan = columnSpan !== undefined ? { ...withOpts, columnSpan } : withOpts;
  return readOnly !== undefined ? { ...withSpan, readOnly } : withSpan;
}
