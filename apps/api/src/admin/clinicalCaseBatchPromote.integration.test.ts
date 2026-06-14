/**
 * MF-CASE-08: promote batch de casos SIM vía API admin (staging → SoT).
 */
import postgres from 'postgres';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { SIM_CLINICAL_CASES } from '@epis2/test-fixtures';
import { stableSimCaseUuids } from '@epis2/test-fixtures/node';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { clinicalCaseRecordSchema } from '@epis2/contracts';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const BATCH_PREFIX = `SIM-BATCH-${Date.now()}`;

function makeBatchRecord(caseCode: string, displayName: string) {
  const ids = stableSimCaseUuids(caseCode);
  return clinicalCaseRecordSchema.parse({
    caseCode,
    tier: 'L0_synthetic',
    provenance: {
      sourceType: 'scraped',
      sourceName: 'synthea',
      license: 'CC0-1.0',
      scrapedAt: '2026-06-12T12:00:00.000Z',
    },
    patient: {
      displayName,
      birthDate: '1980-01-01',
      sex: 'F',
      isSynthetic: true,
    },
    clinical: {
      scenario: 'Batch promote test (sintético)',
      problems: ['Hipertensión arterial esencial (sintético)'],
      observations: [{ label: 'PA', valueText: '130/80 mmHg (sintético)' }],
    },
    epis2Mapping: {
      patientId: ids.patientId,
      encounterId: ids.encounterId,
      encounterStatus: 'open',
      summaryFields: {
        activeProblems: 'HTA',
        recentEvents: 'Estable (sintético)',
        relevantLabs: 'PA 130/80',
        activeMedications: '—',
        pendingItems: 'Control',
        clinicalAlerts: 'SIM / SINTÉTICO — sin alertas reales',
      },
      identifierSystem: 'EPIS2-SIM',
    },
    generation: {
      promptVersion: 'mf-case-08-batch',
      requiresHumanReview: true,
      contentHash: `batch-${caseCode}`,
    },
    fetchedAt: '2026-06-12T12:00:00.000Z',
  });
}

async function loginAdminCookie(app: Awaited<ReturnType<typeof buildApp>>) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username: 'admin.demo', demoAuthKey: 'DEMO-CLAVE-ADMIN' },
  });
  expect(login.statusCode).toBe(200);
  return String(login.headers['set-cookie']).split(';')[0]!;
}

describeIntegration('admin clinical-cases batch promote (MF-CASE-08)', () => {
  let sql: ReturnType<typeof postgres>;
  const caseCodes = [
    `${BATCH_PREFIX}-A`,
    `${BATCH_PREFIX}-B`,
  ];
  const patientIds = caseCodes.map((c) => stableSimCaseUuids(c).patientId);

  beforeAll(async () => {
    sql = postgres(process.env.DATABASE_URL!, { max: 1 });
    for (const [index, caseCode] of caseCodes.entries()) {
      const record = makeBatchRecord(caseCode, `Paciente Sim — Batch ${index + 1}`);
      await sql`
        INSERT INTO clinical_case_staging (
          case_code, scenario, requires_human_review, payload, source_hash, fetched_at, review_status
        ) VALUES (
          ${record.caseCode},
          ${record.clinical.scenario},
          true,
          ${sql.json(record as never)},
          ${`hash-${caseCode}`},
          ${record.fetchedAt},
          'approved'
        )
        ON CONFLICT (case_code) DO UPDATE SET
          payload = EXCLUDED.payload,
          review_status = 'approved',
          reviewed_by = 'usr-admin-01',
          reviewed_at = NOW()
      `;
    }
  });

  afterAll(async () => {
    for (const patientId of patientIds) {
      await sql`DELETE FROM observations WHERE patient_id = ${patientId}`;
      await sql`DELETE FROM problems WHERE patient_id = ${patientId}`;
      await sql`DELETE FROM encounters WHERE patient_id = ${patientId}`;
      await sql`DELETE FROM patient_identifiers WHERE patient_id = ${patientId}`;
      await sql`DELETE FROM patients WHERE id = ${patientId}`;
    }
    for (const caseCode of caseCodes) {
      await sql`DELETE FROM clinical_case_staging WHERE case_code = ${caseCode}`;
    }
    await sql.end();
  });

  it('POST /api/admin/clinical-cases/promote promueve batch aprobado', async () => {
    const app = await buildApp(config);
    const cookie = await loginAdminCookie(app);

    const promote = await app.inject({
      method: 'POST',
      url: '/api/admin/clinical-cases/promote',
      headers: { cookie },
    });
    expect(promote.statusCode).toBe(200);
    const body = promote.json() as { promoted: number; skipped: number };
    expect(body.promoted).toBeGreaterThanOrEqual(2);

    for (const caseCode of caseCodes) {
      const rows = await sql<{ patient_id: string }[]>`
        SELECT patient_id FROM patient_identifiers
        WHERE system = 'EPIS2-SIM' AND value = ${caseCode}
      `;
      expect(rows).toHaveLength(1);
    }
  });

  it('fixtures SIM_CLINICAL_CASES alineadas con catálogo piloto', () => {
    expect(SIM_CLINICAL_CASES.length).toBeGreaterThanOrEqual(10);
  });
});
