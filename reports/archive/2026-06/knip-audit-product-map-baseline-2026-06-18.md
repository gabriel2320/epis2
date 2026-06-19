# Knip audit — PROG-PRODUCT-MAP (MF-KNIP-05-A)

**Fecha:** 2026-06-18 · **Post:** MF-PONYTAIL-TRIM + MF-CATALOG-GATE-01 · **Comando:** `npm run knip:audit -- --reporter compact`

**Modo:** audit-first — **sin cambios en `src/`** en esta MF.

## Métricas KNIP-04 (mantener en 0)

| Categoría | Count | Acción |
|-----------|------:|--------|
| Unused files | **0** | ✓ mantener |
| Unused dependencies | **0** | ✓ mantener |
| Unlisted dependencies | **0** | ✓ mantener |
| Duplicate exports | **0** | ✓ mantener |

## Hallazgos pendientes (triage exports)

| Categoría | Count | Acción MF-KNIP-05-B |
|-----------|------:|---------------------|
| Unused exports | **116** | Lotes ≤10, solo `safe` |
| Unused exported types | **68** | Misma regla; preferir exports antes que types |

## Triage por zona

| Zona | Exports aprox. | Clasificación | Notas |
|------|----------------|---------------|-------|
| `packages/contracts` | alto | **DO_NOT_TOUCH** | API pública Zod |
| `packages/command-registry` | bajo | **DO_NOT_TOUCH** | frontera comandos |
| `packages/clinical-forms` / paper-chart | medio | **public-barrel** | barrels + FHIR/paper |
| `packages/epis2-ui` / theme | alto | **public-barrel** | re-exports MD3; Storybook |
| `apps/web` / modes, three modes | alto | **needs-review** | legacy secundario; no home |
| `apps/web` / paper planner | medio | **needs-review** | demo planner; golden parcial |
| `apps/web` / design-agents | bajo | **safe** | restos post KNIP-02-A |
| `apps/api` | medio | **needs-review** | helpers internos; ver tests |
| `services/*` labs | bajo | **needs-review** | labs-only boundary |
| `tools/` / `scripts/` | bajo | **safe** | gates y maintenance |

## Reglas MF-KNIP-05-B

```txt
No tocar packages públicos sin test.
No tocar barrels si apps/web importa el path.
No tocar contracts / command-registry / clinical-forms registry.
Máximo 10 exports por lote.
Gate: quality:fast + knip:audit sin regresión KNIP-04.
```

## Regenerar

```bash
npm run knip:audit -- --reporter compact > reports/knip-compact-latest.txt
node scripts/quality/validate-knip-05-a-gate.mjs
```

## Próximo paso

**MF-KNIP-05-B** — primer lote `safe` (design-agents + presentation helpers) o **MF-RELEASE-BASE-01**.
