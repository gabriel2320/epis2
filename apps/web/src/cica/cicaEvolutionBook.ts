import type { PatientLongitudinalResponse } from '@epis2/contracts';
import {
  filterClinicalTimeline,
  type TimelineEvent,
} from '../components/chart/timeline/clinicalTimeline.js';

/** Evoluciones ordenadas: más reciente primero (índice 0 = hoy). */
export function listEvolutionEvents(timeline: PatientLongitudinalResponse['timeline']): TimelineEvent[] {
  return filterClinicalTimeline(timeline, 'evolutions').sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}

export function findEvolutionIndex(events: readonly TimelineEvent[], evolutionId?: string): number {
  if (!evolutionId) return 0;
  const idx = events.findIndex((event) => event.id === evolutionId);
  return idx >= 0 ? idx : 0;
}

export function evolutionBookPage(events: readonly TimelineEvent[], index: number) {
  const current = events[index];
  const older = index < events.length - 1 ? events[index + 1] : undefined;
  const newer = index > 0 ? events[index - 1] : undefined;
  return { current, older, newer, index, total: events.length };
}

export function formatEvolutionPageDate(at: string): string {
  return new Date(at).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' });
}
