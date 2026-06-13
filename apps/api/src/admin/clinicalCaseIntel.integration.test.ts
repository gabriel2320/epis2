/**
 * Clinical-Case-Intel (MF-CASE-03): revisión humana y promoción del staging
 * de casos sintéticos → pacientes/encuentros SoT con is_synthetic=true.
 */
import postgres from 'postgres';
import { afterAll, beforeAll, expect, it } from 'vitest';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { SIM_IDENTIFIER_SYSTEM } from '@epis2/test-fixtures';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const caseCode = `SIM-TEST-${Date.now()}`;

function makeRecord(): ClinicalCaseRecord {
  return {
    caseCode,
    tier: 'L0_synthetic',
    provenance: {
      sourceType: 'hybrid',
      sourceName: 'synthea',
      license: 'CC0-1.0',
      scrapedAt: '2026-06-12T12:00:00.000Z',
    },
    patient: {
      displayName: 'Paciente Sim — Integración API',
      birthDate: '1975-06-10',
      sex: 'M',
      isSynthetic: true,
    },
    clinical: {
      scenario: 'HTA en control ambulatorio (sintético)',
      problems: ['Hipertensión arterial esencial (sintético)'],
      observations: [{ label: 'PA', valueText: '138/86 mmHg (sintético)' }],
      medications: [{ name: 'Losartán (demo)', doseText: '50 mg/día', status: 'active' }],
    },
    epis2Mapping: {
      encounterStatus: 'open',
      summaryFields: {
        activeProblems: 'HTA',
        recentEvents: 'Sin síntomas agudos (sintético)',
        relevantLabs: 'PA 138/86',
        activeMedications: 'Losartán',
        pendingItems: 'Control en 7 días',
        clinicalAlerts: 'SIM / SINTÉTICO — sin alertas reales',
      },
      identifierSystem: 'EPIS2-SIM',
    },
    generation: {
      promptVersion: 'mf-case-03-test',
      requiresHumanReview: true,
      contentHash: 'hash-integration-test',
    },
    fetchedAt: '2026-06-12T12:00:00.000Z',
  };
}

async function loginCookie(
  app: Awaited<ReturnType<typeof buildApp>>,
  username: string,
  demoAuthKey: string,
) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username, demoAuthKey },
  });
  expect(login.statusCode).toBe(200);
  return String(login.headers['set-cookie']).split(';')[0]!;
}

describeIntegration('admin clinical-cases (integration)', () => {
  let sql: ReturnType<typeof postgres>;
  let patientId: string | null = null;

  beforeAll(async () => {
    sql = postgres(process.env.DATABASE_URL!, { max: 1 });
    const record = makeRecord();
    await sql`
      INSERT INTO clinical_case_staging (
        case_code, scenario, requires_human_review, payload, source_hash, fetched_at
      ) VALUES (
        ${record.caseCode},
        ${record.clinical.scenario},
        true,
        ${sql.json(record as never)},
        'hash-integration-test',
        ${record.fetchedAt}
      )
      ON CONFLICT (case_code) DO NOTHING
    `;
  });

  afterAll(async () => {
    if (patientId) {
      await sql`DELETE FROM patients WHERE id = ${patientId}`;
    }
    await sql`DELETE FROM clinical_case_staging WHERE case_code = ${caseCode}`;
    await sql.end();
  });

  it('GET /api/admin/clinical-cases — admin lista staging; médico recibe 403', async () => {
    const app = await buildApp(config);
    const adminCookie = await loginCookie(app, 'admin.demo', 'DEMO-CLAVE-ADMIN');
    const physicianCookie = await loginCookie(app, 'medico.demo', 'DEMO-CLAVE-MEDICO');

    const ok = await app.inject({
      method: 'GET',
      url: '/api/admin/clinical-cases?status=pending',
      headers: { cookie: adminCookie },
    });
    expect(ok.statusCode).toBe(200);
    const entries = (
      ok.json() as { entries: Array<{ caseCode: string; record: ClinicalCaseRecord }> }
    ).entries;
    expect(entries.some((e) => e.caseCode === caseCode)).toBe(true);

    const forbidden = await app.inject({
      method: 'GET',
      url: '/api/admin/clinical-cases',
      headers: { cookie: physicianCookie },
    });
    expect(forbidden.statusCode).toBe(403);

    await app.close();
  });

  it('review + promote — caso aprobado llega a pacientes sintéticos con EPIS2-SIM', async () => {
    const app = await buildApp(config);
    const adminCookie = await loginCookie(app, 'admin.demo', 'DEMO-CLAVE-ADMIN');
    const auditorCookie = await loginCookie(app, 'auditor.demo', 'DEMO-CLAVE-AUDITOR');

    const list = await app.inject({
      method: 'GET',
      url: '/api/admin/clinical-cases',
      headers: { cookie: adminCookie },
    });
    const entries = (list.json() as { entries: Array<{ id: string; caseCode: string }> }).entries;
    const target = entries.find((e) => e.caseCode === caseCode)!;

    const forbiddenReview = await app.inject({
      method: 'POST',
      url: `/api/admin/clinical-cases/${target.id}/review`,
      headers: { cookie: auditorCookie },
      payload: { decision: 'approved' },
    });
    expect(forbiddenReview.statusCode).toBe(403);

    const reviewed = await app.inject({
      method: 'POST',
      url: `/api/admin/clinical-cases/${target.id}/review`,
      headers: { cookie: adminCookie },
      payload: { decision: 'approved', note: 'coherencia clínica demo OK' },
    });
    expect(reviewed.statusCode).toBe(200);
    const reviewedEntry = (
      reviewed.json() as { entry: { reviewStatus: string; reviewedBy: string | null } }
    ).entry;
    expect(reviewedEntry.reviewStatus).toBe('approved');
    expect(reviewedEntry.reviewedBy).not.toBeNull();

    const promoted = await app.inject({
      method: 'POST',
      url: '/api/admin/clinical-cases/promote',
      headers: { cookie: adminCookie },
    });
    expect(promoted.statusCode).toBe(200);
    const promotion = promoted.json() as { promoted: number; skipped: number };
    expect(promotion.promoted).toBeGreaterThanOrEqual(1);

    const [identifier] = await sql<{ patient_id: string }[]>`
      SELECT patient_id FROM patient_identifiers
      WHERE system = ${SIM_IDENTIFIER_SYSTEM} AND value = ${caseCode}
    `;
    expect(identifier?.patient_id).toBeTruthy();
    patientId = identifier!.patient_id;

    const patients = await app.inject({
      method: 'GET',
      url: '/api/patients',
      headers: { cookie: await loginCookie(app, 'medico.demo', 'DEMO-CLAVE-MEDICO') },
    });
    expect(patients.statusCode).toBe(200);
    const listPatients = (
      patients.json() as { patients: Array<{ id: string; demoCaseCode?: string }> }
    ).patients;
    expect(listPatients.some((p) => p.id === patientId && p.demoCaseCode === caseCode)).toBe(true);

    const repeat = await app.inject({
      method: 'POST',
      url: '/api/admin/clinical-cases/promote',
      headers: { cookie: adminCookie },
    });
    expect(repeat.statusCode).toBe(200);
    expect((repeat.json() as { skipped: number }).skipped).toBeGreaterThanOrEqual(1);

    await app.close();
  });
});
