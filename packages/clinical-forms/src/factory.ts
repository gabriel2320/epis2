import type {
  ClinicalFormBlueprint,
  FormField,
  FormFieldAuditLevel,
  FormFieldPrintMapping,
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
  clinicalTextBox?: boolean;
  clinicalTextBoxMode?: 'plain' | 'rich';
  catalogAutocomplete?: 'medication';
  variableKey?: string;
  fhirPath?: string;
  auditLevel?: FormFieldAuditLevel;
  aiAllowed?: boolean;
  printMapping?: FormFieldPrintMapping;
  searchable?: boolean;
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
  let catalogAutocomplete: 'medication' | undefined;
  let variableKey: string | undefined;
  let fhirPath: string | undefined;
  let auditLevel: FormFieldAuditLevel | undefined;
  let aiAllowed: boolean | undefined;
  let printMapping: FormFieldPrintMapping | undefined;
  let searchable: boolean | undefined;

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
    catalogAutocomplete = requiredOrDef.catalogAutocomplete;
    variableKey = requiredOrDef.variableKey;
    fhirPath = requiredOrDef.fhirPath;
    auditLevel = requiredOrDef.auditLevel;
    aiAllowed = requiredOrDef.aiAllowed;
    printMapping = requiredOrDef.printMapping;
    searchable = requiredOrDef.searchable;
  }

  const base: FormField = { id, label, type, required };
  const withOpts = opts !== undefined ? { ...base, options: opts } : base;
  const withSpan = columnSpan !== undefined ? { ...withOpts, columnSpan } : withOpts;
  const withReadOnly = readOnly !== undefined ? { ...withSpan, readOnly } : withSpan;
  const withTextBox =
    clinicalTextBox !== undefined ? { ...withReadOnly, clinicalTextBox } : withReadOnly;
  const withTextBoxMode =
    clinicalTextBoxMode !== undefined ? { ...withTextBox, clinicalTextBoxMode } : withTextBox;
  let out: FormField = withTextBoxMode;
  if (catalogAutocomplete !== undefined) out = { ...out, catalogAutocomplete };
  if (variableKey !== undefined) out = { ...out, variableKey };
  if (fhirPath !== undefined) out = { ...out, fhirPath };
  if (auditLevel !== undefined) out = { ...out, auditLevel };
  if (aiAllowed !== undefined) out = { ...out, aiAllowed };
  if (printMapping !== undefined) out = { ...out, printMapping };
  if (searchable !== undefined) out = { ...out, searchable };
  return out;
}
