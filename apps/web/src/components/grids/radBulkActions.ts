export async function copyLinesToClipboard(lines: string[]): Promise<void> {
  if (lines.length === 0) return;
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
  } catch {
    /* noop en test */
  }
}
