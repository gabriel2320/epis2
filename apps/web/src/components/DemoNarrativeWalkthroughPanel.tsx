import { copy } from '@epis2/design-system';
import {
  getDemoCaseByCode,
  listDemoNarrativeEpisodes,
  type DemoNarrativeEpisode,
} from '../fixtures/devFixturesBridge.js';
import { EpisAssistChip, EpisM3Text, Stack } from '@epis2/epis2-ui';

export type DemoNarrativeWalkthroughPanelProps = {
  onSelectEpisode: (episode: DemoNarrativeEpisode) => void;
};

/** Episodios piloto curados — presentación narrativa, no dump de BD (UX-A.4). */
export function DemoNarrativeWalkthroughPanel({
  onSelectEpisode,
}: DemoNarrativeWalkthroughPanelProps) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }} data-testid="epis2-demo-narratives">
      <EpisM3Text role="titleMedium">{copy.commandCenter.demoNarrativesTitle}</EpisM3Text>
      <EpisM3Text role="bodyMedium" color="text.secondary" sx={{ lineHeight: 1.55 }}>
        {copy.commandCenter.demoNarrativesHint}
      </EpisM3Text>
      <Stack spacing={1.5}>
        {listDemoNarrativeEpisodes().map((episode) => {
          const demo = getDemoCaseByCode(episode.demoCaseCode);
          return (
            <Stack
              key={episode.id}
              spacing={0.75}
              data-testid={`epis2-demo-narrative-${episode.id}`}
            >
              <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                <EpisAssistChip
                  label={episode.titleEs}
                  title={episode.oneLinerEs}
                  tone="search"
                  clickable
                  onClick={() => onSelectEpisode(episode)}
                />
                {demo ? (
                  <EpisM3Text role="labelMedium" color="text.secondary">
                    {demo.displayName.split('—').pop()?.trim() ?? demo.displayName}
                    {' · '}
                    {episode.demoCaseCode}
                  </EpisM3Text>
                ) : null}
              </Stack>
              <EpisM3Text
                role="bodyMedium"
                color="text.secondary"
                sx={{ lineHeight: 1.5, fontSize: '0.8125rem' }}
              >
                {episode.oneLinerEs}
              </EpisM3Text>
              <EpisM3Text role="labelMedium" color="primary.main">
                {copy.commandCenter.demoNarrativesCommandLabel}: {episode.suggestedCommandEs}
              </EpisM3Text>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
