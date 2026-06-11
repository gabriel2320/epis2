/** Vistas agenda clínica papel — ADR-003. */
export type PaperPlannerView = 'day' | 'week' | 'month';

/** Superficie dentro de chartMode=paper. */
export type PaperPlannerSurface = 'document' | 'planner';

export type PaperPlannerEventKind =
  | 'encounter'
  | 'evolution'
  | 'lab'
  | 'imaging'
  | 'procedure'
  | 'admin';

export type PaperPlannerEvent = {
  id: string;
  time: string;
  durationMin: number;
  title: string;
  kind: PaperPlannerEventKind;
  location?: string;
  pending?: boolean;
};

export type PaperPlannerPendingItem = {
  id: string;
  label: string;
  dueBy?: string;
  priority: 'routine' | 'urgent';
};

export const PAPER_PLANNER_VIEWS: readonly PaperPlannerView[] = ['day', 'week', 'month'];

export const PAPER_PLANNER_SURFACES: readonly PaperPlannerSurface[] = ['document', 'planner'];

export function isPaperPlannerView(value: string): value is PaperPlannerView {
  return (PAPER_PLANNER_VIEWS as readonly string[]).includes(value);
}

export function isPaperPlannerSurface(value: string): value is PaperPlannerSurface {
  return (PAPER_PLANNER_SURFACES as readonly string[]).includes(value);
}
