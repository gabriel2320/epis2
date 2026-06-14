import type { ClinicalRole } from '@epis2/clinical-domain';
import type { ClinicalIntent } from '@epis2/command-registry';

export type FormFieldType = 'text' | 'textarea' | 'select' | 'date' | 'checkbox';

export type FormFieldAuditLevel = 'low' | 'clinical' | 'critical' | 'legal';

export type FormFieldPrintMapping = {
  chartMode?: 'traditional' | 'paper';
  sectionId?: string;
  slot?: string;
};

export type FormOutputKind = 'SEARCH' | 'READ_ONLY_SUMMARY' | 'CLINICAL_NOTE_DRAFT' | 'ORDER_DRAFT';

/** MF-DI-07 — condiciones para campos de plantilla viva. */
export type LiveTemplateCondition = 'requires_dm2' | 'requires_ckd' | 'requires_insulin';

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
  /** MF-CLINICAL-TEXTBOX-TOOLS — caja con snippets, corrector y mini-toolbar. */
  clinicalTextBox?: boolean;
  /** Modo del ClinicalTextBox cuando clinicalTextBox=true. */
  clinicalTextBoxMode?: 'plain' | 'rich';
  /**
   * MF-184 — campo `text` con autocomplete alimentado por un catálogo clínico
   * promovido (clinical_catalog_staging). El valor guardado sigue siendo string.
   */
  catalogAutocomplete?: 'medication';
  /** MF-REGISTRY-META — clave estable EMR / papel / FHIR / print. */
  variableKey?: string;
  fhirPath?: string;
  auditLevel?: FormFieldAuditLevel;
  aiAllowed?: boolean;
  printMapping?: FormFieldPrintMapping;
  searchable?: boolean;
  /** MF-DI-07 — visible solo si todas las condiciones se cumplen. */
  liveWhen?: readonly LiveTemplateCondition[];
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
