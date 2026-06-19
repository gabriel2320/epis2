# MF-PONY-03 — Cierre (collapse secciones demo paciente)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Colapsar páginas finas demo en mapa config + componente de ruta único; URLs intactas.

## Cambios

| Acción | Detalle |
|--------|---------|
| Add | `cicaPatientDemoSections.ts` — SoT alta / interconsultas / procedimientos |
| Add | `CicaPatientDemoSectionRoutePage.tsx` — resuelve registry + config |
| Delete | `CicaPatientDischargePage`, `InterconsultasPage`, `ProceduresPage` (−3) |
| Router | 3 rutas → mismo componente genérico |
| Gate | `validate-cica-clean-room-close-gate` verifica mapa y ausencia de pages finas |
| Tests | `cicaPatientDemoSections.test.ts` |

**No incluido (secciones no-demo):** `Medications`, `Audit`, `Admission` — componentes/slots propios.

## Qué evitamos construir

- Una page TSX por cada nueva sección demo tradicional
- Duplicar wiring blueprint + `TraditionalDemoSection` en N archivos

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:cica-clean-room-close-gate` | OK |
| `cicaPatientDemoSections.test.ts` | OK |
| `buildCicaBlueprintActions.test.ts` | OK (sin regresión) |
| `quality:fast` | OK |

## Riesgos

Bajo — mismas URLs, testIds y blueprints; lookup por `findCicaScreenByRoutePrefix`.

## Próximo paso

**MF-PONY-04** — dedup blueprints triviales vs registry.
