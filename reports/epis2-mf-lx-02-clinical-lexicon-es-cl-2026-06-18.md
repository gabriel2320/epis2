# MF-LX-02 — Lexicon clínico ES-CL

**Fecha:** 2026-06-18 · **Rama:** `feat/mf-lx-01-clinical-action-manifest`  
**Programa:** PROG-EPIS2-LEXICON-CORE · **Gate:** `quality:clinical-lexicon-es-cl-gate`

---

## Alcance

Paquete `@epis2/clinical-lexicon-es-cl` — resolución determinista de frases clínicas chilenas **sin IA**.

| Entregable | Ruta |
|------------|------|
| Lexicon derivado | `buildLexicon.ts` ← `CLINICAL_ACTION_MANIFEST` |
| Abreviaturas ES-CL | `abbreviations.ts` |
| Resolver capas | `resolve.ts` — exact → contains → colloquial |
| Escalation IA-last | `shouldEscalateToAi()` |
| Gate | `validate-clinical-lexicon-es-cl-gate.mjs` |

---

## API

```typescript
import { resolveClinicalLexicon, shouldEscalateToAi } from '@epis2/clinical-lexicon-es-cl';

const r = resolveClinicalLexicon('evolucionar');
// intentId: create_evolution_draft · confidence: 0.92 · source: exact

shouldEscalateToAi(r); // false
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| vitest lexicon | ✓ 6/6 |
| `quality:clinical-lexicon-es-cl-gate` | ✓ |
| top10 intents cubiertos en lexicon | ✓ |

---

## Próximo paso

**MF-LX-03** — `drug-dictionary-cl` mínimo (~50 fármacos demo).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
