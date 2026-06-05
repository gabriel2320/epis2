# EPIS2-THEME-08 — Snapshots CI + gate MUI-G15

**Fecha:** 2026-06-05 · **Alcance:** `theme:snapshot` en CI; catálogos dev gated en `architecture:validate`

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `compare-theme-snapshots.mjs` integrado en `theme:validate` | ✓ |
| 2 | `npm run theme:validate` en `.github/workflows/ci.yml` | ✓ |
| 3 | Validador `dev-catalog-gates.mjs` (MUI-G15) | ✓ |
| 4 | Smoke test en `validators.test.mjs` | ✓ |
| 5 | `MUI_ANTI_DRIFT_GATES.md` — MUI-G15 automatizado | ✓ |

## MUI-G15 — qué valida

- Rutas `/dev/ui-catalog` y `/desarrollo/catalogo-visual` con `beforeLoad` + guard env.
- `uiCatalogEnv.ts` / `visualThemeCatalogEnv.ts`: flag explícito, `false` desactiva, DEV por defecto.
- `.env.example` documenta flags sin `=true` activo.
- Sin enlaces a catálogos en `apps/web/src` fuera de `dev/` y router.

## Snapshots

```bash
npm run theme:snapshot          # comparar con reports/theme-snapshots/
node scripts/theme/compare-theme-snapshots.mjs --write  # actualizar tras cambio MTB
```

## Gates

```bash
npm run check
npm run theme:validate
npm run test
npm run db:validate
```

## Próximo paso

**THEME-09** (opcional) — Playwright screenshot diff del catálogo visual; o cierre fase M3 con reporte consolidado.
