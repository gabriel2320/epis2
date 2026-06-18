# MF-LX-06 — Política IA-last canónica + cierre lexicon core

**Fecha:** 2026-06-18 · **Rama:** `feat/mf-lx-01-clinical-action-manifest`  
**Programa:** PROG-EPIS2-LEXICON-CORE · **Gates:** `quality:ai-escalation-gate` · `quality:lexicon-core-close-gate`

---

## Alcance

Política **IA-last** formal en `@epis2/command-registry` — lexicon + reglas deterministas antes de LLM.

| Entregable | Ruta |
|------------|------|
| Umbral canónico | `AI_ESCALATION_LEXICON_CONFIDENCE = 0.5` |
| Resolver política | `resolveAiEscalation()` |
| Invariantes manifest | `assertAiEscalationInvariants()` — `aiRequired: false` en todas |
| Delegación lexicon | `clinical-lexicon-es-cl` → `shouldEscalateLexiconConfidence()` |
| Gate unitario | `validate-ai-escalation-gate.mjs` |
| Gate cierre | `validate-lexicon-core-close-gate.mjs` (LX-01…06) |

---

## API

```typescript
import {
  resolveAiEscalation,
  shouldEscalateLexiconConfidence,
} from '@epis2/command-registry';

resolveAiEscalation({
  lexiconConfidence: 0.72,
  commandResult: { status: 'resolved' },
  intentId: 'create_evolution_draft',
});
// { escalate: false, reason: 'none' }

resolveAiEscalation({ lexiconConfidence: 0.2 });
// { escalate: true, reason: 'lexicon_low_confidence', confidence: 0.2 }
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| vitest ai-escalation | ✓ 5/5 |
| `quality:ai-escalation-gate` | ✓ |
| `quality:lexicon-core-close-gate` | ✓ (LX-01…06) |

---

## Cierre PROG-EPIS2-LEXICON-CORE

Microfases **MF-LX-01…06** completas en PR #44:

1. Clinical Action Manifest  
2. Lexicon ES-CL  
3. Drug dictionary CL  
4. Lab dictionary  
5. Clinical rules  
6. AI escalation policy  

**Próximo:** merge PR #44 tras `npm run check` + revisión clínica.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
