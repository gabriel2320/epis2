# EPIS2-09 — Datos demo sintéticos

**ID:** EPIS2-09  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Fixtures | `packages/test-fixtures` — 5 casos `DEMO-001` … `DEMO-005` con resumen clínico |
| Migración | `006_demo_five_cases.sql` — pacientes 4–5, encuentros, problemas, observaciones, nota y borrador demo |
| API | `GET /api/patients` y `GET /api/patients/:id` con `demoCaseCode`, `demoLabel`, `clinicalContext` |
| Web | Resumen clínico precargado desde API; chips DEMO + paciente + código caso |
| Journey | Test activo: 5 casos en `golden-clinical-journey.spec.ts` |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Seed `is_synthetic = true` | Todos los pacientes demo |
| UI badge DEMO/SINTÉTICO | Shell, formularios, revisión de borrador |
| Sin IDs reales | Identificadores solo `EPIS2-DEMO` / `DEMO-00x` |
| 5 casos completos | Encuentro abierto + problemas + observaciones por caso |

---

## Casos demo

| Código | Paciente | Escenario |
|--------|----------|-----------|
| DEMO-001 | Carmen Soto | HTA ambulatoria |
| DEMO-002 | Jorge Pérez | DM2 + borrador en revisión |
| DEMO-003 | niña Inés R. | Asma pediátrica |
| DEMO-004 | Roberto N. Vega | Postoperatorio |
| DEMO-005 | Elena M. Fuentes | FA + polifarmacia |

---

## Uso local

```bash
npm run db:migrate
npm run dev:api
npm run dev:web
```

Login: `medico.demo` / `DEMO-CLAVE-MEDICO` — ver `docs/auth/DEMO_USERS.md`.

---

## Próximo paso

**EPIS2-10** — Interoperabilidad FHIR (export mínimo).

---

## Commit sugerido

```text
feat(epis2-09): five complete synthetic demo cases with DEMO badges
```
