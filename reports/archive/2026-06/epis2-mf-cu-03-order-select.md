# MF-CU-03 — Hook order-select (prescripción)

**Fecha cierre:** 2026-06-14 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-CDS-UX fase 3  
**Gate:** `quality:cds-hooks-gate` ✓ · `npm run check` ✓

---

## Alcance

CDS Hooks **order-select**: al prescribir (blueprint `prescription`), mostrar tarjetas compactas de duplicidad, conflicto alergia–medicamento e interacciones derivadas de `evaluateDemoClinicalAlerts`. API dedicada `GET /api/cds/order-select/:patientId` y panel en formulario generado.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `mapClinicalAlertsToOrderSelectCards.ts` | Filtra/mapea duplicate, allergy, interaction → `hook: 'order-select'` |
| `mapClinicalAlertsToOrderSelectCards.test.ts` | Unit test filtro, variantes, deduplicación |
| `ClinicalOrderSelectCdsPanel.tsx` | Stack de `ClinicalCdsCard`; `data-testid="epis2-cds-order-select"` |
| `ClinicalOrderSelectCdsPanel.test.tsx` | Unit test panel |
| `apps/api/src/routes/cds/routes.ts` | `GET /api/cds/order-select/:patientId` |
| `orderSelect.integration.test.ts` | Test API DEMO-005 + Ceftriaxona |
| `GeneratedFormSections.tsx` | Prescription → `ClinicalOrderSelectCdsPanel` |
| `validate-cds-hooks-gate.mjs` | Gate MF-CU-02 + MF-CU-03 |
| `ola6a-print-prescription.spec.ts` | E2E DEMO-005 CDS card en receta |

## RuleIds order-select

- Duplicidad: `duplicate_medication_order`, `cdr.duplicate_medication_order`
- Alergia prescripción: `prescription_allergy_conflict`, `cdr.prescription_allergy_conflict`
- Interacción: `beta-lactam-cross-reactivity`, `ace-inhibitor-pregnancy`, `renal-dose-adjustment`

## Mapeo severidad → variante

| Origen | Variante card |
|--------|---------------|
| `critical` / `block` | `warning` |
| duplicidad | `suggestion` |
| alergia / interacción | `warning` |

## Gates

```bash
npm run quality:cds-hooks-gate
npm run check
```

E2E receta DEMO-005: panel `epis2-cds-order-select` con ≥1 card (beta-lactam / allergy / duplicate).

## Próximo paso

**MF-CU-04** — API `/cds/cards` interno con prefetch paciente.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
