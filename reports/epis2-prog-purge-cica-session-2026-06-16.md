# EPIS2 — PROG-PURGE-CICA sesión MF-PURGE-00/01

**Fecha:** 2026-06-16 · **Alcance:** depuración documental + archivado reportes  
**Gate:** `quality:fast` (pendiente)

## Objetivo

Aseo y purga del proyecto: archivar archivos fuera del flujo activo (CICA + contratos full stack), sin borrar evidencia ni romper runtime.

## Entregables

| MF | Artefacto | Estado |
|----|-----------|--------|
| MF-PURGE-00 | [`docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md`](../docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md) | ✓ |
| MF-PURGE-02 | [`docs/archive/BRANCH_REGISTRY.md`](../docs/archive/BRANCH_REGISTRY.md) | ✓ |
| MF-PURGE-03 | [`docs/archive/TRUNCATED_MODULES.md`](../docs/archive/TRUNCATED_MODULES.md) | ✓ |
| MF-PURGE-01 | `scripts/maintenance/archive-reports-lote6.mjs` + lote 6 | ✓ 248 archivos |
| MF-PURGE-07 | Perímetro agentes + `.cursorignore` + subagentes congelados | ✓ |

## Métricas

- `reports/` raíz: ~310 → **~66** `.md` activos
- `reports/archive/2026-06/`: 233 → **481** archivos
- Ramas consolidación: inventariadas para borrado local (humano aprueba)

## Intocable (verificado — no tocado)

- `apps/web/src/cica/`, `packages/epis2-ui/src/cica/`
- `@epis2/contracts`, registries, golden journey
- Legacy `/espacio/*` fallback

## MF-PURGE-07 — Alcance agentes

- [`docs/archive/AGENT_SCOPE_EXCLUSIONS.md`](../docs/archive/AGENT_SCOPE_EXCLUSIONS.md) — perímetro canónico
- [`docs/archive/ARCHIVED_PROGRAMS_INDEX.md`](../docs/archive/ARCHIVED_PROGRAMS_INDEX.md) — programas cerrados + punteros
- `.cursorignore` — excluye `reports/archive/` del índice Cursor
- `.cursor/rules/05-agent-archive-boundary.mdc` — regla always-on
- Subagentes congelados: `tramo-implementer`, `m3-guardian`, `layers-integrator`, `ci-parity`
- `dev:session` no regenera prompts archivados; `--tramo` ignorado sin `EPIS2_ALLOW_ARCHIVED_SCOPE=1`
- **No se borró** ninguna rama git ni evidencia — solo referencias

## Riesgos

- Punteros rotos en docs viejos → mitigado: mover, no borrar; manifiesto `lote6-manifest.json`
- Borrar ramas git → **no ejecutado**; BRANCH_REGISTRY = referencia only

## Próximo paso

1. Merge `feat/prog-aesthetic-reset-close` → `master` (CICA productivo)
2. MF-PURGE-02 humano: `git branch -d chore/epis2-consolidation-2*` tras confirmar
3. MF-PURGE-05 opcional: etiquetas `@legacy` en rutas `/espacio` sin redirect CICA
4. `npm run quality:required` antes de PR purga
