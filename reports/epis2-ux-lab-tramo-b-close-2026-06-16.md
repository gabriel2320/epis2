# PROG-UX-LAB — Tramo B cierre (MF-UXLAB-01)

**Fecha:** 2026-06-16 · **Programa:** PROG-UX-LAB · **Microfase:** MF-UXLAB-01  
**Plan:** [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)  
**Baseline:** [`epis2-ux-lab-baseline-2026-06-16.md`](./epis2-ux-lab-baseline-2026-06-16.md)

---

## Alcance

Capas 1–2 del plan UX Lab en `/espacio/buscar-paciente`:

| Entregable | Archivo(s) |
|------------|------------|
| Fixtures censo shift (5 DEMO) | `packages/test-fixtures/src/demoShiftCensus.ts` |
| Bridge RH-06 | `apps/web/src/fixtures/devFixturesBridge.ts` |
| Resolver rutas acción primaria | `apps/web/src/clinical/demoShiftCensusPresentation.ts` |
| Shift Context Strip | `apps/web/src/components/census/ShiftContextStrip.tsx` |
| Censo narrativo grid | `apps/web/src/components/PatientListGrid.tsx` |
| Integración censo | `apps/web/src/pages/GeneratedClinicalFormPage.tsx` |
| Copy ES | `packages/design-system/src/copy/es.ts` |
| E2E smoke | `e2e/ux-lab-census.spec.ts` |
| Scripts npm | `quality:ux-g02`, `quality:ux-pilot`, `quality:ux-pilot-gate`, `test:e2e:ux-lab-census` |

**Congelamiento:** sin rutas nuevas · sin Form Registry · fixtures vía bridge (no import estático `@epis2/test-fixtures` en `apps/web/src` salvo `devFixturesBridge.ts`).

---

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:fast` | ✓ OK (architecture:validate incl. `web-components-root-frozen`) |
| `quality:ux-pilot-gate` | ✓ OK (scripts restaurados en root `package.json`) |
| `test:e2e:ux-lab-census` | ✓ 1/1 (local · Playwright + stack:dev) |
| `quality:golden-journey` | defer cierre sesión (no regresión esperada — censo es presentación) |

### Nota entorno local

Tras `npm install`, `@epis2/ai-client` queda enlazado y `typecheck @epis2/web` pasa. Sin install previo, subpath exports de ai-client fallan localmente (no regresión de Tramo B).

---

## Reglas fixtures (5 DEMO)

Determinísticas por `demoCaseCode`:

- Pendiente principal, último evento, `draftState`, `visualRisk`
- Acción primaria única → `resolveCensusPrimaryActionRoute` (evolución / ficha / borrador)

---

## Riesgos / follow-up

| ID | Riesgo | Mitigación |
|----|--------|------------|
| UXLAB-02 | Strip no sticky en ficha | Tramo C (opcional sticky) |
| UXLAB-03 | Borrador real API vs fixture `draftState` | Tramo C — fusionar API drafts |
| UXLAB-04 | `quality:m3-human-pilot` E2E completo | Tramo D |

---

## Próximo paso

**Tramo C (MF-UXLAB-02):** confianza en ficha dual — estados borrador visibles + degradación IA documentada en copy strip.
