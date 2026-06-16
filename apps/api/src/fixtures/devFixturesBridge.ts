import { isDeployedEnv, type AppConfig } from '../config.js';

type DemoClinicalCaseSummary = {
  demoCaseCode: string;
  summaryFields: Record<string, string>;
};

let demoCaseByPatientId:
  | ((patientId: string) => DemoClinicalCaseSummary | undefined)
  | null
  | undefined;

function readNodeEnv(): AppConfig['NODE_ENV'] {
  const raw = process.env.NODE_ENV;
  if (raw === 'test' || raw === 'staging' || raw === 'production') return raw;
  return 'development';
}

async function loadDemoCaseByPatientId() {
  const nodeEnv = readNodeEnv();
  if (isDeployedEnv(nodeEnv)) return null;
  if (demoCaseByPatientId !== undefined) return demoCaseByPatientId;
  const { getDemoCaseByPatientId } = await import('@epis2/test-fixtures');
  demoCaseByPatientId = getDemoCaseByPatientId;
  return demoCaseByPatientId;
}

/** Dev/test only — staging/production never load @epis2/test-fixtures (MF-CON-09). */
export async function resolveDemoCaseByPatientId(
  patientId: string,
): Promise<DemoClinicalCaseSummary | undefined> {
  const lookup = await loadDemoCaseByPatientId();
  return lookup?.(patientId);
}
