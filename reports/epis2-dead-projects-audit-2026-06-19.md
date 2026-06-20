# EPIS2 - Dead Project Fence Audit

**Fecha:** 2026-06-19  
**Microfase:** AUDIT-PURGE-DEAD-PROJECT-FENCE  
**Objetivo:** alinear CICA GO, congelar fallback legacy y evitar que Cursor/Codex reabran proyectos muertos o truncados.

## Verdad canonica vigente

| Tema | Canon |
|------|-------|
| Producto activo | CICA GO |
| Entrada operativa | `/app/buscar` |
| Legacy `/espacio/*` | fallback congelado |
| Flag canonico | `VITE_DISABLE_CICA_UI=true` como opt-out legacy |
| Flag no canonico | `VITE_ENABLE_CICA_UI` queda solo como compatibilidad historica en codigo viejo/no-go |
| Prohibido expandir | `/espacio/*`, tramos A-K, three modes, dashboard home, OpenMRS/Carbon, OpenClaw auto-dev, Ola M3, paper planner extendido |

## Cambios aplicados

| Archivo | Accion |
|---------|--------|
| `docs/EPIS2_CURRENT_STATE.md` | CICA GO + `/app/buscar`; legacy opt-out con `VITE_DISABLE_CICA_UI=true` |
| `docs/AGENT_CONTEXT_MINIMAL.md` | regla corta para agentes: CICA GO y fallback congelado |
| `docs/MODULE_INVENTORY.md` | `apps/web` clasificado como CICA GO; Command Center home = `SUPERSEDED_DOC` |
| `docs/archive/TRUNCATED_MODULES.md` | reemplaza CICA NO-GO/opt-in por dead project fence |
| `docs/archive/AGENT_SCOPE_EXCLUSIONS.md` | agrega fence operativo para agentes |
| `docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md` | reemplaza `VITE_ENABLE_CICA_UI` por opt-out legacy |
| `docs/PRODUCT_CANON.md` | home canonica pasa a `/app/buscar` |
| `docs/product/PRODUCT_INVARIANTS.md` | invariante #6 actualizado a CICA `/app/buscar` |
| `docs/product/EPIS2_ROUTE_MAP.md` | fallback legacy ligado a `VITE_DISABLE_CICA_UI=true` |
| `.cursor/rules/*.mdc` | reglas de agente alineadas a CICA GO y no dashboard home |
| `docs/quality/*ANTI_DRIFT*`, `PILOT_DEMO_CHECKLIST.md`, `DI_CLINICAL_SECRETARY_SIGNOFF_CHECKLIST.md` | gates/checklists vivos alineados a home CICA |
| `docs/design/*`, `docs/architecture/*`, `docs/product/*` seleccionados | docs de alto riesgo marcados `SUPERSEDED_DOC` o corregidos en referencias de home |
| `apps/web/src/routes/cicaLegacyRedirects.ts` | comentario legacy actualizado: redirects hacia CICA, legacy solo opt-out |
| `apps/web/src/cica/CicaExperimentalBanner.tsx` | copy remueve CICA NO-GO y `VITE_ENABLE_CICA_UI` como instruccion |

## Clasificacion

### ACTIVE_CORE

| Elemento | Estado | Fence |
|----------|--------|-------|
| `apps/web/src/cica/` | activo | CICA GO; primera pantalla `/app/buscar` |
| `packages/epis2-ui/src/cica/` | activo | UI clean-room; no heredar composicion legacy |
| `apps/api` | activo | SoT HTTP y frontera clinica |
| `packages/contracts` | activo | contratos Zod compartidos |
| `packages/command-registry` | activo | unico Command Registry |
| `packages/clinical-forms` | activo | unico Form Registry |
| `packages/clinical-domain` | activo | dominio/alertas demo |
| `packages/clinical-productivity` | activo | grillas y textbox clinico |
| `packages/ai-client` + `services/local-ai` | activo opcional | IA degrada; no decide ni firma |
| `database/migrations` | activo protegido | no tocar sin MF de DB |

### LIVE_LAB

| Elemento | Estado | Fence |
|----------|--------|-------|
| `services/clinical-case-intel` | lab vivo | no dependencia desde core/web |
| `services/drug-intel` | lab vivo | no SoT clinico |
| `../epis2-evolab` | repo hermano | HTTP/JSON, no imports cruzados |
| `../EPIS2-MedRepo` | repo hermano | knowledge pack sintetico |
| `apps/web/src/lab/design-agents/` | lab/tooling | no producto clinico activo |

### FROZEN_FALLBACK

| Elemento | Estado | Fence |
|----------|--------|-------|
| `/espacio/*` | fallback congelado | no redisenar; solo bugfix/redirect |
| `/comando` | compat redirect | no home |
| Classic MD3 | secundario/fallback | no linea de diseno principal |
| Dashboard MD3 `/epis2/dashboard` | secundario | nunca home |
| Three modes | congelado | no estrategia principal |
| Paper mode base | secundario | mantener lectura/print existente; no expandir planner |

### SCAFFOLD_REVIEW

