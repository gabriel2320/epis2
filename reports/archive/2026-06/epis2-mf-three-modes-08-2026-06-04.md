# MF-THREE-MODES-08 — Eliminación de shims

**Fecha:** 2026-06-04  
**Programa:** PROG-THREE-MODES · **Roadmap:** EPIS2-PM-01

## Alcance

Retirar shims deprecated tras MF-06 y actualizar gates classic/dashboard MD3 para apuntar al árbol canónico `apps/web/src/modes/`.

## Eliminado

| Archivo (shim) | Reemplazo canónico |
|----------------|-------------------|
| `classic-md3/useClassicMd3Mode.ts` | `modes/index` → `useClassicMd3Mode` |
| `classic-md3/userPreferences.ts` | `modes/episModePreferences.ts` |
| `dashboard-md3/useDashboardMd3Mode.ts` | `modes/episModeRuntime.ts` / `modes/index` |

## Gates actualizados

- `validate-classic-md3-mode-gate.mjs` — exige `episModePreferences.ts`; falla si shims classic reaparecen
- `validate-dashboard-md3-mode-gate.mjs` — exige `episModeRuntime.ts`; falla si shim dashboard reaparece
- `validate-three-modes-gate.mjs` — verifica ausencia de los tres shims

## Verificación

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `quality:three-modes-gate` | OK |
| `quality:classic-md3-mode-gate` | OK |
| `quality:dashboard-md3-mode-gate` | OK |
| `db:validate` | OK |

## Estado PROG-THREE-MODES

**MF-01…08 DONE.** Import único: `apps/web/src/modes/index.js`.

## Riesgos

1. **Docs históricos** (`EPIS2_MODES_LAYER.md`, reportes 2026-06-08) aún mencionan shims — no afectan runtime; sync doc en ciclo A si aplica.
2. **PM01-E** — `test:e2e:three-modes` requiere PostgreSQL demo antes de cerrar EPIS2-PM-01 en CI.

## Próximo paso

1. Integrar `npm run test:e2e:three-modes` en pipeline con DB demo.
2. Marcar **Fase UX-1** cerrada en `EPIS2_GLOBAL_DEV_PLAN.md` tras E2E verde.
3. Commit consolidado PROG-THREE-MODES (código + nomenclatura v1.1 pendiente).
