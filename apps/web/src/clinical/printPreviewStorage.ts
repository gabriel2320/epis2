const PREFIX = 'epis2_print_preview:';

export function writePrintPreview(blueprintId: string, values: Record<string, string>) {
  sessionStorage.setItem(`${PREFIX}${blueprintId}`, JSON.stringify(values));
}

export function readPrintPreview(blueprintId: string): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${blueprintId}`);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}
