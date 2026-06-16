# Sesión — Árbol formularios/pantallas + responsive canon

**Fecha:** 2026-06-04  
**Alcance:** canon producto, `formScreenTree`, tokens viewport, gate QA

## Entregables

- `docs/product/EPIS2_FORM_SCREEN_TREE.md` — árbol canónico con layouts, dominios y breakpoints
- `packages/clinical-forms/src/formScreenTree.ts` — árbol programático + `assertFormScreenTreeInvariants`
- Token responsive `clinicalFormMaxWidth`: `{ xs: 100%, sm: 560, md: 640, lg: 720 }`
- `epis2ClinicalFormContentMaxWidthSx` — encuadre two-pane sin `640` hardcoded
- `EpisClinicalScrollspyLayout` — columna en compacto, fila en expanded
- Gate `quality:form-screen-tree-gate` en layers-integration
- Enlaces en `PRODUCT_CANON.md` y `EPIS2_COMPLETE_FORM_CATALOG.md`

## Gates

| Gate | Estado |
|------|--------|
| `npm run check` | OK |
| `quality:form-screen-tree-gate` | OK |
| `quality:layers-integration-gate` | OK |
| Tests formScreenTree + GeneratedClinicalFormPage | OK |

## Riesgos

- Scrollspy oculto &lt;lg: navegación por acordeones sigue disponible
- `patient_summary` marcado PARTIAL en catálogo (datos demo)

## Próximo paso

Commit bajo solicitud; Fase B-04 procedimiento blueprint + farmacia dashboard.
