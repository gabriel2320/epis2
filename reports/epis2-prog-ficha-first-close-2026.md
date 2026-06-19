# PROG-FICHA-FIRST — cierre técnico 2026

**Programa:** PROG-FICHA-FIRST-2026  
**Estado ledger:** DONE para MF-FF-00…15 y wave-1…5  
**Plan canónico:** [`docs/product/EPIS2_FICHA_FIRST_DEV_PLAN.md`](../docs/product/EPIS2_FICHA_FIRST_DEV_PLAN.md)  
**Ledger:** [`docs/quality/ficha-first-ledger.json`](../docs/quality/ficha-first-ledger.json)

## Alcance cerrado

PROG-FICHA-FIRST deja establecido el flujo ficha-first como intención principal del producto:

- censo clínico como entrada operativa;
- ficha clásica y modo papel como vistas coordinadas;
- barra transversal disponible en la experiencia clínica;
- formularios bajo `ClinicalShell`;
- frontera IA separada entre cliente web, API y runtime local;
- navegación secundaria para dashboard y compatibilidad `/comando`.

## Evidencia

| Evidencia | Ruta |
| --- | --- |
| Cierre wave 1 | `reports/archive/2026-06/epis2-prog-ficha-first-wave1-close-2026-06-14.md` |
| Cierres MF-FF-00…14 | `reports/archive/2026-06/epis2-mf-ff-*.md` |
| Cierre MF-FF-15 / aliases | `reports/archive/2026-06/epis2-prog-ficha-first-close-2026.md` |
| Estado vigente | `docs/EPIS2_CURRENT_STATE.md` |
| Visión producto | `docs/product/VISION_EPIS2.md` |

## Gates

- `npm run quality:gate -- quality:ficha-first-gate`
- `npm run quality:required`

## Nota de gobernanza

Este archivo mantiene la evidencia viva que el gate de PR exige en `reports/`, mientras los reportes históricos siguen archivados en `reports/archive/2026-06/`.
