# EPIS2 — Auditoría integral y conciliación

**Fecha:** 2026-06-07  
**Alcance:** Producto · arquitectura · código · documentación · IDC · diseño ECM3  
**Fuentes de verdad:** código (`epis2NavigationTree.ts`, `registry.ts`) > matriz IDC > inventarios > catálogos legacy

---

## 1. Veredicto ejecutivo

| Dimensión | Estado | Evidencia |
|-----------|--------|-----------|
| **Invariantes producto** | ✅ Sólido | Home = `/comando`; sin OpenMRS/Carbon; IA no firma |
| **Arquitectura** | ✅ 15/15 gates | `architecture:validate` OK |
| **Typecheck** | ✅ OK | Monorepo completo |
| **Tests** | ✅ **405** / 156 archivos | Vitest |
| **Base de datos** | ✅ **32** migraciones | `db:validate` OK |
| **Lint** | ⚠️ No verificado | ESLint abortó (crash nativo Windows en esta sesión) |
| **EPIS2 Core (demo)** | ✅ Cerrable | Olas 0–1 shell + Ola 2 ambulatorio + M3-00…09 |
| **IDC 1–200** | ◐ **3,5 % Done** · 22 % Active | Matriz cuádruple — no bloquea Core |
| **Documentación** | ⚠️ Deriva menor | Varios docs aún dicen **18** blueprints (código: **19**) |
| **Producción clínica real** | ❌ No lista | OIDC productivo, RLS enforce total, dominios vacíos |

**Frase guía:** los gates de EPIS2 funcionan; el gap principal es **cobertura IDC y docs desactualizados**, no deriva arquitectónica.

---

## 2. Gates ejecutados (2026-06-07)

| Gate | Resultado |
|------|-----------|
| `npm run typecheck` | ✅ OK |
| `npm run architecture:validate` | ✅ OK (15 gates) |
| `npm run test` | ✅ 405 tests |
| `npm run db:validate` | ✅ 32 migraciones |
| `npm run check` (lint incluido) | ⚠️ ESLint crash — reintentar en CI/local |
| `npm run quality:golden-journey` | No ejecutado esta sesión |

---

## 3. Mapa reconciliado del sistema

```text
                    ┌─────────────────────────────────────┐
                    │  PLANIFICACIÓN (no visible al user) │
                    │  21 olas · 200 IDC · tramos A–D     │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │  ECM3 — un solo lenguaje visual     │
                    │  @epis2/epis2-ui · M3 Standard      │
                    └─────────────────┬───────────────────┘
                                      │
     ┌────────────────────────────────┼────────────────────────────────┐
     │                                │                                │
┌────▼────┐                    ┌──────▼──────┐                 ┌───────▼────────┐
│ 5       │                    │ ~33         │                 │ 19             │
│workspace│◄─── rail ─────────►│ superficies │◄─── rutas ─────►│ blueprints     │
│ rail    │                    │ navegación  │                 │ clinical-forms │
└─────────┘                    └─────────────┘                 └────────────────┘
     │                                │                                │
     └────────────────────────────────┼────────────────────────────────┘
                                      │
                              ┌───────▼────────┐
                              │ command-registry│
                              │ intents → rutas │
                              └───────┬────────┘
                                      │
                              ┌───────▼────────┐
                              │ PostgreSQL SoT │
                              │ borrador→firma │
                              └────────────────┘
```

### Jerarquía de conciliación (prioridad)

1. `docs/PRODUCT_CANON.md` + `PRODUCT_INVARIANTS.md`
2. `EPIS2_WAVE_EXECUTION_CANON.md`
3. Código: `epis2NavigationTree.ts` · `clinicalWorkspaceRegistry.ts` · `registry.ts`
4. `EPIS2_IDC_EXECUTION_MATRIX.json` (planificación cuádruple)
5. Inventarios `EPIS2_ARCHITECTURE_INVENTORY_*` (legacy COMPLETE/PARTIAL)
6. Catálogos `EPIS2_COMPLETE_*` (actualización pendiente)

---

## 4. Inventario verificable (código)

| Artefacto | Conteo | Fuente |
|-----------|--------|--------|
| Blueprints clínicos | **19** | `packages/clinical-forms/src/registry.ts` |
| Superficies navegación | **~33** | `EPIS2_NAVIGATION_TREE` (6 dashboard + 7 shell + 19 forms) |
| Workspaces rail | **5** | command · ambulatory · icu · quality_iaas · admin_system |
| Workspaces planificados | **+1** | `emergency` (Ola 10 — no en rail) |
| Migraciones DB | **32** | `db:validate` |
| Tests | **405** | Vitest |
| Perfiles color MTB | **6** | `epis2-ui/theme/generated/` |

