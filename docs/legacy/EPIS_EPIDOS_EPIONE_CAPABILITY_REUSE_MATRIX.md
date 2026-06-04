# Matriz de reutilización — EPIS · EPIDOS · EPIONE → EPIS2

**Versión:** 1.0 · **Auditoría base:** 2026-06-04  
**Manifiesto ejecutable:** [../../legacy-import-manifest.json](../../legacy-import-manifest.json)

Clasificaciones: `MIGRATE_AS_IS` · `MIGRATE_WITH_ADAPTATION` · `REWRITE_FROM_CONCEPT` · `REFERENCE_ONLY` · `REJECT`

---

## Leyenda de prioridad

| Prioridad | Significado |
|-----------|-------------|
| P0 | Ya adaptado o bloqueante V0 |
| P1 | V0 gate o V1 inmediato |
| P2 | V1–V2 |
| P3 | V3+ |
| — | Rechazado / no incorporar |

---

## EPIS

| Capacidad | Proyecto origen | Elemento origen | Clasificación | Destino EPIS2 | Adaptación | Tests | Prioridad |
|-----------|-----------------|-----------------|---------------|---------------|------------|-------|-----------|
| Sinónimos NL es-CL | EPIS | `data/demo/command-synonyms-es-CL.json` | MIGRATE_WITH_ADAPTATION | `command-registry/epis-synonyms` | Mapa intent EPIS2 | router.test | P0 ✓ |
| CDS demo advisory | EPIS | `packages/epis-clinical-safety` | MIGRATE_WITH_ADAPTATION | `clinical-domain/clinicalSafety` | No bloquear approve | safety tests | P0 ✓ |
| Prompts IA clínica | EPIS | `packages/epis-ai-prompts` | MIGRATE_WITH_ADAPTATION | `local-ai/clinicalPromptPolicy` | 4 blueprints MVP | prompt.test | P0 ✓ |
| Gobierno / gates | EPIS | `scripts/architecture/*` | REWRITE_FROM_CONCEPT | `scripts/architecture/validators` | Reglas EPIS2 | validators.test | P0 ✓ |
| FHIR golden | EPIS | conectores FHIR | REFERENCE_ONLY | `fhir-export` | Perfil EPIS2 | golden-bundles | P1 ✓ |
| Pacientes demo | EPIS | `packages/epis-demo-patients` | REWRITE_FROM_CONCEPT | `test-fixtures` + DB seeds | Sin OpenMRS seed | demoCases.test | P1 |
| Blueprints P3–P7 | EPIS | blueprints clínicos | REFERENCE_ONLY | `clinical-forms` | Nuevos blueprints | registry.test | P2 |
| Document intake / OCR | EPIS | intake + OCR pipelines | REWRITE_FROM_CONCEPT | API documents + jobs | Sin sidecar SoT | integration | P2 |
| RAG | EPIS | `epis-rag`, sidecar | REJECT → V1 REWRITE | pgvector + contratos | No segundo SoT | — | V1 |
| Auditoría servicios | EPIS | audit packages | REFERENCE_ONLY | `apps/api/audit` | Ya existe core | — | P1 |
| Módulo Chile | EPIS | `@epis/chile` | REWRITE_FROM_CONCEPT | `clinical-domain/chile` | RUT vía EPIDOS | rut.test | P0 ✓ |
| Writeback OpenMRS | EPIS | `epis-openmrs-write-adapter` | REJECT | — | — | — | — |
| OpenMRS / O3 distro | EPIS | `docs/architecture/OPENMRS*` | REJECT | — | — | — | — |
| Carbon shell | EPIS | `esm-epis-carbon-shell` | REJECT | — | — | — | — |
| Command registry ESM | EPIS | `commandRegistry.ts` | REFERENCE_ONLY | `command-registry` | No copiar | — | — |
| Material shell acoplado O3 | EPIS | ESM UI | REJECT | MUI EPIS2 only | — | — | — |

---

## EPIDOS

