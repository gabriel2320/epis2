import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import type { Epis2ThemeModePreference } from '../theme/theme-mode.js';
import { cicaEpis2gVisual } from './cicaEpis2gVisual.js';

const MODES: { id: Epis2ThemeModePreference; label: string; Icon: typeof LightModeOutlinedIcon }[] =
  [
    { id: 'light', label: 'Modo claro', Icon: LightModeOutlinedIcon },
    { id: 'dark', label: 'Modo oscuro', Icon: DarkModeOutlinedIcon },
    { id: 'system', label: 'Seguir sistema', Icon: SettingsBrightnessOutlinedIcon },
  ];

export type CicaSidebarThemePanelProps = {
  collapsed?: boolean;
  testId?: string;
};

/** Selector compacto de tema — patrón epis2g L1 footer. */
export function CicaSidebarThemePanel({
  collapsed = false,
  testId = 'cica-sidebar-theme-panel',
}: CicaSidebarThemePanelProps) {
  const { preferences, setPreferences } = useEpis2ThemePreferences();

  if (collapsed) {
    const currentIndex = MODES.findIndex((m) => m.id === preferences.mode);
    const next = MODES[(currentIndex + 1) % MODES.length]!;
    const CurrentIcon = MODES.find((m) => m.id === preferences.mode)?.Icon ?? LightModeOutlinedIcon;
    return (
      <Tooltip title="Ciclar tema visual">
        <IconButton
          size="small"
          onClick={() => setPreferences({ mode: next.id })}
          data-testid={`${testId}-cycle`}
          sx={{
            color: cicaEpis2gVisual.accentLabelDark,
            bgcolor: cicaEpis2gVisual.railHoverBg,
            '&:hover': { bgcolor: '#334155', color: '#fff' },
          }}
        >
          <CurrentIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box data-testid={testId} sx={{ width: '100%' }}>
      <Typography
        variant="caption"
        component="p"
        sx={{
          color: cicaEpis2gVisual.railTextMuted,
          fontFamily: cicaEpis2gVisual.fontMono,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          fontSize: 9,
          textAlign: 'center',
          mb: 1,
        }}
      >
        Temas de color
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0.5,
          p: 0.5,
          borderRadius: 1,
          bgcolor: 'rgba(2, 6, 23, 0.4)',
          border: 1,
          borderColor: cicaEpis2gVisual.railBorder,
        }}
      >
        {MODES.map(({ id, label, Icon }) => {
          const active = preferences.mode === id;
          return (
            <Tooltip key={id} title={label}>
              <IconButton
                size="small"
                aria-label={label}
                onClick={() => setPreferences({ mode: id })}
                data-testid={`${testId}-${id}`}
                sx={{
                  borderRadius: 1,
                  color: active ? '#fff' : cicaEpis2gVisual.railTextMuted,
                  bgcolor: active ? cicaEpis2gVisual.railSelectedBg : 'transparent',
                  '&:hover': {
                    bgcolor: active ? cicaEpis2gVisual.railSelectedBg : cicaEpis2gVisual.railHoverBg,
                    color: '#fff',
                  },
                }}
              >
                <Icon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
