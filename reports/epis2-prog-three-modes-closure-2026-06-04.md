# PROG-THREE-MODES — Cierre de programa

**Fecha:** 2026-06-04  
**Roadmap:** EPIS2-PM-01 · **Fase UX-1** cerrada

## Alcance

Cierre operativo del programa tres modos (MF-01…08): sesión unificada, router tipado, modal borrador, E2E, shims eliminados, CI y gates PM01.

## Entregables finales (esta sesión)

| Ítem | Detalle |
|------|---------|
| `quality:pm01` | Agrega PM01-A…E en un comando |
| CI | `quality:pm01` + `three-modes-journey` en `test:e2e` |
| PM01-E | `mode-safety-gate` exige `modeTransitionSafety` + diálogo switcher |
| Plan global | `EPIS2_GLOBAL_DEV_PLAN.md` — Fase UX-1 **cerrada** |

## Gates

```bash
npm run check
npm run quality:pm01
npm run db:validate
npx vitest run apps/web
```

| Gate | Estado local |
|------|----------------|
| `check` | OK |
| `quality:pm01` | OK |
| `db:validate` | OK |
| `test:e2e:three-modes` | Requiere stack dev (API+DB); incluido en CI `test:e2e` |

## Reportes MF

- `reports/epis2-mf-three-modes-03-06-2026-06-04.md`
- `reports/epis2-mf-three-modes-04-07-2026-06-04.md`
- `reports/epis2-mf-three-modes-08-2026-06-04.md`

## Riesgos

1. Docs de arquitectura (`EPIS2_MODES_LAYER.md`) pueden mencionar shims históricos — sync en ciclo doc.
2. Integración API en `npm run test` completo sigue dependiendo de PostgreSQL local `:5433` vs CI `:5432`.

## Próximo paso

Commit/push del bloque PROG-THREE-MODES + nomenclatura v1.1; retomar **Fase C** longitudinal o piloto UX-G02 según `EPIS2_GLOBAL_DEV_PLAN.md`.
