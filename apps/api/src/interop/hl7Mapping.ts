/** Mapeo HL7 v2 demo → preview interno (MF-181). Sin escritura SoT. */
export type Hl7MappingPreview = {
  messageType: string;
  patientHint?: string;
  suggestedDraftType?: 'lab_request' | 'evolution_note' | 'admission_note';
  fields: Record<string, string>;
  warnings: string[];
};

function splitSegments(raw: string): string[] {
  return raw
    .trim()
    .split(/\r\n|\r|\n/)
    .filter(Boolean);
}

function field(segment: string, index: number): string {
  const parts = segment.split('|');
  return parts[index]?.trim() ?? '';
}

function extractMessageType(msh: string): string {
  const parts = msh.split('|');
  const typed = parts.find((p) => /^[A-Z0-9]{3}\^/.test(p));
  return typed ?? (field(msh, 6) || field(msh, 8) || 'UNKNOWN');
}

export function mapHl7Message(raw: string): Hl7MappingPreview {
  const segments = splitSegments(raw);
  const msh = segments[0] ?? '';
  const messageType = extractMessageType(msh);
  const warnings: string[] = [];
  const fields: Record<string, string> = {};
  let patientHint: string | undefined;
  let suggestedDraftType: Hl7MappingPreview['suggestedDraftType'];

  const pid = segments.find((s) => s.startsWith('PID|'));
  if (pid) {
    const hint = field(pid, 3) || field(pid, 5);
    if (hint) {
      patientHint = hint;
      fields.patientHint = hint;
    }
  }

  if (/^ORU/.test(messageType)) {
    suggestedDraftType = 'lab_request';
    const obr = segments.find((s) => s.startsWith('OBR|'));
    const obx = segments.filter((s) => s.startsWith('OBX|'));
    if (obr) fields.labTests = field(obr, 4) || field(obr, 3);
    if (obx.length > 0) {
      fields.clinicalReason = obx.map((s) => `${field(s, 3)}: ${field(s, 5)}`).join('; ');
    } else {
      warnings.push('ORU sin segmentos OBX — preview parcial');
    }
    fields.priority = 'routine';
  } else if (/^ADT/.test(messageType)) {
    suggestedDraftType = 'admission_note';
    const evn = segments.find((s) => s.startsWith('EVN|'));
    fields.admissionReason = (evn ? field(evn, 3) : '') || `Evento ${messageType} (HL7 demo)`;
    fields.clinicalSummary = patientHint
      ? `Paciente ${patientHint} — mensaje ${messageType}`
      : `Mensaje ${messageType} en cuarentena`;
    fields.initialPlan = 'Revisión humana obligatoria antes de ingreso';
  } else {
    suggestedDraftType = 'evolution_note';
    warnings.push(`Tipo ${messageType} mapeado a evolución genérica demo`);
    fields.subjective = `HL7 ${messageType}`;
    fields.objective = 'Datos pendientes de reconciliación';
    fields.assessment = 'Revisar mapeo institucional';
    fields.plan = 'No aplicar sin aprobación humana';
  }

  const result: Hl7MappingPreview = { messageType, fields, warnings };
  if (patientHint) result.patientHint = patientHint;
  if (suggestedDraftType) result.suggestedDraftType = suggestedDraftType;
  return result;
}
