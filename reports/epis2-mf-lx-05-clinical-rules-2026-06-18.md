# MF-LX-05 — Reglas clínicas demo (blocking/critical)

**Fecha:** 2026-06-18 · **Rama:** `feat/mf-lx-01-clinical-action-manifest`  
**Programa:** PROG-EPIS2-LEXICON-CORE · **Gate:** `quality:clinical-rules-gate`

---

## Alcance

Paquete **`@epis2/clinical-rules`** — motor determinista de reglas demo antes de escalación IA (invariante #11/#15).

| Entregable | Ruta |
|------------|------|
| Reglas demo | `rulesDemo.ts` |
| Evaluación | `evaluateClinicalRules()` |
| Invariantes | `assertClinicalRulesInvariants()` |
| Gate | `validate-clinical-rules-gate.mjs` |

---

## Reglas demo (5)

| ID | Severidad | Aplica a |
|----|-----------|----------|
| `prescription_missing_dose` | blocking | prescription |
| `allergy_beta_lactam_prescription` | critical | prescription |
| `critical_potassium_unacknowledged` | critical | evolution, prescription, discharge, resumen |
| `discharge_summary_missing_dx_alta` | blocking | discharge_summary |
| `evolution_missing_analysis_plan` | warning | evolution_note |

Integración: `assessLabValue('potasio', …)` vía `@epis2/lab-dictionary`.

---

## API

```typescript
import { evaluateClinicalRules } from '@epis2/clinical-rules';

evaluateClinicalRules({
  draftType: 'prescription',
  patient: { allergies: ['penicilina'] },
  medications: [{ name: 'amoxicilina 500 mg', dose: '500 mg' }],
});
// hits: allergy_beta_lactam_prescription · hasCritical: true
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| vitest | ✓ 6/6 |
| `quality:clinical-rules-gate` | ✓ |

---

## Próximo paso

**MF-LX-06** — `ai-escalation-gate` formal en command-registry + `quality:lexicon-core-close-gate`.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