| Capacidad | Proyecto origen | Elemento origen | Clasificación | Destino EPIS2 | Adaptación | Tests | Prioridad |
|-----------|-----------------|-----------------|---------------|---------------|------------|-------|-----------|
| Validación RUT | EPIDOS | `packages/shared/src/rut.ts` | MIGRATE_WITH_ADAPTATION | `clinical-domain/chile/rut` | Tests Vitest | rut.test | P0 ✓ |
| AI Gateway | EPIDOS | `apps/api/src/ai-gateway` | MIGRATE_WITH_ADAPTATION | `local-ai` schemas | Solo Ollama | assist.test | P0 ✓ |
| Golden FHIR bundles | EPIDOS | `packages/connectors/fhir/golden` | MIGRATE_WITH_ADAPTATION | `fhir-export/validateExportBundle` | Perfil mínimo | golden tests | P0 ✓ |
| Power bar / UX comando | EPIDOS | UX patterns | REWRITE_FROM_CONCEPT | `web/CommandCenter` | MUI | golden journey | P0 ✓ |
| Command pipeline | EPIDOS | `command-pipeline.ts` | REWRITE_FROM_CONCEPT | `command-registry` flow | Sin regex | journey | P1 REVIEW |
| Ollama providers | EPIDOS | providers | REWRITE_FROM_CONCEPT | `local-ai/ollama` | Un proveedor | ollama.test | P0 ✓ |
| Import PDF/TXT/imagen | EPIDOS | importers | REWRITE_FROM_CONCEPT | API documents | Versionado | — | P2 |
| OCR | EPIDOS | OCR service | REWRITE_FROM_CONCEPT | worker desacoplado | — | — | P2 |
| RAG pgvector | EPIDOS | RAG stack | REJECT (V0) / REWRITE V1 | DB + contracts | Sin UI infra | — | V1 |
| Búsqueda semántica | EPIDOS | search | REWRITE_FROM_CONCEPT | API search semantic | Fuentes | — | V1 |
| FHIR export | EPIDOS | connectors | MIGRATE_WITH_ADAPTATION | `fhir-export` | Frontera | fhir int | P0 ✓ |
| Regex command interpreter | EPIDOS | `command-interpreter.ts` | REJECT | — | — | — | — |
| UI shadcn anterior | EPIDOS | `apps/web` | REJECT | MUI only | — | — | — |
| Informes / PDF | EPIDOS | reports | REWRITE_FROM_CONCEPT | export service V1 | — | — | P2 |

---

## EPIONE

| Capacidad | Proyecto origen | Elemento origen | Clasificación | Destino EPIS2 | Adaptación | Tests | Prioridad |
|-----------|-----------------|-----------------|---------------|---------------|------------|-------|-----------|
| MAU / ranking NL | EPIONE | `medical-action-universe/resolver` | REWRITE_FROM_CONCEPT | `command-registry/rank` | Sin actionIds legacy | rank.test | P0 ✓ |
| CDR reglas | EPIONE | `clinical-decision-rules` | MIGRATE_WITH_ADAPTATION | `clinicalDecisionRules` | Advisory merge | rules.test | P0 ✓ |
| Clinical Action Engine | EPIONE | action executors | REWRITE_FROM_CONCEPT | `packages/clinical-actions` | Declarativo | — | P2 |
| Catálogo 117 acciones | EPIONE | action registry | REJECT (volumen) | Subconjunto por versión | — | — | P2 |
| Intención → acción | EPIONE | intent maps | REWRITE_FROM_CONCEPT | command-registry + actions | — | — | P2 |
| Worklist / tablero | EPIONE | worklist widgets | REWRITE_FROM_CONCEPT | Modo tablero | No home | dashboard tests | P1 |
| Dashboard home | EPIONE | `EpioneMasterDashboard` | REJECT | — | — | — | — |
| localStorage SoT | EPIONE | core-record-storage | REJECT | PostgreSQL | — | — | — |
| UI Radix/Tailwind | EPIONE | `src/components` | REJECT | MUI | — | — | — |
| Laboratorio profundo | EPIONE | lab modules | REWRITE_FROM_CONCEPT | blueprints + API V2 | — | — | P2 |
| Enfermería / UCI | EPIONE | nursing/icu | REWRITE_FROM_CONCEPT | dominios V3 | — | — | P3 |
| Ambulatorio | EPIONE | ambulatory | REWRITE_FROM_CONCEPT | encuentros V1 | — | — | P2 |
| Traslados / epicrisis | EPIONE | forms | REWRITE_FROM_CONCEPT | blueprints existentes+ | — | — | P1 |
| Fixtures clínicos | EPIONE | test data | MIGRATE_WITH_ADAPTATION | `test-fixtures` | Casos DEMO | demoCases | P1 |
| Esquema DB completo | EPIONE | schema.sql | REJECT | Drizzle revisado | — | — | — |

---

## Elementos rechazados (resumen)

| Elemento | Motivo |
|----------|--------|
| OpenMRS / O3 / Carbon | Arquitectura incompatible |
| Writeback OpenMRS | PostgreSQL es SoT |
| RAG sidecar EPIS como núcleo V0 | Complejidad; reescritura V1 |
| Regex interpreter EPIDOS | Contradice registry único |
| Dashboard EPIONE como home | Canon Centro de Comando |
| localStorage clínico | Sin versionado ni auditoría |
| UI donante completa | Una sola UI MUI |
| IA con escritura directa | Gates EPIS2 |
| Catálogo acciones masivo sin criba | Deriva y duplicación |

---

## Pipeline obligatorio

```text
Repositorio donante (solo lectura)
  → auditoría (docs/legacy-audit)
  → manifiesto (legacy-import-manifest.json)
  → cuarentena (migration/candidates)
  → adaptación (migration/adaptations)
  → tests
  → aprobación humana
  → integración
```

---

## Referencias

- [LEGACY_DONOR_CATALOG.md](../legacy-audit/LEGACY_DONOR_CATALOG.md)
- [EPIS2_MIGRATION_INTEGRATION_PLAN.md](../legacy-audit/EPIS2_MIGRATION_INTEGRATION_PLAN.md)
- [EPIS_REJECTED_PATTERNS.md](./EPIS_REJECTED_PATTERNS.md)
