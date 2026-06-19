# MF-PONY-04 — Cierre (blueprint/registry dedup layout trivial)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Derivar layouts MD3 de una sección desde `EPIS_CICA_SCREEN_REGISTRY`; blueprints web solo conservan acciones y casos ricos.

## Cambios

| Acción | Detalle |
|--------|---------|
| Registry | `blueprintSectionId` + `blueprintHideActionBar` en 11 pantallas ficha |
| epis2-ui | `createTrivialCicaBlueprint` + `resolveTrivialCicaBlueprintFromRegistry` |
| Web | `withRegistryLayout()` en `patientScreens.blueprint.ts` |
| Mantener manual | `PATIENT_ADMISSION_BLUEPRINT` (multi-sección) |
| Gate | `validate-cica-screen-registry-gate` verifica SoT |
| Tests | `resolveCicaBlueprint.test.ts` |

## Qué evitamos construir

- ~8 consts `{ screenId, sections: [{ id, span: 12 }] }` duplicadas
- Cuarta fuente de verdad para id de slot de layout

## Gates

| Gate | Resultado |
|------|-----------|
| `validate-cica-screen-registry-gate` | OK |
| `validate-cica-clean-room-close-gate` | OK |
| `quality:fast` | OK |

## Próximo paso

**MF-PONY-05** — unificar lista clínica + búsqueda (`EpisClinicalList`).
