# EPIS2 — Validación de gate (V0–V4)

**Fecha:** 2026-06-04  
**Rama:** `master` (V4 sin commit)

## Automático

| Check | Resultado |
|-------|-----------|
| `npm run db:migrate` | **16** migraciones OK (015/016 V4) |
| `npm test` | **139** tests, **50** archivos |
| Working tree | Cambios V4 pendientes de commit |

## Commits de versión (recientes)

| Versión | Commits base |
|---------|-------------|
| V1 longitudinal | `117cbeb`, `7ac8007` |
| V2 hospitalización | `aaa6e7d`, `8470f38` |
| V3 enfermería/farmacia | `be5eb59` |
| V4 interop/ops | *(pendiente `feat(v4): …`)* |

## Gate humano pendiente

- [PILOT_DEMO_CHECKLIST.md](../docs/quality/PILOT_DEMO_CHECKLIST.md)
- Journey `golden-v4-interop-ops` (auditor.demo → tablero calidad → HL7 → bundle DEMO-005)
