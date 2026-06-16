/** CICA Clean Room — componentes canónicos (sala blanca). */
export { cicaTokens, type CicaLayoutProfile } from './cicaTokens.js';
export {
  cicaBreakpoints,
  cicaDefaultMaxContentWidth,
  cicaFormGrid,
  cicaHorizontalScrollSx,
  cicaIsClinicalMaxWidthProfile,
  cicaMaxContentWidth,
  cicaMaxWidthForProfile,
  cicaNavLabelMinPx,
  cicaPaperCanvasMinHeight,
  cicaPaperCanvasSx,
  cicaPaperModeContentSx,
  cicaPaperModeToolbarSx,
  cicaPaperSheetMaxWidth,
  cicaResponsiveContainerSx,
  cicaResponsiveGrid,
  cicaSafeAreaBottomSx,
  cicaSafeAreaInsetsSx,
  cicaShellPaddingX,
  cicaShellPaddingXSx,
  CICA_BREAKPOINT_TABLE,
  type CicaBreakpoint,
  type CicaBreakpointKey,
  type CicaClinicalMaxWidthProfile,
} from './cicaResponsive.js';
export {
  CicaResponsiveContainer,
  type CicaResponsiveContainerProps,
} from './CicaResponsiveContainer.js';
export {
  CicaResponsiveGrid,
  CicaGridCell,
  type CicaResponsiveGridProps,
  type CicaResponsiveGridColumns,
  type CicaGridCellProps,
} from './CicaResponsiveGrid.js';
export { CicaFormGrid, type CicaFormGridProps } from './CicaFormGrid.js';
export {
  EPIS_CICA_SCREEN_REGISTRY,
  findCicaScreenById,
  findCicaScreenByRoutePrefix,
  type CicaScreenDefinition,
} from './EPIS_CICA_SCREEN_REGISTRY.js';
export {
  CICA_CHART_TAB_REGISTRY,
  inferChartTabFromPathname,
  chartTabScreenId,
  findChartTabById,
  type CicaChartTabId,
  type CicaChartTabDefinition,
} from './CICA_CHART_TAB_REGISTRY.js';
export {
  buildCicaPath,
  CICA_ROUTE_TEMPLATE,
  cicaScreenTitle,
  isCicaPaperRoute,
  parseCicaPatientId,
  todayIsoDate,
  type CicaScreenId,
  type CicaRouteParams,
} from './cicaRoutes.js';
export { CicaAppShell, type CicaAppShellProps } from './CicaAppShell.js';
export { CicaTopBar, type CicaTopBarProps } from './CicaTopBar.js';
export { CicaThemeControls, type CicaThemeControlsProps } from './CicaThemeControls.js';
export {
  useCicaThemeTokens,
  type CicaSemanticColors,
  type CicaThemeTokens,
} from './useCicaThemeTokens.js';
export {
  CicaClinicalNav,
  buildDefaultCicaNavItems,
  type CicaClinicalNavProps,
  type CicaNavItem,
  type CicaNavBuilderContext,
} from './CicaClinicalNav.js';
export {
  CicaPatientIdentityBand,
  type CicaPatientIdentityBandProps,
} from './CicaPatientIdentityBand.js';
export { CicaContextStrip, type CicaContextStripProps } from './CicaContextStrip.js';
export {
  ClinicalActionBar,
  type ClinicalActionBarProps,
} from './ClinicalActionBar.js';
export { CicaScreenFrame, type CicaScreenFrameProps } from './CicaScreenFrame.js';
export {
  CicaScreenTransition,
  type CicaScreenTransitionProps,
} from './CicaScreenTransition.js';
export {
  CicaPatientScreenFrame,
  type CicaPatientScreenFrameProps,
} from './CicaPatientScreenFrame.js';
export {
  CicaChartTabs,
  inferCicaChartTabFromPathname,
  type CicaChartTabsProps,
} from './CicaChartTabs.js';

export {
  ClinicalScreen,
  ClinicalSection,
  ClinicalFieldGrid,
  ClinicalFieldCell,
  ClinicalOverflowMenu,
  ClinicalLayoutActionBar,
  type ClinicalScreenProps,
  type ClinicalSectionProps,
  type ClinicalFieldGridProps,
  type ClinicalLayoutAction,
  type ClinicalLayoutProfile as ClinicalScreenProfile,
} from '../layout/clinical/index.js';

export {
  PaperModeScreen,
  PaperModeToolbar,
  PaperCanvas,
  type PaperModeScreenProps,
  type PaperModeToolbarProps,
  type PaperCanvasProps,
} from './PaperModeScreen.js';
