import type { PaperChartSectionId } from './paper-chart/schema.js';

/** IDs nav lateral ficha electrónica — alineado a `TraditionalSectionNav`. */
export const TRADITIONAL_SECTION_NAV_IDS = [
  'navSummary',
  'navAdmin',
  'navAnamnesis',
  'navAntecedents',
  'navAllergies',
  'navPhysicalExam',
  'navDiagnoses',
  'navOrders',
  'navMeds',
  'navEvolution',
  'navLabs',
  'navImaging',
  'navConsults',
  'navDocuments',
  'navEpicrisis',
  'navProcedures',
  'navAudit',
] as const;

export type TraditionalSectionNavId = (typeof TRADITIONAL_SECTION_NAV_IDS)[number];

/** Enlace espejo papel ↔ electrónica (PROG-FICHA-NORM MF-NORM-01). */
export type ChartSectionMirrorBinding = {
  traditionalSectionId: TraditionalSectionNavId;
  /** null = solo electrónica (agregador / auditoría). */
  paperSectionId: PaperChartSectionId | null;
  /** Identificador estable para mirror SoT y FHIR futuro. */
  fieldId: string;
};

/** Mapa canónico sección nav → sección papel. */
export const CHART_SECTION_MIRROR_BINDINGS: readonly ChartSectionMirrorBinding[] = [
  { traditionalSectionId: 'navSummary', paperSectionId: null, fieldId: 'chart.summary' },
  { traditionalSectionId: 'navAdmin', paperSectionId: 'cover', fieldId: 'chart.admin' },
  { traditionalSectionId: 'navAnamnesis', paperSectionId: 'anamnesis', fieldId: 'chart.anamnesis' },
  { traditionalSectionId: 'navAntecedents', paperSectionId: 'cover', fieldId: 'chart.antecedents' },
  { traditionalSectionId: 'navAllergies', paperSectionId: 'cover', fieldId: 'chart.allergies' },
  {
    traditionalSectionId: 'navPhysicalExam',
    paperSectionId: 'physicalExam',
    fieldId: 'chart.physical_exam',
  },
  { traditionalSectionId: 'navDiagnoses', paperSectionId: 'soap', fieldId: 'chart.diagnoses' },
  { traditionalSectionId: 'navOrders', paperSectionId: 'orders', fieldId: 'chart.orders' },
  { traditionalSectionId: 'navMeds', paperSectionId: 'orders', fieldId: 'chart.medications' },
  { traditionalSectionId: 'navEvolution', paperSectionId: 'soap', fieldId: 'chart.evolution' },
  { traditionalSectionId: 'navLabs', paperSectionId: 'labs', fieldId: 'chart.labs' },
  { traditionalSectionId: 'navImaging', paperSectionId: 'imaging', fieldId: 'chart.imaging' },
  { traditionalSectionId: 'navConsults', paperSectionId: 'consults', fieldId: 'chart.consults' },
  { traditionalSectionId: 'navDocuments', paperSectionId: 'consent', fieldId: 'chart.documents' },
  { traditionalSectionId: 'navEpicrisis', paperSectionId: 'discharge', fieldId: 'chart.discharge' },
  {
    traditionalSectionId: 'navProcedures',
    paperSectionId: 'procedures',
    fieldId: 'chart.procedures',
  },
  { traditionalSectionId: 'navAudit', paperSectionId: null, fieldId: 'chart.audit' },
] as const;

/** Batch 1 espejo MF-NORM-09 — alergias…evolución. */
export const CHART_MIRROR_BATCH1_NAV_IDS = [
  'navAllergies',
  'navMeds',
  'navOrders',
  'navLabs',
  'navEvolution',
] as const;

export type ChartMirrorBatch1NavId = (typeof CHART_MIRROR_BATCH1_NAV_IDS)[number];

export function isChartMirrorBatch1Section(
  sectionId: TraditionalSectionNavId,
): sectionId is ChartMirrorBatch1NavId {
  return (CHART_MIRROR_BATCH1_NAV_IDS as readonly string[]).includes(sectionId);
}

function assertChartMirrorBatchBindings(
  navIds: readonly TraditionalSectionNavId[],
  batchLabel: string,
): string[] {
  const errors: string[] = [];
  for (const navId of navIds) {
    const binding = getMirrorBindingForTraditionalSection(navId);
    if (!binding) {
      errors.push(`${batchLabel} sin binding: ${navId}`);
      continue;
    }
    if (binding.paperSectionId === null) {
      errors.push(`${batchLabel} ${navId} debe enlazar sección papel`);
    }
    if (!binding.fieldId.startsWith('chart.')) {
      errors.push(`${batchLabel} ${navId} fieldId inválido`);
    }
  }
  return errors;
}

export function assertChartMirrorBatch1Bindings(): string[] {
  return assertChartMirrorBatchBindings(CHART_MIRROR_BATCH1_NAV_IDS, 'batch1');
}

/** Batch 2 espejo MF-NORM-10 — anamnesis…interconsulta. */
export const CHART_MIRROR_BATCH2_NAV_IDS = [
  'navAnamnesis',
  'navPhysicalExam',
  'navDiagnoses',
  'navImaging',
  'navConsults',
] as const;

export type ChartMirrorBatch2NavId = (typeof CHART_MIRROR_BATCH2_NAV_IDS)[number];

export function isChartMirrorBatch2Section(
  sectionId: TraditionalSectionNavId,
): sectionId is ChartMirrorBatch2NavId {
  return (CHART_MIRROR_BATCH2_NAV_IDS as readonly string[]).includes(sectionId);
}

export function assertChartMirrorBatch2Bindings(): string[] {
  return assertChartMirrorBatchBindings(CHART_MIRROR_BATCH2_NAV_IDS, 'batch2');
}

export function isChartMirrorBatchSection(
  sectionId: TraditionalSectionNavId,
): sectionId is ChartMirrorBatch1NavId | ChartMirrorBatch2NavId {
  return isChartMirrorBatch1Section(sectionId) || isChartMirrorBatch2Section(sectionId);
}

export function getMirrorBindingForTraditionalSection(
  sectionId: TraditionalSectionNavId,
): ChartSectionMirrorBinding | undefined {
  return CHART_SECTION_MIRROR_BINDINGS.find((b) => b.traditionalSectionId === sectionId);
}

export function getMirrorBindingForPaperSection(
  paperSectionId: PaperChartSectionId,
): readonly ChartSectionMirrorBinding[] {
  return CHART_SECTION_MIRROR_BINDINGS.filter((b) => b.paperSectionId === paperSectionId);
}

export function assertChartSectionMirrorInvariants(): string[] {
  const errors: string[] = [];
  if (CHART_SECTION_MIRROR_BINDINGS.length !== TRADITIONAL_SECTION_NAV_IDS.length) {
    errors.push('CHART_SECTION_MIRROR_BINDINGS desincronizado con TRADITIONAL_SECTION_NAV_IDS');
  }
  const seen = new Set<string>();
  for (const b of CHART_SECTION_MIRROR_BINDINGS) {
    if (seen.has(b.traditionalSectionId)) {
      errors.push(`traditionalSectionId duplicado: ${b.traditionalSectionId}`);
    }
    seen.add(b.traditionalSectionId);
    if (!TRADITIONAL_SECTION_NAV_IDS.includes(b.traditionalSectionId)) {
      errors.push(`nav desconocido: ${b.traditionalSectionId}`);
    }
  }
  return errors;
}
