import { normalizeCommandText } from './normalize.js';
import type { CommandSlots } from './types.js';

const MEDICATIONS =
  /\b(amoxicilina|amoxi|paracetamol|ibuprofeno|metformina|enalapril|losartan|omeprazol|atorvastatina)\b/i;

export function extractSlots(raw: string): CommandSlots {
  const normalized = normalizeCommandText(raw);
  const slots: CommandSlots = {};

  const patientMatch = normalized.match(
    /(?:paciente|para)\s+([a-z][a-z0-9\s]{2,30})/,
  );
  if (patientMatch?.[1]) {
    slots.patientHint = patientMatch[1].trim();
  }

  const medMatch = raw.match(MEDICATIONS);
  if (medMatch?.[1]) {
    slots.medicationHint = medMatch[1].toLowerCase();
  }

  const studyMatch = normalized.match(
    /(?:hemograma|glucosa|creatinina|perfil\s+hepatico|torax|radiografia|rx\s+torax|placa)/,
  );
  if (studyMatch?.[0]) {
    slots.studyHint = studyMatch[0];
  }

  return slots;
}
