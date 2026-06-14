import type {
  ClinicalAlert,
  PatientClinicalSummaryResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
import type { CommandChip } from '@epis2/command-registry';
import { Box, epis2TraditionalChartTokens } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { PatientClinicalSummaryGrid } from '../clinical-summary/PatientClinicalSummaryGrid.js';
import { ClinicalRightContextPanel } from './ClinicalRightContextPanel.js';
import { resolveTraditionalSectionContent } from './sections/index.js';
import { TraditionalClinicalPanel } from './TraditionalClinicalPanel.js';
import { TraditionalSectionMobileNav } from './TraditionalSectionMobileNav.js';
import { TraditionalSectionNav, type TraditionalSectionId } from './TraditionalSectionNav.js';
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
  testId?: string | undefined;
};

/** Ficha electrónica tradicional — nav + panel + contexto colapsable (ADR-002). */
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
  testId = 'epis2-traditional-ehr-mode',
}: TraditionalEhrModeProps) {
  const [activeSection, setActiveSection] = useState<TraditionalSectionId>('navSummary');
  const visibleSectionIds = useMemo(
    () => resolveVisibleTraditionalSections(demoCaseCode),
    [demoCaseCode],
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

  useEffect(() => {
    if (!visibleSectionIds.includes(activeSection)) {
      setActiveSection('navSummary');
    }
  }, [activeSection, visibleSectionIds]);
  const [internalContextOpen, setInternalContextOpen] = useState(true);
  const resolvedContextOpen = contextOpen ?? internalContextOpen;
  const toggleContext = onContextToggle ?? (() => setInternalContextOpen((open) => !open));

  const resolvedMain =
    mainContent ??
    (activeSection === 'navSummary' && summaryFields ? (
      <PatientClinicalSummaryGrid
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
      })
    ));

  return (
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
      <TraditionalSectionMobileNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        visibleSectionIds={visibleSectionIds}
      />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <TraditionalSectionNav
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          visibleSectionIds={visibleSectionIds}
          testId="epis2-traditional-ehr-nav"
        />
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
  );
}
