import { ClinicalShellCommandPalette } from '../ClinicalShellCommandPalette.js';

/** Overlay global Ctrl+K — reutiliza palette existente (ADR-002). */
export function CommandPaletteOverlay() {
  return <ClinicalShellCommandPalette />;
}
