# Reporte — Simetría y encuadre MD3 · Fase 2

**Fecha:** 2026-06-07  
**Alcance:** `columnSpan` en blueprints, grid 12 cols en `EpisClinicalForm`, validación de layout  
**Canon:** `docs/design/EPIS2_M3_SYMMETRY_AND_FRAMING.md`

---

## Fase 2 completada

| Entrega | Estado |
|---------|--------|
| `FormField.columnSpan` (1–12) | ✓ |
| `field()` con `FieldDefinition` | ✓ |
| `layout.ts` — resolve + validate | ✓ |
| `EpisClinicalForm` — `epis2M3FormGridSx` | ✓ |
| Grid responsivo (xs=12, sm+=span) | ✓ |
| 12 blueprints con spans proporcionales | ✓ |
| Registry valida layout | ✓ |

## Blueprints con columnSpan

`nursing_note`, `evolution_note`, `patient_search`, `allergy_entry`, `clinical_problem_entry`, `admission_note`, `transfer_note`, `discharge_summary`, `lab_request`, `imaging_request`, `prescription`, `medication_administration`, `pharmacy_validation`, `referral`

Textareas y formularios de prosa (`outpatient_visit`, `referral_report`, etc.) permanecen ancho completo (12 cols).

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 371 tests (147 archivos) |
| `npm run theme:validate` | OK |
| `npm run db:validate` | OK — 31 migraciones |

## Riesgos

- En viewport compacto todos los campos ocupan fila completa (comportamiento intencional).
- Nuevos blueprints deben declarar `columnSpan` en campos cortos o heredar ancho 12.

## Próximo paso

Pasada visual opcional: `npm run quality:m3-visual-pass` en formularios MAR, signos vitales y receta.
