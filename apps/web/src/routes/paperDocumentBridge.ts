import type { ClinicalNavigateFn } from './clinicalNavigate.js';

/** Puentes desde ficha papel → documentos print existentes (MF-PAPER-07). */
export type PaperDocumentBridgeId =
  | 'prescription'
  | 'discharge_summary'
  | 'lab_request'
  | 'medical_certificate'
  | 'imaging_request';

export type PaperDocumentBridgeTarget = {
  id: PaperDocumentBridgeId;
  to:
    | '/espacio/receta/imprimir'
    | '/espacio/epicrisis/imprimir'
    | '/espacio/laboratorio/imprimir'
    | '/espacio/certificado/imprimir'
    | '/espacio/imagenologia/imprimir';
  labelKey:
    | 'actionPrescription'
    | 'navEpicrisis'
    | 'actionLab'
    | 'navDocuments'
    | 'navImaging';
  testId: string;
};

export const PAPER_DOCUMENT_BRIDGES: readonly PaperDocumentBridgeTarget[] = [
  {
    id: 'prescription',
    to: '/espacio/receta/imprimir',
    labelKey: 'actionPrescription',
    testId: 'epis2-paper-bridge-prescription',
  },
  {
    id: 'discharge_summary',
    to: '/espacio/epicrisis/imprimir',
    labelKey: 'navEpicrisis',
    testId: 'epis2-paper-bridge-discharge',
  },
  {
    id: 'lab_request',
    to: '/espacio/laboratorio/imprimir',
    labelKey: 'actionLab',
    testId: 'epis2-paper-bridge-lab',
  },
  {
    id: 'medical_certificate',
    to: '/espacio/certificado/imprimir',
    labelKey: 'navDocuments',
    testId: 'epis2-paper-bridge-certificate',
  },
  {
    id: 'imaging_request',
    to: '/espacio/imagenologia/imprimir',
    labelKey: 'navImaging',
    testId: 'epis2-paper-bridge-imaging',
  },
] as const;

export type PaperPrintSearch = {
  patientId?: string;
  returnChartMode?: 'paper';
  printFormat?: 'letter' | 'a5';
  chartMode?: 'paper';
};

/** Navega a vista print A5/Carta desde ficha papel. */
export function navigatePaperDocumentBridge(
  navigate: ClinicalNavigateFn,
  patientId: string,
  bridgeId: PaperDocumentBridgeId,
): void {
  const bridge = PAPER_DOCUMENT_BRIDGES.find((b) => b.id === bridgeId);
  if (!bridge) return;
  void navigate({
    to: bridge.to,
    search: { patientId, returnChartMode: 'paper' },
  });
}

/** Vuelve a ficha papel desde vista print. */
export function navigateBackToPaperChart(
  navigate: ClinicalNavigateFn,
  patientId: string,
  printFormat: 'letter' | 'a5' = 'letter',
): void {
  void navigate({
    to: '/espacio/ficha',
    search: { patientId, chartMode: 'paper', printFormat },
  });
}

export function parsePaperPrintSearch(search: Record<string, unknown>): PaperPrintSearch {
  const parsed: PaperPrintSearch = {};
  if (typeof search.patientId === 'string' && search.patientId) {
    parsed.patientId = search.patientId;
  }
  if (search.returnChartMode === 'paper') {
    parsed.returnChartMode = 'paper';
  }
  if (search.printFormat === 'letter' || search.printFormat === 'a5') {
    parsed.printFormat = search.printFormat;
  }
  if (search.chartMode === 'paper') {
    parsed.chartMode = 'paper';
  }
  return parsed;
}
