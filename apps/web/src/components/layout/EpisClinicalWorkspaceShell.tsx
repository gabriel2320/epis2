import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';
import type { EpisScreenKind } from '../../quality/uiDensityRules.js';

export type EpisClinicalWorkspaceShellProps = {
  screenKind?: Exclude<EpisScreenKind, 'command'>;
  commandBar?: ReactNode;
  actionBar?: ReactNode;
  supportingPane?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/**
 * Shell Tipo B/C/D — workspace, formulario o documento clínico.
 * Scroll único en contenido principal; panel secundario sin ActionBar propia.
 */
export function EpisClinicalWorkspaceShell({
  screenKind = 'workspace',
  commandBar,
  actionBar,
  supportingPane,
  children,
  testId = 'epis2-clinical-workspace-shell',
}: EpisClinicalWorkspaceShellProps) {
  const hasSupporting = Boolean(supportingPane);

  return (
    <Box
      data-testid={testId}
      data-epis-screen-kind={screenKind}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        flex: 1,
      }}
    >
      {commandBar ? (
        <Box data-testid="epis2-workspace-command-bar" sx={{ flexShrink: 0, pb: 1 }}>
          {commandBar}
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          gap: hasSupporting ? 2 : 0,
          flexDirection: { xs: 'column', md: hasSupporting ? 'row' : 'column' },
        }}
      >
        <Box
          component="main"
          data-testid="epis2-main-content"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>

        {hasSupporting ? (
          <Box
            component="aside"
            data-testid="epis2-supporting-pane"
            sx={{
              flex: { xs: 'none', md: '0 0 min(40%, 420px)' },
              minWidth: 0,
              maxHeight: { xs: '50vh', md: 'none' },
              overflow: 'auto',
              display: { xs: 'block', md: 'block' },
            }}
          >
            {supportingPane}
          </Box>
        ) : null}
      </Box>

      {actionBar ? (
        <Box
          data-testid="epis2-clinical-action-bar-slot"
          sx={{
            flexShrink: 0,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {actionBar}
        </Box>
      ) : null}
    </Box>
  );
}

/** Alias semántico del slot central — uso en gates estáticos. */
export function EpisMainContent({ children }: { children: ReactNode }) {
  return (
    <Box data-testid="epis2-main-content-inner" sx={{ width: '100%' }}>
      {children}
    </Box>
  );
}

/** Panel secundario MD3 supporting pane — sin acciones globales. */
export function EpisSupportingPane({ children }: { children: ReactNode }) {
  return (
    <Box data-testid="epis2-supporting-pane-inner" sx={{ width: '100%' }}>
      {children}
    </Box>
  );
}
