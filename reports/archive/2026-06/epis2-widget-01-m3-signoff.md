# EPIS2-WIDGET-01 — Montaje M3 contextual (signoff)

**Fecha:** 2026-06-05 · **Alcance:** Rejilla adaptativa, estados M3, catálogo visual, docs

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `Epis2WidgetGrid` + `useEpis2WidgetLayoutBreakpoint` | ✓ |
| 2 | `ClinicalWidgetPanel` usa rejilla M3 | ✓ |
| 3 | `ClinicalWidgetCard` — breakpoint, offline, `ListItemButton` | ✓ |
| 4 | `Epis2WidgetSurface` — span responsive xs/md | ✓ |
| 5 | Catálogo visual — sección widgets | ✓ |
| 6 | Docs + reglas producto sincronizadas | ✓ |

## Superficies (sin cambio de contrato)

| Superficie | Widgets |
|------------|---------|
| `command-center` | `patient-context`, `pending-drafts` (explícito) |
| `patient-workspace` | `patient-summary`, `active-problems` (explícito) |

## Gates

- `npm run check` — OK
- `npm run test` — 288 passed
- `npm run db:validate` — OK

## Riesgos

- Rejilla compacta fuerza span 12 vía `resolveWidgetPlacement` — coherente con M3-06.
- `epis2-ui` no depende de `epis2-widgets`; constante 12 columnas duplicada con comentario de alineación.

## Próximo paso

**V1 completo** (OCR, RAG pgvector, PDF) o widgets en superficie `clinical-form` (fuera de WIDGET-01).
