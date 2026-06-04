# Catálogo de candidatos donantes

Clasificaciones: `MIGRATE_AS_IS` | `MIGRATE_WITH_ADAPTATION` | `REWRITE_FROM_CONCEPT` | `REFERENCE_ONLY` | `REJECT`

Estado por defecto en manifiesto: `REVIEW_REQUIRED`. Extracciones: ver `legacy-import-manifest.json` y `migration/candidates/`.

---

## EPIS

| ID | Elemento | Clasificación | Estado | GO/REVIEW/REJECT |
|----|----------|---------------|--------|------------------|
| epis-command-synonyms-es-cl | Sinónimos NL es-CL | MIGRATE_WITH_ADAPTATION | EXTRACTED | REVIEW |
| epis-clinical-safety-rules-demo | CDS demo read-only | MIGRATE_WITH_ADAPTATION | EXTRACTED | GO |
| epis-command-registry-concept | commandRegistry.ts | REFERENCE_ONLY | REVIEW | REVIEW |
| epis-chile-package | @epis/chile RUT | REWRITE_FROM_CONCEPT | REVIEW | GO (usar cuarentena EPIDOS rut) |
| epis-demo-patients | Pacientes sintéticos | REWRITE_FROM_CONCEPT | REVIEW | REVIEW |
| epis-ai-prompts | Plantillas IA | MIGRATE_WITH_ADAPTATION | REVIEW | REVIEW |
| epis-openmrs-distro | openmrs/ | REJECT | REJECTED | REJECT |
| epis-carbon-shell | Carbon ESM | REJECT | REJECTED | REJECT |
| epis-openmrs-write-adapter | Writeback | REJECT | REJECTED | REJECT |
| epis-rag-sidecar | RAG + sidecar | REJECT | REJECTED | REJECT |
| epis-material-shell-ui | UI MUI en ESM | REJECT (UI acoplada O3) | REVIEW | REJECT |

## EPIDOS

| ID | Elemento | Clasificación | Estado | GO/REVIEW/REJECT |
|----|----------|---------------|--------|------------------|
| epidos-chile-rut-validator | rut.ts | MIGRATE_WITH_ADAPTATION | EXTRACTED | GO |
| epidos-command-pipeline | Pipeline comando | REWRITE_FROM_CONCEPT | REVIEW | REVIEW |
| epidos-ai-gateway | AI Gateway | MIGRATE_WITH_ADAPTATION | REVIEW | REVIEW |
| epidos-fhir-golden-bundles | Golden FHIR | MIGRATE_WITH_ADAPTATION | REVIEW | GO |
| epidos-regex-command-interpreter | Regex NL | REJECT | REJECTED | REJECT |
| epidos-shadcn-ui | apps/web UI | REJECT | REJECTED | REJECT |
| epidos-rag-pgvector | RAG | REJECT (MVP) | REVIEW | REJECT |

## EPIONE

| ID | Elemento | Clasificación | Estado | GO/REVIEW/REJECT |
|----|----------|---------------|--------|------------------|
| epione-mau-resolver-reference | MAU resolver | REWRITE_FROM_CONCEPT | EXTRACTED | REVIEW |
| epione-clinical-decision-rules | CDR | MIGRATE_WITH_ADAPTATION | REVIEW | REVIEW |
| epione-clinical-actions-executor | Executors | REWRITE_FROM_CONCEPT | REVIEW | REVIEW |
| epione-dashboard-home | Inicio/jornada | REJECT | REJECTED | REJECT |
| epione-localstorage-sot | localStorage | REJECT | REJECTED | REJECT |
| epione-radix-ui-shell | UI | REJECT | REJECTED | REJECT |
| epione-action-registry-full | 117 actionIds | REJECT (volumen) | REVIEW | REJECT |

---

## Criterios de aceptación (recordatorio)

Un candidato solo pasa a `APPROVED_FOR_INTEGRATION` si: sin OpenMRS/Carbon, sin PHI, sin secretos, tests, responsabilidad única, no segunda fuente de verdad, IA sin writeback.

---

## Prioridades de rescate (B3)

| Categoría | Fuente principal |
|-----------|------------------|
| Command-first / aliases ES | EPIS JSON + EPIONE MAU (reescritura) |
| Formularios | EPIS blueprints (ref) + EPIS2 ya tiene 6 MVP |
| Seguridad / CDS | EPIS clinical-safety + EPIONE CDR |
| IA local | EPIDOS gateway + EPIS prompts (adaptar) |
| UX / copy ES | EPIS data/demo + EPIS2 design-system |
| Fixtures | EPIS demo-patients + EPIS2 test-fixtures |
