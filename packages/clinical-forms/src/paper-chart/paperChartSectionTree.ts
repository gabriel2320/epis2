import { PAPER_CHART_SECTION_IDS, type PaperChartSectionId } from './schema.js';

/** Numeración romana I–XIV — orden canónico ficha papel. */
export const PAPER_CHART_SECTION_ROMAN = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
] as const;

/** Etiquetas cortas ES — sincronizar con `copy.chartModes.paperSections` en design-system. */
export const PAPER_CHART_SECTION_LABELS_ES: Record<PaperChartSectionId, string> = {
  cover: 'Carátula',
  anamnesis: 'Anamnesis',
  physicalExam: 'Examen físico',
  orders: 'Indicaciones',
  soap: 'Evolución SOAP',
  labs: 'Laboratorio',
  discharge: 'Epicrisis',
  nursing: 'Enfermería',
  fluidBalance: 'Balance hídrico',
  consults: 'Interconsultas',
  procedures: 'Procedimientos',
  imaging: 'Imágenes',
  consent: 'Consentimiento',
  socialWork: 'Trabajo social',
};

export type PaperChartSectionTreeNode = {
  sectionId: PaperChartSectionId;
  roman: (typeof PAPER_CHART_SECTION_ROMAN)[number];
  index: number;
  labelEs: string;
  navLabelEs: string;
};

/** Árbol canónico secciones ficha papel — derivado de schema SoT. */
export const EPIS2_PAPER_CHART_SECTION_TREE: readonly PaperChartSectionTreeNode[] =
  PAPER_CHART_SECTION_IDS.map((sectionId, i) => {
    const roman = PAPER_CHART_SECTION_ROMAN[i];
    if (!roman) {
      throw new Error(`PAPER_CHART_SECTION_ROMAN desincronizado en índice ${i}`);
    }
    const labelEs = PAPER_CHART_SECTION_LABELS_ES[sectionId];
    return {
      sectionId,
      roman,
      index: i + 1,
      labelEs,
      navLabelEs: `${roman}. ${labelEs}`,
    };
  });

export function getPaperChartSectionTreeNode(
  sectionId: PaperChartSectionId,
): PaperChartSectionTreeNode | undefined {
  return EPIS2_PAPER_CHART_SECTION_TREE.find((n) => n.sectionId === sectionId);
}

export function assertPaperChartSectionTreeInvariants(): string[] {
  const errors: string[] = [];
  if (EPIS2_PAPER_CHART_SECTION_TREE.length !== PAPER_CHART_SECTION_IDS.length) {
    errors.push('paperChartSectionTree desincronizado con PAPER_CHART_SECTION_IDS');
  }
  if (PAPER_CHART_SECTION_ROMAN.length !== PAPER_CHART_SECTION_IDS.length) {
    errors.push('PAPER_CHART_SECTION_ROMAN desincronizado con PAPER_CHART_SECTION_IDS');
  }
  for (const node of EPIS2_PAPER_CHART_SECTION_TREE) {
    if (!PAPER_CHART_SECTION_LABELS_ES[node.sectionId]) {
      errors.push(`Falta label ES para sección ${node.sectionId}`);
    }
  }
  return errors;
}
