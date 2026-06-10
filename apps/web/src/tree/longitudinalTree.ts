import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { EpisTreeNode } from '@epis2/epis2-ui';
import { buildDocumentTreeByType } from './documentTree.js';

export function buildLongitudinalSectionTree(data: PatientLongitudinalResponse): EpisTreeNode[] {
  const nodes: EpisTreeNode[] = [];

  if (data.problems.length > 0) {
    nodes.push({
      id: 'section-problems',
      label: `${copy.longitudinal.problems} (${data.problems.length})`,
      children: data.problems.map((p) => ({
        id: `problem-${p.id}`,
        label: `${p.description} · ${p.status}`,
      })),
    });
  }

  if (data.allergies.length > 0) {
    nodes.push({
      id: 'section-allergies',
      label: `${copy.longitudinal.allergies} (${data.allergies.length})`,
      children: data.allergies.map((a) => ({
        id: `allergy-${a.id}`,
        label: `${a.substance} · ${a.severity}`,
      })),
    });
  }

  if (data.observations.length > 0) {
    nodes.push({
      id: 'section-observations',
      label: `${copy.longitudinal.observations} (${data.observations.length})`,
      children: data.observations.map((o) => ({
        id: `observation-${o.id}`,
        label: `${o.label}: ${o.valueText}`,
      })),
    });
  }

  if (data.medications.length > 0) {
    nodes.push({
      id: 'section-medications',
      label: `${copy.longitudinal.medications} (${data.medications.length})`,
      children: data.medications.map((m) => ({
        id: `medication-${m.id}`,
        label: [m.name, m.doseText, m.route].filter(Boolean).join(' · '),
      })),
    });
  }

  if (data.timeline.length > 0) {
    nodes.push({
      id: 'section-timeline',
      label: `${copy.longitudinal.timeline} (${data.timeline.length})`,
      children: data.timeline.map((ev) => ({
        id: `timeline-${ev.id}`,
        label: `${ev.title} · ${new Date(ev.at).toLocaleString('es-CL')}`,
      })),
    });
  }

  if (data.documents.length > 0) {
    nodes.push({
      id: 'section-documents',
      label: `${copy.longitudinal.documents} (${data.documents.length})`,
      children: buildDocumentTreeByType(
        data.documents.map((d) => ({
          id: d.id,
          title: d.title,
          documentType: d.documentType,
          snippet: d.storageRef,
        })),
      ),
    });
  }

  return nodes;
}

export function resolveTimelineDraftId(
  data: PatientLongitudinalResponse,
  itemId: string,
): string | undefined {
  if (!itemId.startsWith('timeline-')) return undefined;
  const eventId = itemId.slice('timeline-'.length);
  const event = data.timeline.find((e) => e.id === eventId);
  if (event?.kind === 'draft' && event.entityId) return event.entityId;
  return undefined;
}
