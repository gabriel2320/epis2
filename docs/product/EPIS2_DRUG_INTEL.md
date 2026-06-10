# EPIS2 Drug-Intel — pipeline de fármacos Chile (MF-183)

> Staging, no SoT clínico. Ningún dato scrapeado llega a farmacia sin revisión
> y promoción humana auditada. La IA correlaciona y marca discrepancias; nunca
> aprueba (invariante 11). El pipeline funciona completo sin Ollama
> (invariante 15).

## Qué hace

`services/drug-intel` (`@epis2/drug-intel`) es un pipeline CLI que:

1. **Scrape** — obtiene fármacos disponibles en Chile desde fuentes públicas:
   - **ISP** (registro sanitario + alertas de seguridad de medicamentos).
   - **Precios referenciales públicos**: Tufarmacia.gob.cl (MINSAL) y dataset
     CENABAST.
   - **Precios referenciales retail** (`src/sources/retail.ts`): Salcobrand
     (Algolia público del sitio), Cruz Verde (API headless con sesión anónima)
     y Farmacias Ahumada (sugerencias del storefront SFCC). Se desactivan con
     `DRUG_INTEL_RETAIL=0`.
   - **Internacional** (APIs, no scraping): OpenFDA labels (warnings, RAM,
     dosificación) y RxNorm/RxNav (rxcui + clasificación ATC).
2. **Excluye** homeopáticos, suplementos, cosméticos y sustancias de uso no
   clínico (`src/exclusions.ts`; un ATC clínico válido pesa más que las
   heurísticas de nombre).
3. **Normaliza** todo a `drugIntelRecordSchema` (`@epis2/contracts`).
4. **Correlaciona** Chile ↔ internacional: chequeos determinísticos siempre +
   resumen Ollama opcional. Cualquier discrepancia ⇒ `requiresHumanReview`.
5. **Carga** a `drug_intel_staging` (PostgreSQL) de forma idempotente: si el
   contenido cambia (hash), el registro vuelve a `pending`.

## Comandos

```bash
npm run drug-intel:scrape -- --limit 25 [--query losartan]
npm run drug-intel:correlate        # usa OLLAMA_BASE_URL si está disponible
npm run drug-intel:load             # requiere DATABASE_URL (stack:dev)
npm run drug-intel:report
```

Cada etapa deja snapshot auditable en `data/drug-intel/` (gitignored) antes de
tocar PostgreSQL. Cache HTTP en `services/drug-intel/.cache/` (TTL 24 h,
rate-limit 1 req/s por host, User-Agent identificado).

### Variables de entorno

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Carga a staging (obligatoria solo para `load`) |
| `OLLAMA_BASE_URL` | Correlación IA opcional (default `http://127.0.0.1:11434`) |
| `DRUG_INTEL_OLLAMA_MODEL` | Modelo para resumen de discrepancias (default `qwen3:8b`) |
| `DRUG_INTEL_ISP_DATASET_URL` | Dataset CSV del registro sanitario (preferido sobre HTML). Validado: `https://datos.gob.cl/uploads/recursos/Productos_farmaceuticos_vigentes_venta_directa.csv` (venta directa, sin principio activo; para el universo con receta usar export Excel del buscador ANAMED) |
| `DRUG_INTEL_CENABAST_DATASET_URL` | Dataset CSV de precios CENABAST |
| `DRUG_INTEL_RETAIL` | `0` desactiva los precios de cadenas retail (Salcobrand/Cruz Verde/Ahumada); activado por defecto |

## Revisión humana y promoción (API admin)

| Endpoint | Permiso | Función |
|---|---|---|
| `GET /api/admin/drug-intel?status=pending` | `audit.read` | Listar staging con registro completo y discrepancias |
| `POST /api/admin/drug-intel/:id/review` | `admin.catalogs.write` | Aprobar/rechazar (auditado: `admin.drug_intel.reviewed`) |
| `POST /api/admin/drug-intel/promote` | `admin.catalogs.write` | Aprobados → `clinical_catalog_staging` con `catalog_code='medication'` (auditado, idempotente) |

