import { copy } from '@epis2/design-system';
import { EpisButton } from '@epis2/epis2-ui';

export type ClinicalDictationButtonProps = {
  enabled?: boolean;
  onTranscript?: (text: string) => void;
  testId?: string;
};

/** Dictado Fase E — whisper.cpp pendiente; nunca firma automática. */
export function ClinicalDictationButton({
  enabled = false,
  onTranscript,
  testId = 'epis2-clinical-dictation',
}: ClinicalDictationButtonProps) {
  if (!enabled) {
    return (
      <EpisButton appearance="text" size="small" disabled data-testid={testId}>
        {copy.clinicalProductivity.dictationDisabled}
      </EpisButton>
    );
  }

  return (
    <EpisButton
      appearance="outlined"
      size="small"
      data-testid={testId}
      onClick={() => onTranscript?.('')}
    >
      {copy.clinicalProductivity.dictationStart}
    </EpisButton>
  );
}
