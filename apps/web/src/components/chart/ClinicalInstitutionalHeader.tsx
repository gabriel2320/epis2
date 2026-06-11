import { copy } from '@epis2/design-system';
import { Box, EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { epis2ClinicalShellTokens } from '@epis2/epis2-ui';
import { useAuth } from '../../auth/AuthContext.js';

export type ClinicalInstitutionalHeaderProps = {
  serviceUnit?: string | undefined;
  testId?: string | undefined;
};

/** Capa 1 — header institucional azul marino (canon visual §1). */
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
        px: 2,
        bgcolor: epis2ClinicalShellTokens.institutionalNavy,
        color: epis2ClinicalShellTokens.onInstitutional,
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
        <Box
          aria-hidden
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: 0.5,
          }}
        >
          EP
        </Box>
        <Typography variant="subtitle2" fontWeight={600} noWrap>
          {copy.chartModes.shellHeaderTitle}
        </Typography>
      </Stack>
      <Typography
        variant="caption"
        sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.9 }}
        noWrap
      >
        {serviceUnit}
      </Typography>
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
          appearance="outlined"
          size="small"
          onClick={() => void logout()}
          data-testid="epis2-chart-header-logout"
          sx={{
            color: epis2ClinicalShellTokens.onInstitutional,
            borderColor: 'rgba(255,255,255,0.45)',
            '&:hover': {
              borderColor: epis2ClinicalShellTokens.onInstitutional,
              bgcolor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          {copy.layout.logout}
        </EpisButton>
      </Stack>
    </Stack>
  );
}
