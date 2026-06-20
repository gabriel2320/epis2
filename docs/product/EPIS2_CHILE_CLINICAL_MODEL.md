# EPIS2 — Modelo clínico Chile (conciliación)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** ADR operativo · **Programa:** post-PROG-DUAL-CHART / PROG-PAPER-MODE  
**Origen:** conciliación prompt estructural Chile ↔ implementación EPIS2-native

> **Principio:** RUN/RUT como identificador nacional **buscable**, UUID como **única clave de join**. Formulario → borrador → aprobación humana → PostgreSQL. **No** segundo registry ni rutas `/pacientes/:rut/*`.

**Canon:** [`PRODUCT_INVARIANTS.md`](./PRODUCT_INVARIANTS.md) · [`EPIS2_FORM_SCREEN_TREE.md`](./EPIS2_FORM_SCREEN_TREE.md) · [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](../architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md) · [`ARCHITECTURE_TARGET.md`](../ARCHITECTURE_TARGET.md)

---

## 1. Principio arquitectónico central (Chile)

En Chile el identificador clínico principal de personas es el **RUN/RUT normalizado** (módulo 11), pero en PostgreSQL **no** es primary key física.

```text
patients.id              UUID  ← única PK de join clínico
patient_identifiers      system + value + tipo MINSAL
  └─ RUN / RUN provisorio / RUN madre RN / pasaporte / folio parto / otro
```

Referencias normativas (diseño, no implementación legal en este doc):

