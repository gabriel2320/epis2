# MF-OLA3-001 — Ficha → antecedentes (CTAs)

**Fecha:** 2026-06-07  
**Ola:** 3 (ficha longitudinal)  
**Estado:** ✅ Parcial — CTAs y rutas; IDC 27–29 siguen Active

## Alcance

Enriquecer ficha con accesos directos a blueprints de antecedentes y bandeja de resultados.

## Cambios

- `PatientLongitudinalPanel` — CTAs alergia, problema, resultados
- `PatientWorkspacePage` — handlers + `QUICK_ROUTE_PATHS`
- `clinicalNavigate.ts` — rutas tipadas Ola 3
- `copy/es.ts` — microcopy CTAs
- `PatientLongitudinalPanel.test.tsx`

## IDC

| IDC | Estado | Nota |
|-----|--------|------|
| 27–28 | Active | CTA + blueprint; no Done (falta journey E2E) |
| 29 | Active | CTA problema |
| 21–26 | Active | quick routes ampliados |

## Próximo

MF-OLA3-002 — E2E ficha CTAs + banner alertas (IDC 22)
