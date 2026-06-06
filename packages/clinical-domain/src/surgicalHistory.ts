/** Prefijo SoT para antecedentes quirúrgicos (IDC 30) — sin columna extra en MVP. */
export const SURGICAL_HISTORY_DESCRIPTION_PREFIX = '[Ant.Qx] ';

export function isSurgicalHistoryDescription(description: string): boolean {
  return description.startsWith(SURGICAL_HISTORY_DESCRIPTION_PREFIX);
}

export function stripSurgicalHistoryPrefix(description: string): string {
  return isSurgicalHistoryDescription(description)
    ? description.slice(SURGICAL_HISTORY_DESCRIPTION_PREFIX.length).trim()
    : description;
}

export function formatSurgicalHistoryDescription(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (isSurgicalHistoryDescription(trimmed)) return trimmed;
  return `${SURGICAL_HISTORY_DESCRIPTION_PREFIX}${trimmed}`;
}
