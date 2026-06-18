# MF-KNIP-02 — Cierre tramo (poda delete-safe Ponytail)

**Fecha:** 2026-06-18 · **Rama:** `chore/pony-knip-trim-00` · **Programa:** PROG-PONYTAIL-TRIM

## Resumen

| Microfase | Zona | Archivos − | Unused files Knip |
|-----------|------|----------:|------------------:|
| KNIP-02-A | design-agents | 10 | 38 → 29 |
| KNIP-02-B | legacy web + barrels | 18 | 29 → 11 |
| KNIP-02-C | epis2-ui theme/foundations | 8 | 11 → 3 |
| KNIP-02-D | api db shim + rag barrel + knip | 2 | 3 → **0** |
| **Total** | | **38** | **38 → 0** |

## Qué no se tocó

- CICA activo (`apps/web/src/cica/**` — 0 unused desde KNIP-00)
- API dominio clínico, migrations, contracts, golden journey
- `run-ux-g02-validation.ts` (gate UX activo)

## Reportes

- `reports/epis2-mf-pony-knip-02a-close.md`
- `reports/epis2-mf-pony-knip-02b-close.md`
- `reports/epis2-mf-pony-knip-02c-close.md`
- `reports/epis2-mf-pony-knip-02d-close.md`

## Siguiente tramo sugerido

1. **MF-KNIP-03** — unused deps (2) + duplicate exports (10)
2. **MF-PONY-DOC-01** — `MODULE_INVENTORY.md` + typography doc paths
3. **MF-PONY-GATE-01** — archive gates tramo
