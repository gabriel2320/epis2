# EPIS2 — PEND-011: fix CI rojo E2E impresión Ola 6A

**Fecha:** 2026-06-10 · **Pendiente:** PEND-011 (P0) · **Hilo:** Calidad / CI

## Alcance declarado

- `apps/web/src/pages/GeneratedClinicalFormPage.tsx` (guard de acceso)
- `apps/web/src/pages/GeneratedClinicalFormPage.test.tsx` (tests del guard)
- Docs: tablero + registro de pendientes + este reporte

## Síntoma

Desde `fb5ba23` (fase 2, que amplió el set `test:e2e` de CI con los specs de impresión), CI rojo:
`ola6a-print-certificate`, `ola6a-print-orders` (lab + imagen) fallaban con
`getByTestId('epis2-form-<blueprint>')` not found (timeout 15 s). Localmente en dev pasaban.

## Causa raíz

**Carrera de autenticación en carga fría, visible solo con bundle de producción.**

1. Los specs hacen `page.goto('/espacio/<form>?patientId=…')` → carga fría del SPA.
2. `AuthProvider` arranca con `session = null` y resuelve `fetchSession()` async.
3. `GeneratedClinicalFormPage` calculaba `allowed = role !== undefined && …` → con sesión aún
   cargando, `allowed = false` y su `useEffect` **redirigía de inmediato a `/sin-acceso`**
   («Tu rol no puede usar este formulario») — capturado en screenshot de Playwright.
4. En dev (vite) la sesión gana la carrera; con `npm run preview` (CI usa bundle, ver
   `playwright.config.ts`) el primer render gana y la página redirige antes de tener rol.

Reproducido localmente al 100% con `CI=1` + `npm run build -w @epis2/web`: **los 5 specs de
impresión fallaban** (incluso epicrisis/receta que en CI a veces pasaban por timing).

## Fix mínimo

`GeneratedClinicalFormPage`: el guard ya no decide mientras `useAuth().isLoading` es true.

- Mientras carga: render `null` (sin flash, sin redirect).
- Sesión cargada y rol no permitido: redirect a `/sin-acceso` (comportamiento original).

Tests unitarios nuevos (`GeneratedClinicalFormPage.test.tsx`):

- no redirige a `/sin-acceso` mientras la sesión carga;
- redirige cuando la sesión cargó sin rol válido.

## Gates ejecutados

| Gate | Resultado |
|------|-----------|
| `playwright test ola6a-print-*` (paridad CI: bundle + `CI=1`) | **5/5 ✓** (antes 0/5) |
| `npm run test:e2e` (set CI completo) | **15/15 ✓** |
| Tests unitarios `GeneratedClinicalFormPage*` | 11/11 ✓ (incluye 2 nuevos) |
| `npm run check` (lint + typecheck + 18 gates arquitectura) | ✓ |
| `npm run test` | **235/235 archivos ✓** (1.ª pasada tuvo 2 flaky de integración por puertos con stack dev activo; re-run limpio) |

## Riesgos

- Bajo: el cambio solo posterga la decisión del guard hasta que la sesión termine de cargar;
  el caso «sin sesión» sigue cubierto por `requireSession` (router) + redirect del guard.

## Próximo paso exacto

1. Push y verificar run CI verde (gate de cierre real de PEND-011).
2. Con CI verde: desbloquear **Hilo NORM** (PEND-012) y abrir Tramo N1.
