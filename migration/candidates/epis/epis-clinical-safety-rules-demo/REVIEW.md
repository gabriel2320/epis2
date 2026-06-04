# Revisión — epis-clinical-safety-rules-demo

**Estado:** EXTRACTED_TO_QUARANTINE  
**Recomendación:** GO (P1) como módulo `clinical-safety-demo` en `@epis2/clinical-domain`.

## Adaptaciones

- Integrar en flujo de asistencia IA (solo texto de alerta), nunca en aprobación automática.
- Ampliar reglas tras validación clínica chilena.

## Tests

- Portar 4 casos de `safety.test.ts` a Vitest EPIS2.

## Riesgo

Medio (expectativas clínicas vs demo).
