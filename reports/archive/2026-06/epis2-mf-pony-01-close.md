# MF-PONY-01 — Cierre (delete seguro Ponytail)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Eliminar passthrough y código muerto CICA sin cambiar rutas ni UX visible.

## Cambios

| Acción | Detalle |
|--------|---------|
| Delete | `CicaBlueprintPage.tsx` (passthrough 6 líneas) |
| Delete | `CicaPatientSectionPages.tsx` (sin referencias en router; superseded por páginas dedicadas) |
| Delete | `stubPatientBlueprint()` en `systemScreens.blueprint.ts` |
| Replace | 4 call sites → `CicaGeneratedScreen` desde `@epis2/epis2-ui` |
| Gate | Quitar checks obsoletos de stubs en `validate-cica-clean-room-close-gate.mjs` (páginas dedicadas ya verificadas) |

**Archivos tocados:** 7 · **Net:** −2 archivos TSX, −1 función blueprint, −19 líneas gate

## Qué evitamos construir

- Wrapper web `CicaBlueprintPage` en cada pantalla blueprint nueva
- `CicaPatientSectionPage` genérico con stub blueprint (patrón abandonado)

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:cica-clean-room-close-gate` | OK |
| `vitest` `apps/web/src/cica/*` + `cicaSidebarNav.test.ts` | OK |
| `quality:fast` | Pendiente local (run largo); sin cambio de contrato |

## Riesgos

Ninguno producto — diff mecánico; URLs y testIds intactos.

## Próximo paso

**MF-PONY-02** — ocultar stubs sidebar (recientes, mi-trabajo, agenda).
