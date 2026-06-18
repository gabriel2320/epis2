# EPIS2 — Catálogo de producto (objetos clínicos)

**Versión:** 1.0 · **Programa:** PROG-PRODUCT-MAP · **Fecha:** 2026-06-18

> **SoT técnico:** `EPIS_CICA_SCREEN_REGISTRY.ts` · `@epis2/clinical-forms` · `@epis2/command-registry`  
> **SoT rutas (derivado):** [`EPIS2_ROUTE_MAP.md`](EPIS2_ROUTE_MAP.md) · `tools/catalog/route-map.generated.json`  
> **Este doc:** vista humana — filas curadas; no duplica registries en código.

## Reglas

```txt
KEEP_CANONICAL  — producto activo CICA /app/*
HIDE_STUB       — ruta viva, sin nav (ver ROUTE_MAP)
KEEP_FALLBACK   — legacy /espacio/*
DO_NOT_TOUCH    — borrador→aprobación, auditoría, SoT PostgreSQL
```

- **IA:** solo `draft-assist` en formularios; nunca aprueba ni firma.
- **API/DB:** no inventar aquí; enlazar solo vía blueprint/form registry verificado.
- Tras cambiar registry o forms core, actualizar este bloque en MF autorizada.

## Objetos core (v0.1)

<!-- EPIS2_PRODUCT_OBJECTS:BEGIN -->
| objectId | Intención clínica | Ruta CICA | screenId | formBlueprint | IA | humanoAprueba | status | gates |
|----------|-------------------|-----------|----------|---------------|-----|---------------|--------|-------|
| PATIENT_SEARCH | Encontrar paciente demo y abrir ficha | /app/buscar | patient-search | patient_search | none | no | KEEP_CANONICAL | quality:cica-screen-registry-gate |
| CENSUS | Elegir paciente desde lista clínica | /app/censo | census | — | none | no | KEEP_CANONICAL | quality:cica-screen-registry-gate |
| PATIENT_CHART | Comprender situación clínica del paciente | /app/pacientes/:patientId/resumen | patient-summary | patient_summary | draft-assist | sí (docs) | KEEP_CANONICAL | quality:clinical |
| EVOLUTION_NOTE | Registrar borrador de evolución médica | /app/pacientes/:patientId/evoluciones/nueva | new-evolution | evolution_note | draft-assist | sí | KEEP_CANONICAL | quality:clinical · golden journey |
| PRESCRIPTION | Preparar borrador de prescripción | /app/pacientes/:patientId/indicaciones/nueva | new-prescription | prescription | draft-assist | sí | KEEP_CANONICAL | quality:clinical |
| EPICRISIS | Redactar borrador de epicrisis de alta | /app/pacientes/:patientId/epicrisis/nueva | new-epicrisis | discharge_summary | draft-assist | sí | KEEP_CANONICAL | quality:clinical |
| MEDICAL_CERTIFICATE | Emitir borrador de certificado médico | /app/pacientes/:patientId/documentos/nuevo | new-document | medical_certificate | draft-assist | sí | KEEP_CANONICAL | quality:clinical |
| EXAMS | Revisar resultados y tendencias | /app/pacientes/:patientId/examenes | patient-exams | lab_request | none | sí (órdenes) | KEEP_CANONICAL | quality:clinical |
| PAPER_MODE | Leer/imprimir hoja clínica diaria | /app/pacientes/:patientId/papel/dia/:date | paper-day | — | none | sí (contenido clínico) | KEEP_CANONICAL | quality:clinical |
| AI_ASSIST | Sugerir texto en borradores | — | — | — | draft-assist | sí (siempre) | DO_NOT_TOUCH | quality:sh-03-degrade-gate · quality:ai |
| DRAFT_APPROVAL | Aprobar borrador → dato clínico | — | — | — | none | sí (obligatorio) | DO_NOT_TOUCH | PRODUCT_INVARIANTS · golden journey |
<!-- EPIS2_PRODUCT_OBJECTS:END -->

**Objetos:** 11 · **Form blueprints citados:** verificados en `packages/clinical-forms/src/registry.ts`

## Notas por objeto

| objectId | Notas |
|----------|-------|
| PATIENT_SEARCH | Entrada operativa CICA; legacy form route `/espacio/buscar-paciente` |
| PATIENT_CHART | Tabs adicionales vía `clinicalChartTabRegistry.ts` — ver ROUTE_MAP |
| EXAMS | Sección ficha; form `lab_request` para órdenes (legacy `/espacio/laboratorio`) |
| PAPER_MODE | Modo papel propio; libro en `paper-book` |
| AI_ASSIST | Capa `@epis2/ai-client`; degrade sin Ollama |
| DRAFT_APPROVAL | Invariante transversal; no es pantalla |

## Pendiente (fuera v0.1 catálogo)

- Columnas API/DB por objeto (solo tras verificación explícita).
- Gate `quality:product-map-gate` (MF-CATALOG-GATE-01).
- Stubs `HIDE_STUB`: recientes, mi-trabajo, agenda — no listar como producto.

## Referencias

| Doc | Uso |
|-----|-----|
| [`EPIS2_ROUTE_MAP.md`](EPIS2_ROUTE_MAP.md) | Rutas y visibilidad nav |
| [`PRODUCT_INVARIANTS.md`](PRODUCT_INVARIANTS.md) | IA · aprobación · SoT |
| [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) | Flujo demo obligatorio |
