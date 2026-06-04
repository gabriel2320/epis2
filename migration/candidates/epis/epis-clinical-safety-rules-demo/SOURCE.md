# Procedencia — epis-clinical-safety-rules-demo

| Campo | Valor |
|-------|--------|
| Proyecto origen | EPIS |
| Rutas origen | `packages/epis-clinical-safety/src/{rules,types,evaluate}.ts` |
| Commit origen | `a3b0ffe1caa8b141b9f08e4824c71ec214090cde` |
| Clasificación | MIGRATE_WITH_ADAPTATION |
| Motivo | CDS demo read-only (alergias, embarazo, función renal) sin writeback |

## Dependencias legacy

Ninguna OpenMRS; paquete `@epis/clinical-safety` aislado.

## Riesgos

- Alto si se interpreta como bloqueo automático: debe permanecer **advisory only**.
- Reglas regex simplificadas; no sustituyen farmacovigilancia real.

## Archivos copiados

- `original/rules.ts`, `types.ts`, `evaluate.ts`
- `tests/safety.test.ts` (referencia)
- `proposed/evaluate.ts` (re-export adaptado)

## No copiados

- `fixtures/demo-scenarios.json` (revisar PHI; regenerar en EPIS2 test-fixtures).
