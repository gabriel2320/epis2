export type {
  ClinicalFormBlueprint,
  FormField,
  FormSection,
  FormValidationResult,
} from './types.js';
export {
  EPIS2_FORM_BLUEPRINTS,
  getBlueprintById,
  getBlueprintByRoutePath,
  assertRegistryInvariants,
} from './registry.js';
export { initialFormValues, validateFormValues, BLUEPRINT_DRAFT_TYPES } from './validate.js';
export { buildBlueprintFormSchema, mapBlueprintZodErrors } from './blueprintFormSchema.js';
export {
  EPIS2_FORM_SCREEN_TREE,
  assertFormScreenTreeInvariants,
  getFormScreenNode,
  resolveFormScreenLayout,
  type FormScreenLayoutKind,
  type FormScreenTreeNode,
} from './formScreenTree.js';
export { defaultSummaryValues } from './blueprints/patient-summary.js';
export {
  CLINICAL_PROSE_BLUEPRINT_IDS,
  blueprintUsesClinicalProse,
  type ClinicalProseBlueprintId,
} from './clinical-prose-blueprints.js';
export {
  CLINICAL_CONTEXT_BLUEPRINT_IDS,
  blueprintSupportsClinicalContext,
  defaultClinicalContextInsertField,
  type ClinicalContextBlueprintId,
} from './clinical-context-blueprints.js';
export { scaffoldBlueprintModule, type ScaffoldBlueprintInput } from './scaffoldBlueprint.js';
export {
  BLUEPRINT_EXPORT_SCHEMA_VERSION,
  blueprintExportFilename,
  parseBlueprintImport,
  serializeBlueprintToJson,
  type BlueprintExportDocument,
  type BlueprintImportResult,
} from './blueprint-io.js';
export {
  EPIS2_M3_FORM_COLUMNS,
  clampColumnSpan,
  resolveFieldColumnSpan,
  validateBlueprintLayout,
} from './layout.js';
export {
  SCROLLSPY_LAYOUT_BLUEPRINT_IDS,
  blueprintUsesScrollspyLayout,
  scrollspySectionLabels,
  type ScrollspyLayoutBlueprintId,
} from './scrollspy-blueprints.js';
export { buildCommandSlotPrefill, hasCommandSlotPrefill } from './command-slot-prefill.js';
export {
  PAPER_MIRROR_VARIABLE_KEYS,
  getPaperMirrorByVariableKey,
  getPaperMirrorForClassicField,
  type PaperMirrorEntry,
} from './paper-mirror/variable-keys.js';
export {
  buildContextClinicalPrefill,
  mergePrefillOnlyEmpty,
  supportsContextClinicalPrefill,
} from './context-clinical-prefill.js';
export {
  PAPER_CHART_DRAFT_TYPE,
  PAPER_CHART_SECTION_IDS,
  PAPER_FIELD_SOURCES,
  applyPaperChartSectionPatch,
  canSignPaperChart,
  confirmAiSuggestion,
  emptyPaperChartDraft,
  insertAiSuggestion,
  mergePaperChartSection,
  paperChartBlueprint,
  paperChartFieldValues,
  paperChartSectionSchema,
  paperChartSignBlockMessage,
  parsePaperChartBody,
  parsePaperChartSectionPatch,
  rejectAiSuggestion,
  type PaperChartDraftBody,
  type PaperChartSectionId,
  type PaperChartSectionPatch,
  type PaperFieldSource,
  type PaperFieldState,
  EPIS2_PAPER_CHART_SECTION_TREE,
  PAPER_CHART_SECTION_LABELS_ES,
  PAPER_CHART_SECTION_ROMAN,
  assertPaperChartSectionTreeInvariants,
  getPaperChartSectionTreeNode,
  type PaperChartSectionTreeNode,
} from './paper-chart/index.js';
