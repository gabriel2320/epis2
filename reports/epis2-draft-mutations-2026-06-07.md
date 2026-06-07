# EPIS2 — Mutaciones borrador (useMutation)

**Fecha:** 2026-06-07 · **Alcance:** Prioridad B — invalidación unificada post-borrador

---

## Alcance

Cerrar la capa TanStack Query con **mutaciones** para crear, actualizar y aprobar borradores, con invalidación centralizada de lecturas clínicas.

---

## Cambios

| Área | Detalle |
|------|---------|
| API | `createDraft()` en `clinicalApi.ts` |
| Invalidación | `invalidateClinicalDraftQueries()` — borradores, ficha, dashboard, alertas |
| Hooks | `useCreateDraftMutation`, `useUpdateDraftMutation`, `useApproveDraftMutation` |
| Formularios | `GeneratedClinicalFormPage` — guardar borrador vía mutation |
| Revisión | `DraftReviewPage` — enviar a revisión / aprobar vía mutations |
| Test | `invalidateClinical.test.ts` |

---

## Invalidación tras mutación

- `queryKeys.drafts.*`
- `queryKeys.patients.detail/longitudinal/clinicalAlerts` (si hay `patientId`)
- `queryKeys.dashboard.all()` y `dashboard.patient`

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 439/439 OK |
| `npm run db:validate` | OK |

---

## Próximo paso

1. **Prioridad A:** signoff clínico humano A–K → piloto institucional.
2. PATCH borrador desde edición continua en formulario (si se añade flujo edit-by-id).
3. CI opcional: `storybook:ui:build` + presupuesto bundle M3-09.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
