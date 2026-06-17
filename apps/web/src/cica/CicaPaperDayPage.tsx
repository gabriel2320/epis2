import { copy } from '@epis2/design-system';
import {
  EpisButton,
  EpisDemoBadgeChip,
  PaperCanvas,
  PaperModeScreen,
  PaperModeToolbar,
} from '@epis2/epis2-ui';
import { useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { PaperChartMode } from '../components/chart/PaperChartMode.js';
import { PaperDayNavBar } from '../components/chart/paper/PaperDayNavBar.js';
import { ErrorState } from '../components/ErrorState.js';
import { shiftPaperDate } from '../routes/paperStandaloneSearch.js';
import { demoNationalId } from './cicaPatientPresentation.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

function resolvePaperDateParam(date: string | undefined): string {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date().toISOString().slice(0, 10);
}

/** CICA Clean Room — modo papel standalone (/app/pacientes/:patientId/papel/dia/:date). */
export function CicaPaperDayPage() {
  const { date } = useParams({ strict: false }) as { date?: string };
  const paperDate = resolvePaperDateParam(date);
  const { session } = useAuth();
  const { go } = useCicaNavigate();
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation } = page;

  useEffect(() => {
    if (!patientId) go('patient-search');
  }, [go, patientId]);

  const sexLabel = presentation?.identity.sexLabel;

  const recordNumber = useMemo(() => {
    if (!detailQuery.data) return undefined;
    return detailQuery.data.patient.demoCaseCode ?? detailQuery.data.patient.id.slice(0, 8);
  }, [detailQuery.data]);

  if (!patientId) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data || !presentation) return null;

  const detail = detailQuery.data;

  const goPaperDate = (nextDate: string) => {
    go('paper-day', { patientId, date: nextDate });
  };

  return (
    <PaperModeScreen
      toolbar={
        <PaperModeToolbar>
          <EpisButton
            appearance="text"
            size="small"
            data-testid="cica-paper-back-chart"
            onClick={() => go('patient-summary', { patientId })}
          >
            {copy.chartModes.paperStandalone.backToChart}
          </EpisButton>
          <PaperDayNavBar
            paperDate={paperDate}
            onPreviousDay={() => goPaperDate(shiftPaperDate(paperDate, -1))}
            onToday={() => goPaperDate(new Date().toISOString().slice(0, 10))}
            onNextDay={() => goPaperDate(shiftPaperDate(paperDate, 1))}
            trailing={
              <>
                <EpisDemoBadgeChip label={copy.demoBadge} />
                <EpisButton
                  appearance="outlined"
                  size="small"
                  data-testid="cica-paper-print"
                  aria-label={copy.chartModes.printPreview}
                  sx={{ minHeight: 44, flexShrink: 0 }}
                  onClick={() => window.print()}
                >
                  {copy.chartModes.printPreview}
                </EpisButton>
              </>
            }
          />
        </PaperModeToolbar>
      }
      testId="cica-paper-day-screen"
    >
      <PaperCanvas watermark={`${copy.demoBadge} / BORRADOR`}>
        <PaperChartMode
          routeTo="/espacio/ficha/papel"
          patientId={patientId}
          patientName={detail.patient.displayName}
          recordNumber={recordNumber}
          userDisplayName={session?.user.displayName}
          patientStrip={{
            nationalId: demoNationalId(detail.patient.demoCaseCode),
            ageYears: presentation.identity.ageYears,
            sexLabel,
            serviceUnit: presentation.identity.serviceUnit ?? copy.chartModes.shellServiceDefault,
            allergyLabels: [],
          }}
          testId="cica-paper-chart-mode"
        />
      </PaperCanvas>
    </PaperModeScreen>
  );
}
