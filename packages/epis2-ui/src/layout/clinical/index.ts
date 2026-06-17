export { clinicalLayoutTokens, type ClinicalLayoutDensity } from './clinicalLayoutTokens.js';
export {
  clinicalLayoutProfiles,
  normalizeClinicalActions,
  getFieldSpan,
  resolveLayoutProfile,
  auditClinicalLayout,
  auditCicaScreen,
  resolveCicaVerdict,
  type ClinicalLayoutProfile,
  type ClinicalLayoutProfileConfig,
  type ClinicalLayoutAction,
  type ClinicalLayoutActionKind,
  type ClinicalFieldType,
  type ClinicalFieldSpan,
  type NormalizedClinicalActions,
  type ClinicalLayoutAuditFinding,
  type ClinicalLayoutAuditInput,
  type CicaScreenAuditInput,
  type CicaScreenAuditFinding,
  type CicaScreenVerdict,
} from './clinicalLayoutEngine.js';
export {
  clinicalScreenSx,
  clinicalHeaderSx,
  clinicalContentSx,
  clinicalSectionSx,
  clinicalActionBarSx,
} from './clinicalLayoutSx.js';
export { ClinicalScreen, type ClinicalScreenProps } from './ClinicalScreen.js';
export { ClinicalSection, type ClinicalSectionProps } from './ClinicalSection.js';
export {
  ClinicalFieldGrid,
  ClinicalFieldCell,
  type ClinicalFieldGridProps,
  type ClinicalFieldGridColumns,
  type ClinicalFieldCellProps,
} from './ClinicalFieldGrid.js';
export {
  ClinicalLayoutActionBar,
  type ClinicalLayoutActionBarProps,
} from './ClinicalLayoutActionBar.js';
export { ClinicalOverflowMenu, type ClinicalOverflowMenuProps } from './ClinicalOverflowMenu.js';
export * from '../../screen-governor/index.js';

/** Alias corto — motor de layout clínico EPIS2. */
export { ClinicalScreen as EpisClinicalLayoutScreen } from './ClinicalScreen.js';
export { ClinicalLayoutActionBar as EpisClinicalLayoutActionBar } from './ClinicalLayoutActionBar.js';
