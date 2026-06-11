import type {
  ClinicalAlert,
  PatientClinicalSummaryResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
import { Box, epis2TraditionalChartShellSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { PatientClinicalSummaryGrid } from '../clinical-summary/PatientClinicalSummaryGrid.js';
import { ClinicalRightContextPanel } from './ClinicalRightContextPanel.js';
import { TraditionalClinicalPanel } from './TraditionalClinicalPanel.js';
import { TraditionalSectionNav, type TraditionalSectionId } from './TraditionalSectionNav.js';

export type TraditionalEhrModeProps = {
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
  mainContent?: ReactNode | undefined;
  contextPane?: ReactNode | undefined;
  contextOpen?: boolean | undefined;
  onContextToggle?: (() => void) | undefined;
  testId?: string | undefined;
};

/** Ficha electrónica tradicional — nav + panel + contexto colapsable (ADR-002). */
export function TraditionalEhrMode({
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
  mainContent,
  contextPane,
  contextOpen,
  onContextToggle,
  testId = 'epis2-traditional-ehr-mode',
}: TraditionalEhrModeProps) {
  const [activeSection, setActiveSection] = useState<TraditionalSectionId>('navSummary');
  const [internalContextOpen, setInternalContextOpen] = useState(true);
  const resolvedContextOpen = contextOpen ?? internalContextOpen;
  const toggleContext = onContextToggle ?? (() => setInternalContextOpen((open) => !open));

  const resolvedMain =
    mainContent ??
    (activeSection === 'navSummary' && summaryFields ? (
      <PatientClinicalSummaryGrid
        surfaceProfile="traditional"
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
      />
    ) : undefined);

  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2TraditionalChartShellSx(),
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <TraditionalSectionNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        testId="epis2-traditional-ehr-nav"
      />
      <TraditionalClinicalPanel activeSection={activeSection}>
        {resolvedMain}
      </TraditionalClinicalPanel>
      {contextPane ? (
        <ClinicalRightContextPanel open={resolvedContextOpen} onToggle={toggleContext}>
          {contextPane}
        </ClinicalRightContextPanel>
      ) : null}
    </Box>
  );
}
