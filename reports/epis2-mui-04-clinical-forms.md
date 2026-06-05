# EPIS2-MUI-04 — Formularios clínicos

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Wrapper | Función |
|---------|---------|
| `EpisClinicalForm` | Render de blueprint (`EpisClinicalField` + secciones/acordeón) |
| `EpisClinicalFormPage` | Shell de página de formulario |
| `EpisDraftStatus` | Chip de estado de borrador |
| `EpisApprovalGate` | Envío a revisión + aprobación humana |
| `EpisAiDisclosure` | Aviso de revisión humana con IA |

- Eliminados `ClinicalFormRenderer.tsx` y `DraftStatusChip.tsx` de `apps/web`.
- `GeneratedClinicalFormPage`, `DraftReviewPage`, tablero y ficha usan wrappers `epis2-ui`.
- Copy: `drafts.approvalDisclaimer`.
- Build: `clinical-forms` antes de `epis2-ui`.

## Próximo paso

**MUI-05:** `@mui/x-data-grid` + `EpisDataGrid` (worklists).
