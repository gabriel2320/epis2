import type {
  ClinicalAlert,
  PatientClinicalSummaryResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
import type { CommandChip } from '@epis2/command-registry';
import { Box, ClinicalScreen, epis2TraditionalChartTokens } from '@epis2/epis2-ui';
import type { ClinicalLayoutAction } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ClinicalPatientViewCdsPanel } from '../cds/ClinicalPatientViewCdsPanel.js';
import { PatientClinicalSummaryGrid } from '../clinical-summary/PatientClinicalSummaryGrid.js';
import { ClassicChartSubNav } from './ClassicChartSubNav.js';
import { ClassicChartTabs } from './ClassicChartTabs.js';
import {
  CLASSIC_CHART_TAB_IDS,
  defaultSectionForTab,
  tabForSection,
  visibleSectionsForCicaClassicTab,
  visibleSectionsForTab,
  type ClassicChartTabId,
} from './classicChartTabConfig.js';
import { ClinicalRightContextPanel } from './ClinicalRightContextPanel.js';
import { resolveTraditionalSectionContent } from './sections/index.js';
import { TraditionalClinicalPanel } from './TraditionalClinicalPanel.js';
import { type TraditionalSectionId } from './TraditionalSectionNav.js';
import { resolveCicaTabLayoutActions } from '../../clinical/clinicalIntent.js';
import { resolveVisibleTraditionalSections } from './traditionalSectionVisibility.js';

export type TraditionalEhrModeProps = {
  demoCaseCode?: string | undefined;
  summaryFields?: Record<string, string> | undefined;
  clinicalSummary?: PatientClinicalSummaryResponse | null | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  alerts?: readonly ClinicalAlert[] | undefined;
  onRegisterAllergy?: (() => void) | undefined;
  onRegisterProblem?: (() => void) | undefined;
  onOpenResults?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  onViewFullTimeline?: (() => void) | undefined;
  onOpenEvolution?: (() => void) | undefined;
  onNewOrder?: (() => void) | undefined;
  onOpenPrescription?: (() => void) | undefined;
  onOpenDocuments?: (() => void) | undefined;
  onPaperMode?: (() => void) | undefined;
  onOpenAuditSection?: (() => void) | undefined;
  onOpenAuditConsole?: (() => void) | undefined;
  probableActionChips?: readonly CommandChip[] | undefined;
  onProbableAction?: ((commandSample: string) => void) | undefined;
  initialTraditionalSection?: TraditionalSectionId | undefined;
  focusTraditionalSection?: TraditionalSectionId | undefined;
  onTraditionalSectionPersist?: ((section: TraditionalSectionId) => void) | undefined;
  mainContent?: ReactNode | undefined;
  contextPane?: ReactNode | undefined;
  contextOpen?: boolean | undefined;
  onContextToggle?: (() => void) | undefined;
  contextEventCount?: number | undefined;
  layoutActions?: readonly ClinicalLayoutAction[] | undefined;
  testId?: string | undefined;
};

