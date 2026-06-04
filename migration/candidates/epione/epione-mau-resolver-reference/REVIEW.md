# Revisión — epione-mau-resolver-reference

**Estado:** ADAPTED  
**Recomendación:** Cerrado — reescritura en `packages/command-registry/src/rank.ts` (ver `migration/adaptations/epione-mau-v2-command-ranking.md`).

## Adaptaciones

- Extraer ideas de normalización y score; implementar en `packages/command-registry`.
- Un solo resolver; eliminar resolvers paralelos de EPIONE.

## Tests

- Golden tests de frases clínicas chilenas (nuevo en EPIS2).

## Riesgo

Alto si se copia catálogo o action registry completo.
