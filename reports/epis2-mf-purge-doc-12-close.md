# MF-PURGE-DOC-12 — Cierre (archive lote 12 product-map MF)

**Fecha:** 2026-06-18 · **Programa:** PROG-PURGE-CICA

## Alcance

Archivar **10** cierres MF individuales de PROG-PRODUCT-MAP + knip audits. Hub único en raíz: `epis2-prog-product-map-close.md`.

## Lote 12

Manifiesto: `reports/archive/2026-06/lote12-manifest.json`

## Gates actualizados

| Gate | Cambio |
|------|--------|
| `validate-purge-doc-08-gate.mjs` | keep → product-map-close |
| `validate-knip-05-a-gate.mjs` | baseline en archive |
| `validate-knip-05-b-gate.mjs` | lote1 en archive |

## Gates

| Gate | Resultado |
|------|-----------|
| `node scripts/maintenance/archive-reports-lote12.mjs` | OK |
| `node scripts/quality/validate-purge-doc-12-gate.mjs` | OK (30 .md raíz) |
| `validate-release-base-01-gate` | OK |
| `npm run quality:fast` | OK |

## Próximo paso

**MF-PURGE-05** — `@legacy-runtime` en `/espacio/*`.
