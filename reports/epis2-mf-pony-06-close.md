# MF-PONY-06 — Cierre (registry-driven CICA routes · 06a)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Generador de rutas TanStack desde `EPIS_CICA_SCREEN_REGISTRY`; wiring componentes en mapa único.

## Cambios

| Acción | Detalle |
|--------|---------|
| epis2-ui | `registryRouteToTanstackPath`, `parseCicaDraftRouteSearch`, `CICA_DRAFT_FORM_SCREEN_IDS` |
| Web | `cicaRouteComponents.ts` — mapa screenId → page |
| Web | `buildCicaRoutesFromRegistry.ts` — wiring `CICA_REGISTRY_ROUTE_WIRING` + rutas literales (inferencia TanStack) |
| Router | −~170 líneas de `createRoute` manuales |
| Gates | clean-room + screen-registry verifican generador |
| Tests | `cicaRoutePaths.test.ts`, `buildCicaRoutesFromRegistry.test.ts` |

**URLs intactas** — conversión `:param` → `$param` sin cambio de paths.

## Qué evitamos construir

- Un `createRoute` manual por pantalla CICA nueva
- Cuarta fuente de paths (`router` duplicando `registry`)

## Gates

| Gate | Resultado |
|------|-----------|
| `validate-cica-screen-registry-gate` | OK |
| `validate-cica-clean-room-close-gate` | OK |
| `quality:fast` | OK |

## Riesgos / pendiente

- **06b/06c** (programa): golden journey + e2e CICA en CI pre-merge PR
- Orden de rutas depende del orden registry (ya canónico)

## Próximo paso

**MF-PONY-07** — nav/tabs unificados · o cerrar PR #46 tras CI verde.
