import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { inferCicaChartTabFromPathname } from '@epis2/epis2-ui';
import { useLocation, useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { mergeClinicalSummaryFields } from '../../clinical/mergeClinicalSummaryFields.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { getDemoCaseByPatientId } from '../../fixtures/devFixturesBridge.js';
import { usePatientClinicalSummaryQuery } from '../../query/hooks/usePatientClinicalSummaryQuery.js';
import { usePatientDetailQuery } from '../../query/hooks/usePatientDetailQuery.js';
import { usePatientLongitudinalQuery } from '../../query/hooks/usePatientLongitudinalQuery.js';
import { buildCicaPatientPresentation } from '../cicaPatientPresentation.js';
import { useCicaNavigate } from './useCicaNavigate.js';

export type UseCicaPatientPageResult = {
  patientId: string | undefined;
  activeTabId: ReturnType<typeof inferCicaChartTabFromPathname>;
  detailQuery: ReturnType<typeof usePatientDetailQuery>;
  longitudinal: PatientLongitudinalResponse | null | undefined;
  summaryFields: Record<string, string>;
  demoCase: ReturnType<typeof getDemoCaseByPatientId>;
  presentation: ReturnType<typeof buildCicaPatientPresentation> | undefined;
  go: ReturnType<typeof useCicaNavigate>['go'];
  goPath: ReturnType<typeof useCicaNavigate>['goPath'];
};

/**
 * Hook único para páginas ficha CICA — datos, presentación y navegación.
 * Añadir una sección: registry + página que use este hook + children.
 */
export function useCicaPatientPage(): UseCicaPatientPageResult {
  const { patientId } = useParams({ strict: false }) as { patientId?: string };
  const { pathname } = useLocation();
  const { setPatient } = useActivePatient();
  const { go, goPath } = useCicaNavigate();

  const detailQuery = usePatientDetailQuery(patientId);
  const longitudinalQuery = usePatientLongitudinalQuery(patientId, Boolean(patientId));
  const clinicalSummaryQuery = usePatientClinicalSummaryQuery(patientId, Boolean(patientId));

  useEffect(() => {
    if (!patientId) {
      go('patient-search');
    }
  }, [go, patientId]);

  useEffect(() => {
    if (detailQuery.data) {
      setPatient(detailQuery.data.patient);
    }
  }, [detailQuery.data, setPatient]);

  const demoCase = useMemo(
    () => (patientId ? getDemoCaseByPatientId(patientId) : undefined),
    [patientId],
  );

  const summaryFields = useMemo(() => {
    const base = detailQuery.data?.clinicalContext.summaryFields ?? {};
    return mergeClinicalSummaryFields(base, clinicalSummaryQuery.data);
  }, [detailQuery.data, clinicalSummaryQuery.data]);

  const presentation = useMemo(() => {
    if (!detailQuery.data) return undefined;
    return buildCicaPatientPresentation(detailQuery.data.patient.displayName, demoCase);
  }, [detailQuery.data, demoCase]);

  return {
    patientId,
    activeTabId: inferCicaChartTabFromPathname(pathname),
    detailQuery,
    longitudinal: longitudinalQuery.data,
    summaryFields,
    demoCase,
    presentation,
    go,
    goPath,
  };
}
