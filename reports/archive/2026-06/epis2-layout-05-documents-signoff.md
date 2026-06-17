# EPIS2-LAYOUT-05 — Documentos en context pane + signoff layout

**Fecha:** 2026-06-05 · **Alcance:** Tabs Eventos/Documentos, deuda UX ficha, catálogo visual

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `EpisClinicalContextDocuments` — búsqueda API con debounce 200ms | ✓ |
| 2 | Tabs en `EpisClinicalContextPane` (Eventos \| Documentos) | ✓ |
| 3 | Detalle in-panel + chip inserción en documentos | ✓ |
| 4 | `PatientClinicalAiPanel` colapsado por defecto en ficha | ✓ |
| 5 | Sección «Layouts clínicos» en catálogo visual M3 | ✓ |
| 6 | Tests componentes + catálogo | ✓ |

## Gates

- `npm run check` — OK
- `npm run test` — 287 passed
- `npm run db:validate` — OK

## Riesgos

- Búsqueda documental requiere ≥2 caracteres; coherente con coste API.
- Intake de documentos permanece solo en ficha longitudinal (no duplicado en split).

## Próximo paso

**EPIS2-13** — Hospitalización (V2) según `docs/ROADMAP.md`, o piloto humano con checklist `PILOT_DEMO_CHECKLIST.md`.
