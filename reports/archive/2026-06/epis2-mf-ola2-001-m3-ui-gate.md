# MF-OLA2-001 — Gate M3-UI consulta ambulatoria (IDC 31–40)

**Fecha:** 2026-06-07  
**Ola:** 2 · **IDC:** 31–40 (parcial 33–35, 40 Active)

---

## Problema detectado

`outpatient_visit` tenía secciones scrollspy en el blueprint pero **no** en `GeneratedClinicalFormPage` — caía en layout simple sin scrollspy ni FAB ambulatorio.

## Alcance

| Entregable | Archivo |
|------------|---------|
| Registry scrollspy ambulatorio | `packages/clinical-forms/src/scrollspy-blueprints.ts` |
| Layout shell Ola 2 | `apps/web/src/pages/GeneratedClinicalFormPage.tsx` |
| Tests M3-UI | `GeneratedClinicalFormPage.ola2.test.tsx` |
| E2E visual + journey | `e2e/ola2-ambulatory-m3-ui.spec.ts` |
| Gate estático | `scripts/quality/validate-ola2-m3-ui-gate.mjs` |
| Glosario IDC 41 | `docs/product/EPIS2_IDC_GLOSSARY.md` |

## Gate M3-UI — resultado

| Criterio | Estado |
|----------|--------|
| Tokens ECM3 / componentes compartidos | ✅ |
| Scrollspy 7 secciones | ✅ |
| Patient context bar + draft chip | ✅ |
| FAB cierre episodio | ✅ |
| Validación campos | ✅ test |
| Persistencia borrador → revisión | ✅ E2E journey (sin snapshot aún) |
| Context pane (no requerido ambulatorio) | ✅ toggle oculto |
| Print Carta/A5 IDC 40 | ◐ Active — signoff pendiente |
| Visual regression snapshots | ◐ spec listo — ejecutar `npm run test:e2e:ola2 -- --update-snapshots` |

## IDC promovidos a Done

| IDC | Evidencia |
|-----|-----------|
| 31 | Anamnesis + tests |
| 32 | Sección vitals |
| 36 | Plan + indicaciones |
| 39 | closeEncounter + FAB |

**Active:** 33, 34, 35, 40 (plantillas / CIE staging / print A5)

## Gates

```text
test: 410 OK (+5)
validate-ola2-m3-ui-gate: OK
architecture:validate: OK (sesión previa)
```

## Próximo paso

MF-OLA2-002: generar baselines Playwright en CI/Linux + cerrar Ola 2 en canon olas.
