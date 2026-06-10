# EPIS2 — Cierre sesión 2026-06-10

## Gates

- [x] check (lint+types+arch) (ok)
- [x] test (ok — 252 archivos / 745 tests)
- [x] db:validate (ok — 34 migraciones)

## Alcance

- **MF-183 (drug-intel)**: pipeline CLI `services/drug-intel` (scrape ISP +
  precios públicos + OpenFDA/RxNorm → exclusiones → correlación IA →
  `drug_intel_staging`), API admin de revisión/promoción a catálogo
  `medication`, migración 034. Addendum: precios referenciales de cadenas
  retail (Salcobrand/Cruz Verde/Ahumada) en `src/sources/retail.ts`.
- **MF-184 (autocomplete)**: `GET /api/clinical/catalogs/medication`
  (`patient.read`), metadata `catalogAutocomplete` en `packages/clinical-forms`,
  hook `renderCatalogField` en `EpisClinicalFormRhf`,
  `MedicationCatalogAutocomplete` cableado en `GeneratedClinicalFormPage`.

Detalle: `reports/epis2-mf-183-drug-intel.md` ·
`reports/epis2-mf-184-medication-autocomplete.md`.

## Decisiones

- Catálogo sugiere, no restringe (freeSolo); el valor guardado sigue siendo
  string y la receta mantiene aprobación humana aguas abajo.
- Roles clínicos solo ven `entryCode`/`label`; el payload drug-intel completo
  (precios, correlación IA) queda en la capa admin.
- Precios retail vía los backends que consumen los propios sitios, marcados
  `referential: true` con cadena y fecha; `DRUG_INTEL_RETAIL=0` los desactiva.

## Riesgos

- Endpoints retail sin contrato público: pueden cambiar o bloquearse sin
  aviso (cada adaptador degrada a failure sin romper el pipeline).
- Autocomplete depende de entradas promovidas; con catálogo vacío se comporta
  como campo de texto normal.

## Próximo paso exacto

- Extender `catalogAutocomplete: 'medication'` a `medication-administration`
  y `pharmacy-validation` (una línea por blueprint + test).
- Export ANAMED (universo receta) y repetir `scrape → correlate → load`.
- Revisar/promover registros `pending` vía `GET /api/admin/drug-intel`.