## Modelo de datos

- Migración: `database/migrations/034_drug_intel_staging.sql`.
- Drizzle: `drugIntelStaging` en `apps/api/src/db/schema.ts`.
- Payload completo (JSONB) = `drugIntelRecordSchema`: nombre, principio
  activo, ATC, registro ISP, condición de venta, formas farmacéuticas, dosis
  recomendadas, precios referenciales (`referential: true`, fuente, fecha),
  warnings, alertas ISP, reacciones adversas, fuentes (URLs) y correlación.

## Consumo por farmacia ambulatoria y hospitalizado

La promoción deja los fármacos aprobados en el catálogo staging existente
(MF-172), consultable vía `GET /api/admin/catalogs?catalogCode=medication`.
Mapeo previsto:

| Destino | Campo origen |
|---|---|
| `patient_medications.name` | `productName` |
| Blueprint `prescription` — slot `medicationHint` | `productName` / `activeIngredient` |
| `mar_scheduled_doses.medication` (hospitalizado) | `productName` |
| Validación farmacéutica (`pharmacy_validation`) | `warnings`, `ispAlerts`, `adverseReactions` como contexto |

Fuera de alcance MF-183: dispensación real e inventario (NON_GOALS v1).

## Autocomplete de medicamentos (MF-184)

El catálogo promovido alimenta el campo `medication` del blueprint
`prescription` con autocomplete:

- **Endpoint clínico**: `GET /api/clinical/catalogs/medication?q=&limit=`
  (permiso `patient.read`, todos los roles clínicos). Devuelve solo
  `entryCode`/`label` de entradas `active`; el payload drug-intel completo
  queda en la capa admin. Contrato: `medicationCatalogSearchResponseSchema`
  en `@epis2/contracts`.
- **Metadata declarativa**: `FormField.catalogAutocomplete: 'medication'`
  (`packages/clinical-forms`), declarada en el blueprint canónico — sin
  segundo registry. Reutilizable en `medication-administration` y
  `pharmacy-validation` añadiendo la misma prop.
- **Render**: `EpisClinicalFormRhf` expone `renderCatalogField` (paralelo a
  `renderClinicalTextBox`); `GeneratedClinicalFormPage` lo cablea a
  `MedicationCatalogAutocomplete` (`apps/web/src/clinical/`).
- **Comportamiento**: `freeSolo` — el catálogo sugiere, no restringe; el valor
  guardado sigue siendo texto y el borrador mantiene aprobación humana aguas
  abajo. Si la API falla, degrada a texto libre sin romper el formulario.

## Riesgos conocidos

- El buscador del registro sanitario ISP es ASP.NET WebForms y frágil al
  scraping; la vía preferida es el dataset CSV (`DRUG_INTEL_ISP_DATASET_URL`).
  Los parsers son puros y se testean con fixtures.
- Los precios son **referenciales** con fuente y fecha, nunca transaccionales.
  Los de cadenas retail (Salcobrand/Cruz Verde/Ahumada) provienen de los
  endpoints internos que consumen los propios sitios: **sin contrato público,
  pueden cambiar o bloquearse sin aviso**. Cada adaptador degrada a failure
  sin romper el pipeline (validado en vivo 2026-06-10: las tres cadenas
  respondieron; Salcobrand exige header `Origin/Referer` del sitio, Cruz Verde
  cookie de sesión anónima). El matcher `priceMatchesProduct` descarta hits
  de otros fármacos devueltos por los buscadores retail.
- La correlación IA depende de la calidad del match `activeIngredient` →
  OpenFDA/RxNorm (nombres en español vs inglés); por eso toda discrepancia o
  ausencia de match fuerza revisión humana.
