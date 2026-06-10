# EPIS2 — MF-183: Drug-Intel staging pipeline (cierre de sesión)

Fecha: 2026-06-10 · Alcance declarado: microfase nueva **MF-183** (ledger MF-151–182 cerrado) · Plan: `drug-intel_scraper_epis2`

## Alcance

Pipeline CLI de inteligencia de fármacos disponibles en Chile (dosis, formas
farmacéuticas, precios referenciales, warnings, alertas y reacciones adversas),
con exclusión de homeopáticos/suplementos/cosméticos/no clínicos, correlación
IA + internacional, staging PostgreSQL y revisión/promoción humana auditada
hacia el catálogo consumible por farmacia ambulatoria y hospitalizado.

### Archivos tocados (dentro del alcance declarado)

| Área | Archivos |
|---|---|
| Workspace nuevo | `services/drug-intel/**` (`@epis2/drug-intel`: http+cache, fuentes ISP/Tufarmacia/CENABAST/OpenFDA/RxNorm, exclusiones, normalización, correlación, loader, CLI, 35 tests unit) |
| Contratos | `packages/contracts/src/drugIntel.ts` (+ export en `index.ts`) |
| BD | `database/migrations/034_drug_intel_staging.sql`, `drugIntelStaging` en `apps/api/src/db/schema.ts` |
| API admin | `apps/api/src/admin/routes.ts`: `GET /api/admin/drug-intel`, `POST .../:id/review`, `POST .../promote` (+ test integración `drugIntel.integration.test.ts`) |
| Raíz | `package.json` (scripts `drug-intel:*`, cadenas build/typecheck), `.gitignore` |
| Docs | `docs/product/EPIS2_DRUG_INTEL.md` |

## Decisiones

1. **Pipeline CLI + staging** (opción elegida por el usuario), no microservicio
   con UI propia: scrape → exclude → normalize → correlate → snapshot
   (`data/drug-intel/`, gitignored) → load idempotente a `drug_intel_staging`.
2. **Precios solo de fuentes públicas estructuradas** (Tufarmacia/MINSAL,
   CENABAST); sin scraping de farmacias retail. Todo precio es
   `referential: true` con fuente y fecha.
3. **IA acotada a correlación**: chequeos determinísticos siempre; Ollama
   (qwen3:8b) opcional solo agrega resumen/discrepancias, nunca las quita ni
   aprueba. Cualquier discrepancia ⇒ `requiresHumanReview`. Sin Ollama el
   pipeline corre completo (invariante 15).
4. **Promoción reutiliza MF-172**: aprobados → `clinical_catalog_staging`
   con `catalog_code='medication'` (permisos existentes `audit.read` /
   `admin.catalogs.write`; eventos `admin.drug_intel.reviewed|promoted`).
5. **Hash de contenido** (sin timestamps): recarga con contenido nuevo
   devuelve el registro a `pending` y limpia la revisión anterior.

## Gates ejecutados

| Gate | Resultado |
|---|---|
| `npm run lint` | OK |
| `npm run typecheck` (incluye `@epis2/drug-intel`) | OK |
| `npm run architecture:validate` | OK (todos los validadores) |
| `npm run test` | OK — 723 passed; 2 fallos preexistentes de MAR por ventanas demo stale (ver riesgos), re-verificados en verde tras refresh |
| `npm run db:validate` | OK — 34 migraciones |
| Smoke E2E pipeline | correlate (con Ollama qwen3:8b) → load (1 nuevo) → load repetido (1 sin cambios) → report; registro smoke eliminado |
| Tests integración drug-intel | 2/2 OK contra Postgres real (revisión 403/400/200 + promoción idempotente) |

## Riesgos

- **Fragilidad ISP**: el buscador del registro sanitario es ASP.NET WebForms;
  parsers puros con fixtures + vía preferida dataset CSV
  (`DRUG_INTEL_ISP_DATASET_URL`). Sin dataset configurado, la cobertura del
  scrape HTML puede ser parcial.
- **Match internacional**: `activeIngredient` en español vs OpenFDA/RxNorm en
  inglés puede no matchear; el caso queda marcado como discrepancia warning y
  exige revisión humana (no bloquea el pipeline).
