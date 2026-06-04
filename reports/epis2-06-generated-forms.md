# EPIS2-06 — Formularios generados

**ID:** EPIS2-06  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Registry | `packages/clinical-forms` — 6 blueprints declarativos |
| Validación | `validateFormValues`, `assertRegistryInvariants` |
| UI | `ClinicalFormRenderer` + `GeneratedClinicalFormPage` |
| Rutas | `/espacio/*` enlazadas 1:1 con blueprints |
| Borrador | Guardado vía `POST /api/drafts` cuando hay paciente + API |

---

## Blueprints MVP

| blueprintId | Intent | Ruta |
|-------------|--------|------|
| `patient_search` | search_patient | `/espacio/buscar-paciente` |
| `patient_summary` | summarize_patient | `/espacio/resumen` |
| `evolution_note` | create_evolution_draft | `/espacio/evolucion` |
| `discharge_summary` | prepare_discharge_draft | `/espacio/epicrisis` |
| `prescription` | prepare_prescription | `/espacio/receta` |
| `lab_request` | request_laboratory | `/espacio/laboratorio` |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Un blueprint por `blueprintId` | `registry.test.ts` |
| `intentIds` ⊆ command-registry | `assertRegistryInvariants()` |
| Render sin IA | `aiAssistMode: NONE` + test web |

---

## Próximo paso

**EPIS2-07** — IA local segura (Ollama opcional).

---

## Commit sugerido

```text
feat(epis2-06): declarative clinical form blueprints and MUI renderer

Add unified form registry with six MVP blueprints, generated workspace pages,
client-side validation without AI, and optional draft persistence via API.
```
