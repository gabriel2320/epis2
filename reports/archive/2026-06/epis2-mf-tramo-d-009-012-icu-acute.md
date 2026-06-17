# EPIS2 — MF-TRAMO-D-009 … D-012 (UCI aguda demo)

**Fecha:** 2026-06-07

## Alcance

Profundización post-cierre Tramo D: paneles demo IDC **46–49** en tablero UCI.

| MF | IDC | Panel | Gate |
|----|-----|-------|------|
| D-009 | 46 | Valoración neurológica (GCS, pupilas) | `quality:tramo-d-neurological-gate` |
| D-010 | 47 | Escalas SOFA / APACHE II | `quality:tramo-d-severity-scales-gate` |
| D-011 | 48 | Titulación vasoactivos | `quality:tramo-d-vasoactive-gate` |
| D-012 | 49 | Sedoanalgesia + RASS | `quality:tramo-d-sedoanalgesia-gate` |

## Archivos tocados

- `packages/contracts/src/dashboard.ts` — schemas neurológico, escalas, vasoactivos, sedoanalgesia
- `apps/api/src/dashboard/icu.ts` — demo data + IDC 46–49 Active
- `apps/web/src/components/IcuDashboardTab.tsx` — 4 paneles
- `packages/design-system/src/copy/es.ts` — microcopy español
- `e2e/tramo-d-icu.spec.ts` — journeys E2E
- Matriz IDC + plan/cierre Tramo D actualizados

## Corrección canon

Pabellón = **Ola 15 IDC 151–160** (no 121–130 APS). Actualizado en plan maestro y cierre D.

## Riesgos

- Demo read-only; no titulación real ni integración bombas
- IDC 131–140 UCI especializada sigue Defer

## Próximo paso

Signoff clínico A–D · inventario Tramo E pabellón (151–160) · UCI 131–140 Future

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
