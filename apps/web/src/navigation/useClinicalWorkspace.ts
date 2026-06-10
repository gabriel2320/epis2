import { useEpis2ThemePreferences } from '@epis2/epis2-ui';
import type { EpisClinicalWorkspaceId } from '@epis2/epis2-ui';
import type { ClinicalRole } from '@epis2/clinical-domain';
import { useAuth } from '../auth/AuthContext.js';
import {
  getClinicalWorkspaceDefinition,
  resolveWorkspaceForRole,
  canRoleAccessWorkspace,
} from './clinicalWorkspaceRegistry.js';
import { defaultWorkspaceForRole } from './clinicalRoleCareMatrix.js';

export function useClinicalWorkspace() {
  const { preferences, setPreferences } = useEpis2ThemePreferences();
  const { session } = useAuth();
  const role = session?.user.role ?? 'physician';

  const activeWorkspace = preferences.clinicalWorkspace ?? defaultWorkspaceForRole(role);

  const definition = getClinicalWorkspaceDefinition(activeWorkspace);

  const setWorkspace = (workspace: EpisClinicalWorkspaceId) => {
    setPreferences({ clinicalWorkspace: workspace });
  };

  const canUseWorkspace = (workspaceId: EpisClinicalWorkspaceId): boolean => {
    if (workspaceId === 'command') return true;
    if (!canRoleAccessWorkspace(role, workspaceId)) return false;
    const def = getClinicalWorkspaceDefinition(workspaceId);
    if (!def.allowedRoles || def.allowedRoles.length === 0) return true;
    return def.allowedRoles.includes(role as ClinicalRole);
  };

  return {
    activeWorkspace,
    definition,
    setWorkspace,
    canUseWorkspace,
    defaultWorkspace: resolveWorkspaceForRole(role),
  };
}
