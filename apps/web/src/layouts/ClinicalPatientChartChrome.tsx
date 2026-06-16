import { copy } from '@epis2/design-system';
import {
  EpisDemoBadgeChip,
  EpisDraftStatus,
  EpisPatientChartShell,
  ScienceIcon,
  Stack,
} from '@epis2/epis2-ui';
import { useRouterState } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { getPrimaryNarrativeForDemoCode } from '../clinical/demoNarrativePresentation.js';
import {
  PATIENT_CHART_TABS,
  patientChartTabTarget,
  resolvePatientChartTabId,
} from '../clinical/patientChartNavigation.js';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';
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
  const narrative = patient.demoCaseCode
    ? getPrimaryNarrativeForDemoCode(patient.demoCaseCode)
    : undefined;
  const metaParts = [
    narrative?.titleEs,
    narrative?.settingEs,
    patient.demoCaseCode ? patient.demoCaseCode : null,
  ].filter(Boolean);
  const metaLine = metaParts.join(' · ');
  const draftsQuery = useDraftsQuery({ patientId: patient.id });
  const openDraftStatus = useMemo(() => {
    const drafts = draftsQuery.data ?? [];
    const open = drafts.find(
      (row) => row.status !== 'approved' && row.status !== 'cancelled' && row.status !== 'rejected',
    );
    return open?.status;
  }, [draftsQuery.data]);

  return (
    <EpisPatientChartShell
      displayName={patient.displayName}
      {...(metaLine ? { meta: metaLine } : {})}
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
          {openDraftStatus ? <EpisDraftStatus status={openDraftStatus} /> : null}
        </Stack>
      }
    />
  );
}
