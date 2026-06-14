# MF-CU-02 — Hook patient-view (cards al abrir ficha)

**Fecha cierre:** 2026-06-14 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-CDS-UX fase 2  
**Gate:** `quality:cds-hooks-gate` ✓ · `npm run check` ✓

---

## Alcance

CDS Hooks **patient-view**: al abrir ficha tradicional (dual-chart /espacio/ficha), mostrar tarjetas compactas de alergias, gaps y advisory derivadas de `clinicalAlerts` existentes. Sin servidor CDS externo; mapeo client-side desde alertas ya evaluadas (`evaluateDemoClinicalAlerts` vía API `/clinical-alerts`).

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `mapClinicalAlertsToPatientViewCards.ts` | Mapper alertas → `{ variant, label, detail?, hook: 'patient-view' }` |
| `mapClinicalAlertsToPatientViewCards.test.ts` | Unit test severidad, allergy/gap, deduplicación |
| `ClinicalPatientViewCdsPanel.tsx` | Stack de `ClinicalCdsCard`; `data-testid="epis2-cds-patient-view"` |
| `ClinicalPatientViewCdsPanel.test.tsx` | Unit test panel + cards |
| `TraditionalEhrMode.tsx` | Panel arriba de nav/resumen cuando `alerts` presente |
| `validate-cds-hooks-gate.mjs` | Gate MF-CU-02 |
| `dual-chart-modes.spec.ts` | E2E DEMO-005 ≥1 CDS card al abrir ficha |

## Mapeo severidad → variante

| Origen | Variante card |
|--------|---------------|
| `critical` | `warning` |
| `warning` + ruleId alergia/gap | `suggestion` |
| `warning` advisory | `info` |

RuleIds alergia/gap reconocidos: `beta-lactam-cross-reactivity`, `allergy_medication_conflict`, `medication_reconciliation_gap`, `critical_lab_without_ack`, `duplicate_medication_order`, etc.

## Diseño

- **No** se elimina `ClinicalAlertsPanel` en otros contextos (Centro de Comando, borradores).
- API dedicada `/api/cds/patient-view` **omitida** en CU-02 — reutiliza alertas ya cargadas en ficha (MF-CU-04).

## Gates

```bash
npm run quality:cds-hooks-gate
npm run check
```

E2E (opt-in): `VITE_ENABLE_DUAL_CHART_MODES=true` · test `h) patient-view muestra CDS card al abrir ficha DEMO-005`.

## Próximo paso

**MF-CU-03** — Hook order-select (prescripción) · **MF-CU-04** — API `/cds/cards` interno.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
