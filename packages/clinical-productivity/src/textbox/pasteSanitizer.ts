const DANGEROUS_PATTERNS = [
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe/i,
  /<object/i,
];

/** Pega solo texto plano; elimina HTML/formato externo peligroso. */
export function sanitizePastedClinicalText(raw: string): string {
  let text = raw.replace(/\r\n/g, '\n');
  if (DANGEROUS_PATTERNS.some((re) => re.test(text))) {
    text = text.replace(/<[^>]+>/g, '');
  }
  return text.replace(/<[^>]*>/g, '').trim();
}

export function pastedTextLooksLikeAi(raw: string): boolean {
  return raw.includes('[IA]') || /generado por ia/i.test(raw);
}
