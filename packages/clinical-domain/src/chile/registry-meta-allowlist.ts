/**
 * MF-SH-04 — Allowlist canónica de variableKey Chile (RUT + SNRE + resumen clínico).
 * @see docs/product/EPIS2_CHILE_CLINICAL_MODEL.md §5
 */

/** Claves SNRE / receta (MedicationRequest frontera FHIR). */
export const CHILE_SNRE_REGISTRY_META_KEYS = [
  'rx.medication',
  'rx.dose',
  'rx.quantity',
  'rx.route',
  'rx.frequency',
  'rx.duration',
  'rx.patient_instructions',
  'rx.clinical_notes',
] as const;

/** Claves identificador paciente (RUT / RUN MINSAL). */
export const CHILE_RUT_REGISTRY_META_KEYS = ['patient.rut', 'patient.rut_normalizado'] as const;

/** Claves resumen clínico longitudinal. */
export const CHILE_SUMMARY_REGISTRY_META_KEYS = [
  'summary.active_problems',
  'summary.recent_events',
  'summary.relevant_labs',
  'summary.active_medications',
  'summary.pending_items',
  'summary.clinical_alerts',
] as const;

export type ChileSnreRegistryMetaKey = (typeof CHILE_SNRE_REGISTRY_META_KEYS)[number];
export type ChileRutRegistryMetaKey = (typeof CHILE_RUT_REGISTRY_META_KEYS)[number];
export type ChileSummaryRegistryMetaKey = (typeof CHILE_SUMMARY_REGISTRY_META_KEYS)[number];
export type ChileRegistryMetaKey =
  | ChileSnreRegistryMetaKey
  | ChileRutRegistryMetaKey
  | ChileSummaryRegistryMetaKey;

const KEY_SET = new Set<string>([
  ...CHILE_SNRE_REGISTRY_META_KEYS,
  ...CHILE_RUT_REGISTRY_META_KEYS,
  ...CHILE_SUMMARY_REGISTRY_META_KEYS,
]);

export const CHILE_REGISTRY_META_ALLOWLIST: readonly ChileRegistryMetaKey[] = [
  ...CHILE_SNRE_REGISTRY_META_KEYS,
  ...CHILE_RUT_REGISTRY_META_KEYS,
  ...CHILE_SUMMARY_REGISTRY_META_KEYS,
];

export function isChileRegistryMetaKey(value: string): value is ChileRegistryMetaKey {
  return KEY_SET.has(value);
}