| Elemento | Estado | Fence |
|----------|--------|-------|
| Tramos A-K | scaffold/demo | no roadmap activo; no nuevos IDC panels |
| IDC olas / TE / PA / NORM | cerrado o parcial | archivar docs/gates alias; no reabrir |
| Paper planner extendido | scaffold | revisar contra Base v0.1 antes de tocar |
| `docs/product/EPIS2_TRAMO_*` | docs historicos | no planificar; usar `TRUNCATED_MODULES.md` como puntero |
| `scripts/quality/validate-tramo-*` | gates historicos | conservar evidencia; no convertir en trabajo activo |

### FOSSIL_ARCHIVE

| Elemento | Estado | Fence |
|----------|--------|-------|
| `migration/candidates/epis/**` | fossil | EPIS donor reference only |
| `migration/candidates/epione/**` | fossil | no actionIds/runtime EPIONE |
| `migration/candidates/epidos/**` | fossil | no pipeline EPIDOS como runtime |
| `migration/candidates/lyra/**` | fossil | catalogs export archivado |
| OpenMRS/O3/Carbon | rejected | solo auditoria/gates |
| Florence references | fossil externo | no importar sin manifest |
| `scripts/legacy-audit/**` | audit tooling | lectura forense, no producto |

### SUPERSEDED_DOC

| Documento | Motivo |
|-----------|--------|
| `docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md` | CICA opt-in / NO-GO superseded; se conserva clean-room |
| `docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md` | CICA NO-GO superseded |
| `docs/design/EPIS2_CICA_SCREEN_MAP_v1.md` | opt-in superseded; usar route map actual |
| `docs/adr/ADR-002-dual-chart-modes.md` | dual chart historico; home/three modes superseded |
| `docs/architecture/EPIS2_MODES_LAYER.md` | three modes secundario, no canon operativo |
| `docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md` | Home `/comando` superseded |
| `docs/design/EPIS2_DASHBOARD_MD3_MODE.md` | modo tablero secundario, no home |
| `docs/design/EPIS2_THREE_MODES_ORCHESTRATION.md` | three modes congelado |
| `docs/product/EPIS2_COMPLETE_SCREEN_CATALOG.md` | catalogo historico; usar route map CICA |
| `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` | plan historico; no planificar tramos/olas |
| `docs/product/EPIS2_THREE_MODES_DEV_PLAN.md` | plan three modes historico |
| `docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md` | mapa historico con `/comando` como HOME; cabecera superseded |
| `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` | plan historico con home comando; cabecera superseded |
| `reports/epis2-cica-classic-implementation-roadmap.md` | CICA NO-GO historico; no editar en esta MF, clasificado superseded |
| `reports/epis2-frontend-purge-cica-reform-plan.md` | CICA NO-GO historico; no editar en esta MF, clasificado superseded |
| `reports/epis2-mf-cica-l01-close.md` | previo a GO; mantener como evidencia |

## Discusion

La auditoria muestra que el conflicto no esta en el runtime principal: `apps/web/src/dev/cicaUiEnv.ts` ya declara CICA `go` y respeta `VITE_DISABLE_CICA_UI=true`. El conflicto estaba en documentos vivos y reglas de agente que todavia narraban CICA como opt-in/no-go o `/comando` como home.

La decision segura fue separar tres capas:

1. **Canon vivo:** `CURRENT_STATE`, `PRODUCT_CANON`, `PRODUCT_INVARIANTS`, `ROUTE_MAP`, reglas Cursor.
2. **Referencia historica marcada:** docs CICA/three-modes/dashboard con cabecera `SUPERSEDED_DOC`.
3. **Evidencia sin tocar:** reportes historicos y migraciones; quedan clasificados aqui para archivo progresivo, no borrados.

No conviene mover en masa todos los reportes root durante esta MF porque mezcla fence documental con higiene de archivo. La accion recomendada es un lote posterior `MF-PURGE-REPORTS-SUPERSEDED` que mueva solo reportes CICA NO-GO a `reports/archive/2026-06/` y actualice el README del archive.

## Riesgos residuales

| Riesgo | Mitigacion |
|--------|------------|
| Busquedas aun encuentran "dashboard home" en docs de rechazo | Mantener porque son patrones prohibidos, no instrucciones activas |
| `VITE_ENABLE_CICA_UI` sigue en codigo | Aceptado como compat historica cuando `CICA_UI_PRODUCT_STATUS !== 'go'`; no usar como canon nuevo |
| Tramos A-K siguen presentes en `docs/product/` | Fence en `AGENT_SCOPE_EXCLUSIONS`, `TRUNCATED_MODULES` y reporte; mover en lote documental separado |
| Reports root con CICA NO-GO | Clasificados `SUPERSEDED_DOC`; mover en lote posterior |

## Siguiente paso exacto

1. Ejecutar gates de esta MF: `npm run quality:fast`, `npm run check`, `npm run quality:required` por toque TS menor.
2. Si pasan, preparar commit sugerido: `docs(purge): align CICA GO and dead project boundaries`.
3. Lote posterior opcional: mover reportes CICA NO-GO superseded a `reports/archive/2026-06/`.
