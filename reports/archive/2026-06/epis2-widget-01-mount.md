# EPIS2 — WIDGET-01 Montaje contextual

**Fecha:** 2026-06-05  
**Alcance:** Plan B — widgets en Centro de Comando y ficha clínica.

---

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| B1 | `buildWidgetContext` desde sesión + paciente + superficie | ✓ |
| B2 | Widgets montados: `patient-context`, `pending-drafts`, `patient-summary`, `active-problems` | ✓ |
| B3 | `ClinicalWidgetPanel` + `ClinicalWidgetCard` con `Epis2Widget*` | ✓ |
| B4 | Tests visibilidad + integración Comando/ficha | ✓ |
| B5 | Gate `widget-registry-gates` actualizado para host WIDGET-01 | ✓ |

---

## Superficies

### Centro de Comando (`/comando`)

Con paciente activo:

- **Contexto del paciente** — visible por defecto
- **Borradores pendientes** — revelado vía `explicitlyShownWidgetIds`
- **Mi trabajo** (dashboard) — **bloqueado** en home

### Ficha (`/espacio/ficha`)

Con `patientId`:

- **Resumen del paciente** — API longitudinal + fallback demo
- **Problemas activos** — problemas del paciente demo

---

## Archivos nuevos

```
apps/web/src/widgets/
  buildWidgetContext.ts
  widgetSurface.ts
  useWidgetActions.ts
  ClinicalWidgetPanel.tsx
  ClinicalWidgetCard.tsx
  ClinicalWidgetPanel.test.tsx
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 204 passed, 10 skipped |
| `npm run db:validate` | OK (18 migraciones) |
| `single-widget-registry` | OK |
| `widget-registry-gates` | OK (host web permitido) |

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Panel compite con Power Bar | Solo visible con paciente; debajo de alertas |
| Fetch sin contexto | `shouldFetch` del registry; sin paciente no hay panel en comando |
| Duplicar registry | Gate prohíbe `EPIS2_WIDGET_REGISTRY` en web |

---

## Próximo paso

**Plan C — V1 completo** (OCR, RAG pgvector, PDF) o ampliar widgets a superficie `clinical-form`.

---

## Frase guía

*Los widgets muestran lo necesario, cuando es necesario, y siempre conducen al trabajo clínico.*
