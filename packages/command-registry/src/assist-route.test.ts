import { describe, expect, it } from 'vitest';
import { requiresExplicitConfirmation } from './confirmation.js';
import {
  ASSIST_ROUTE_PHRASE_MIN_RESOLVE_RATIO,
  ASSIST_ROUTE_PHRASE_SUITE,
} from './assist-route-phrases.js';
import {
  ASSIST_ROUTE_RESOLVE_CONFIDENCE,
  applyAssistScoreBoost,
  listAssistRouteIntentsForRole,
  pickAssistFallback,
  sanitizeAssistRouteHint,
  shouldInvokeAssistRoute,
  assistClarifyFooterHint,
} from './assist-route.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { rankCommandDefinitions } from './rank.js';
import { resolveCommand } from './router.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('assist-route (CE-3)', () => {
  it('shouldInvokeAssistRoute solo en needs_clarification', () => {
    expect(
      shouldInvokeAssistRoute(
        resolveCommand({
          text: 'dejarlo listo para irse',
          role: 'physician',
          patientId: DEMO_PATIENT_ID,
        }),
      ),
    ).toBe(true);
    expect(
      shouldInvokeAssistRoute(
        resolveCommand({ text: 'hacer evolución', role: 'physician', patientId: DEMO_PATIENT_ID }),
      ),
    ).toBe(false);
  });

  it('sanitizeAssistRouteHint filtra intents no permitidos', () => {
    const hint = sanitizeAssistRouteHint(
      {
        intent: 'open_dashboard_quality',
        confidence: 0.9,
        reason: 'auditoría',
        suggestedCandidates: ['open_dashboard_quality'],
      },
      'physician',
    );
    expect(hint).toBeNull();
  });

  it('sanitizeAssistRouteHint acepta intent permitido', () => {
    const hint = sanitizeAssistRouteHint(
      {
        intent: 'prepare_discharge_draft',
        confidence: 0.88,
        reason: 'alta hospitalaria',
        suggestedCandidates: ['prepare_discharge_draft', 'summarize_patient'],
      },
      'physician',
    );
    expect(hint?.intent).toBe('prepare_discharge_draft');
    expect(hint?.suggestedCandidates).toContain('prepare_discharge_draft');
  });

  it('applyAssistScoreBoost impulsa intent señalado', () => {
    const def = EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === 'prepare_discharge_draft');
    expect(def).toBeDefined();
    const boost = applyAssistScoreBoost(def!, {
      intent: 'prepare_discharge_draft',
      confidence: ASSIST_ROUTE_RESOLVE_CONFIDENCE,
      missingContext: [],
      reason: 'alta',
      suggestedCandidates: ['prepare_discharge_draft'],
    });
    expect(boost).toBeGreaterThan(15);
  });

  it('listAssistRouteIntentsForRole respeta permisos', () => {
    const physician = listAssistRouteIntentsForRole('physician');
    const nurse = listAssistRouteIntentsForRole('nurse');
    expect(physician.some((e) => e.intent === 'prepare_discharge_draft')).toBe(true);
    expect(nurse.some((e) => e.intent === 'open_dashboard_quality')).toBe(false);
  });

  it('suite long-tail: sin hint queda en aclaración', () => {
    const ambiguous = ASSIST_ROUTE_PHRASE_SUITE.filter(({ phrase }) => {
      const result = resolveCommand({
        text: phrase,
        role: 'physician',
        patientId: DEMO_PATIENT_ID,
      });
      return result.status === 'needs_clarification';
    });
    expect(ambiguous.length).toBeGreaterThanOrEqual(15);
    for (const { phrase } of ambiguous) {
      const result = resolveCommand({
        text: phrase,
        role: 'physician',
        patientId: DEMO_PATIENT_ID,
      });
      expect(result.status, phrase).toBe('needs_clarification');
    }
  });

  it('suite long-tail: con hint mock ≥70% resuelve al intent esperado', () => {
    let resolved = 0;
    for (const { phrase, hintIntent } of ASSIST_ROUTE_PHRASE_SUITE) {
      const result = resolveCommand({
        text: phrase,
        role: 'physician',
        patientId: DEMO_PATIENT_ID,
        assistHint: {
          intent: hintIntent,
          confidence: ASSIST_ROUTE_RESOLVE_CONFIDENCE,
          missingContext: [],
          reason: 'mock CE-3',
          suggestedCandidates: [hintIntent],
        },
        ...(requiresExplicitConfirmation(hintIntent) ? { confirmed: true } : {}),
      });
      if (result.status === 'resolved' && result.intent === hintIntent) {
        resolved += 1;
      }
    }
    const ratio = resolved / ASSIST_ROUTE_PHRASE_SUITE.length;
    expect(ratio).toBeGreaterThanOrEqual(ASSIST_ROUTE_PHRASE_MIN_RESOLVE_RATIO);
  });

  it('pickAssistFallback elige intent con gap suficiente tras boost', () => {
    const ranked = rankCommandDefinitions('dejarlo listo para irse', {
      hasPatient: true,
      assistHint: {
        intent: 'prepare_discharge_draft',
        confidence: 0.85,
        missingContext: [],
        reason: 'alta',
        suggestedCandidates: ['prepare_discharge_draft', 'summarize_patient'],
      },
    });
    const picked = pickAssistFallback(ranked, {
      intent: 'prepare_discharge_draft',
      confidence: 0.85,
      missingContext: [],
      reason: 'alta',
      suggestedCandidates: ['prepare_discharge_draft'],
    });
    expect(picked?.intent).toBe('prepare_discharge_draft');
  });

  it('assistClarifyFooterHint visible con candidatos', () => {
    expect(assistClarifyFooterHint(2)).toMatch(/candidato/i);
    expect(assistClarifyFooterHint(0)).toBeUndefined();
  });
});
