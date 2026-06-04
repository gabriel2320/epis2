# EPIS2 — Mapa donante legacy (EPIS)

**Donante:** `../Epis` · **Estado donante:** `LEGACY_REFERENCE`  
**Regla:** selección explícita — nunca copia masiva de carpetas.

---

## Leyenda

| Acción | Significado |
|--------|-------------|
| **MIGRATE** | Portar concepto/datos a EPIS2 con adaptación |
| **REWRITE** | Usar EPIS solo como referencia; implementación nueva |
| **REFERENCE_ONLY** | Consultar; no portar código |
| **REJECT** | No usar en EPIS2 |

---

## REJECT — no portar

| Elemento | Ruta / nota EPIS |
|----------|------------------|
| OpenMRS core / distro | `openmrs/`, configuración distro |
| O3 / ESM framework | `frontend/esm-*`, `@openmrs/*` |
| Carbon / Soft Carbon UI | `packages/epis-ui/src/command/EpisSoftCarbon*`, `epis-soft-carbon.css` |
| Overlays material/theme | `frontend/esm-epis-material-app`, `esm-epis-theme-app` |
| Route bridge OpenMRS | `epis-route-bridge.ts`, `epis-route-chrome.ts` |
| Adapter OpenMRS | `packages/epis-openmrs-adapter/` |
| Writeback / invisible core ADR-021 | `docs/architecture/OPENMRS_INVISIBLE_CORE.md` (patrón abandonado) |
| Dashboards / KPI home | cualquier home tipo tablero |
| Scripts overlay MF | `scripts/epis-mf-*.mjs` específicos OpenMRS |
| Fixtures REST OpenMRS | `packages/epis-openmrs-adapter/fixtures/` |
| Gobierno microfases EPIS | `docs/MICROPHASE_LEDGER_CANONICAL.md` como proceso — solo REFERENCE |
| node_modules / builds | siempre excluidos |

---

## MIGRATE — portar con simplificación

| Elemento | Ruta EPIS | Destino EPIS2 | Notas |
|----------|-----------|---------------|-------|
| Command Registry | `packages/epis-ui/src/command/commandRegistry.ts` | `packages/command-registry/` | Simplificar intents a MVP v1 |
| Intent router | `packages/epis-ui/src/command/intentRouter.ts` | `packages/command-registry/` | Unificar con registry |
| Clinical intent resolver | `packages/epis-ui/src/command/clinicalIntentResolver.ts` | `packages/command-registry/` | Tests ≥100 comandos |
| Text parser | `packages/epis-ui/src/command/clinicalTextParser.ts` | `packages/command-registry/` | Normalización español |
| Command autocomplete / chips | `commandAutocomplete.ts`, `commandFirstChips.ts` | web Command Center | Solo sugerencias MVP |
| Form blueprints | `packages/epis-clinical-forms/`, `docs/forms/CLINICAL_FORM_BLUEPRINTS.md` | `packages/clinical-forms/` | 6 blueprints v1 |
| Blueprint mapping doc | `docs/command-first/COMMAND_FORM_REGISTRY_BLUEPRINT_MAPPING.md` | `docs/` | Actualizar IDs |
| Fixtures sintéticos | `packages/epis-clinical-forms/src/fixtures/` | `packages/test-fixtures/` | Revisar PHI; marcar DEMO |
| Clinical safety rules | `packages/epis-clinical-safety/` | `packages/clinical-domain/` | Con tests |
| Role policy | `docs/product/EPIS_ROLE_POLICY_CANON.md` | `packages/clinical-domain/` | 5 roles v1 |
| Tests registry/resolver | `packages/epis-ui/test/commandRegistry.test.ts`, `clinicalIntentResolver.test.ts`, `intentRouter.test.ts` | equivalentes EPIS2 | Adaptar imports |
| Microcopy español | `docs/ux/EPIS_MATERIAL_SPANISH_COPY.md` | `packages/design-system/copy/` | REWRITE tono EPIS2 |
| Contratos IA | buscar en `packages/epis-*` contratos structured output | `packages/contracts/` | JSON Schema / Zod |
| Demo commands/patients | `fixtures/demoPatients.ts`, `demoCommands.ts` | `packages/test-fixtures/` | EPIS2-09 |

---

## REWRITE — nuevo código, misma intención

| Elemento | Referencia EPIS | Destino EPIS2 |
|----------|-----------------|---------------|
| Product canon | `docs/product/EPIS_PRODUCT_CANON.md` | `docs/PRODUCT_CANON.md` ✓ |
| Auth / sesión | `EpisProtectedRoute`, OpenMRS bridge | `apps/api` + `apps/web` sesión propia |
| Login UI | `epis-material-shell`, `EpisV2Login` | MUI tema EPIS2 nuevo |
| Command Center | `EpisV2CommandCenter.tsx`, `EpisCommandCenter.tsx` | shell MUI sin OpenMRS |
| Navegación | `episRoutes.ts`, SPA navigate | TanStack Router |
| Tema visual | `episMaterialTheme.ts` | `packages/design-system/` tokens EPIS2 |
| Generated clinical page | `EpisGeneratedClinicalPage.tsx` | blueprint-driven renderer |
| API clínica | N/A (era OpenMRS) | Fastify + Drizzle |
| Persistencia | OpenMRS DB | PostgreSQL |

---

## REFERENCE_ONLY

| Elemento | Ruta EPIS |
|----------|-----------|
| Historial microfases | `docs/product/EPIS_MICROPHASE_HISTORY.md` |
| ADRs OpenMRS/MUI/Carbon | `docs/adr/ADR-020` … `ADR-024` |
| Reports MF-CMD | `reports/mf-cmd-*.md` |
| Human QA canon | `docs/product/EPIS_HUMAN_PRODUCT_QA_CANON.md` |
| Roadmap EPIS | `docs/roadmap/MF-CMD-ROADMAP.md` |
| Plan reset limpio | `reports/mf-cmd-026-clean-product-reset-plan.md` |

---

## Matriz resumen MVP

| Categoría | Acción |
|-----------|--------|
| Visión / canon | REWRITE ✓ |
| Command registry | MIGRATE |
| Blueprints formularios | MIGRATE |
| Microcopy español | REWRITE (desde doc EPIS) |
| Fixtures sintéticos | MIGRATE (revisados) |
| Validadores clínicos | MIGRATE + tests |
| Contratos IA | MIGRATE |
| Reglas por rol | MIGRATE |
| Código OpenMRS/O3/Carbon | REJECT |
| Rutas / overlays | REJECT |
| Dashboards | REJECT |
| Docs históricos EPIS | REFERENCE_ONLY |

---

## Proceso de verificación por ítem

Antes de portar cualquier archivo:

1. Etiquetar en PR: `MIGRATE` | `REWRITE` | `REJECT`.  
2. Si `MIGRATE`: eliminar imports `@openmrs/*`, Carbon, adapter.  
3. Añadir test mínimo o actualizar suite existente.  
4. Registrar en `docs/DECISIONS.md` si cambia comportamiento clínico.
