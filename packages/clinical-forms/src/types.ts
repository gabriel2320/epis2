import type { ClinicalRole } from '@epis2/clinical-domain';
import type { ClinicalIntent } from '@epis2/command-registry';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'date'
  | 'checkbox';

export type FormOutputKind =
  | 'SEARCH'
  | 'READ_ONLY_SUMMARY'
  | 'CLINICAL_NOTE_DRAFT'
  | 'ORDER_DRAFT';

export type FormSection = {
  id: string;
  label: string;
  fieldIds: string[];
  initialVisibility?: 'visible' | 'collapsed';
};

export type FormField = {
  id: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: readonly string[];
  readOnly?: boolean;
  /** Ancho en grid M3 de 12 columnas (escritorio). Por defecto 12. */
  columnSpan?: number;
};

export type FormValidationRule = {
  fieldId: string;
  message: string;
};

export type ClinicalFormBlueprint = {
  blueprintId: string;
  label: string;
  purpose: string;
  intentIds: readonly ClinicalIntent[];
  allowedRoles: readonly ClinicalRole[];
  routePath: string;
  outputKind: FormOutputKind;
  requiresPatient: boolean;
  requiresEncounter: boolean;
  sections: readonly FormSection[];
  fields: readonly FormField[];
  validations: readonly FormValidationRule[];
  /** EPIS2-06: formularios manuales; IA en EPIS2-07 */
  aiAssistMode: 'NONE';
  approvalRequired: boolean;
};

export type FormValidationResult = {
  valid: boolean;
  errors: Array<{ fieldId: string; message: string }>;
};
