# MF-FF-00 — Conciliar canon censo-first

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 2  
**Gate:** `npm run quality:ficha-first-gate` ✓

---

## Alcance

Alinear documentación canónica tras wave 1 (routing ya en censo): invariante #6, Golden journey paso 2, ADR-002 enmienda home, capa modos.

## Evidencia

| Requisito | Artefacto |
|-----------|-----------|
| Invariante #6 = censo-first | [`PRODUCT_INVARIANTS.md`](../docs/product/PRODUCT_INVARIANTS.md) v1.1 |
| Golden paso 2 = censo + barra transversal | [`GOLDEN_CLINICAL_JOURNEY.md`](../docs/quality/GOLDEN_CLINICAL_JOURNEY.md) |
| ADR-002 enmienda home | [`ADR-002-dual-chart-modes.md`](../docs/adr/ADR-002-dual-chart-modes.md) ✓ |
| Modos layer coherente | [`EPIS2_MODES_LAYER.md`](../docs/architecture/EPIS2_MODES_LAYER.md) |
| Canon producto | [`PRODUCT_CANON.md`](../docs/PRODUCT_CANON.md) (ya alineado wave 1) |

## Gates

```bash
npm run quality:ficha-first-gate
npm run dev:rapid
```

## Próximo paso

**MF-FF-04** — Dashboard secundario en nav (READY).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
