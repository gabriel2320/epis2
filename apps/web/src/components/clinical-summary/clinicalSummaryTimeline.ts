import type { PatientLongitudinalResponse } from '@epis2/contracts';

export type TimelineEventKind = PatientLongitudinalResponse['timeline'][number]['kind'];

export type TimelineKindFilter = TimelineEventKind | 'all';

export const CLINICAL_SUMMARY_TIMELINE_KINDS = [
  'encounter',
  'note',
  'observation',
  'document',
  'draft',
] as const satisfies readonly TimelineEventKind[];

export function filterTimelineByKind<T extends { kind: TimelineEventKind }>(
  events: readonly T[],
  filter: TimelineKindFilter,
): T[] {
  if (filter === 'all') return [...events];
  return events.filter((ev) => ev.kind === filter);
}

export function formatTimelinePreviewLines(
  events: readonly PatientLongitudinalResponse['timeline'][number][],
  max = 3,
): string {
  const items = events.slice(0, max);
  if (items.length === 0) return '';
  return items
    .map(
      (e) =>
        `${new Date(e.at).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })} — ${e.title}`,
    )
    .join('\n');
}
