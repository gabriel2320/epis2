import { describeIntegration } from '@epis2/test-fixtures';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { testApiConfig } from '../testConfig.js';
import { listApprovedNotes } from './service.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

describeIntegration('clinical API (integration)', () => {
  it('borrador aprobado aparece en notas; borrador pendiente no', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const patients = await app.inject({
      method: 'GET',
      url: '/api/patients',
      headers: { cookie },
    });
    const list = (patients.json() as {
      patients: { id: string; isSynthetic?: boolean; demoLabel?: string; demoCaseCode?: string }[];
    }).patients;
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.every((p) => p.isSynthetic && p.demoLabel === 'DEMO/SINTÉTICO')).toBe(true);
    expect(list.some((p) => p.demoCaseCode === 'DEMO-005')).toBe(true);

    const patientId = list.find((p) => p.demoCaseCode === 'DEMO-005')?.id ?? list[0]?.id;
    if (!patientId) throw new Error('Sin pacientes de demo en la base');

    const detail = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}`,
      headers: { cookie },
    });
    expect(detail.statusCode).toBe(200);
    const detailJson = detail.json() as {
      clinicalContext: { summaryFields: Record<string, string> };
    };
    expect(Object.keys(detailJson.clinicalContext.summaryFields).length).toBeGreaterThan(0);

    const alerts = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}/clinical-alerts`,
      headers: { cookie },
    });
    expect(alerts.statusCode).toBe(200);
    const alertsJson = alerts.json() as {
      readOnly: boolean;
      alerts: { source: string; severity: string }[];
    };
    expect(alertsJson.readOnly).toBe(true);
    const demo005 = list.find((p) => p.demoCaseCode === 'DEMO-005');
    if (demo005) {
      expect(alertsJson.alerts.some((a) => a.source === 'cds')).toBe(true);
      const alertsRx = await app.inject({
        method: 'GET',
        url: `/api/patients/${demo005.id}/clinical-alerts?blueprintId=prescription&fields=${encodeURIComponent(
          JSON.stringify({ medication: 'Ceftriaxona 1 g IV' }),
        )}`,
        headers: { cookie },
      });
      expect(alertsRx.statusCode).toBe(200);
      const rxJson = alertsRx.json() as { alerts: { ruleId: string }[] };
      expect(
        rxJson.alerts.some(
          (a) => a.ruleId.includes('beta-lactam') || a.ruleId.includes('allergy'),
        ),
      ).toBe(true);
    }

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId,
        draftType: 'evolution_note',
        title: 'Evolución test',
        body: { texto: 'sintético' },
      },
    });
    expect(created.statusCode).toBe(201);
    const draftId = (created.json() as { draft: { id: string } }).draft.id;

    const detailBefore = await app.inject({
      method: 'GET',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
    });
    expect((detailBefore.json() as { versions: unknown[] }).versions).toHaveLength(1);

    await app.inject({
      method: 'PATCH',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
      payload: { body: { texto: 'actualización v2' } },
    });

    const detailAfter = await app.inject({
      method: 'GET',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
    });
    expect((detailAfter.json() as { versions: unknown[] }).versions).toHaveLength(2);

    const illegal = await app.inject({
      method: 'PATCH',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
      payload: { status: 'approved' },
    });
    expect(illegal.statusCode).toBe(400);

    const notesBefore = await listApprovedNotes(db, patientId);
    const beforeCount = notesBefore.length;

    const approved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draftId}/approve`,
      headers: { cookie },
    });
    expect(approved.statusCode).toBe(200);

    const notesAfter = await listApprovedNotes(db, patientId);
    expect(notesAfter.length).toBe(beforeCount + 1);
    expect(notesAfter.some((n) => n.title === 'Evolución test')).toBe(true);

    const longitudinal = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}/longitudinal`,
      headers: { cookie },
    });
    expect(longitudinal.statusCode).toBe(200);
    const longJson = longitudinal.json() as {
      readOnly: boolean;
      allergies: { substance: string }[];
      medications: { name: string }[];
      timeline: unknown[];
    };
    expect(longJson.readOnly).toBe(true);
    expect(longJson.timeline.length).toBeGreaterThan(0);

    if (demo005) {
      const long005 = await app.inject({
        method: 'GET',
        url: `/api/patients/${demo005.id}/longitudinal`,
        headers: { cookie },
      });
      const long005Json = long005.json() as { allergies: { substance: string }[] };
      expect(long005Json.allergies.some((a) => /penicilina/i.test(a.substance))).toBe(true);

      const board = await app.inject({
        method: 'GET',
        url: `/api/dashboard/patient/${demo005.id}`,
        headers: { cookie },
      });
      expect(board.statusCode).toBe(200);
      const boardJson = board.json() as {
        displayName: string;
        allergies: { substance: string }[];
        timelinePreview: unknown[];
      };
      expect(boardJson.displayName.length).toBeGreaterThan(0);
      expect(boardJson.allergies.some((a) => /penicilina/i.test(a.substance))).toBe(true);
      expect(boardJson.timelinePreview.length).toBeGreaterThan(0);
    }

    const docPatientId =
      list.find((p) => p.demoCaseCode === 'DEMO-001')?.id ?? patientId;
    const docSearch = await app.inject({
      method: 'GET',
      url: `/api/patients/${docPatientId}/documents/search?q=laboratorio`,
      headers: { cookie },
    });
    expect(docSearch.statusCode).toBe(200);
    const docJson = docSearch.json() as { hits: unknown[]; searchMode?: string };
    expect(docJson.hits.length).toBeGreaterThan(0);
    expect(['semantic', 'keyword']).toContain(docJson.searchMode);

    const intake = await app.inject({
      method: 'POST',
      url: `/api/patients/${docPatientId}/documents/intake`,
      headers: { cookie },
      payload: {
        title: 'Nota intake test',
        documentType: 'txt',
        textContent: 'Control laboratorio creatinina hemoglobina intake demo',
      },
    });
    expect(intake.statusCode).toBe(201);
    const intakeJson = intake.json() as {
      document: { requiresHumanReview: boolean; chunkCount: number };
    };
    expect(intakeJson.document.requiresHumanReview).toBe(true);
    expect(intakeJson.document.chunkCount).toBeGreaterThan(0);

    const exportRes = await app.inject({
      method: 'GET',
      url: `/api/patients/${docPatientId}/export/summary`,
      headers: { cookie },
    });
    expect(exportRes.statusCode).toBe(200);
    expect(String(exportRes.headers['content-type'])).toContain('text/plain');
    expect(exportRes.body).toContain('Resumen clínico');

    const ragRes = await app.inject({
      method: 'POST',
      url: '/api/ai/rag/query',
      headers: { cookie },
      payload: { patientId: docPatientId, question: 'resultados de laboratorio' },
    });
    expect(ragRes.statusCode).toBe(200);
    const ragJson = ragRes.json() as { citations: unknown[]; requiresHumanReview: boolean };
    expect(ragJson.requiresHumanReview).toBe(true);
    expect(ragJson.citations.length).toBeGreaterThan(0);

    const referralCmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'solicitar interconsulta', role: 'physician', patientId },
    });
    expect(referralCmd.statusCode).toBe(200);
    expect((referralCmd.json() as { routePath: string }).routePath).toBe(
      '/espacio/interconsulta',
    );

    const imagingCmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'pedir radiografia de torax', role: 'physician', patientId },
    });
    expect(imagingCmd.statusCode).toBe(200);
    expect((imagingCmd.json() as { routePath: string }).routePath).toBe('/espacio/imagenologia');

    await app.close();
  });
});