- **Preexistente (no drug-intel)**: `dashboard.test.ts` y
  `v3-mar.integration.test.ts` dependen de ventanas MAR demo refrescadas por
  la migración 030 relativa a NOW(); con BD migrada hace días fallan. Se
  re-aplicó el refresh (mismas sentencias de 030) y quedaron verdes. Sugerencia
  futura: mover ese refresh a un setup de tests idempotente.

## Validación con datos reales (2026-06-10, segunda pasada)

Dataset público real configurado:
`DRUG_INTEL_ISP_DATASET_URL=https://datos.gob.cl/uploads/recursos/Productos_farmaceuticos_vigentes_venta_directa.csv`
(nómina ISP de productos farmacéuticos vigentes de venta directa, 2.428 filas).

- **Scrape**: 2.428 productos parseados (fix de encoding Windows-1252 →
  `decodeBody` en `http.ts` + test); **74 excluidos** correctamente en data
  real (multivitamínicos → supplement; shampoos/jabones → cosmetic;
  repelentes → non_clinical).
- **Correlate**: 10 registros con Ollama qwen3:8b en vivo; todos `discrepant`
  + `requiresHumanReview` (el dataset de venta directa no trae principio
  activo → sin correlación internacional posible, comportamiento esperado).
- **Load**: 10 nuevos en `drug_intel_staging`, quedan `pending` para revisión
  humana vía `GET /api/admin/drug-intel`.
- **Fallos tolerados y registrados**: `ISP alertas: fetch failed` y
  `Tufarmacia: fetch failed` (sin API pública); el pipeline degrada sin
  romper.

Limitaciones observadas con data real:

- El dataset de venta directa **no incluye principio activo ni forma
  farmacéutica** → para cobertura completa se necesita el export Excel del
  buscador ANAMED (con condición de venta "receta") o un dataset más rico.
- Jabones antisépticos clínicos (clorhexidina) caen en exclusión `cosmetic`
  por la heurística `jabón`; aceptable para v1 (no son fármacos de
  prescripción), revisar si farmacia los necesita en catálogo.

## Próximo paso exacto

1. Obtener export del buscador ANAMED con principio activo y condición de
   venta "receta médica" (o dataset equivalente) y repetir
   `scrape → correlate → load` para el universo con prescripción.
2. Revisar/promover los registros `pending` desde la API admin.
3. Microfase siguiente (fuera de MF-183): autocomplete de medicamentos en
   blueprints `prescription` / MAR consumiendo
   `GET /api/admin/catalogs?catalogCode=medication` (mapeo documentado en
   `docs/product/EPIS2_DRUG_INTEL.md`).

## Addendum 2026-06-10 — precios de cadenas retail

A pedido del usuario se añadieron las principales cadenas de venta a público
como fuentes de precio referencial (`src/sources/retail.ts`):

| Cadena | Mecanismo | Validado en vivo |
|---|---|---|
| Salcobrand | Algolia público del sitio (índice `sb_variant_production`; clave search-only restringida por Referer) | ✓ 5 precios `paracetamol` |
| Cruz Verde | API headless SFCC `api.cruzverde.cl` (login anónimo → cookie, búsqueda JSON) | ✓ `price-list-cl` / `price-sale-cl` |
| Farmacias Ahumada | Sugerencias del storefront SFCC (fragmento HTML, precio en `content=`) | ✓ 3 precios |

- Parsers puros con fixtures reales (8 tests, `retail.test.ts`); cada cadena
  degrada a failure sin romper el pipeline.
- `DRUG_INTEL_RETAIL=0` desactiva el grupo completo.
- Corrida E2E verificada: `PARACETAMOL SUPOSITORIOS 125 mg` quedó con precios
  de Cruz Verde ($2.029) y Ahumada ($1.326); el matcher por nombre descartó
  hits de otros fármacos.
- Riesgo documentado: endpoints internos sin contrato público, pueden cambiar
  o bloquearse sin aviso (`docs/product/EPIS2_DRUG_INTEL.md`).
