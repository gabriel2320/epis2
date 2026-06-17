# EPIS2 — Plan F+G UI signoff (piloto demo)

**Fecha:** 2026-06-05 · **Alcance:** Cerrar signoff UI V4/V5 + gates CI post-V3

## Contexto

Plan F (V4 interop, V5 IA, hardening) y Plan G (CI bundle, golden journeys, Dependabot) ya entregados en commits `fa130f7`–`1a1f81a` y `92a3de2`. Esta sesión verifica **gates completos** y añade cobertura UI del tablero de calidad (V4 read-only).

## Entregables sesión

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `QualityDashboardTab.test.tsx` — métricas ops + validación HL7 | ✓ |
| 2 | `data-testid` botón HL7 | ✓ |
| 3 | Gates Plan F+G re-ejecutados localmente | ✓ |
| 4 | Roadmap actualizado — F/G cerrados | ✓ |

## Referencias API (ya existentes)

| Track | Reporte |
|-------|---------|
| Plan F | `reports/archive/2026-06/epis2-plan-f-complete.md` |
| Plan G | `reports/archive/2026-06/epis2-plan-g-complete.md` |
| V4 interop | `reports/epis2-v4-interop-ops.md` |
| V5 IA | `reports/epis2-v5-ai-traceable.md` |

## Gates sesión

- `npm run check` — OK
- `npm run test` — OK (297 passed, 20 skipped)
- `npm run db:validate` — OK
- `npm run ai:evals` — OK (5 casos)
- `npm run quality:golden-journey` — OK (spec; API skipped sin `DATABASE_URL`)
- `npm run qa:bundle-analyze` — OK (presupuestos MUI X dentro de umbral)

## Demo calidad (V4)

1. Login `auditor.demo` → Modo tablero → pestaña **Calidad**
2. Revisar staging FHIR + auditoría (solo lectura)
3. Validar HL7 v2 en panel demo

## Próximo

**Piloto humano** — `docs/quality/PILOT_DEMO_CHECKLIST.md` y `reports/epis2-pilot-human-2026-06-05.md`.
