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
  isCicaLetterRoute,
  isCicaSidebarHiddenRoute,
  parseCicaPatientId,
  parseCicaEvolutionId,
  todayIsoDate,
  type CicaScreenId,
  type CicaRouteParams,
} from './cicaRoutes.js';
export { CicaAppShell, type CicaAppShellProps } from './CicaAppShell.js';
export { cicaEpis2gVisual, resolveCicaEpis2gSurfaces } from './cicaEpis2gVisual.js';
export {
  type CicaBlueprintAction,
  type CicaBlueprintSection,
  type CicaBlueprintSectionSpan,
  type CicaGeneratedScreenProps,
  type CicaScreenBlueprint,
} from './cicaScreenBlueprint.js';
export { CicaGeneratedScreen, CicaBlueprintBody } from './CicaGeneratedScreen.js';
export {
  createTrivialCicaBlueprint,
  resolveTrivialCicaBlueprintFromRegistry,
} from './resolveCicaBlueprint.js';
export { CicaSidebarThemePanel, type CicaSidebarThemePanelProps } from './CicaSidebarThemePanel.js';
export {
  CicaSidebar,
  type CicaSidebarProps,
  type CicaSidebarPatientContext,
} from './CicaSidebar.js';
export {
  buildCicaSidebarSections,
  buildCicaSystemSidebarSections,
  buildCicaPatientSidebarSection,
  buildCicaPatientMoreSidebarSection,
  type CicaSidebarItem,
  type CicaSidebarSection,
  type CicaSidebarNavContext,
} from './cicaSidebarNav.js';
export { CicaLetterPageShell, type CicaLetterPageShellProps } from './CicaLetterPageShell.js';
export { CicaBookPager, type CicaBookPagerProps } from './CicaBookPager.js';
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
  CicaClinicalList,
  type CicaClinicalListItem,
  type CicaClinicalListProps,
} from './CicaClinicalList.js';
export { ClinicalActionBar, type ClinicalActionBarProps } from './ClinicalActionBar.js';
export { CicaScreenFrame, type CicaScreenFrameProps } from './CicaScreenFrame.js';
export { CicaScreenTransition, type CicaScreenTransitionProps } from './CicaScreenTransition.js';
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
