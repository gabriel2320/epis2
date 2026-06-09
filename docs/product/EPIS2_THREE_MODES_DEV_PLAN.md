# EPIS2 — Plan de desarrollo: tres modos MD3

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Precedencia:** post MF-151…182 · paralelo a Fase C longitudinal  
**Canon:** [`PRODUCT_INVARIANTS.md`](PRODUCT_INVARIANTS.md) · [`EPIS2_GLOBAL_DEV_PLAN.md`](EPIS2_GLOBAL_DEV_PLAN.md)

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

## Microfases (programa THREE-MODES)

| ID | Título | Estado | Depende de |
|----|--------|--------|------------|
| **MF-THREE-MODES-01** | Orquestación login → command → classic → dashboard | **DONE** | MF-CLASSIC-EMR-MD3, MF-DASHBOARD-MD3 |
| **MF-THREE-MODES-02** | Consolidación árbol `modes/` + shims + sesión | **DONE** | MF-THREE-MODES-01 |
| **MF-THREE-MODES-03** | Modal borrador no guardado en transiciones | **READY** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-04** | Search params tipados (`intent`, `returnTo`, `nextMode`) | **READY** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-05** | Dashboard fila → `transitionDashboardToClassic` | **READY** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-06** | Migrar imports legacy → `modes/index` | **READY** | MF-THREE-MODES-02 |
| **MF-THREE-MODES-07** | Journey E2E Playwright three-modes | **READY** | MF-THREE-MODES-03, 05 |
| **MF-THREE-MODES-08** | Eliminar shims deprecated | **BLOCKED** | MF-THREE-MODES-06 |

Reportes de cierre: `reports/epis2-three-modes-*.md`

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
- [ ] Gate `quality:mode-safety-gate` extendido

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
```

**Entregables:**

- [ ] `transitionDashboardToClassic(navigate, patientId, tab)` en handlers de fila
- [ ] Detail pane CTA «Abrir modo clásico» con tab activo en returnTo
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

---

## Integración con plan global

| Plan global | Relación |
|-------------|----------|
| **Fase C** longitudinal | Classic/detail pane comparte paciente activo — no bloquear |
| **Fase D** Tramo J farmacia | Dashboard pharmacy tab usa `buildDashboardTabSearch` |
| **MF-RAD-M3** | Grids dashboard legacy y MD3 comparten datos; modo solo cambia shell |
| **Golden journey** | Paso 1–5 sin cambio; modos son atajos opcionales post-login |

Actualizar [`EPIS2_GLOBAL_DEV_PLAN.md`](EPIS2_GLOBAL_DEV_PLAN.md) Fase E al cerrar MF-THREE-MODES-07.

---

## Definition of Done (cada microfase THREE-MODES)

```bash
npm run check
npm run test -- apps/web/src/modes apps/web/src/session apps/web/src/components/modes
npm run quality:three-modes-gate
npm run db:validate
```

Reporte `reports/epis2-mf-three-modes-XX-*.md` con alcance, gates, riesgos, próximo paso.

---

## Riesgos del programa

| # | Riesgo | Mitigación |
|---|--------|------------|
| 1 | Dashboard compite con home | Invariante #7 + copy + gates |
| 2 | Tres árboles de detección reviven | Solo `modes/` + code review |
| 3 | Navegación directa bypass session | Lint/gate: prohibir `navigate({ to: '/comando' })` en shells MD3 |
| 4 | Preferencia classic por defecto | Default `modern`; opt-in explícito |
| 5 | E2E flaky por timing session | `data-testid` en switcher + wait URL |

---

## Frase guía

> EPIS2 tiene tres modos, pero una sola mente — el plan THREE-MODES cierra deuda de orquestación sin tocar SoT ni registries clínicos.
