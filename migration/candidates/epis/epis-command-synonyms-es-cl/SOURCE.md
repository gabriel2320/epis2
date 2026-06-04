# Procedencia — epis-command-synonyms-es-cl

| Campo | Valor |
|-------|--------|
| Proyecto origen | EPIS |
| Ruta origen | `data/demo/command-synonyms-es-CL.json` |
| Commit origen | `a3b0ffe1caa8b141b9f08e4824c71ec214090cde` |
| Clasificación | REFERENCE_ONLY → MIGRATE_WITH_ADAPTATION (aliases) |
| Motivo | Sinónimos NL es-CL alineados a intents; enriquecer `packages/command-registry` |

## Dependencias legacy

- Catálogo P8: `data/demo/command-intent-catalog.json` (no copiado; intents distintos a EPIS2).

## Riesgos

- Medio: `intentId` legacy no coincide 1:1 con intents EPIS2; requiere tabla de mapeo.

## Licencia

EPIS privado local.

## Archivos copiados

- `original/command-synonyms-es-CL.json` (`syntheticOnly: true`)

## No copiados

- Catálogo completo P8, disambiguación sin revisión clínica, variantes DEFERRED.
