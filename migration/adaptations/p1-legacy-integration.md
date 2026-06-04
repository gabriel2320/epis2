# Integración P1 — candidatos legacy (2026-06-04)

## Integrado en producción

| Candidato | Destino |
|-----------|---------|
| `epidos-chile-rut-validator` | `packages/clinical-domain/src/chile/rut.ts` + tests |
| `epis-clinical-safety-rules-demo` | `packages/clinical-domain/src/clinicalSafety/` + tests |
| `epis-command-synonyms-es-cl` (parcial) | Aliases en `packages/command-registry/src/definitions.ts` |

## Pendiente

- Usar `normalizeRut` en búsqueda de paciente (API) cuando exista endpoint de búsqueda por RUT.
- Enriquecer asistencia IA con `formatSafetyWarningsForAssist` cuando el contexto traiga meds/alergias.
- MAU EPIONE: solo cuarentena; reescritura en fase posterior.
