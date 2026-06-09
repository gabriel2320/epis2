# EPIS2 — Fix E2E `tramo-c-admission` (PEND-003)

**Fecha:** 2026-06-09  
**Hilo:** B — Calidad E2E  
**Pendiente:** [PEND-003](./epis2-pendientes-registro-2026-06-09.md)

## Contexto

Tras el rediseño de ficha compacta (Ola 3 / M3), los CTAs longitudinales (`epis2-longitudinal-admit-hospital`, órdenes servicio, censo) viven en `PatientLongitudinalPanel`, oculto hasta abrir el split `epis2-ficha-history`. El spec `e2e/tramo-c-admission.spec.ts` seguía asumiendo el panel visible por defecto → drift respecto a `golden-v2-admission-discharge.spec.ts` y `ola3-ficha-journey.spec.ts`.

## Cambios

**Archivo:** `e2e/tramo-c-admission.spec.ts`

1. **Helper local `openFichaHistory`** — mismo patrón que `ola3-ficha-journey.spec.ts`: click en `epis2-ficha-history` + assert `epis2-longitudinal-panel`.
2. **Tres tests** — llaman `openFichaHistory(page)` tras `pinDemoCase` antes de interactuar con CTAs longitudinales.
3. **Eliminados `page.goto` redundantes** — `pinDemoCase` ya navega a `/espacio/ficha?patientId=…`.
4. **MF-TRAMO-C-004** — aserción actualizada de `epis2-dashboard-tab-service` (testId no expuesto en DOM del tab activo) a `epis2-service-orders-grid` (alineado con `golden-v2-admission-discharge.spec.ts`).

**No tocado:** código Tramo J farmacia (Hilo A), helpers combobox (PEND-004).

## Verificación

| Comando | Resultado |
|---------|-----------|
| `npm run stack:dev` | OK (Postgres + migrate) |
| `npm run test:e2e:tramo-c-admission` | **3/3 passed** (13.8s) |
| `npm run check` | OK (lint, typecheck, architecture:validate) |

## Commit sugerido (no aplicado — tests OK, commit a criterio del usuario)

```
fix(e2e): abrir ficha-history antes de CTAs Tramo C

Los CTAs de hospitalización y servicio están en el panel longitudinal,
visible solo tras epis2-ficha-history. Alinea tramo-c-admission con
golden-v2 y ola3-ficha-journey; corrige aserción de órdenes activas.
```

## Cierre PEND-003

**Sí, puede cerrarse** tras marcar fecha en `reports/epis2-pendientes-registro-2026-06-09.md` y actualizar `docs/product/EPIS2_TABLERO.md` (ítem “Deuda E2E tramo-c-admission”).
