# Revisión — lyra-clinical-catalogs-export

**Estado:** Archivado · **REFERENCE_ONLY** · sin entrada en `legacy-import-manifest.json`

## Decisión EPIS2

| Veredicto | Detalle |
|-----------|---------|
| **REJECT runtime** | Catálogos Lyra masivos no entran a `apps/`, `packages/`, ni SoT frontend |
| **ACCEPT reference** | Copia curada en `migration/candidates/lyra/` para consulta y futura migración PG |
| **PRIORIDAD uso** | Lab/rad/interconsulta (pequeños) > especialidades > vademécum/CIE-10 (solo referencia) |

## Limpieza aplicada

1. Eliminados JSON vacíos (`[]`) del export incompleto.
2. Excluido HTML Lyra (patrón UI legacy).
3. Recortados campos de UI Lyra; conservados identificadores clínicos útiles.
4. Reducción ~6.2 MB crudo → ~780 KB curado (12 archivos).

## Cuándo reabrir

- Fase catálogo clínico Chile (CIE-10, FONASA) salga de **DEFERRED** en roadmap.
- Migración a `clinical_catalog_staging` con curación clínica + legal, no bulk import.
- Enriquecimiento de aliases command-registry desde `interconsultas-frecuentes` (manual, ≤20 filas).

## Gates antes de cualquier port parcial

1. Entrada en `legacy-import-manifest.json` + `LEGACY_IMPORT_LEDGER.md`.
2. `npm run architecture:validate`.
3. Sin segundo registry / sin JSON en bundle web de producción.
