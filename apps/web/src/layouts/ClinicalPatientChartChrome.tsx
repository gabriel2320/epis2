import { copy } from '@epis2/design-system';
import { EpisDemoBadgeChip, EpisPatientChartShell, ScienceIcon, Stack } from '@epis2/epis2-ui';
import { useRouterState } from '@tanstack/react-router';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import {
  PATIENT_CHART_TABS,
  patientChartTabTarget,
  resolvePatientChartTabId,
} from '../clinical/patientChartNavigation.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

/** Cabecera N1–N2 cuando hay paciente activo en rutas clínicas. */
export function ClinicalPatientChartChrome() {
  const { patient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!patient || pathname.startsWith('/espacio/buscar-paciente')) {
    return null;
  }

  const activeTabId = resolvePatientChartTabId(pathname);
  const metaParts = [patient.demoCaseCode ? `Demo ${patient.demoCaseCode}` : null].filter(
    Boolean,
  );

  return (
    <EpisPatientChartShell
      displayName={patient.displayName}
      meta={metaParts.join(' · ') || undefined}
      alerts={[]}
      tabs={PATIENT_CHART_TABS}
      activeTabId={activeTabId}
      onTabChange={(tabId) => {
        const target = patientChartTabTarget(tabId as typeof activeTabId, patient.id);
        void navigate(target);
      }}
      contextBarTrailing={
        <Stack direction="row" spacing={0.5} alignItems="center">
          <EpisDemoBadgeChip icon={<ScienceIcon />} label={copy.demoBadge} />
        </Stack>
      }
    />
  );
}
