# Adaptación — MAU EPIONE → ranking EPIS2

**Origen conceptual:** `migration/candidates/epione/epione-mau-resolver-reference/` (resolver + ranker EPIONE).

**Destino:** `packages/command-registry/src/rank.ts`

## Qué se reutilizó

- Normalización de consulta en español (`normalize.ts`, ya existente).
- Idea de puntuar por alias, solapamiento de tokens y desempate cuando varios intents compiten.
- Sugerencias acotadas (máx. 3) en `needs_clarification`.

## Qué no se portó

- Catálogos Lyra / `actionId` EPIONE.
- Candidatos por tipo (medicación, imagen, endoscopia, etc.).
- Prefill de formularios desde catálogo MAU.

## Contrato

Un solo resolver: `resolveCommand` en `router.ts` usa `rankCommandDefinitions` + `pickBestFromRanked`.
