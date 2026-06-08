import { copy } from '@epis2/design-system';
import { isClinicalRole } from '@epis2/clinical-domain';
import { EpisChip, Stack } from '@epis2/epis2-ui';
import { WORKSPACE_CARE_SETTING } from '../navigation/clinicalRoleCareMatrix.js';
import { useClinicalWorkspace } from '../navigation/useClinicalWorkspace.js';
import { useAuth } from '../auth/AuthContext.js';
import { resolveWorkspaceCopyKey } from '../navigation/workspaceCopy.js';

/** Contexto rol + ámbito clínico — visible fuera de /comando. */
export function ClinicalRoleCareContext() {
  const { session } = useAuth();
  const { activeWorkspace, definition } = useClinicalWorkspace();
  const role = session?.user.role ?? 'physician';

  if (activeWorkspace === 'command') {
    return null;
  }

  const roleLabel = isClinicalRole(role)
    ? copy.roles[role]
    : role;
  const workspaceLabel = resolveWorkspaceCopyKey(definition.labelKey);
  const careKey = WORKSPACE_CARE_SETTING[activeWorkspace];
  const careLabel =
    careKey !== 'institutional' ? copy.careSettings[careKey] : copy.careSettings.institutional;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      flexWrap="wrap"
      alignItems="center"
      sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
      data-testid="epis2-role-care-context"
    >
      <EpisChip size="small" label={roleLabel} variant="outlined" />
      <EpisChip size="small" label={workspaceLabel} variant="filled" />
      <EpisChip size="small" label={careLabel} variant="outlined" />
    </Stack>
  );
}
