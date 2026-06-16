import { copy } from '@epis2/design-system';
import { getDemoCaseByPatientId } from '../fixtures/devFixturesBridge.js';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { Box, ClinicalScreen, EpisDemoBadgeChip, epis2PaperCalmCanvasSx } from '@epis2/epis2-ui';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { ClinicalTransversalCommandDock } from '../components/chart/ClinicalTransversalCommandDock.js';
import { ClinicalPageNav } from '../components/ClinicalPageNav.js';
import { resolvePaperModeIntent } from '../clinical/clinicalIntent.js';
import { PaperChartMode } from '../components/chart/PaperChartMode.js';
import { PaperDayNavBar } from '../components/chart/paper/PaperDayNavBar.js';
import { ErrorState } from '../components/ErrorState.js';
import { usePatientDetailQuery } from '../query/hooks/usePatientDetailQuery.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import {
  PAPER_STANDALONE_ROUTE,
  parsePaperStandaloneSearch,
  resolvePaperDate,
  shiftPaperDate,
} from '../routes/paperStandaloneSearch.js';

function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

function demoNationalId(demoCaseCode: string | undefined): string | undefined {
  if (!demoCaseCode) return undefined;
  return `${demoCaseCode} · ${copy.chartModes.identitySyntheticId}`;
}

/** MF-AEST-03 — modo papel exclusivo, pantalla completa, navegación por día. */
export function StandalonePaperChartPage() {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const search = parsePaperStandaloneSearch(rawSearch);
  const navigate = useClinicalNavigate();
  const { session } = useAuth();
  const { setPatient } = useActivePatient();
  const patientId = search.patientId;
  const paperDate = resolvePaperDate(search);
  const detailQuery = usePatientDetailQuery(patientId);
  const demoCase = useMemo(
    () => (patientId ? getDemoCaseByPatientId(patientId) : undefined),
    [patientId],
  );

  useEffect(() => {
    if (!patientId) {
      void navigate({ to: '/espacio/buscar-paciente' });
    }
  }, [navigate, patientId]);

  useEffect(() => {
    if (detailQuery.data) {
      setPatient(detailQuery.data.patient);
    }
  }, [detailQuery.data, setPatient]);

  const goPaperDate = (nextDate: string) => {
    if (!patientId) return;
    void navigate({
      to: PAPER_STANDALONE_ROUTE,
      search: {
        patientId,
        paperDate: nextDate,
        chartMode: 'paper',
        paperSurface: search.paperSurface,
        plannerView: search.plannerView,
        section: search.section,
        printFormat: search.printFormat,
      },
    });
  };

  if (!patientId) {
    return null;
  }

  if (detailQuery.isError) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.errors.genericMessage} onRetry={() => detailQuery.refetch()} />;
  }

  if (!detailQuery.data) {
    return null;
  }

  const detail = detailQuery.data;
  const sexLabel =
    demoCase?.sex === 'F'
      ? copy.chartModes.sexFemale
      : demoCase?.sex === 'M'
        ? copy.chartModes.sexMale
        : undefined;
  const allergyLabels: readonly string[] = [];
  const paperIntent = resolvePaperModeIntent();

  return (
    <Box
      data-testid="epis2-paper-standalone-page"
      data-cica-composition="classic"
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...epis2PaperCalmCanvasSx(),
      }}
    >
      <Box sx={{ flexShrink: 0, px: { xs: 1.5, md: 2 }, pt: 1 }}>
        <ClinicalPageNav
          patientId={patientId}
          patientDisplayName={detail.patient.displayName}
          sectionLabel={paperIntent.sectionLabel}
        />
        <ClinicalTransversalCommandDock patientId={patientId} testId="epis2-paper-command-bar" />
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ClinicalScreen
        profile="paper-mode"
        title={copy.chartModes.paperStandalone.pageTitle}
        hideActionBar
        toolbar={
          <PaperDayNavBar
            paperDate={paperDate}
            onPreviousDay={() => goPaperDate(shiftPaperDate(paperDate, -1))}
            onToday={() => goPaperDate(new Date().toISOString().slice(0, 10))}
            onNextDay={() => goPaperDate(shiftPaperDate(paperDate, 1))}
            trailing={
              detail.patient.demoCaseCode ? (
                <EpisDemoBadgeChip
                  label={copy.demoBadge}
                  data-testid="epis2-paper-standalone-demo-badge"
                />
              ) : null
            }
          />
        }
        testId="clinical-screen"
      >
        <PaperChartMode
          routeTo={PAPER_STANDALONE_ROUTE}
          patientId={patientId}
          patientName={detail.patient.displayName}
          recordNumber={detail.patient.demoCaseCode ?? detail.patient.id.slice(0, 8)}
          userDisplayName={session?.user.displayName}
          patientStrip={{
            nationalId: demoNationalId(detail.patient.demoCaseCode),
            ageYears: demoCase ? ageFromBirthDate(demoCase.birthDate) : undefined,
            sexLabel,
            serviceUnit: demoCase?.scenario ?? copy.chartModes.shellServiceDefault,
            allergyLabels,
          }}
        />
      </ClinicalScreen>
      </Box>
    </Box>
  );
}
