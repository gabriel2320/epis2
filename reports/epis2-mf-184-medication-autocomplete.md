# EPIS2 — MF-184: Autocomplete de medicamentos (catálogo drug-intel)

**Fecha:** 2026-06-10 · **Alcance:** microfase MF-184 (continuación MF-183)

## Objetivo

Cerrar el loop de producto del pipeline drug-intel: el catálogo `medication`
promovido a `clinical_catalog_staging` ahora alimenta un autocomplete en el
campo `medication` del blueprint `prescription`.

## Cambios

| Capa | Archivo | Cambio |
|---|---|---|
| Contratos | `packages/contracts/src/catalogs.ts` (nuevo) | `medicationCatalogSearchResponseSchema` (`entryCode`/`label`, `readOnly: true`) |
| API | `apps/api/src/clinical/routes.ts` | `GET /api/clinical/catalogs/medication?q=&limit=` — permiso `patient.read`, solo entradas `active`, limit acotado 1–50 |
| Forms | `packages/clinical-forms` (`types`, `factory`, `blueprints/prescription`) | Nueva metadata `catalogAutocomplete: 'medication'` en `FormField`; declarada en el campo `medication` de receta |
| UI | `packages/epis2-ui/src/forms/EpisClinicalFormRhf.tsx` | Hook opcional `renderCatalogField` (campos `text` con `catalogAutocomplete`), paralelo a `renderClinicalTextBox` |
| Web | `apps/web/src/clinical/MedicationCatalogAutocomplete.tsx` (nuevo) | `EpisAutocomplete` freeSolo + debounce 250 ms + `searchMedicationCatalog`; degrada a texto libre si la API falla |
| Web | `apps/web/src/api/clinicalApi.ts`, `GeneratedClinicalFormPage.tsx` | Fetch tipado y wiring de `renderCatalogField` en los 4 puntos de render |

## Decisiones

- **Sin segundo registry**: la metadata vive en el blueprint canónico
  (`packages/clinical-forms`); `apps/web` solo provee el render. Reutilizable
  en `medication-administration` / `pharmacy-validation` con una línea.
- **`freeSolo`**: el catálogo sugiere, no restringe. El valor guardado sigue
  siendo string (Zod/RHF sin cambios) y la receta mantiene revisión humana
  aguas abajo — el autocomplete no aprueba nada.
- **Permiso `patient.read`** (no `audit.read`): médicos, enfermería y farmacia
  pueden consultar; solo se exponen `entryCode`/`label`, nunca el payload
  drug-intel completo (precios, correlación IA) que queda en la capa admin.

## Gates

| Gate | Resultado |
|---|---|
| `npm run check` (lint + typecheck + architecture:validate) | OK — single-form-registry y demás gates en verde |
| Tests afectados (`apps/web/src/pages`, `clinical-forms`, `epis2-ui`) | 81 archivos / 184 tests OK |
| `medicationCatalog.integration.test.ts` (nuevo) | OK — médico/enfermería 200, anónimo 401, inactivos excluidos, limit acotado |
| `MedicationCatalogAutocomplete.test.tsx` (nuevo) | OK — sugerencia seleccionable + degradación sin API |
| `npm run test` (suite completa) | OK — 250 archivos / 735 tests |
| `npm run db:validate` | OK — 34 migraciones |

## Riesgos

- El autocomplete depende de que existan entradas promovidas; con catálogo
  vacío se comporta como campo de texto normal (sin regresión).
- MUI Autocomplete controlado vía `inputValue`: el valor RHF es la fuente de
  verdad; verificado con tests de interacción.

## Próximo paso exacto

1. Añadir `catalogAutocomplete: 'medication'` a `medication-administration`
   y `pharmacy-validation` (una línea por blueprint + test).
2. Corrida ANAMED con universo receta (`DRUG_INTEL_ISP_DATASET_URL` o export
   manual) para poblar el catálogo más allá de la muestra de venta directa.
