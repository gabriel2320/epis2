# EPIS2 — Sistema único de desarrollo (SDEPIS2)

**Versión:** 1.0 · **Fecha:** 2026-06-09  
**Estado:** Canónico — reemplaza vocabulario disperso (fases, lotes, etapas, story board, olas mezcladas).

> **Una sola regla:** cada unidad de trabajo tiene **un nivel**, **un ID** y **un artefacto**. No mezclar sinónimos en el mismo documento.

---

## 1. Jerarquía (mayor → menor)

```text
Invariante
  └─ Ola (capacidad producto)
       └─ Hito (cierre parcial en ola: 1A, 1B, EPIS2-05…)
            └─ Capa (eje transversal L0–L6)
                 └─ Hilo (secuencia activa plan global: Hilo A…D)
                      └─ Tramo clínico (dominio A–K)
                           └─ Programa (init transversal PROG-*)
                                └─ Microfase (unidad de sesión MF-*)
                                     └─ Entrega (PR/commit acotado)
```

**Precedencia:** Ola define *qué capacidad* · Tramo define *dominio clínico* · Hilo define *qué hacer ahora* · Microfase define *una sesión agente*.

---

## 2. Glosario canónico

| Término | ID | Qué es | Fuente / ejemplo |
|---------|-----|--------|------------------|
| **Invariante** | — | Regla permanente de producto | `PRODUCT_INVARIANTS.md` |
| **Ola** | Ola 0…9+ | Agrupación arquitectónica de capacidades (precedencia, no cola rígida) | `EPIS2_WAVE_EXECUTION_CANON.md` · Ola 2 = atención médica |
| **Hito** | 1A, 1B, EPIS2-05 | Subconjunto cerrable dentro de ola o bootstrap MVP | `ROADMAP.md` · EPIS2-00…12 = hitos bootstrap |
| **Capa** | L0…L6 | Eje transversal del plan global (invariantes, tramos, RAD…) | `EPIS2_GLOBAL_DEV_PLAN.md` |
| **Hilo** | Hilo A…D, UX-1 | Secuencia de trabajo activa post-MVP (antes «Fase A/B/C») | Plan global · **Hilo C** activo |
| **Tramo clínico** | Tramo A…K | Dominio clínico / IDC (`MF-TRAMO-*`) | Tramo J = farmacia |
| **Secuencia operacional** | Sec. A…D | Orden recomendado de olas (≠ tramo clínico) | `EPIS2_WAVE_EXECUTION_CANON.md` §9 |
| **Programa** | PROG-* | Iniciativa transversal con microfases propias | PROG-THREE-MODES |
| **Microfase** | MF-* | Unidad ejecutable en **una sesión** agente | `microphase-ledger.json` · MF-157 |
| **Entrega** | ENT-* o commit | PR/commit acotado dentro de microfase o hilo | Entrega CI-E2E (antes «Lote 1») |
| **IDC** | 1…200 | Ítem catálogo funcional hospitalario | `EPIS2_IDC_EXECUTION_MATRIX.md` |
| **Tablero de desarrollo** | — | Vista viva hecho / en curso / siguiente | [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md) |
| **Storybook** | — | Herramienta UI dev (`npm run storybook:ui`) — **no** planificación | `EPIS2_STORYBOOK_DECISIONS.md` |

---

## 3. Sinónimos deprecados (no usar en docs nuevos)

| ❌ Deprecado | ✅ Usar | Notas |
|-------------|---------|-------|
| Story board | **Tablero de desarrollo** | Estado vivo; no confundir con Storybook |
| Storybook (como plan) | **Storybook** solo como herramienta UI | Catálogo M3 en `packages/epis2-ui` |
| Fase A / B / C / D (plan global) | **Hilo A / B / C / D** | «Fase B activa» → «Hilo B activo» |
| Fase (EPIS2-00…) | **Hito bootstrap** o **EPIS2-NN** | Mantener ID `EPIS2-05`; no renombrar código |
| Etapa | **Hito** o **Entrega** | Según escala |
| Lote 1 / Lote 2 | **Entrega** | p. ej. Entrega E2E-01 |
| Milestone | **Hito** | 1A, 1B en Ola 1 |
| MF-1…51 (oral) | **Microfase** + ID ledger | Ver conciliación §5 |
| Dashboard (como home) | **Modo tablero** `/epis2/dashboard` | Home = CICA `/app/buscar` |

---

