import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { eq } from 'drizzle-orm';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { auditEvents, clinicalCriticalResults } from '../db/schema.js';
import { testApiConfig } from '../testConfig.js';

const DEMO004_PCR_CRITICAL_ID = 'f0000004-0000-4000-8000-000000000002';

describeIntegration(
  'guard epicrisis con crítico sin acuse (Evolab discharge-critical-pending-001)',
  () => {
    it('bloquea approve sin acuse; permite tras acuse o override justificado en high', async () => {
      const db = getDatabase(process.env.DATABASE_URL!);
      if (!db) throw new Error('DATABASE_URL requerida');

      await db
        .update(clinicalCriticalResults)
        .set({ acknowledgedAt: null, acknowledgedBy: null })
        .where(eq(clinicalCriticalResults.id, DEMO004_PCR_CRITICAL_ID));

      const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
      const login = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
      });
      const cookie = String(login.headers['set-cookie']).split(';')[0];

      const demo004 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-004')!;

      const created = await app.inject({
        method: 'POST',
        url: '/api/drafts',
        headers: { cookie },
        payload: {
          patientId: demo004.patientId,
          encounterId: demo004.encounterId,
          draftType: 'discharge_summary',
          title: 'Epicrisis test guard',
          body: {
            diagnoses: 'Alta demo test',
            dischargeDate: '2026-06-10',
            hospitalizationSummary: 'Evolución favorable',
            dischargeMedications: 'Paracetamol PRN',
            instructions: 'Control ambulatorio',
            followUpPlan: 'Control 7 días',
          },
        },
      });
      expect(created.statusCode).toBe(201);
      const draftId = (created.json() as { draft: { id: string } }).draft.id;

      const blocked = await app.inject({
        method: 'POST',
        url: `/api/drafts/${draftId}/approve`,
        headers: { cookie },
      });
      expect(blocked.statusCode).toBe(409);

      const blockedEvents = await db
        .select()
        .from(auditEvents)
        .where(eq(auditEvents.entityId, draftId));
      expect(blockedEvents.some((e) => e.eventType === 'clinical.draft.approve_blocked')).toBe(
        true,
      );
      expect(blockedEvents.some((e) => e.eventType === 'clinical.draft.approved')).toBe(false);

      const withOverride = await app.inject({
        method: 'POST',
        url: `/api/drafts/${draftId}/approve`,
        headers: { cookie },
        payload: {
          clinicalOverrideReason:
            'PCR conocida y discutida con paciente; seguimiento ambulatorio acordado (demo sintético).',
        },
      });
      expect(withOverride.statusCode).toBe(200);

      const overrideEvents = await db
        .select()
        .from(auditEvents)
        .where(eq(auditEvents.entityId, draftId));
      expect(
        overrideEvents.some((e) => e.eventType === 'clinical.draft.approved_with_override'),
      ).toBe(true);
      expect(overrideEvents.some((e) => e.eventType === 'clinical.draft.approved')).toBe(true);

      await db
        .update(clinicalCriticalResults)
        .set({ acknowledgedAt: null, acknowledgedBy: null })
        .where(eq(clinicalCriticalResults.id, DEMO004_PCR_CRITICAL_ID));

      const created2 = await app.inject({
        method: 'POST',
        url: '/api/drafts',
        headers: { cookie },
        payload: {
          patientId: demo004.patientId,
          encounterId: demo004.encounterId,
          draftType: 'discharge_summary',
          title: 'Epicrisis test post-acuse',
          body: {
            diagnoses: 'Alta demo test 2',
            dischargeDate: '2026-06-10',
            hospitalizationSummary: 'Evolución favorable',
            dischargeMedications: 'Paracetamol PRN',
            instructions: 'Control ambulatorio',
            followUpPlan: 'Control 7 días',
          },
        },
      });
      const draftId2 = (created2.json() as { draft: { id: string } }).draft.id;

      const ack = await app.inject({
        method: 'POST',
        url: `/api/inpatient/critical-results/${DEMO004_PCR_CRITICAL_ID}/acknowledge`,
        headers: { cookie },
      });
      expect(ack.statusCode).toBe(200);

      const approved = await app.inject({
        method: 'POST',
        url: `/api/drafts/${draftId2}/approve`,
        headers: { cookie },
      });
      expect(approved.statusCode).toBe(200);

      await app.close();
    });
  },
);
