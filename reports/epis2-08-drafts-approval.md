# EPIS2-08 — Borradores y aprobación

**ID:** EPIS2-08  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Máquina de estados | `@epis2/clinical-domain` — `draftStates.ts` |
| Versionado | `draft_versions` en cada guardado/actualización |
| API | `GET /api/drafts`, detalle con versiones, `PATCH` con transiciones, `POST …/approve` |
| UI | `DraftReviewPage` — historial, enviar a revisión, aprobar (humano) |
| IA | `sanitizeAiSuggestedFields` — ignora `status` / `approve` |

---

## Gates

| Criterio | ✓ |
|----------|---|
| `approved` solo vía endpoint + `draft.approve` | PATCH bloquea `approved` |
| IA no auto-aprueba | `sanitizeAiSuggestedFields` + tests |
| Versiones incrementan | test integración (con DB) |

---

## Flujo demo

1. Formulario clínico → **Guardar borrador** → `/espacio/borrador/:id`
2. **Enviar a revisión** → estado `ready_for_review`
3. Médico con permiso → **Aprobar (humano)** → nota en `clinical_notes`

---

## Próximo paso

**EPIS2-09** — Datos demo sintéticos (5 casos completos). Ver `epis2-09-demo-data.md`.

---

## Commit sugerido

```text
feat(epis2-08): draft state machine, version history, and human approval UI

Add draft lifecycle transitions, versioned saves, review page with
human-only approval, and AI field sanitization blocking auto-approve.
```
