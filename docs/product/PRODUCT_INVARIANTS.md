# EPIS2 — Invariantes de producto

**Versión:** 1.1 · **Vinculante:** permanente en `main` · **MF-FF-00** conciliado 2026-06-15

Violación = bug de arquitectura. Validador: `main-product-invariants.mjs`.

---

## Invariantes (18)

| # | Invariante | Verificación |
|---|------------|--------------|
| 1 | EPIS2 es producto independiente | Sin deps OpenMRS/Carbon |
| 2 | EPIS es donante controlado | `legacy-import-manifest.json` |
| 3 | Sin migración sin allowlist | Manifiesto + ledger |
| 4 | Frontend visible = React + MUI únicamente | `no-legacy-dependencies` |
| 5 | PostgreSQL = SoT clínica | ADR-001; sin OpenMRS SoT |
| 6 | Home clínica = CICA `/app/buscar` (barra transversal); `/comando` solo compat redirect; `/espacio/*` solo fallback legacy por opt-out (`VITE_DISABLE_CICA_UI=true`); workspace = ficha dual (ADR-002) | `command-center-home` + CICA route-map gates |
| 7 | No dashboard como home | `command-center-home` |
| 8 | Información no solicitada oculta | Canon + revisión UX |
| 9 | Un solo Command Registry | `packages/command-registry` |
| 10 | Un solo Clinical Form Registry | `packages/clinical-forms` |
| 11 | IA no aprueba, firma, SQL ni escribe finales | `ai-write-boundary` |
| 12 | Toda acción clínica → borrador primero | EPIS2-08 |
| 13 | Aprobación humana auditada | `human-approval-required` |
| 14 | UI clínica en español | `spanish-visible-copy` |
| 15 | App funciona sin IA local | Tests EPIS2-07 |
| 16 | `main` = verdad canónica | Proceso git |
| 17 | Permisos explícitos sin wildcard | `explicit-permissions` |
| 18 | No copiar carpetas completas desde EPIS | Manifiesto + allowlist |

---

## Frase guía

> Los errores de EPIS no son recuerdos: son gates de EPIS2.

---

## Referencias

- `docs/PRODUCT_CANON.md`
- `docs/architecture/EPIS2_MODES_LAYER.md` — tres modos MD3 (secundarios; home = CICA `/app/buscar`)
- `docs/adr/ADR-002-dual-chart-modes.md` — dual chart: ficha electrónica + papel; launcher delgado
- `docs/legacy/EPIS_POSTMORTEM.md`
- `docs/quality/ANTI_DRIFT_GATES.md`
- `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`
