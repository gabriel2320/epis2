import type { PatientLongitudinalResponse } from '@epis2/contracts';

export type TimelineEvent = PatientLongitudinalResponse['timeline'][number];

/** MF-DI-08 — filtros clínicos de timeline (no confundir con kind crudo). */
export type ClinicalTimelineFilter =
  | 'all'
  | 'labs'
  | 'signed'
  | 'hospitalizations'
  | 'evolutions'
  | 'documents';

export const CLINICAL_TIMELINE_FILTERS = [
  'all',
  'labs',
  'signed',
  'hospitalizations',
  'evolutions',
  'documents',
] as const satisfies readonly ClinicalTimelineFilter[];

export const CLINICAL_TIMELINE_FILTER_LABELS_ES: Record<ClinicalTimelineFilter, string> = {
  all: 'Todos',
  labs: 'Laboratorio',
  signed: 'Firmados',
  hospitalizations: 'Hospitalizaciones',
  evolutions: 'Evoluciones',
  documents: 'Documentos',
};

export type TimelinePeriodBucket = 'today' | 'last3Months' | 'lastYear' | 'older';

export const TIMELINE_PERIOD_LABELS_ES: Record<TimelinePeriodBucket, string> = {
  today: 'Hoy',
  last3Months: 'Hace 3 meses',
  lastYear: 'Hace 1 año',
  older: 'Anterior',
};

const MS_DAY = 86_400_000;

function isEvolutionEvent(event: TimelineEvent): boolean {
  if (event.kind === 'draft') {
    return /evolution_note/i.test(event.detail ?? '');
  }
  if (event.kind === 'note') {
    const detail = event.detail ?? '';
    if (!detail) return true;
    return /evolution/i.test(detail);
  }
  return false;
}

export function matchesClinicalTimelineFilter(
  event: TimelineEvent,
  filter: ClinicalTimelineFilter,
): boolean {
  if (filter === 'all') return true;
  if (filter === 'labs') return event.kind === 'observation';
  if (filter === 'signed') return event.kind === 'note';
  if (filter === 'hospitalizations') return event.kind === 'encounter';
  if (filter === 'evolutions') return isEvolutionEvent(event);
  if (filter === 'documents') return event.kind === 'document';
  return false;
}

export function filterClinicalTimeline(
  events: readonly TimelineEvent[],
  filter: ClinicalTimelineFilter,
): TimelineEvent[] {
  return events.filter((event) => matchesClinicalTimelineFilter(event, filter));
}

export function resolveTimelinePeriodBucket(atIso: string, now = new Date()): TimelinePeriodBucket {
  const at = new Date(atIso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfAtDay = new Date(at.getFullYear(), at.getMonth(), at.getDate());
  if (startOfAtDay.getTime() === startOfToday.getTime()) return 'today';
  const diffDays = (startOfToday.getTime() - startOfAtDay.getTime()) / MS_DAY;
  if (diffDays <= 92) return 'last3Months';
  if (diffDays <= 366) return 'lastYear';
  return 'older';
}

export type GroupedClinicalTimeline = {
  bucket: TimelinePeriodBucket;
  label: string;
  events: TimelineEvent[];
};

export function groupClinicalTimelineByPeriod(
  events: readonly TimelineEvent[],
  now = new Date(),
): GroupedClinicalTimeline[] {
  const order: TimelinePeriodBucket[] = ['today', 'last3Months', 'lastYear', 'older'];
  const buckets = new Map<TimelinePeriodBucket, TimelineEvent[]>();
  for (const bucket of order) buckets.set(bucket, []);

  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  for (const event of sorted) {
    const bucket = resolveTimelinePeriodBucket(event.at, now);
    buckets.get(bucket)!.push(event);
  }

  return order
    .map((bucket) => ({
      bucket,
      label: TIMELINE_PERIOD_LABELS_ES[bucket],
      events: buckets.get(bucket) ?? [],
    }))
    .filter((group) => group.events.length > 0);
}

export function filterAndGroupClinicalTimeline(
  events: readonly TimelineEvent[],
  filter: ClinicalTimelineFilter,
  now = new Date(),
): GroupedClinicalTimeline[] {
  return groupClinicalTimelineByPeriod(filterClinicalTimeline(events, filter), now);
}
