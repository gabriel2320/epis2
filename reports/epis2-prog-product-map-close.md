# PROG-PRODUCT-MAP — cierre programa

**Fecha:** 2026-06-18 · **Tag:** `epis2-base-v0.1` · **Pre-req:** merge PROG-PONYTAIL-TRIM @ `b2d6a00`

---

## Tesis (cumplida)

El código ya tenía SoT técnico (`EPIS_CICA_SCREEN_REGISTRY`, `@epis2/clinical-forms`, `@epis2/command-registry`). Este programa añadió **mapa humano verificable**, **meta-gates anti-drift**, **brújula al día** y **archivo docs** — sin pantallas nuevas ni segundo registry.

---

## Microfases entregadas

| MF | Evidencia | Entregable |
|----|-----------|------------|
| MF-BRÚJULA-00 | [`archive/2026-06/epis2-mf-brujula-00-close.md`](archive/2026-06/epis2-mf-brujula-00-close.md) | CURRENT_STATE v1.4+ · entrada CICA `/app/buscar` |
| MF-CATALOG-00 | [`archive/2026-06/epis2-mf-catalog-00-close.md`](archive/2026-06/epis2-mf-catalog-00-close.md) | `EPIS2_ROUTE_MAP.md` · `route-map.generated.json` · `quality:route-map-gate` |
| MF-CATALOG-01 | [`archive/2026-06/epis2-mf-catalog-01-close.md`](archive/2026-06/epis2-mf-catalog-01-close.md) | `EPIS2_PRODUCT_CATALOG.md` · `quality:product-catalog-minimum-gate` |
| MF-CATALOG-GATE-01 | [`archive/2026-06/epis2-mf-catalog-gate-01-close.md`](archive/2026-06/epis2-mf-catalog-gate-01-close.md) | `quality:product-map-gate` |
| MF-PURGE-DOC-08 | [`archive/2026-06/epis2-mf-purge-doc-08-close.md`](archive/2026-06/epis2-mf-purge-doc-08-close.md) | Archive lote 7 reportes · `quality:purge-doc-08-gate` |
| MF-KNIP-05-A | [`archive/2026-06/epis2-mf-knip-05a-close.md`](archive/2026-06/epis2-mf-knip-05a-close.md) | Baseline exports triage · `quality:knip-05-a-gate` |
| MF-KNIP-05-B | [`archive/2026-06/epis2-mf-knip-05b-close.md`](archive/2026-06/epis2-mf-knip-05b-close.md) | Lote 1 safe (−8 símbolos design-agents) · `quality:knip-05-b-gate` |
| MF-RELEASE-BASE-01 | [`archive/2026-06/epis2-mf-release-base-01-close.md`](archive/2026-06/epis2-mf-release-base-01-close.md) | Tag `epis2-base-v0.1` · `quality:release-base-01-gate` |

---

## SoT post-programa

| Capa | Artefacto |
|------|-----------|
| Técnico rutas CICA | `packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts` |
| Máquina rutas | `tools/catalog/route-map.generated.json` (`--check`) |
| Humano rutas | [`docs/product/EPIS2_ROUTE_MAP.md`](../docs/product/EPIS2_ROUTE_MAP.md) |
| Humano objetos | [`docs/product/EPIS2_PRODUCT_CATALOG.md`](../docs/product/EPIS2_PRODUCT_CATALOG.md) |
| Brújula | [`docs/EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) v1.5 |
| Meta-gate | `quality:product-map-gate` |

**Prohibido:** `productCatalog.ts` paralelo · dashboard/three modes como home.

---

## Knip (post MF-KNIP-05-B)

| Métrica | Valor |
|---------|------:|
| Unused files / deps / unlisted / duplicates | **0** (KNIP-04) |
| Unused exports | **114** (triage conservador; no poda masiva) |
| Unused exported types | **68** |

Audits: [`archive/2026-06/knip-audit-product-map-baseline-2026-06-18.md`](archive/2026-06/knip-audit-product-map-baseline-2026-06-18.md) · [`archive/2026-06/knip-audit-product-map-lote1-2026-06-18.md`](archive/2026-06/knip-audit-product-map-lote1-2026-06-18.md)

---

## Gates cierre

```bash
npm run quality:gate -- quality:product-map-gate
npm run quality:gate -- quality:knip-05-a-gate
npm run quality:gate -- quality:knip-05-b-gate
npm run quality:gate -- quality:purge-doc-08-gate
node scripts/quality/validate-release-base-01-gate.mjs
npm run quality:required
git tag -a epis2-base-v0.1 -m "EPIS2 base consolidada: mapa producto + CICA SoT."
```

---

## EPIS2 Base v0.1

Checklist [`EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) ✓ · tag **`epis2-base-v0.1`** distingue esta línea base del demo tag **`v0.1-demo-rc3`**.

**Congelamiento vigente** — sin features clínicas nuevas salvo MF autorizada.

---

## Programa activo siguiente

**PROG-PURGE-CICA** — archivar referencias legacy · [`EPIS2_PURGE_ARCHIVE_PLAN.md`](../docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md)
