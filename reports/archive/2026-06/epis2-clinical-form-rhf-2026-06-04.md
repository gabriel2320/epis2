# Sesión — Stack formularios RHF + Zod + MD3

**Fecha:** 2026-06-04  
**Fase:** B — productividad clínica / capa formularios  
**Alcance:** `@epis2/clinical-forms`, `@epis2/epis2-ui`, `@epis2/clinical-productivity`, `GeneratedClinicalFormPage`, gates QA

## Entregables

- Esquema Zod derivado de blueprints (`buildBlueprintFormSchema`)
- Hook `useEpisClinicalBlueprintForm` con `zodResolver`
- Componente `EpisClinicalFormRhf` (Controller + `EpisClinicalField` + acordeones MD3)
- Migración de `GeneratedClinicalFormPage` a RHF (`FormProvider`, `trigger()` en guardado)
- Re-export `FormProvider` desde `@epis2/epis2-ui`
- Gate `quality:clinical-form-rhf-gate` integrado en `layers-integration-gate`
- Tests: `EpisClinicalFormRhf.test.tsx`, `blueprintFormSchema.test.ts` (existente)
- Doc: `docs/design/EPIS2_CLINICAL_FORM_RHF.md`

## Gates

| Gate | Estado |
|------|--------|
| `npm run check` | OK |
| Tests formularios (13) | OK |
| `quality:clinical-form-rhf-gate` | OK |
| `quality:layers-integration-gate` | OK |
| `npm run db:validate` | OK |

## Riesgos

- `watch()` en página re-renderiza en cada keystroke (equivalente al `useState` anterior)
- Tiptap / rich text sigue stub; `ClinicalRichTextField` listo para wiring futuro
- Tests integración API siguen requiriendo Postgres `:5433`

## Próximo paso

1. Commit cuando el usuario lo solicite  
2. Fase B-04: blueprint procedimiento, cierre encuentro UI, `dashboard-pharmacy` → `done`  
3. Tiptap en `ClinicalRichTextEditor` vía capa L5
