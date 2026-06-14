import { normalizeCommandText } from './normalize.js';
import type { CommandSlots } from './types.js';

const MEDICATIONS =
  /\b(amoxicilina|amoxi|paracetamol|ibuprofeno|metformina|enalapril|losartan|omeprazol|atorvastatina|ceftriaxona|warfarina)\b/i;

const SPECIALTIES =
  /\b(cardiolog(?:ia|o)|neurolog(?:ia|o)|traumatolog(?:ia|o)|infectolog(?:ia|o)|psiquiatr(?:ia|o)|gastroenterolog(?:ia|o)|dermatolog(?:ia|o))\b/i;

const BODY_SITES =
  /\b(torax|tórax|abdomen|craneo|cráneo|pelvis|columna|cervical|lumbar|extremidad|rodilla|hombro)\b/i;

export function extractSlots(raw: string): CommandSlots {
  const normalized = normalizeCommandText(raw);
  const slots: CommandSlots = {};

  const patientMatch = normalized.match(
    /(?:paciente|para|ficha\s+(?:de|del))\s+([a-z][a-z0-9\s]{2,30})/,
  );
  if (patientMatch?.[1]) {
    slots.patientHint = patientMatch[1].trim();
  }

  const medMatch = raw.match(MEDICATIONS);
  if (medMatch?.[1]) {
    slots.medicationHint = medMatch[1].toLowerCase();
  }

  const specialtyMatch = normalized.match(
    /(?:interconsulta|derivar|derivacion|referir)\s+(?:a\s+)?([a-z][a-z\s]{2,24})/,
  );
  if (specialtyMatch?.[1]) {
    slots.specialtyHint = specialtyMatch[1].trim();
  } else {
    const knownSpecialty = normalized.match(SPECIALTIES);
    if (knownSpecialty?.[0]) {
      slots.specialtyHint = knownSpecialty[0];
    }
  }

  const studyMatch = normalized.match(
    /(?:hemograma|glucosa|creatinina|hba1c|hemoglobina\s+glicosilada|perfil\s+bioquimico|perfil\s+hepatico|analitica|bioquimica|tac|tomografia|resonancia|rmn|rx|radiografia|ecografia|placa)/,
  );
  if (studyMatch?.[0]) {
    slots.studyHint = studyMatch[0];
  }

  const bodySiteMatch = normalized.match(BODY_SITES);
  if (bodySiteMatch?.[0]) {
    slots.bodySiteHint = bodySiteMatch[0];
  }

  if (/\b(stat|urgente|inmediato|emergente)\b/.test(normalized)) {
    slots.urgencyHint = /\bstat\b/.test(normalized) ? 'stat' : 'urgent';
  } else if (/\b(rutina|rutinario|rutinaria)\b/.test(normalized)) {
    slots.urgencyHint = 'routine';
  }

  const reasonMatch = normalized.match(/(?:por|motivo|debido a|indicacion)\s+([a-z0-9\s]{3,48})/);
  if (reasonMatch?.[1]) {
    slots.clinicalReasonHint = reasonMatch[1].trim();
  }

  const noteMatch = raw.match(/(?:nota|evolucion)\s*:\s*(.+)/i);
  if (noteMatch?.[1]) {
    slots.noteHint = noteMatch[1].trim().slice(0, 500);
  }

  if (/control\s+diabetes|control\s+dm2?\b|control\s+dm\b/.test(normalized)) {
    slots.clinicalReasonHint = 'Control diabetes mellitus tipo 2';
  } else if (/control\s+hta|control\s+hipertension/.test(normalized)) {
    slots.clinicalReasonHint = 'Control hipertensión arterial';
  } else if (/renovar\s+receta|receta\s+cronica|renovacion\s+de\s+receta/.test(normalized)) {
    slots.clinicalReasonHint = 'Renovación receta crónica';
  }

  if (
    /panel\s+control\s+dm2|laboratorio\s+control\s+diabetes|control\s+dm2\s+lab/.test(normalized)
  ) {
    slots.studyHint = slots.studyHint ?? 'panel control dm2';
    if (!slots.clinicalReasonHint) {
      slots.clinicalReasonHint = 'Control diabetes mellitus tipo 2';
    }
  }

  return slots;
}
