import { copy } from '@epis2/design-system';
import { EpisChip } from '../primitives/EpisChip.js';

/** MF-UXLAB-02 — IA local off/degradada; no bloquea flujo core (Modo A). */
export function EpisAiDegradedChip() {
  return (
    <EpisChip
      size="small"
      variant="outlined"
      color="default"
      label={copy.chartModes.aiDegraded}
      data-testid="epis2-ai-degraded-chip"
    />
  );
}
