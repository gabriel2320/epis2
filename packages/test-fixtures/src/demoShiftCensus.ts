/** Presentación censo narrativo — PROG-UX-LAB MF-UXLAB-01 (fixtures determinísticos). */

export type DemoCensusPrimaryAction =
  | 'create_evolution'
  | 'continue_evolution'
  | 'review_draft'
  | 'open_chart';

export type DemoCensusDraftState = 'none' | 'draft' | 'ready_for_review';

export type DemoCensusVisualRisk = 'normal' | 'warning' | 'critical';

export type DemoShiftCensusPresentation = {
  demoCaseCode: string;
  pendingLabelEs: string;
  lastEventEs: string;
  draftState: DemoCensusDraftState;
  visualRisk: DemoCensusVisualRisk;
  primaryAction: DemoCensusPrimaryAction;
  primaryActionLabelEs: string;
};

export const DEMO_SHIFT_CENSUS: readonly DemoShiftCensusPresentation[] = [
  {
    demoCaseCode: 'DEMO-001',
    pendingLabelEs: 'Evolución pendiente',
    lastEventEs: 'Hace 18 h — sin evolución del turno (demo)',
    draftState: 'none',
    visualRisk: 'warning',
    primaryAction: 'create_evolution',
    primaryActionLabelEs: 'Crear evolución',
  },
  {
    demoCaseCode: 'DEMO-002',
    pendingLabelEs: 'Control metabólico',
    lastEventEs: 'Glicemia capilar 142 mg/dL — hace 4 h (demo)',
    draftState: 'none',
    visualRisk: 'normal',
    primaryAction: 'open_chart',
    primaryActionLabelEs: 'Abrir ficha',
  },
  {
    demoCaseCode: 'DEMO-003',
    pendingLabelEs: 'Borrador por aprobar',
    lastEventEs: 'Nota de evolución en revisión (demo)',
    draftState: 'ready_for_review',
    visualRisk: 'normal',
    primaryAction: 'review_draft',
    primaryActionLabelEs: 'Revisar borrador',
  },
  {
    demoCaseCode: 'DEMO-004',
    pendingLabelEs: 'Evolución postoperatorio',
    lastEventEs: 'Postoperatorio día 2 — hace 6 h (demo)',
    draftState: 'draft',
    visualRisk: 'warning',
    primaryAction: 'continue_evolution',
    primaryActionLabelEs: 'Continuar evolución',
  },
  {
    demoCaseCode: 'DEMO-005',
    pendingLabelEs: 'Laboratorio simulado reciente',
    lastEventEs: 'Hemocultivos pendientes de revisión (demo)',
    draftState: 'none',
    visualRisk: 'critical',
    primaryAction: 'open_chart',
    primaryActionLabelEs: 'Abrir ficha',
  },
] as const;

export function getDemoShiftCensusPresentation(
  demoCaseCode: string | undefined,
): DemoShiftCensusPresentation | undefined {
  if (!demoCaseCode) return undefined;
  return DEMO_SHIFT_CENSUS.find((row) => row.demoCaseCode === demoCaseCode);
}

export function listDemoShiftCensusPresentations(): readonly DemoShiftCensusPresentation[] {
  return DEMO_SHIFT_CENSUS;
}

export function assertDemoShiftCensusInvariants(): string[] {
  const errors: string[] = [];
  if (DEMO_SHIFT_CENSUS.length !== 5) {
    errors.push('Se requieren exactamente 5 filas de censo shift');
  }
  const codes = new Set<string>();
  for (const row of DEMO_SHIFT_CENSUS) {
    if (codes.has(row.demoCaseCode)) {
      errors.push(`Código duplicado: ${row.demoCaseCode}`);
    }
    codes.add(row.demoCaseCode);
    if (!/^DEMO-00[1-5]$/.test(row.demoCaseCode)) {
      errors.push(`Código demo inválido: ${row.demoCaseCode}`);
    }
    if (!row.primaryActionLabelEs.trim()) {
      errors.push(`Acción primaria vacía: ${row.demoCaseCode}`);
    }
  }
  return errors;
}
