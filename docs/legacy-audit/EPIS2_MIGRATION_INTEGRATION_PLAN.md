# Plan de integración EPIS2 (propuesta — sin ejecución)

**Fase D:** no mover código a producción hasta revisión humana y gates.

---

## Matriz de integración

| Candidato | Origen | Destino EPIS2 | Adaptación | Tests | Riesgo | Prioridad |
|-----------|--------|---------------|------------|-------|--------|-----------|
| epidos-chile-rut-validator | EPIDOS | `packages/clinical-domain` | Namespace `@epis2`, tests nuevos | `rut.test.ts` | Bajo | **P0** |
| epis-clinical-safety-rules-demo | EPIS | `packages/clinical-domain` | Advisory-only, español | Port `safety.test.ts` | Medio | **P1** |
| epis-command-synonyms-es-cl | EPIS | `packages/command-registry` | Mapeo intents | Extender router tests | Medio | **P1** |
| epione-mau-resolver-reference | EPIONE | `packages/command-registry` | Reescritura ranking | Golden NL chileno | Alto | **P1** |
| epidos-ai-gateway | EPIDOS | `services/local-ai` | Solo Ollama, contratos EPIS2 | `assist.test.ts` | Medio | **P2** |
| epidos-fhir-golden-bundles | EPIDOS | `packages/fhir-export` | Perfil EPIS2 | `mappers.test.ts` | Bajo | **P2** |
| epione-clinical-decision-rules | EPIONE | `packages/clinical-domain` | Fusionar con safety | Nuevos CDR tests | Medio | **P2** |
| epis-ai-prompts | EPIS | `services/local-ai` | Sin RAG | Evals opcionales | Medio | **P2** |
| epidos-command-pipeline | EPIDOS | `packages/command-registry` | Registry, no regex | Golden journey | Alto | **P2** |
| epis-demo-patients | EPIS | `packages/test-fixtures` | Ya DEMO-001..005 | demoCases.test | Bajo | **P2** |

---

## Prioridad por valor

### P0 — Fundacional

- Validación RUT chilena.
- Contratos y tipos estrictos (ya en `@epis2/contracts`).
- Permisos y auditoría (ya en API EPIS2).

### P1 — MVP

- Aliases español en command-registry.
- CDS demo en asistencia (no bloqueo).
- Ranking MAU (reescrito).
- Formularios MVP (ya en `clinical-forms`).

### P2 — Posterior

- AI Gateway patterns EPIDOS.
- Golden FHIR EPIDOS.
- Prompts/evals EPIS.
- RAG / enfermería / farmacia.

### REJECTED

- OpenMRS, Carbon, writeback, RAG sidecar, localStorage SoT, UI Radix/shadcn/Carbon, dashboard home EPIONE, regex interpreter EPIDOS, catálogos Lyra masivos.

---

## Secuencia sugerida (post-auditoría)

1. Revisar manifiesto y aprobar candidatos `EXTRACTED` → `APPROVED_FOR_INTEGRATION` uno a uno.
2. Integrar `epidos-chile-rut-validator` con tests.
3. Fusionar sinónimos EPIS tras tabla de intents.
4. Portar clinical-safety demo.
5. Diseñar MAU v2 en command-registry (sin copiar resolver EPIONE).
6. Ejecutar `npm run check` + golden journey tras cada integración.

---

## Lo que EPIS2 ya tiene (no re-importar)

- Centro de Comando, paciente activo, ficha (`b2c47c9`).
- `packages/command-registry`, `clinical-forms`, `test-fixtures`, `fhir-export`.
- Golden journey API (`tests/golden-clinical-journey.api.spec.ts`).

---

*Documento de propuesta — Fase D completa sin cambios en `apps/` productivos.*