## 4. Artefactos por nivel

| Nivel | Artefacto principal | Comando / gate |
|-------|---------------------|----------------|
| Sistema | Este documento | — |
| Tablero | `EPIS2_TABLERO.md` | — |
| Ola / tramo | `EPIS2_WAVE_EXECUTION_CANON.md` | `quality:golden-journey` |
| Plan global | `EPIS2_GLOBAL_DEV_PLAN.md` | `quality:layers-integration-gate` |
| Microfase | `microphase-ledger.json` | `npm run quality:microphase-next` |
| IDC | `epis2-idc-execution-matrix.json` | `generate-idc-matrix.mjs` |
| Cierre sesión | `reports/epis2-mf-*.md` | `npm run check` · `test` · `db:validate` |
| UI catálogo | Storybook `:6006` | `storybook:ui:build` · gate MUI-G16 |

---

## 5. Conciliación de IDs microfase

Tres familias coexisten; **no renombrar** sin migración explícita del ledger:

| Familia | Rango | Uso |
|---------|-------|-----|
| **Hito bootstrap** | EPIS2-00…12 | MVP cerrado · mapa MF-1…13 en `MF_UNIFIED_CANON.md` |
| **Ledger post-MVP** | MF-151…188 | Fuente operativa histórica · **DONE** |
| **Programa modos** | MF-THREE-MODES-01…08 | PROG-THREE-MODES · EPIS2-PM-01 |
| **Tramo clínico** | MF-TRAMO-* | Inventario dominio A–K |
| **UI / RAD** | MF-UI-*, MF-RAD-* | Gates densidad y disciplina |
| **Propuesta futura** | MF-2xx | No activa hasta decisión explícita |

Tabla MF-1…51 ↔ legado: [`docs/quality/MF_UNIFIED_CANON.md`](../quality/MF_UNIFIED_CANON.md).

---

## 6. Flujo de sesión (agente o humano)

```text
1. Leer PRODUCT_CANON + PRODUCT_INVARIANTS
2. Leer EPIS2_DEV_SYSTEM (este doc) + EPIS2_TABLERO
3. npm run quality:microphase-next  → microfase READY o hilo activo
4. Declarar alcance: nivel + ID + archivos permitidos
5. Implementar una microfase o entrega
6. Gates: check · test · db:validate (+ específicos del hilo)
7. Reporte reports/*.md + actualizar tablero si cambia el siguiente paso
```

---

## 7. Estado actual (snapshot 2026-06-09)

| Nivel | Estado |
|-------|--------|
| Hitos bootstrap EPIS2-00…12 | ✓ Cerrados |
| Programa MF-151…182 | ✓ Cerrado |
| PROG-THREE-MODES | ✓ Cerrado |
| CI master | ✓ 10/10 E2E · [run 27222014998](https://github.com/gabriel2320/epis2/actions/runs/27222014998) · `15b6131` |
| **Hilo B** (Ola 2) | ✓ Cerrado 2026-06-09 · PEND-002 defer |
| **Hilo C** (Ola 3) | ○ Activo |
| **Hilo D** / Tramo J | ✓ PEND-001 cerrado 2026-06-09 |
| Ledger MF READY | 0 — usar hilo + tablero |

Auditoría: [`reports/archive/2026-06/epis2-audit-avance-proyecto-2026-06-09.md`](../../reports/archive/2026-06/epis2-audit-avance-proyecto-2026-06-09.md) · Registro pendientes: [`reports/archive/2026-06/epis2-pendientes-registro-2026-06-09.md`](../../reports/archive/2026-06/epis2-pendientes-registro-2026-06-09.md)

---

## 8. Referencias (no duplicar contenido)

- [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md) — tablero de desarrollo
- [`EPIS2_GLOBAL_DEV_PLAN.md`](./EPIS2_GLOBAL_DEV_PLAN.md) — capas e hilos
- [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) — olas y secuencias
- [`EPIS2_COMPLETION_ROADMAP.md`](./EPIS2_COMPLETION_ROADMAP.md) — olas por capacidad
- [`ROADMAP.md`](../ROADMAP.md) — hitos bootstrap EPIS2-NN
- [`MICROPHASE_PROGRAM.md`](../quality/MICROPHASE_PROGRAM.md) — reglas microfase
- [`EPIS2_STORYBOOK_DECISIONS.md`](../design/EPIS2_STORYBOOK_DECISIONS.md) — Storybook UI

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
