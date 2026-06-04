# Integración P1 — candidatos legacy (2026-06-04)

## Integrado en producción

| Candidato | Destino |
|-----------|---------|
| `epidos-chile-rut-validator` | `packages/clinical-domain/src/chile/rut.ts` + tests |
| `epis-clinical-safety-rules-demo` | `packages/clinical-domain/src/clinicalSafety/` + tests |
| `epis-command-synonyms-es-cl` (parcial) | Aliases en `packages/command-registry/src/definitions.ts` |

## Completado (2026-06-04, post-P1)

| Candidato | Destino |
|-----------|---------|
| `epione-mau-resolver-reference` | `packages/command-registry/src/rank.ts` |
| `epis-command-synonyms-es-cl` (tabla + disambiguation) | `epis-intent-map.ts`, `epis-disambiguation.ts`, aliases |

## Pendiente

- Enriquecer asistencia IA con más contexto demo (ya parcial vía CDS en API).
- `epidos-command-pipeline` — REJECT regex-only; mantener registry EPIS2.
