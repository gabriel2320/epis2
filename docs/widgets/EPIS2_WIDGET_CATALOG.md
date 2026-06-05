# EPIS2 — Catálogo de widgets (WIDGET-00 demo)

Definiciones sintéticas en `@epis2/epis2-widgets`. Sin PHI real.

| id | label | categoría | contexto | oculto por defecto |
|----|-------|-----------|----------|-------------------|
| `patient-context` | Contexto del paciente | command-center | paciente | no |
| `pending-drafts` | Borradores pendientes | clinical | usuario | sí |
| `patient-summary` | Resumen del paciente | patient | paciente | sí |
| `active-problems` | Problemas activos | clinical | paciente | sí |
| `recent-labs` | Laboratorio reciente | clinical | paciente | sí |
| `my-work` | Mi trabajo | dashboard | usuario | sí |

## Acciones permitidas

Solo `navigate` (ruta) o `command` (intent del Command Registry). Ejemplos:

- `patient-context` → `/espacio/ficha`, `summarize_patient`
- `pending-drafts` → `/espacio/borrador/$draftId`
- `my-work` → `/epis2/dashboard`, `open_dashboard_work`

## Datos sintéticos

Fixtures: `packages/epis2-widgets/src/fixtures/demo-widget-data.ts`

## IA

| Widget | aiMode |
|--------|--------|
| patient-summary | optional-offline |
| my-work | optional-offline |
| resto | none |

La IA nunca es obligatoria para renderizar el widget.
