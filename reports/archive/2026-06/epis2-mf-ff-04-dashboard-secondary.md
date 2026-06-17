# MF-FF-04 — Dashboard secundario en nav

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 2  
**Gate:** `npm run quality:ui-simplify-gate` ✓

---

## Alcance

Marcar el dashboard como navegación **secundaria** sin competir con el censo/ficha como home primaria.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `epis2NavigationTree.ts` | `navigationTier`: `primary` (censo via blueprint `patient_search`), `secondary` (tabs dashboard), `compat` (`/comando`) |
| `uiDensityRules.ts` | `EPIS_NAV_TIER_BY_ROUTE_PREFIX`, `navigationTierForPathname`, `isSecondaryClinicalRoute`, registry `clinicalCensusHome` |
| `validate-dashboard-secondary-gate.mjs` | Gate MF-FF-04 enlazado en `quality:ui-simplify-gate` |
| Tests | `epis2NavigationTree.test.ts`, `uiDensityRules.test.ts` |

## Invariantes

- Home primaria = `/espacio/buscar-paciente` (`navigationTier: primary` en blueprint `patient_search`)
- `/comando` = `compat` (redirect; no compite con ficha)
- Todos los `dashboard_tab` = `secondary`
- Sin rutas duplicadas en el árbol

## Gates

```bash
npm run quality:ui-simplify-gate
npm run dev:rapid
```

## Próximo paso

**MF-FF-05** — `VISION_EPIS2.md` + reglas agente (wave 2).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
