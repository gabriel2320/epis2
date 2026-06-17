import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { epis2ClinicalShellTokens } from '@epis2/epis2-ui';
import { useAuth } from '../../auth/AuthContext.js';

export type ClinicalInstitutionalHeaderProps = {
  serviceUnit?: string | undefined;
  testId?: string | undefined;
};

/** Capa 1 — franja institucional sobria (clinical-calm). */
export function ClinicalInstitutionalHeader({
  serviceUnit = copy.chartModes.shellServiceDefault,
  testId = 'epis2-clinical-institutional-header',
}: ClinicalInstitutionalHeaderProps) {
  const { session, logout } = useAuth();
  const displayName = session?.user.displayName ?? copy.layout.navUser;
  const roleKey = session?.user.role as keyof typeof copy.roles | undefined;
  const roleLabel = roleKey ? (copy.roles[roleKey] ?? roleKey) : undefined;

  return (
    <Stack
      data-testid={testId}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        minHeight: epis2ClinicalShellTokens.institutionalHeaderHeight,
        px: { xs: 2, md: 3 },
        bgcolor: epis2ClinicalShellTokens.institutionalNavy,
        color: epis2ClinicalShellTokens.onInstitutional,
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={600} letterSpacing={0.2} noWrap>
          {copy.chartModes.shellHeaderTitle}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.88 }}
          noWrap
        >
          {serviceUnit}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
        <Stack spacing={0} alignItems="flex-end" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography variant="caption" fontWeight={600} lineHeight={1.2}>
            {displayName}
          </Typography>
          {roleLabel ? (
            <Typography variant="caption" sx={{ opacity: 0.85 }} lineHeight={1.2}>
              {roleLabel}
            </Typography>
          ) : null}
        </Stack>
        <EpisButton
          appearance="text"
          size="small"
          onClick={() => void logout()}
          data-testid="epis2-chart-header-logout"
          sx={{
            color: epis2ClinicalShellTokens.onInstitutional,
            minWidth: 0,
            px: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
          }}
        >
          {copy.layout.logout}
        </EpisButton>
      </Stack>
    </Stack>
  );
}
