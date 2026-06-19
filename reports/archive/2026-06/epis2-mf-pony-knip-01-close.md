# MF-KNIP-01 — Cierre (reporte Knip accionable)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM + Knip audit

## Alcance

Generar reporte markdown accionable post MF-KNIP-00 — **sin borrar código ni deps**.

## Archivos tocados

| Archivo | Cambio |
|---------|--------|
| `reports/knip-audit-pony-2026-06-18.md` | Raw Knip + cabecera EPIS2, resumen, tabla por zona |

## Qué se eliminó

Nada (audit-only).

## Hallazgos clave

- **38** unused files (vs 483 pre-config) — concentrados en design-agents, legacy web, theme foundations, barrels.
- **0** unused files en `apps/web/src/cica/**` — CICA activo OK.
- **2** unused deps: `@epis2/drug-dictionary-cl`, `zod` (epis2-ui).
- **10** duplicate exports — incl. alias PONY-07 en `clinicalChartTabRegistry.ts`.
- **Falso positivo:** `apps/api/src/db.ts` (entry runtime, no borrar).

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK |

## Próximo paso

**MF-KNIP-02** — poda delete-safe por zona (design-agents → legacy barrels → theme foundations).

Reporte completo: `reports/knip-audit-pony-2026-06-18.md`
