# Revisión — epione-mau-resolver-reference

**Estado:** EXTRACTED_TO_QUARANTINE  
**Recomendación:** REVIEW (reescribir; no integrar archivo tal cual).

## Adaptaciones

- Extraer ideas de normalización y score; implementar en `packages/command-registry`.
- Un solo resolver; eliminar resolvers paralelos de EPIONE.

## Tests

- Golden tests de frases clínicas chilenas (nuevo en EPIS2).

## Riesgo

Alto si se copia catálogo o action registry completo.
