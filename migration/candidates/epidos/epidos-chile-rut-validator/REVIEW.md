# Revisión — epidos-chile-rut-validator

**Estado:** EXTRACTED_TO_QUARANTINE  
**Recomendación:** GO (integración P1) tras tests unitarios en `@epis2/clinical-domain`.

## Adaptaciones requeridas

- Mover a `packages/clinical-domain/src/chile/rut.ts`.
- Añadir `rut.test.ts` en EPIS2 (no copiado desde EPIDOS).
- Usar en API de búsqueda de paciente y slots de comando (futuro).

## Tests requeridos

- Casos válidos/inválidos, K mayúscula, formatos con puntos.

## Riesgo de migración

Bajo.