- [Tipos de identificador paciente — IG MINSAL](https://interoperabilidad.minsal.cl/fhir/ig/nid/0.4.1/ValueSet-VSTiposIdentificadorPaciente.html)
- [Norma técnica EIS — DEIS](https://deis.minsal.cl/norma-tecnica-de-estandares-de-informacion-en-salud-eis/)
- [SNRE — HL7 FHIR R4](https://interoperabilidad.minsal.cl/fhir/ig/snre/)

EPIS2 ya implementa validación RUT en `packages/clinical-domain/src/chile/rut.ts` y búsqueda en API vía `CHILE_RUT_IDENTIFIER_SYSTEM`.

**Datos sensibles:** trazabilidad (`audit_events`), RBAC, RLS piloto, pipeline borrador≠SoT — obligatorio desde demo; reforzar antes de PHI real.

---

## 2. Estado actual vs modelo objetivo

### 2.1 Identidad (conciliado)

| Concepto prompt | EPIS2 hoy | Acción |
|-----------------|-----------|--------|
| `person` + `patient` | Solo `patients` | Diferir split `person`; enriquecer `patients` + identifiers |
| `rut_normalizado` UNIQUE | `patient_identifiers.value` formateado | MF-CHILE-ID-01: columnas derivadas + índice parcial |
| Tipos MINSAL | Un system URI demo | MF-CHILE-ID-01: `identifier_type` enum |
| RUT en URL | `patientId` UUID en rutas | **Mantener** — RUT solo en comando/búsqueda |

### 2.2 Clínica longitudinal (parcial)

| Tabla prompt | EPIS2 | Estado |
|--------------|-------|--------|
| `encounter` | `encounters` | ✓ |
| `episode_of_care` | — | MF-EPISODE-01 (capa sobre encounters) |
| `admission` / `transfer` / `discharge` | `inpatient_admissions` + drafts (`admission_note`, `transfer_note`, `discharge_summary`) | ◐ |
| `condition` | `problems` | ✓ |
| `allergy_intolerance` | `patient_allergies` | ✓ |
| `observation` | `observations` | ✓ |
| `clinical_note` | `clinical_notes` + `clinical_drafts` | ✓ (pipeline draft) |
| `medication_request` | drafts + `patient_medications` | ◐ |
| `prescription` / SNRE | draft `prescription` + print | MF-CHILE-RX-01 (FHIR frontera) |
| `service_request` / lab / imagen | `clinical_orders` v2 + blueprints | ◐ |
| `coverage` / previsión | — | **MF-CHILE-ADM-01** prioridad Chile |
| `professional` + RNPI | `app_users` demo | MF-CHILE-PRO-01 |
| `document` | `clinical_documents` | ✓ |

### 2.3 Formularios y variables (conciliación crítica)

| Enfoque prompt | Enfoque EPIS2 (mantener) |
|----------------|--------------------------|
| `clinical_variable_registry` tabla SQL | **Metadata en `FormField`** del Clinical Form Registry único |
| 80+ formularios pantalla a pantalla | **19 blueprints** + extensión por olas IDC + ficha papel I–XIV |
| Escritura directa a tablas clínicas | `clinical_drafts` → `approvals` → `clinical_notes` / SoT |
| `/pacientes/:rut/*` | `/comando` + `/espacio/*?patientId=` |

**Regla de oro EPIS2:**

```text
Intent → blueprint.fieldId → Zod → draft.body JSONB → approve → tabla SoT / nota
```

No: `Formulario → tabla` sin borrador.

---

## 3. Decisiones (ADR)

### D1 — UUID PK; RUT identificador, no clave física

**Adoptado.** Coincide con `patients.id` y `patient_identifiers`.

### D2 — No segundo Command / Form Registry

**Adoptado.** Invariantes #9–#10. Extender metadata de campos; prohibido `clinical_variable_registry` paralelo.

### D3 — Rutas canónicas sin RUT en path

**Adoptado.** Búsqueda por RUT en comando/API; deep links con `patientId` UUID (privacidad, RUN provisorio, cambios de identificador).

### D4 — Subformularios SOAP/anamnesis como JSONB + Zod, no tablas por sección

**Adoptado.** Alineado con `clinical_drafts.body` y `paper-chart` schema.

### D5 — Modo papel sin `pdf_template` SQL en v1

**Adoptado.** `paperChartSectionTree` + `paper-visual-reference` + print CSS/React — ver [`EPIS2_PAPER_MODE_DEV_PLAN.md`](./EPIS2_PAPER_MODE_DEV_PLAN.md).

### D6 — FHIR / SNRE en frontera

**Adoptado.** `packages/fhir-export`; receta electrónica MF posterior, no UI acoplada a OpenMRS/O3.

### D7 — `patient_clinical_summary` read model

**Adoptado.** Vista SQL o tabla denormalizada refrescada en approve — alimenta censo, resumen MD3, carátula papel.

---

## 4. Patrones rechazados (del prompt externo)

| Patrón | Motivo |
|--------|--------|
| Crear 40+ tablas clínicas en una migración | Rompe olas EPIS2; demo→MVP incremental |
| `person` obligatorio día 1 | Complejidad sin formulario registro completo aún |
| Dashboard como home | Invariante #6–#7 — Centro de Comando |
| Tablas `soap_note`, `anamnesis`, `physical_exam` separadas | Duplica JSONB ya validado por blueprint |
| `ai_suggestion` escribe SoT | Invariante #11 — solo borrador / `ai_runs` |
| Copiar árbol de rutas hospitalario 200 ítems | Ya conciliado en `epis2NavigationTree.ts` |

---

## 5. Extensión metadata canónica (MF-REGISTRY-META)

Sin nueva tabla. Extender `FormField` en `packages/clinical-forms/src/types.ts`:

```ts
/** Clave canónica Chile/interop — estable entre EMR, papel, FHIR, print. */
variableKey?: string; // ej. patient.rut_normalizado, vital.fc, rx.dosis

/** FHIR R4 path lógico (export frontera). */
fhirPath?: string;

/** Nivel auditoría: bajo | clínico | crítico | legal */
auditLevel?: 'low' | 'clinical' | 'critical' | 'legal';

/** IA puede leer/proponer en borrador. */
aiAllowed?: boolean;

/** Mapeo impresión papel / Carta-A5. */
printMapping?: {
  chartMode?: 'traditional' | 'paper';
  sectionId?: string; // PaperChartSectionId
  slot?: string;
};

/** Incluir en búsqueda global / comando. */
searchable?: boolean;
```

Export JSON existente (`blueprint-io.ts`) incluye metadata para gates y documentación.

**Gate:** `quality:registry-meta-gate` ✓ — blueprints Chile clave con `variableKey` en campos obligatorios.

---

## 6. Modelo de datos — migraciones por microfase

### MF-CHILE-ID-01 — Identificadores MINSAL + RUT robusto ✓

**Archivos:** `database/migrations/035_chile_patient_identifiers.sql`, `packages/clinical-domain/src/chile/*`, `apps/api/src/clinical/service.ts`, `apps/api/src/db/schema.ts`

| Cambio | Detalle |
|--------|---------|
| `patient_identifiers.identifier_type` | Enum subset MINSAL (`RUN`, `RUN_PROVISIONAL`, …) |
| `rut_numero`, `rut_dv`, `value_normalized` | Backfill RUT demo + índices parciales UNIQUE |
| API | `searchPatients` por `value`, `value_normalized` o par número+DV |
| Dominio | `parseRutParts`, `CHILE_PATIENT_IDENTIFIER_TYPES` |

**No hacer:** PK en RUT; exponer RUT en rutas web.

**Siguiente:** ~~MF-CHILE-ADM-01~~ ✓

### MF-CHILE-ADM-01 — Previsión y demographics mínimos ✓

**Archivos:** `database/migrations/036_chile_patient_coverage.sql`, `apps/api/src/db/schema.ts` (`patientCoverage`)

**Tabla nueva:** `patient_coverage`

```text
coverage_id, patient_id, tipo_prevision, fonasa_tramo, isapre, plan,
vigente_desde, vigente_hasta, created_by
```

Blueprints: extender `patient_summary` / futuro `patient_registration` (IDC).

### MF-SUMMARY-VIEW-01 — Read model resumen ✓

**Archivos:** `database/migrations/037_chile_patient_clinical_summary.sql`, `apps/api/src/clinical/patientClinicalSummary.ts`, `GET /api/patients/:id/clinical-summary`, `packages/contracts/src/clinicalSummary.ts`

**Vista SQL:** `patient_clinical_summary`

Campos mínimos:

```text
patient_id, display_name, edad, sexo, prevision_resumen,
alergias_criticas, problemas_activos, medicamentos_activos,
ultimo_encuentro_at, hospitalizado, alertas_json, updated_at
```

Consumidores: `PatientClinicalSummaryGrid`, censo, carátula papel, comando contexto.

### MF-EPISODE-01 — Episodio de cuidado ✓

**Archivos:** `database/migrations/038_chile_episodes_of_care.sql`, `episodesOfCare` + `encounters.episodeId` en schema Drizzle

**Tabla:** `episodes_of_care` — `encounter.episode_id` FK opcional.

No reemplaza `encounters`; agrupa hospitalización / programa crónico.

### MF-CHILE-RX-01 — Receta SNRE ✓

**Archivos:** `prescription` blueprint con `variableKey` + `toFhirMedicationRequest` en `packages/fhir-export`. Sin auto-firma.

### MF-CHILE-PRO-01 — Profesional RNPI ✓

**Archivos:** `database/migrations/039_chile_professionals.sql`, tabla `professionals` en schema Drizzle. Catálogo consulta externa futura.

### MF-REGISTRY-META ✓ · PROG-PAPER-MIRROR ✓

**Archivos:** `packages/clinical-forms/src/types.ts`, blueprints `patient_summary` / `prescription`, `paper-mirror/variable-keys.ts`, gate `quality:registry-meta-gate`.

### Auditoría extendida ✓

**Archivo:** `database/migrations/040_chile_audit_extend.sql`, columnas en `audit_events` + `apps/api/src/audit/store.ts`.

---

## 7. Mapa funcional conciliado (rutas)

```text
/login
/app/buscar                           ← HOME CICA (invariante)
/comando                              ← redirect compat
/espacio/buscar-paciente              ← fallback legacy búsqueda RUT / nombre
/espacio/ficha?patientId=&chartMode=  ← dual traditional | paper
/espacio/resumen
/espacio/evolucion
/espacio/ingreso · /espacio/traslado · /espacio/epicrisis
/espacio/receta · /espacio/laboratorio · /espacio/imagenologia
/espacio/resultados
/espacio/ficha/papel/imprimir
/espacio/borrador/:draftId
/espacio/admin                        ← catálogos, usuarios (parcial)
```

**Alias humano:** comando `paciente 12.345.678-5` → API resuelve UUID → navega a `/espacio/ficha?patientId=`.

Documentación viva: [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](../architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md).

---

## 8. Modo papel y variables compartidas

PROG-PAPER-MODE ya implementa el espíritu del prompt §9 (form_definition + print) en código:

| Prompt | EPIS2 |
|--------|-------|
| `form_definition` | `paper-chart` blueprint + Zod schema |
| `form_section` | `PAPER_CHART_SECTION_IDS` / `paperChartSectionTree` |
| `print_layout` | `paper-visual-reference.ts` + `paperChartPrint.css` |
| `pdf_field_map` | `printMapping` en FormField + sección papel |

**Programa hermano:** PROG-PAPER-MIRROR — misma `variableKey` en traditional y paper.

---

## 9. Auditoría e IA (transversal)

| Requisito Chile | EPIS2 |
|-----------------|-------|
| Lectura/escritura sensible auditada | Extender `audit_events`: `patient_id`, `action`, `table_name`, `record_id`, `ip`, `reason` |
| IA no firma / no valida legalmente | `ai_runs`, `paperAiState`, invariante #11 |
| Sugerencias pendientes | `pending` / `accepted` / `rejected` en body borrador |

---

## 10. Orden de implementación (SDEPIS2)

```text
Ola CHILE-0 (identidad)
  MF-CHILE-ID-01     identifiers MINSAL + índices RUT

Ola CHILE-1 (administrativo Chile)
  MF-CHILE-ADM-01    previsión / coverage
  MF-SUMMARY-VIEW-01 read model resumen

Ola CHILE-2 (registry)
  MF-REGISTRY-META   metadata FormField + gate

Ola CHILE-3 (longitudinal)
  MF-EPISODE-01      episode_of_care
  MF-CHILE-PRO-01    professionals / RNPI stub

Ola CHILE-4 (interop)
  MF-CHILE-RX-01     SNRE / FHIR MedicationRequest
  PROG-PAPER-MIRROR  classic ↔ paper misma variableKey
```

**No bloquear** Hilo C / PROG-PAPER-MODE en curso; CHILE-0 puede ejecutarse en paralelo si no toca dual-chart shell.

---

## 11. Gates y verificación

| Gate | Cuándo |
|------|--------|
| `npm run check` | Siempre |
| `npm run db:validate` | Tras migración |
| `npm run architecture:validate` | Sin segundo registry |
| `quality:registry-meta-gate` | Tras MF-REGISTRY-META (nuevo) |
| `quality:paper-mode-*` | PROG-PAPER-MODE |
| `npm run quality:golden-journey` | Tras MF-SUMMARY-VIEW si afecta resumen |

---

## 12. Prompt Cursor (EPIS2-native)

Usar este bloque en lugar del prompt genérico de 40 tablas:

```text
Arquitecto EPIS2 — modelo clínico Chile.

Lee: docs/product/EPIS2_CHILE_CLINICAL_MODEL.md, PRODUCT_INVARIANTS.md,
EPIS2_FORM_SCREEN_TREE.md, EPIS2_RECONCILED_NAVIGATION_TREE.md.

Alcance: declarar MF-CHILE-* + archivos permitidos.

Reglas:
- UUID patientId; RUT en patient_identifiers, no PK ni path URL.
- Un Command Registry + un Clinical Form Registry; extender FormField metadata.
- clinical_drafts → approve → SoT; IA solo borrador.
- Rutas /comando y /espacio/*; no /pacientes/:rut/*.
- Migraciones incrementales; sin OpenMRS/Carbon/import EPIS sin manifest.

Entrega: migración + Zod + API + test RUT + actualizar ledger si aplica.
```

---

## 13. Referencias internas

| Documento | Uso |
|-----------|-----|
| [`EPIS2_PAPER_MODE_DEV_PLAN.md`](./EPIS2_PAPER_MODE_DEV_PLAN.md) | Modo papel |
| [`EPIS2_PAPER_MIRROR_RECONCILIATION.md`](./EPIS2_PAPER_MIRROR_RECONCILIATION.md) | Mirror variables |
| [`EPIS2_CLINICAL_TERMINOLOGY.md`](./EPIS2_CLINICAL_TERMINOLOGY.md) | Intents español |
| [`packages/clinical-domain/src/chile/rut.ts`](../../packages/clinical-domain/src/chile/rut.ts) | Validación RUT |
| [`database/migrations/003_core_clinical.sql`](../../database/migrations/003_core_clinical.sql) | Núcleo SoT |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
