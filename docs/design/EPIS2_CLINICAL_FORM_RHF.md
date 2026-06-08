# EPIS2 — Stack formularios RHF + Zod + MD3

## Alcance

Integración de **React Hook Form** y **Zod** encapsulados en las capas EPIS2, sin imports directos en `apps/web`.

## Capas

| Capa | Responsabilidad |
|------|-----------------|
| `@epis2/clinical-forms` | `buildBlueprintFormSchema`, `mapBlueprintZodErrors` — misma semántica que `validateFormValues` |
| `@epis2/epis2-ui` | `useEpisClinicalBlueprintForm`, `EpisClinicalFormRhf`, re-export `FormProvider` |
| `@epis2/clinical-productivity` | `ClinicalRichTextField` — campo enriquecido con RHF (stub editor) |
| `apps/web` | `GeneratedClinicalFormPage` — `FormProvider` + hook + `EpisClinicalFormRhf` |

## Uso en pantallas

```tsx
const form = useEpisClinicalBlueprintForm({ blueprint, seed });
const { watch, setValue, getValues, trigger } = form;

return (
  <FormProvider {...form}>
    <EpisClinicalFormRhf blueprint={blueprint} clinicalProse />
  </FormProvider>
);
```

Validación al guardar: `await trigger()` antes de persistir.

## Gate

```bash
npm run quality:clinical-form-rhf-gate
```

Prohíbe `react-hook-form` y `@hookform/resolvers` en `apps/web/src`.

## Próximo paso

Tiptap en `ClinicalRichTextEditor` vía `@epis2/clinical-productivity` (sin imports en web).
