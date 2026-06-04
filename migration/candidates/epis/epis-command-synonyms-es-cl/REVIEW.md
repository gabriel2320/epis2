# Revisión — epis-command-synonyms-es-cl

**Estado:** ADAPTED  
**Recomendación:** Cerrado — `epis-intent-map.ts`, `epis-disambiguation.ts` y aliases en `definitions.ts`.

## Adaptaciones

- Crear `packages/command-registry/src/aliases-es-cl.json` solo tras mapeo.
- Incorporar disambiguación «rx» (receta vs radiografía) como patrón en router EPIS2.

## Tests

- Tests de resolución de comando en español (extender `router.test.ts`).

## Riesgo

Medio (deriva semántica entre proyectos).
