import Box from '@mui/material/Box';
import { copy } from '@epis2/design-system';
import { EpisButton } from '../../primitives/EpisButton.js';
import {
  normalizeClinicalActions,
  resolveLayoutProfile,
  type ClinicalLayoutAction,
  type ClinicalLayoutProfile,
} from './clinicalLayoutEngine.js';
import { clinicalActionBarSx } from './clinicalLayoutSx.js';
import { ClinicalOverflowMenu } from './ClinicalOverflowMenu.js';

export type ClinicalLayoutActionBarProps = {
  profile?: ClinicalLayoutProfile;
  actions: readonly ClinicalLayoutAction[];
  overflowLabel?: string;
  testId?: string;
};

function actionAppearance(kind: ClinicalLayoutAction['kind']) {
  switch (kind) {
    case 'primary':
      return 'filled' as const;
    case 'danger':
      return 'filled' as const;
    case 'secondary':
      return 'outlined' as const;
    case 'quiet':
    default:
      return 'text' as const;
  }
}

/** Barra de acciones gobernada — orden automático primaria/secundaria/overflow. */
export function ClinicalLayoutActionBar({
  profile = 'clinical-form',
  actions,
  overflowLabel = copy.chartModes.actionMoreOpen,
  testId = 'clinical-action-bar',
}: ClinicalLayoutActionBarProps) {
  if (actions.length === 0) return null;

  const config = resolveLayoutProfile(profile);
  const { primary, visibleSecondary, overflow } = normalizeClinicalActions(actions);

  return (
    <Box
      data-testid={testId}
      sx={clinicalActionBarSx(config.primaryActionPosition)}
      className="epis2-clinical-layout-action-bar"
    >
      {visibleSecondary.map((action) => (
        <EpisButton
          key={action.id}
          appearance={actionAppearance(action.kind)}
          color={action.kind === 'danger' ? 'error' : 'primary'}
          onClick={action.onClick}
          {...(action.disabled ? { disabled: true } : {})}
          data-action-kind={action.kind}
          {...(action.testId ? { 'data-testid': action.testId } : {})}
        >
          {action.label}
        </EpisButton>
      ))}
      {overflow.length > 0 ? (
        <ClinicalOverflowMenu actions={overflow} label={overflowLabel} />
      ) : null}
      {primary.map((action) => (
        <EpisButton
          key={action.id}
          appearance={actionAppearance(action.kind)}
          color={action.kind === 'danger' ? 'error' : 'primary'}
          onClick={action.onClick}
          {...(action.disabled ? { disabled: true } : {})}
          data-action-kind="primary"
          {...(action.testId ? { 'data-testid': action.testId } : {})}
        >
          {action.label}
        </EpisButton>
      ))}
    </Box>
  );
}
