import { useEpis2ThemePreferences } from '@epis2/epis2-ui';
import type { EpisClinicalWorkspaceId } from '@epis2/epis2-ui';
import { useAuth } from '../auth/AuthContext.js';
import {
  getClinicalWorkspaceDefinition,
  resolveWorkspaceForRole,
} from './clinicalWorkspaceRegistry.js';

export function useClinicalWorkspace() {
  const { preferences, setPreferences } = useEpis2ThemePreferences();
  const { session } = useAuth();
  const role = session?.user.role ?? 'physician';

  const activeWorkspace: EpisClinicalWorkspaceId =
    preferences.clinicalWorkspace ?? resolveWorkspaceForRole(role);

  const definition = getClinicalWorkspaceDefinition(activeWorkspace);

  const setWorkspace = (workspace: EpisClinicalWorkspaceId) => {
    setPreferences({ clinicalWorkspace: workspace });
  };

  const canUseWorkspace = (workspaceId: EpisClinicalWorkspaceId): boolean => {
    if (workspaceId === 'command') return true;
    const def = getClinicalWorkspaceDefinition(workspaceId);
    if (!def.allowedRoles || def.allowedRoles.length === 0) return true;
    return def.allowedRoles.includes(role);
  };

  return {
    activeWorkspace,
    definition,
    setWorkspace,
    canUseWorkspace,
  };
}