### 19 blueprints (registry único)

`patient_search` · `patient_summary` · `evolution_note` · `outpatient_visit` · `medical_certificate` *(Ola 2)* · `discharge_summary` · `prescription` · `lab_request` · `imaging_request` · `referral` · `referral_report` · `nursing_note` · `medication_administration` · `pharmacy_validation` · `admission_note` · `allergy_entry` · `clinical_problem_entry` · `medication_reconciliation` · `transfer_note`

---

## 5. Superficies por estado (árbol reconciliado)

| Status | Aprox. | Ejemplos |
|--------|--------|----------|
| **complete** | ~18 | `/login`, `/comando`, `/espacio/ficha`, evolución, receta, consulta ambulatoria, certificado, alergias, problemas, conciliación… |
| **partial** | ~14 | Dashboard tabs (5/6), bandeja resultados, admin, lab/imagen, MAR, farmacia |
| **missing/disabled** | rail ICU/urgencia, recepción 2–10 | Olas 4+ |

**Home:** `/comando` — test + invariante arquitectónico ✅  
**Dashboard:** secundario — nunca home ✅

---

## 6. Matriz IDC 1–200 vs realidad

Fuente: `docs/product/epis2-idc-execution-matrix.json`

| Campo | Distribución |
|-------|--------------|
| Estado | Planned 148 · Active 44 · Blocked 1 · **Done 7** |
| Horizonte | Core 41 · Post-core 88 · Future 71 |
| Decisión | Build 127 · Defer 66 · Integrate 5 · Exclude 2 |

### IDC marcados Done en matriz

| IDC | Capacidad | Evidencia código |
|-----|-----------|------------------|
| 1 | Login | `/login` complete |
| 37 | SOAP | `evolution_note` complete |
| 52 | Receta | `prescription` complete |
| 55 | Lab | `lab_request` complete |
| 64 | Derivación | `referral` complete |
| 91 | Assist redacción | API assist |
| 165 | Conciliación | `medication_reconciliation` complete |

### Brechas matriz ↔ código (conciliar en próxima regeneración)

| IDC | Matriz | Código / árbol | Acción |
|-----|--------|----------------|--------|
| 27–30 | Active/Planned | Blueprints `allergy_entry`, `clinical_problem_entry` **complete** | Promover a **Active** o **Done** parcial |
| 31–36, 39–40 | Active | `outpatient_visit`, `medical_certificate` **complete** | Cerrar Ola 2 en matriz → Done tras gate M3-UI |
| 41 | Future/Defer (bloque UCI) | `admission_note` mapea IDC 41 | **Tensión semántica** — IDC 41 = dashboard UCI vs ingreso clínico |
| 42 | Defer | `transfer_note` **complete** | Desacoplar IDC 42 (sábana) de blueprint traslado |
| 58 | Active | `ResultsInboxPage` partial | OK — alinear con árbol |
| 111 | Active/Planned | `nursing_note` complete | Promover IDC 111 |

> **Regla de conciliación:** la matriz cuádruple gobierna **planificación**; el árbol reconciliado gobierna **implementación**. Ante conflicto, actualizar matriz tras gate de MF, no al revés.

---

## 7. Olas — estado conciliado

| Ola / hito | Estado operacional | Evidencia |
|------------|-------------------|-----------|
| **0** Plataforma | ✅ Cerrada | CI, migraciones, golden API, audit deps |
| **1A** Shell | ✅ Done | Login, rail, workspaces, sesión expirada |
| **1B** Consulta mínima | ✅ Done | SOAP + outpatient base |
| **1C** Órdenes/resultados | ◐ Partial | Receta/lab ✓; bandeja partial; CDS demo |
| **1D** IA segura | ◐ Partial | Assist + RAG; golden V5 |
| **2** Ambulatorio | ✅ Implementada | scrollspy + certificado (19º blueprint) |
| **3** Antecedentes | ◐ En curso | Blueprints 27–30 existen; ficha enriquecida partial |
| **4–20** | Planned/Defer | Según matriz IDC |

