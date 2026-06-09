# EPIS2 — Conciliación three-modes con el proyecto

**Fecha:** 2026-06-04  
**Alcance:** Documentación, planes de desarrollo y armonización post-consolidación MF-THREE-MODES-02

## Objetivo

Integrar la capa de tres modos (Command · Classic · Dashboard) en el canon EPIS2 existente — navegación reconciliada, capas UI, plan global e invariantes — sin contradecir home = `/comando`.

## Documentación creada

| Documento | Rol |
|-----------|-----|
| [`docs/architecture/EPIS2_MODES_LAYER.md`](../docs/architecture/EPIS2_MODES_LAYER.md) | Conciliación modos × workspaces × L3–L5 × registries |
| [`docs/design/EPIS2_CLASSIC_EMR_MD3_MODE.md`](../docs/design/EPIS2_CLASSIC_EMR_MD3_MODE.md) | Canon modo classic (antes solo en reporte) |
| [`docs/product/EPIS2_THREE_MODES_DEV_PLAN.md`](../docs/product/EPIS2_THREE_MODES_DEV_PLAN.md) | Roadmap MF-THREE-MODES-03…08 |

## Documentación actualizada

| Documento | Cambio |
|-----------|--------|
| `EPIS2_THREE_MODES_ORCHESTRATION.md` | Referencias cruzadas + plan pendiente |
| `EPIS2_DASHBOARD_MD3_MODE.md` | Activación vía `modes/` |
| `EPIS2_RECONCILED_NAVIGATION_TREE.md` | Ramas `?mode=classic` / `?mode=dashboard` + mermaid |
| `EPIS2_UI_LAYERS.md` | Sección modos transversal L3 |
| `EPIS2_GLOBAL_DEV_PLAN.md` | Fase E + microfases THREE-MODES |
| `PRODUCT_INVARIANTS.md` | Puntero a capa modos |

## Mapa de precedencia (conciliado)

```text
PRODUCT_INVARIANTS (#6 home, #7 no dashboard home)
        │
PRODUCT_CANON (flujo login → comando)
        │
EPIS2_RECONCILED_NAVIGATION_TREE (superficies ~33)
        │
EPIS2_MODES_LAYER (marco Command / Classic / Dashboard)
        │
EPIS2_UI_LAYERS L3–L5 (shells RAD + productivity)
        │
EPIS2_THREE_MODES_DEV_PLAN (MF-03…07 pendientes)
```

## Estado microfases THREE-MODES

| ID | Estado |
|----|--------|
| MF-THREE-MODES-01 Orquestación | DONE |
| MF-THREE-MODES-02 Consolidación `modes/` | DONE |
| MF-THREE-MODES-03 Modal borrador | **READY — próxima sesión** |
| MF-THREE-MODES-04 Router tipado | READY |
| MF-THREE-MODES-05 Dashboard → classic | READY |
| MF-THREE-MODES-06 Migrar imports | READY |
| MF-THREE-MODES-07 E2E Playwright | READY |
| MF-THREE-MODES-08 Eliminar shims | BLOCKED (tras 06) |

## Gates (sesión)

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK (sin cambios de código en esta sesión — solo docs) |
| Docs no contradicen `architecture:validate` | OK — sin segundo registry ni dashboard home |

## Riesgos

1. **Doc drift** — mantener `EPIS2_MODES_LAYER.md` alineado si cambia `epis2NavigationTree.ts`
2. **Reportes duplicados** — reportes `2026-06-08` siguen válidos; este reporte es capa doc/plan
3. **Classic doc vs report** — `EPIS2_CLASSIC_EMR_MD3_MODE.md` resume; detalle técnico en `reports/epis2-classic-emr-md3-mode-2026-06-07.md`

## Próximo paso exacto

Ejecutar **MF-THREE-MODES-03**: modal borrador no guardado antes de transiciones de modo. Ver alcance en [`EPIS2_THREE_MODES_DEV_PLAN.md`](../docs/product/EPIS2_THREE_MODES_DEV_PLAN.md).
