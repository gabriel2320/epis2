# EPIS2 — MF-RAD-M3-A Phase A (2026-06-07)

**Microfase:** MF-RAD-M3-A — Migración de superficies densas a Grid, Bulk Actions y formularios plegables  
**Canon:** sin router paralelo; `/comando` intacto; Tramo J Farmacia **bloqueado**

---

## Pantallas auditadas y migradas

| Pantalla / tab | Superficie RAD | Estado | Cambio principal |
|----------------|----------------|--------|------------------|
| `/espacio/resultados` | Grid | **done** | `EpisRadGridSurface` + grids críticos/órdenes + bulk |
| `/epis2/dashboard?tab=work` | Grid | **done** | `WorklistDraftGrid` seleccionable + bulk copy |
| `/epis2/dashboard?tab=service` | Grid | **done** | Censo/órdenes/críticos en grid; acciones en bulk |
| `/epis2/dashboard?tab=nursing` | Grid | **done** | MAR en grid; bulk registrar MAR |
| `/epis2/dashboard?tab=pharmacy` | Grid | **partial** | Validaciones/despacho/reconciliación grid; paneles secundarios en acordeón |
| `/epis2/dashboard?tab=emergency` | Grid | **done** | Triaje y observación en grid |
| `/epis2/dashboard?tab=patient` | Grid | partial | Hero + grids existentes |
| `/epis2/dashboard?tab=icu` | Grid | partial | Pendiente grid completo camas |
| `/epis2/dashboard?tab=quality` | Grid | partial | `QualityDashboardGrids` previo |
| `/epis2/dashboard?tab=specialty` | Grid | partial | Listas densas pendientes |
| Formularios clínicos | Form | **partial** | `collapseNonPrimarySections` en `EpisClinicalForm` |

---

## Cards reemplazadas por grids

- ResultsInbox: listas críticas y órdenes pendientes → `ResultsInboxCriticalGrid`, `ResultsInboxPendingOrdersGrid`
- Service: censo, órdenes activas, críticos, altas probables, pendientes equipo
- Nursing: MAR programado
- Pharmacy: validaciones, despacho, reconciliación, Y-site (en acordeón)
- Emergency: cola triaje y observación
- Dashboard work: borradores con selección múltiple

---

## Acciones duplicadas eliminadas

- Botones «Abrir paciente» repetidos por fila en censo servicio → click fila + bulk
- Botones MAR + paciente por fila en enfermería → grid + bulk «Registrar MAR»
- Listas con `secondaryAction` en resultados críticos → columna acción única + bulk acuse

---

## Bulk menus agregados

Componentes: `EpisRadSelectableGrid`, `DashboardHomogeneousGrid`, `EpisBulkActionMenu` (vía `@epis2/clinical-productivity`).

Acciones: marcar revisado, copiar selección, abrir borrador, preparar alta, acuse crítico (con confirmación).

Regla: menú visible **solo con selección activa**.

---

## Formularios — acordeones

- `EpisClinicalForm.collapseNonPrimarySections` — secciones >1 colapsadas por defecto
- `GeneratedClinicalFormPage` activa cuando `blueprint.sections.length > 2`
- `EpisRadFormSectionAccordion` en tab farmacia para paneles IDC secundarios

---

## Infraestructura nueva

| Archivo | Rol |
|---------|-----|
| `EpisRadSelectableGrid.tsx` | Grid + selección + bulk |
| `EpisRadDashboardTabShell.tsx` | Hero + grid por tab |
| `EpisRadFormSectionAccordion.tsx` | Secciones plegables dashboard |
| `useRadBulkSelection.ts` | Estado selección RAD |
| `EpisDataGridCore` | `checkboxSelection` + `selectedRowIds` |

---

## Gates

```bash
npm run quality:grid-surface-gate
npm run quality:form-collapse-gate
npm run quality:bulk-actions-gate
npm run quality:ui-simplify-gate
npm run quality:rad-m3-discipline-gate
npm run quality:design-mode-gate
```

---

## Riesgos pendientes

1. Tab farmacia — migración parcial; Tramo J requiere cola farmacia completa + gates clínicos.
2. ICU / specialty / quality — listas homogéneas aún parciales.
3. Grids con DataGrid lazy — tests deben mockear o usar `EpisRadSelectableGrid` en unit tests.
4. Transferencia de cama en servicio — bulk usa primera cama disponible (simplificado Fase A).

---

## Recomendación Tramo J

**Tramo J sigue bloqueado.**

Motivos: tab farmacia `migration: partial`; L3/L4 estabilización incompleta; adopción grid+bulk no cerrada en specialty/ICU/quality; gates clínicos de farmacia (`quality:tramo-j-pharmacy-gate`) no ejecutados en esta microfase.

Próximo paso: completar grid farmacia + `quality:clinical-productivity-gate` verde antes de reevaluar Tramo J.
