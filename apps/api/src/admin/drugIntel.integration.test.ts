/**
 * Drug-Intel (MF-183): revisión humana y promoción del staging de fármacos.
 * El pipeline carga `drug_intel_staging`; aquí se valida el ciclo
 * revisión → aprobación → promoción a `clinical_catalog_staging` (medication).
 */
import postgres from 'postgres';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { afterAll, beforeAll, expect, it } from 'vitest';
import type { DrugIntelRecord } from '@epis2/contracts';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const recordKey = `isp-test-${Date.now()}`;

function makeRecord(): DrugIntelRecord {
  return {
    recordKey,
    productName: 'LOSARTÁN TEST 50 mg COMPRIMIDOS',
    activeIngredient: 'Losartán potásico',
    atcCode: 'C09CA01',
    ispRegistry: { registryId: 'F-TEST/26', saleCondition: 'Receta médica', status: 'Vigente' },
    pharmaceuticalForms: ['Comprimido recubierto'],
    recommendedDoses: [{ population: 'adult', text: '50 mg una vez al día', source: 'openfda' }],
    prices: [
      {
        amountClp: 3490,
        currency: 'CLP',
        source: 'tufarmacia.gob.cl (MINSAL)',
        fetchedAt: '2026-06-10T00:00:00.000Z',
        referential: true,
      },
    ],
    warnings: [{ text: 'Riesgo de hipotensión', source: 'openfda:warnings' }],
    ispAlerts: [],
    adverseReactions: [{ text: 'Mareos, hiperkalemia', source: 'openfda:adverse_reactions' }],
    sources: ['https://registrosanitario.ispch.gob.cl'],
    correlation: {
      status: 'consistent',
      requiresHumanReview: false,
      discrepancies: [],
      correlatedAt: '2026-06-10T00:00:00.000Z',
    },
    fetchedAt: '2026-06-10T00:00:00.000Z',
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

describeIntegration('admin drug-intel (integration)', () => {
  let sql: ReturnType<typeof postgres>;

  beforeAll(async () => {
    sql = postgres(process.env.DATABASE_URL!, { max: 1 });
    const record = makeRecord();
    await sql`
      INSERT INTO drug_intel_staging (
        record_key, product_name, active_ingredient, atc_code,
        requires_human_review, payload, source_hash, fetched_at
      ) VALUES (
        ${record.recordKey}, ${record.productName}, ${record.activeIngredient!},
        ${record.atcCode!}, false, ${sql.json(record as never)}, 'hash-test', ${record.fetchedAt}
      )
      ON CONFLICT (record_key) DO NOTHING
    `;
  });

  afterAll(async () => {
    await sql`DELETE FROM clinical_catalog_staging WHERE catalog_code = 'medication' AND entry_code = ${recordKey}`;
    await sql`DELETE FROM drug_intel_staging WHERE record_key = ${recordKey}`;
    await sql.end();
  });

  it('GET /api/admin/drug-intel — admin lista staging; médico recibe 403', async () => {
    const app = await buildApp(config);
    const adminCookie = await loginCookie(app, 'admin.demo', 'DEMO-CLAVE-ADMIN');
    const physicianCookie = await loginCookie(app, 'medico.demo', 'DEMO-CLAVE-MEDICO');

    const ok = await app.inject({
      method: 'GET',
      url: '/api/admin/drug-intel?status=pending',
      headers: { cookie: adminCookie },
    });
    expect(ok.statusCode).toBe(200);
    const entries = (
      ok.json() as { entries: Array<{ recordKey: string; record: DrugIntelRecord }> }
    ).entries;
    const entry = entries.find((e) => e.recordKey === recordKey);
    expect(entry).toBeDefined();
    expect(entry!.record.prices[0]!.referential).toBe(true);

    const invalidStatus = await app.inject({
      method: 'GET',
      url: '/api/admin/drug-intel?status=otra',
      headers: { cookie: adminCookie },
    });
    expect(invalidStatus.statusCode).toBe(400);

    const forbidden = await app.inject({
      method: 'GET',
      url: '/api/admin/drug-intel',
      headers: { cookie: physicianCookie },
    });
    expect(forbidden.statusCode).toBe(403);

    await app.close();
  });

  it('review + promote — aprobación humana auditada llega al catálogo medication', async () => {
    const app = await buildApp(config);
    const adminCookie = await loginCookie(app, 'admin.demo', 'DEMO-CLAVE-ADMIN');
    const auditorCookie = await loginCookie(app, 'auditor.demo', 'DEMO-CLAVE-AUDITOR');

    const list = await app.inject({
      method: 'GET',
      url: '/api/admin/drug-intel',
      headers: { cookie: adminCookie },
    });
    const entries = (list.json() as { entries: Array<{ id: string; recordKey: string }> }).entries;
    const target = entries.find((e) => e.recordKey === recordKey)!;

    // El auditor (sin admin.catalogs.write) no puede revisar ni promover.
    const forbiddenReview = await app.inject({
      method: 'POST',
      url: `/api/admin/drug-intel/${target.id}/review`,
      headers: { cookie: auditorCookie },
      payload: { decision: 'approved' },
    });
    expect(forbiddenReview.statusCode).toBe(403);

    const reviewed = await app.inject({
      method: 'POST',
      url: `/api/admin/drug-intel/${target.id}/review`,
      headers: { cookie: adminCookie },
      payload: { decision: 'approved', note: 'validado contra ficha ISP' },
    });
    expect(reviewed.statusCode).toBe(200);
    const reviewedEntry = (
      reviewed.json() as { entry: { reviewStatus: string; reviewedBy: string | null } }
    ).entry;
    expect(reviewedEntry.reviewStatus).toBe('approved');
    expect(reviewedEntry.reviewedBy).not.toBeNull();

    const promoted = await app.inject({
      method: 'POST',
      url: '/api/admin/drug-intel/promote',
      headers: { cookie: adminCookie },
    });
    expect(promoted.statusCode).toBe(200);
    const promotion = promoted.json() as { promoted: number; catalogCode: string };
    expect(promotion.catalogCode).toBe('medication');
    expect(promotion.promoted).toBeGreaterThanOrEqual(1);

    // El fármaco aprobado queda en el catálogo staging consumible.
    const catalogs = await app.inject({
      method: 'GET',
      url: '/api/admin/catalogs?catalogCode=medication',
      headers: { cookie: adminCookie },
    });
    expect(catalogs.statusCode).toBe(200);
    const catalogEntries = (catalogs.json() as { entries: Array<{ entryCode: string }> }).entries;
    expect(catalogEntries.some((e) => e.entryCode === recordKey)).toBe(true);

    // Promote repetido no duplica (UNIQUE catalog_code/entry_code + onConflictDoNothing).
    const repeat = await app.inject({
      method: 'POST',
      url: '/api/admin/drug-intel/promote',
      headers: { cookie: adminCookie },
    });
    expect(repeat.statusCode).toBe(200);
    const repeatedCatalog = await app.inject({
      method: 'GET',
      url: '/api/admin/catalogs?catalogCode=medication',
      headers: { cookie: adminCookie },
    });
    const repeatedEntries = (repeatedCatalog.json() as { entries: Array<{ entryCode: string }> })
      .entries;
    expect(repeatedEntries.filter((e) => e.entryCode === recordKey)).toHaveLength(1);

    const cuerpoInvalido = await app.inject({
      method: 'POST',
      url: `/api/admin/drug-intel/${target.id}/review`,
      headers: { cookie: adminCookie },
      payload: { decision: 'auto-approve' },
    });
    expect(cuerpoInvalido.statusCode).toBe(400);

    await app.close();
  });
});
