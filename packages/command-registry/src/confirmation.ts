import { getSecureCommandMeta } from './intent-metadata.js';
import type { ClinicalIntent, CommandDefinition, CommandSlots } from './types.js';

/** CE-2: confirmación explícita antes de abrir formularios de orden clínica. */
export function requiresExplicitConfirmation(intent: ClinicalIntent): boolean {
  const meta = getSecureCommandMeta(intent);
  return meta.safetyLevel === 'order' || meta.safetyLevel === 'sign';
}

export function buildConfirmationMessage(def: CommandDefinition, slots: CommandSlots): string {
  const detailParts: string[] = [];
  if (slots.medicationHint) detailParts.push(`medicamento: ${slots.medicationHint}`);
  if (slots.studyHint) detailParts.push(`estudio: ${slots.studyHint}`);
  if (slots.specialtyHint) detailParts.push(`especialidad: ${slots.specialtyHint}`);
  if (slots.bodySiteHint) detailParts.push(`región: ${slots.bodySiteHint}`);
  if (slots.urgencyHint && slots.urgencyHint !== 'routine') {
    detailParts.push(`urgencia: ${slots.urgencyHint}`);
  }

  const detail = detailParts.length > 0 ? ` (${detailParts.join(' · ')})` : '';

  return `Vas a abrir ${def.labelEs.toLowerCase()}${detail}. Se creará un borrador para revisión humana — no se firma automáticamente.`;
}
