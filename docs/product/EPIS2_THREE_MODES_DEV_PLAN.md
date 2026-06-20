# EPIS2 — Plan de desarrollo: tres modos MD3

> **SUPERSEDED_DOC fence (2026-06-19):** plan three modes historico. No usar como estrategia principal. Canon vigente: CICA GO `/app/buscar`; three modes queda secundario/congelado.

**Versión:** 1.1 · **Fecha:** 2026-06-04  
**Precedencia:** post MF-151…182 · paralelo a Fase C longitudinal  
**Canon:** [`PRODUCT_INVARIANTS.md`](PRODUCT_INVARIANTS.md) · [`EPIS2_GLOBAL_DEV_PLAN.md`](EPIS2_GLOBAL_DEV_PLAN.md)

> **Fuente única de nomenclatura** del programa tres modos. Evitar alias sueltos (`Fase E`, `EPIS2-13`, `MF-01`).

---

## Tabla de nomenclatura (canónica)

| Capa | ID canónico | Nombre | No usar (conflicto) |
|------|-------------|--------|---------------------|
| Roadmap post-MVP | **EPIS2-PM-01** | Tres modos MD3 | ~~EPIS2-13~~ → reservado a **Hospitalización V2** |
| Plan global (hilo Q2) | **Fase UX-1** | Orquestación tres modos | ~~Fase E~~ → **Tramo E** = pabellón |
| Programa | **PROG-THREE-MODES** | MF-THREE-MODES-01…08 | ~~MF-THREE-MODES-ORCHESTRATION~~ |
| Prerrequisito shell | **MF-CLASSIC-MD3** | Classic EMR MD3 | alias reporte: MF-CLASSIC-EMR-MD3 |
| Prerrequisito shell | **MF-DASHBOARD-MD3** | Dashboard MD3 | alias reporte: MF-DASHBOARD-MD3-AI-DESIGN-AGENTS |
| Quality gates | **PM01-A…E** | Ver `QUALITY_GATES.md` § EPIS2-PM-01 | ~~13-A…E~~ |
| Reporte cierre MF | `reports/epis2-mf-three-modes-NN-<slug>.md` | NN = 01…08 | ~~epis2-three-modes-*~~ salvo auditorías |

**Numeración MVP (`ROADMAP.md`):** EPIS2-00…**12** cerradas. EPIS2-**13** en [`EPIS2_RELEASE_ROADMAP.md`](EPIS2_RELEASE_ROADMAP.md) = **Hospitalización (V2)** — eje distinto.

---

## Norte

```text
Login → /comando (HOME)
         ├─► Classic EMR (?mode=classic + patientId)
         └─► Dashboard MD3 (?mode=dashboard + tab)
```

Una sesión (`EpisSessionContext`). Un árbol de modos (`modes/index`). Cero routers paralelos.

Arquitectura: [`EPIS2_MODES_LAYER.md`](../architecture/EPIS2_MODES_LAYER.md)

---

## Microfases (PROG-THREE-MODES)

| ID | Título | Estado | Depende de |
|----|--------|--------|------------|
| **MF-THREE-MODES-01** | Orquestación login → command → classic → dashboard | **DONE** | MF-CLASSIC-MD3, MF-DASHBOARD-MD3 |
| **MF-THREE-MODES-02** | Consolidación árbol `modes/` + sesión | **DONE** | MF-THREE-MODES-01 |
| **MF-THREE-MODES-03** | Modal borrador no guardado en transiciones | **DONE** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-04** | Search params tipados (`intent`, `returnTo`, `nextMode`) | **DONE** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-05** | Dashboard → `transitionDashboardToClassic` | **DONE** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-06** | Migrar imports legacy → `modes/index` | **DONE** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-07** | Journey E2E Playwright three-modes | **DONE** | MF-THREE-MODES-03, 05 |
| **MF-THREE-MODES-08** | Eliminar shims deprecated | **DONE** | MF-THREE-MODES-06 |

Reportes históricos: `reports/epis2-three-modes-*.md` · cierres nuevos: `reports/epis2-mf-three-modes-NN-*.md`

---

## MF-THREE-MODES-03 — Modal borrador no guardado

**Objetivo:** Evitar pérdida silenciosa al cambiar modo con formulario dirty.

**Alcance permitido:**

```text
apps/web/src/modes/modeTransitionSafety.ts   (nuevo)
apps/web/src/session/EpisSessionContext.tsx
apps/web/src/components/modes/EpisModeSwitcher.tsx
packages/design-system/src/copy/es.ts        (copy modal)
```

**Entregables:**

- [ ] Hook `useUnsavedDraftGuard()` consulta borrador activo
- [ ] Modal confirmación antes de `setActiveMode` / switcher
- [ ] Gate `quality:mode-safety-gate` extendido (PM01-E)

