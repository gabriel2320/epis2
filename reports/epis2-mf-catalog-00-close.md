# MF-CATALOG-00 — Cierre (route map derivado)

**Fecha:** 2026-06-18 · **Programa:** PROG-PRODUCT-MAP

## Alcance

Mapa de rutas CICA derivado de `EPIS_CICA_SCREEN_REGISTRY` — JSON para gate, Markdown para humanos.

## Artefactos

| Archivo | Rol |
|---------|-----|
| `tools/catalog/export-route-map.mjs` | Generador + `--check` |
| `tools/catalog/route-map.generated.json` | Artefacto máquina (no editar) |
| `docs/product/EPIS2_ROUTE_MAP.md` | Vista humana |
| `scripts/quality/validate-route-map-gate.mjs` | Gate MF |
| `tools/catalog/export-route-map.test.mjs` | Parser registry |

## Métricas

- **25** pantallas CICA
- **3** `HIDE_STUB` (recientes, mi-trabajo, agenda)
- Checksum JSON: `e582d887b337`

## Gates

| Gate | Resultado |
|------|-----------|
| `node tools/catalog/export-route-map.mjs --check` | OK |
| `node scripts/quality/validate-route-map-gate.mjs` | OK |
| `npm run quality:fast` | (cierre sesión) |

## Próximo paso

**MF-CATALOG-01** — `EPIS2_PRODUCT_CATALOG.md` (humano, bloque delimitado).
