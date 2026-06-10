import { copy } from '@epis2/design-system';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  EpisAppearancePreferencesPanel,
  EpisButton,
  EpisM3Text,
  EpisTopAppBar,
  Stack,
  epis2PageIslandSx,
  epis2CanvasSx,
} from '@epis2/epis2-ui';
import { ClassicMd3PreferencesSection } from '../components/classic-md3/ClassicMd3PreferencesSection.js';

export function AppearancePreferencesPage() {
  const navigate = useNavigate();

  return (
    <Box sx={epis2CanvasSx} data-testid="epis2-appearance-preferences-page">
      <EpisTopAppBar
        title={copy.themePreferences.title}
        startAction={
          <EpisButton
            appearance="text"
            size="small"
            onClick={() => void navigate({ to: '/comando' })}
          >
            {copy.themePreferences.backToCommand}
          </EpisButton>
        }
      />
      <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, py: 3 }}>
        <Box sx={epis2PageIslandSx({ maxWidth: 560, mx: 'auto' })}>
          <Stack spacing={2}>
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {copy.themePreferences.pageDescription}
            </EpisM3Text>
            <EpisAppearancePreferencesPanel />
            <ClassicMd3PreferencesSection />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
