import type { ReactNode } from 'react';
import { Box, EpisAppShellLayout, type EpisNavigationRailItem } from '@epis2/epis2-ui';
import type { EpisScreenKind } from '../../quality/uiDensityRules.js';

export type EpisAppScaffoldProps = {
  screenKind?: EpisScreenKind;
  topBar: ReactNode;
  sideNavItems: EpisNavigationRailItem[];
  sideNavFooter?: ReactNode;
  railHidden?: boolean;
  patientChrome?: ReactNode;
  commandBar?: ReactNode;
  actionBar?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/**
 * MF-UI-SIMPLIFY-M3 — scaffold MD3 canónico.
 * 100dvh · top bar fija · rail fijo · un solo scroll en contenido principal.
 */
export function EpisAppScaffold({
  screenKind = 'workspace',
  topBar,
  sideNavItems,
  sideNavFooter,
  railHidden = false,
  patientChrome,
  commandBar,
  actionBar,
  children,
  testId = 'epis2-app-scaffold',
}: EpisAppScaffoldProps) {
  return (
    <Box
      data-testid={testId}
      data-epis-screen-kind={screenKind}
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EpisAppShellLayout
        railItems={sideNavItems}
        {...(sideNavFooter ? { railFooter: sideNavFooter } : {})}
        railHidden={railHidden}
        embeddedLayout
        appBar={topBar}
        {...(patientChrome ? { patientChrome } : {})}
        testId={`${testId}-shell`}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            flex: 1,
          }}
        >
          {commandBar ? (
            <Box
              data-testid="epis2-command-bar-slot"
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: (theme) => theme.zIndex.appBar - 2,
                flexShrink: 0,
                pb: 1,
              }}
            >
              {commandBar}
            </Box>
          ) : null}
          <Box
            component="section"
            data-testid="epis2-main-content"
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
          {actionBar ? (
            <Box
              data-testid="epis2-clinical-action-bar-slot"
              sx={{
                position: 'sticky',
                bottom: 0,
                flexShrink: 0,
                zIndex: (theme) => theme.zIndex.appBar - 1,
                bgcolor: 'background.default',
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              {actionBar}
            </Box>
          ) : null}
        </Box>
      </EpisAppShellLayout>
    </Box>
  );
}
