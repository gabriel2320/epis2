/** OCR demo sin sidecar — solo texto sintético o extracción TXT base64. */
export function extractDemoOcrText(input: {
  mimeType?: string | null;
  textContent?: string | null;
  title: string;
}): { text: string; mode: 'extracted' | 'synthetic' } {
  const existing = input.textContent?.trim();
  if (existing && !existing.startsWith('[OCR pendiente')) {
    return { text: existing, mode: 'extracted' };
  }

  const mime = (input.mimeType ?? '').toLowerCase();
  if (mime.includes('text/plain') && existing) {
    return { text: existing.replace(/^\[OCR pendiente[^\]]*\]\s*/i, ''), mode: 'extracted' };
  }

  return {
    text: `Texto OCR demo generado para «${input.title}». Revisión humana obligatoria antes de indexar clínicamente.`,
    mode: 'synthetic',
  };
}