/** Ficha electrónica tradicional — tabs clínicos + panel único (MF-AEST-02). */
export function TraditionalEhrMode({
  demoCaseCode,
  summaryFields,
  clinicalSummary,
  longitudinal,
  alerts,
  onRegisterAllergy,
  onRegisterProblem,
  onOpenResults,
  onOpenDraft,
  onViewFullTimeline,
  onOpenEvolution,
  onNewOrder,
  onOpenPrescription,
  onOpenDocuments,
  onPaperMode,
  onOpenAuditSection,
  onOpenAuditConsole,
  probableActionChips,
  onProbableAction,
  initialTraditionalSection,
  focusTraditionalSection,
  onTraditionalSectionPersist,
  mainContent,
  contextPane,
  contextOpen,
  onContextToggle,
  contextEventCount,
  layoutActions,
  testId = 'epis2-traditional-ehr-mode',
}: TraditionalEhrModeProps) {
  const [activeSection, setActiveSection] = useState<TraditionalSectionId>('navSummary');
  const visibleSectionIds = useMemo(
    () => resolveVisibleTraditionalSections(demoCaseCode),
    [demoCaseCode],
  );

  const visibleTabs = useMemo((): ClassicChartTabId[] => {
    return CLASSIC_CHART_TAB_IDS.filter(
      (tab) => visibleSectionsForTab(tab, visibleSectionIds).length > 0,
    );
  }, [visibleSectionIds]);

  const activeTab = tabForSection(activeSection);

  const tabSubsections = useMemo(
    () => visibleSectionsForCicaClassicTab(activeTab, visibleSectionIds),
    [activeTab, visibleSectionIds],
  );

  useEffect(() => {
    if (!initialTraditionalSection) return;
    if (!visibleSectionIds.includes(initialTraditionalSection)) return;
    setActiveSection(initialTraditionalSection);
  }, [initialTraditionalSection, visibleSectionIds]);

  useEffect(() => {
    if (!focusTraditionalSection) return;
    if (!visibleSectionIds.includes(focusTraditionalSection)) return;
    setActiveSection(focusTraditionalSection);
  }, [focusTraditionalSection, visibleSectionIds]);

  const handleSectionChange = (section: TraditionalSectionId) => {
    setActiveSection(section);
    onTraditionalSectionPersist?.(section);
  };

  const handleTabChange = (tab: ClassicChartTabId) => {
    const sections = visibleSectionsForCicaClassicTab(tab, visibleSectionIds);
    const next = sections[0] ?? defaultSectionForTab(tab);
    handleSectionChange(next);
  };

  useEffect(() => {
    if (!visibleSectionIds.includes(activeSection)) {
      setActiveSection('navSummary');
    }
  }, [activeSection, visibleSectionIds]);

  const [internalContextOpen, setInternalContextOpen] = useState(false);
  const resolvedContextOpen = contextOpen ?? internalContextOpen;
  const toggleContext = onContextToggle ?? (() => setInternalContextOpen((open) => !open));

  const resolvedLayoutActions = useMemo(
    () =>
      resolveCicaTabLayoutActions(
        activeTab,
        {
          onOpenEvolution,
          onNewOrder,
          onOpenResults,
          onOpenDocuments,
          onPaperMode,
          onOpenPrescription,
          onOpenAuditSection,
          onOpenAuditConsole,
        },
        { activeSection },
      ),
    [
      activeTab,
      activeSection,
      onNewOrder,
      onOpenAuditConsole,
      onOpenAuditSection,
      onOpenDocuments,
      onOpenEvolution,
      onOpenPrescription,
      onOpenResults,
      onPaperMode,
    ],
  );

  const resolvedMain =
    mainContent ??
    (activeSection === 'navSummary' && summaryFields ? (
      <PatientClinicalSummaryGrid
        compositionMode="cica-classic"
        surfaceProfile="calm"
        summaryFields={summaryFields}
        clinicalSummary={clinicalSummary}
        longitudinal={longitudinal}
        alerts={alerts}
        onRegisterAllergy={onRegisterAllergy}
        onRegisterProblem={onRegisterProblem}
        onOpenResults={onOpenResults}
        onOpenDraft={onOpenDraft}
        onViewFullTimeline={onViewFullTimeline}
        onOpenEvolution={onOpenEvolution}
        probableActionChips={probableActionChips}
        onProbableAction={onProbableAction}
      />
    ) : (
      resolveTraditionalSectionContent({
        sectionId: activeSection,
        demoCaseCode,
        longitudinal,
        onRegisterAllergy,
        onOpenEvolution,
        onOpenDraft,
        compositionMode: 'cica-classic',
      })
    ));

  return (
    <ClinicalScreen
      profile="classic-chart"
      tabs={
        <ClassicChartTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          visibleTabs={visibleTabs}
          testId="classic-chart-tabs"
        />
      }
      actions={layoutActions ?? resolvedLayoutActions}
      hideActionBar={!(layoutActions?.length ?? resolvedLayoutActions.length)}
      testId="clinical-screen"
    >
      <Box
        data-testid={testId}
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: epis2TraditionalChartTokens.shellBg,
        }}
      >
        {alerts && alerts.length > 0 ? <ClinicalPatientViewCdsPanel alerts={alerts} /> : null}
        <ClassicChartSubNav
          sections={tabSubsections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <Box
          sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}
        >
          <TraditionalClinicalPanel activeSection={activeSection}>
            {resolvedMain}
          </TraditionalClinicalPanel>
          {contextPane ? (
            <ClinicalRightContextPanel
              open={resolvedContextOpen}
              onToggle={toggleContext}
              contextEventCount={contextEventCount}
            >
              {contextPane}
            </ClinicalRightContextPanel>
          ) : null}
        </Box>
      </Box>
    </ClinicalScreen>
  );
}
