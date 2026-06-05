import { copy } from '@epis2/design-system';
import { EpisAlert } from '../primitives/EpisAlert.js';

export type EpisAiDisclosureProps = {
  visible?: boolean;
};

/** Aviso de revisión humana obligatoria cuando hay asistencia IA. */
export function EpisAiDisclosure({ visible = true }: EpisAiDisclosureProps) {
  if (!visible) return null;
  return (
    <EpisAlert severity="info" variant="outlined" data-testid="epis2-ai-disclosure">
      {copy.ai.humanReviewRequired}
    </EpisAlert>
  );
}
