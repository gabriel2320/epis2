# EPIS2-LAYOUT-04 — Drag & drop + sessionStorage + blueprints

**Fecha:** 2026-06-05 · **Alcance:** Desktop DnD, persistencia split, receta e interconsulta

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `clinical-context-dnd` — MIME + serialización | ✓ |
| 2 | Drop en textareas (`EpisClinicalField` / `EpisClinicalForm`) | ✓ |
| 3 | Timeline `draggable` + `aria-grabbed` en desktop | ✓ |
| 4 | `useEpisClinicalContextDragEnabled` (sin MUI directo en web) | ✓ |
| 5 | `sessionStorage` por `patientId+blueprintId` en hook split | ✓ |
| 6 | Blueprints `prescription` + `referral` + campos destino | ✓ |
| 7 | Tests DnD, sessionStorage, blueprints, arquitectura | ✓ |

## Campos destino por blueprint

| Blueprint | Campo inserción |
|-----------|-----------------|
| `evolution_note` | `plan` |
| `discharge_summary` | `followUpPlan` |
| `prescription` | `clinicalNotes` |
| `referral` | `clinicalSummary` |

## Gates

- `npm run check` — OK (tras fix typecheck)
- `npm run test` — 285 passed
- `npm run db:validate` — OK

## Riesgos

- Drop solo en textareas con foco visual (outline); chip sigue como fallback accesible.
- `sessionStorage` no sobrevive cierre de pestaña; aceptable para preferencia de sesión.

## Próximo paso

**LAYOUT-05** (si aplica diseño) — búsqueda documental en context pane, o cierre de fase layout con golden journey manual.
