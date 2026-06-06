# MF-OLA3-007 — Antecedentes quirúrgicos (IDC 30)

**Fecha:** 2026-06-07  
**Estado:** ✅ Cerrada

## Alcance

Tipo `surgical_history` en formulario problema, prefijo SoT `[Ant.Qx]`, sección dedicada en ficha.

## Cambios

- `@epis2/clinical-domain` — helpers prefijo quirúrgico
- `clinical_problem_entry` — campo `problemCategory`
- `PatientLongitudinalPanel` — sección + CTA
- Aprobación borrador — `formatSurgicalHistoryDescription`

## Evidencia

| Gate | Resultado |
|------|-----------|
| ola3-surgical-gate | ✅ |
| surgicalHistory.test | ✅ |

## IDC

30 → **Done**