**Gates:** `npm run check` · `quality:three-modes-gate` · tests unitarios guard

**Riesgo:** falso positivo si borrador auto-guardado — usar estado API/local explícito

---

## MF-THREE-MODES-04 — Router search tipado

**Objetivo:** Validar `intent`, `returnTo`, `nextMode` en TanStack Router search schemas.

**Alcance:**

```text
apps/web/src/routes/router.tsx
apps/web/src/routes/clinicalNavigate.ts
apps/web/src/modes/episModeSearch.ts
```

**Entregables:**

- [ ] `CommandSearch` con `intent`, `nextMode`, `context`
- [ ] `ClassicSearch` con `returnTo`, `mode`
- [ ] Eliminar casts `as never` en session/guards

---

## MF-THREE-MODES-05 — Dashboard → Classic desde fila

**Objetivo:** Click en fila de grilla MD3 abre ficha classic preservando `returnTo=dashboard`.

**Alcance:**

```text
apps/web/src/components/dashboard-md3/EpisDashboardMd3MainGrid.tsx
apps/web/src/components/dashboard-md3/EpisDashboardMd3DetailPane.tsx
apps/web/src/dashboard/DashboardModeContent.tsx
apps/web/src/session/EpisSessionContext.tsx   (transiciones cruzadas)
```

**Entregables:**

- [ ] `transitionDashboardToClassic(navigate, patientId, tab)` en handlers de fila
- [ ] Detail pane CTA «Abrir modo clásico» con tab activo en returnTo
- [ ] `setActiveMode` ramifica classic↔dashboard (no solo vía command)
- [ ] Test unitario transición

---

## MF-THREE-MODES-06 — Migración imports

**Objetivo:** Todos los consumidores importan desde `modes/index`.

**Archivos a migrar (lista inicial):**

```text
apps/web/src/layouts/ClinicalShellLayout.tsx
apps/web/src/pages/PatientWorkspacePage.tsx
apps/web/src/pages/GeneratedClinicalFormPage.tsx
apps/web/src/classic-md3/classicNavDestinations.ts   ✓
apps/web/src/dashboard/DashboardModeContent.tsx      ✓ parcial
```

**DoD:** grep sin imports directos a `useClassicMd3Mode` / `userPreferences` fuera de shims.

---

## MF-THREE-MODES-07 — Journey E2E

**Objetivo:** Playwright demuestra flujo completo three-modes.

**Pasos:**

1. Login → `/comando`
2. Seleccionar paciente → classic via switcher
3. Volver command → abrir dashboard tab work
4. Desde dashboard → classic con returnTo
5. Assert URLs contienen `mode=` canónico

**Artefacto:** `e2e/three-modes-journey.spec.ts` · screenshots en `reports/screenshots/three-modes/`

**Gate cierre EPIS2-PM-01:** PM01-A…E + este journey.

---

## Integración con plan global

| Plan global | Relación |
|-------------|----------|
| **Fase UX-1** (`EPIS2_GLOBAL_DEV_PLAN.md`) | Este programa — marcar cerrada al completar MF-07 |
| **Fase C** longitudinal | Classic/detail pane comparte paciente activo — no bloquear |
| **Fase D** Tramo J farmacia | Dashboard pharmacy tab usa `buildDashboardTabSearch` |
| **MF-RAD-M3** | Grids dashboard legacy y MD3 comparten datos; modo solo cambia shell |
| **Golden journey** | Paso 1–5 sin cambio; modos son atajos opcionales post-login |
| **EPIS2-13** (RELEASE) | Hospitalización V2 — **sin dependencia** con PROG-THREE-MODES |

---

## Definition of Done (cada microfase)

```bash
npm run check
npm run test -- apps/web/src/modes apps/web/src/session apps/web/src/components/modes
npm run quality:three-modes-gate
npm run db:validate
```

Reporte `reports/epis2-mf-three-modes-NN-<slug>.md` con alcance, gates, riesgos, próximo paso.

---

## Riesgos del programa

| # | Riesgo | Mitigación |
|---|--------|------------|
| 1 | Dashboard compite con home | Invariante #7 + copy + gates |
| 2 | Tres árboles de detección reviven | Solo `modes/` + code review |
| 3 | Navegación directa bypass session | MF-06: sesión o `navigateToMode` |
| 4 | Preferencia classic por defecto | Default `modern`; opt-in explícito |
| 5 | E2E flaky por timing session | `data-testid` en switcher + wait URL |
| 6 | Colisión EPIS2-13 / Fase E | Usar solo IDs de la tabla § nomenclatura |

---

## Frase guía

> EPIS2 tiene tres modos, pero una sola mente — PROG-THREE-MODES cierra deuda de orquestación sin tocar SoT ni registries clínicos.
