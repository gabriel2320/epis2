import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { prefersReducedMotion } from '../theme/motion.js';
import {
  EPIS2_CLINICAL_SPLIT_MIN_PX,
  epis2ClinicalActionPaneSx,
  epis2ClinicalContextPaneSx,
  epis2ClinicalSplitTransition,
} from './epis-clinical-two-pane-tokens.js';

export type EpisClinicalTwoPaneLayoutProps = {
  appBar: ReactNode;
  actionPane: ReactNode;
  contextPane?: ReactNode;
  contextOpen: boolean;
  onContextOpenChange: (open: boolean) => void;
  footer: ReactNode;
  testId?: string;
};

/** Layout M3 two-pane — Enfoque (default) ↔ Contexto bajo demanda (LAYOUT-01). */
export function EpisClinicalTwoPaneLayout({
  appBar,
  actionPane,
  contextPane,
  contextOpen,
  onContextOpenChange,
  footer,
  testId = 'epis2-clinical-two-pane',
}: EpisClinicalTwoPaneLayoutProps) {
  const splitSideBySide = useMediaQuery(`(min-width:${EPIS2_CLINICAL_SPLIT_MIN_PX}px)`);
  const { preferences } = useEpis2ThemePreferences();
  const reducedMotion = preferences.motion === 'reduced' || prefersReducedMotion();

  useEffect(() => {
    if (!contextOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onContextOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [contextOpen, onContextOpenChange]);

  const transition = epis2ClinicalSplitTransition(reducedMotion);

  return (
    <Stack data-testid={testId} sx={{ width: '100%' }} spacing={0}>
      {appBar}
      <Box
        sx={{
          display: 'flex',
          flexDirection: splitSideBySide ? 'row' : 'column',
          minHeight: { xs: 360, sm: 420 },
          position: 'relative',
        }}
      >
        {splitSideBySide ? (
          <Box
            role="complementary"
            aria-hidden={!contextOpen}
            data-testid="epis2-clinical-context-split"
            sx={{
              ...epis2ClinicalContextPaneSx,
              flexBasis: contextOpen ? '40%' : '0%',
              minWidth: contextOpen ? 320 : 0,
              maxWidth: contextOpen ? '45%' : 0,
              opacity: contextOpen ? 1 : 0,
              borderRight: 1,
              borderColor: contextOpen ? 'divider' : 'transparent',
              transition,
              pointerEvents: contextOpen ? 'auto' : 'none',
            }}
          >
            {contextOpen ? contextPane : null}
          </Box>
        ) : null}
        <Box
          role="main"
          data-testid="epis2-clinical-action-pane"
          sx={{
            ...epis2ClinicalActionPaneSx,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
          }}
        >
          {actionPane}
        </Box>
        {!splitSideBySide ? (
          <Drawer
            anchor="left"
            open={contextOpen}
            onClose={() => onContextOpenChange(false)}
            ModalProps={{ keepMounted: false }}
            PaperProps={{
              sx: {
                ...epis2ClinicalContextPaneSx,
                width: { xs: 'min(100vw, 360px)', sm: 400 },
                pt: 1,
              },
              'data-testid': 'epis2-clinical-context-drawer',
            }}
          >
            {contextPane}
          </Drawer>
        ) : null}
      </Box>
      <Box
        component="footer"
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
        data-testid="epis2-clinical-two-pane-footer"
      >
        {footer}
      </Box>
    </Stack>
  );
}
