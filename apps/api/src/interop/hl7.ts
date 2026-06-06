/** Validación mínima HL7 v2 (frontera — sin persistir). */
export function validateHl7Message(raw: string) {
  const errors: string[] = [];
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: false, errors: ['Mensaje vacío'] };
  }

  const segments = trimmed.split(/\r\n|\r|\n/).filter(Boolean);
  if (segments.length === 0) {
    return { valid: false, errors: ['Sin segmentos'] };
  }

  const msh = segments[0];
  if (!msh?.startsWith('MSH|')) {
    errors.push('Primer segmento debe ser MSH');
  }

  let messageType: string | undefined;
  if (msh) {
    const fields = msh.split('|');
    if (fields.length < 9) {
      errors.push('MSH incompleto (se esperan al menos 9 campos)');
    } else {
      messageType = fields.find((p) => /^[A-Z0-9]{3}\^/.test(p)) ?? fields[6] ?? fields[8];
    }
  }

  return {
    valid: errors.length === 0,
    messageType,
    errors,
  };
}