**EPIS2 Core completado** (definición canon): Tramo A en progreso — falta cerrar 1C–1D + 6A print productivo + gate M3-UI olas abiertas.

---

## 8. Diseño ECM3 (Material 3 adaptativo)

| Tema | Estado | Doc |
|------|--------|-----|
| M3-00…09 | ✅ Completado | `M3_ADOPTION_PLAN.md` |
| LAYOUT-01…05, WIDGET-01 | ✅ Completado | two-pane, context pane, widgets |
| Conciliación olas × M3 | ✅ Documentado | `EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md` |
| Gate M3-UI por ola | ✅ En canon §10 | Checklist 11 ítems |
| Print Carta/A5 productivo | ❌ | Norma escrita; `Print*` pendiente |
| Visual regression CI | ❌ | M3-0.12 gap |
| Workspace `emergency` | ❌ | Planificado Ola 10 |

**6 áreas IA del usuario → 5 workspaces EPIS2:** ver conciliación ECM3 §4.

---

## 9. Deriva documental detectada (conciliada esta sesión)

| Documento | Decía | Debe decir | Acción |
|-----------|-------|------------|--------|
| `EPIS2_RECONCILED_NAVIGATION_TREE.md` | 18 blueprints | **19** | ✅ Actualizado |
| `EPIS2_COMPLETE_FORM_CATALOG.md` | 18 | **19** | ✅ Actualizado |
| `EPIS2_WAVE_EXECUTION_CANON.md` §3 | 18 blueprints | **19** | ✅ Actualizado |
| `EPIS2_ARCHITECTURE_INVENTORY_101_200.md` | baseline 18 | **19** | ✅ Actualizado |
| `epis2-global-screen-form-audit.md` | 18/18 registry | **19/19** | ✅ Actualizado |
| `EPIS2_COMPLETE_SCREEN_CATALOG.md` §20 | 18 rutas | 22+ rutas | Pendiente mantenimiento |

---

## 10. Riesgos priorizados

| # | Riesgo | Severidad | Mitigación |
|---|--------|-----------|------------|
| 1 | Docs «18 blueprints» desincronizados | Media | Actualización esta sesión + lint doc en CI |
| 2 | IDC 41 dual (UCI dashboard vs ingreso) | Media | Glosario IDC: distinguir pantalla vs blueprint |
| 3 | Matriz Done (7) subestima código (~15 complete) | Baja | Regenerar matriz post-gates Ola 2–3 |
| 4 | ESLint crash local Windows | Baja | Verificar en CI Linux |
| 5 | Print no productivo | Alta clínica | Ola 6A + gate impresión |
| 6 | `emergency` workspace ausente | Media | Ola 10 antes de IDC 101–110 |
| 7 | Widget layout solo localStorage | Baja | API perfil futuro |
| 8 | Scaffold ≠ auto-registro blueprint | Media | Proceso MF + gates registry |

---

## 11. Conciliación accionable — próximos 5 pasos

1. **Regenerar matriz IDC** tras cerrar gate M3-UI Ola 2 (promover 31–40, 62).
2. **Ola 3 MF:** enriquecer ficha 21–26; alinear IDC 27–30 con blueprints existentes.
3. **Mantenimiento doc:** actualizar `EPIS2_COMPLETE_SCREEN_CATALOG.md` rutas.
4. **M3-0.12:** visual regression en CI.
5. **Tramo B piloto:** Ola 4 recepción + workspace `reception` (futuro) sin romper ECM3.

---

## 12. Índice de artefactos canónicos

| Dominio | Documento |
|---------|-----------|
| Producto | `docs/PRODUCT_CANON.md` |
| Olas | `docs/product/EPIS2_WAVE_EXECUTION_CANON.md` |
| IDC planificación | `docs/product/EPIS2_IDC_EXECUTION_MATRIX.md` |
| Navegación código | `apps/web/src/navigation/epis2NavigationTree.ts` |
| Diseño ECM3 | `docs/design/EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md` |
| Workspaces | `docs/design/EPIS2_ROLE_WORKSPACES_M3.md` |
| M3 adopción | `docs/design/M3_ADOPTION_PLAN.md` |
| Árbol doc | `docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md` |

---

**Cierre:** EPIS2 está **arquitectónicamente conciliado** (command-first, registries únicos, ECM3, olas ≠ UI). La conciliación pendiente es **operacional**: sincronizar matriz IDC con gates reales, cerrar print/emergency, y eliminar deriva doc restante.
