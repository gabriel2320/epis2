/** Normalización de texto clínico en español (acentos, typos frecuentes). */
export function normalizeCommandText(raw: string): string {
  const trimmed = raw
    .trim()
    .replace(/\breseta\b/gi, 'receta')
    .replace(/\brx\b/gi, 'radiografia')
    .replace(/\btorax\b/gi, 'torax')
    .replace(/\s+/g, ' ');

  const lowered = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

  return lowered.replace(/^(por favor|necesito|quiero)\s+/, '');
}
