# EPIS2 — Roadmap por fases

Cada fase termina con **gate** documentado en `QUALITY_GATES.md` y reporte en `reports/`.

**Regla:** no iniciar fase N+1 sin cumplir gate de N.

---

## EPIS2-00 — Decisión y congelamiento ✓

**Objetivo:** Canon, alcance, migración, reglas Cursor. Sin código productivo.

**Entregables:** `docs/*`, `.cursor/rules/*`, `reports/epis2-00-*.md`

**Gate:** Sin `package.json` productivo. Visión en una página. MVP ≤8 actividades.

---

## EPIS2-01 — Bootstrap monorepo ✓

**Entregables:** estructura `apps/`, `packages/`, `services/`, TS strict, lint, test, Docker Compose (Postgres + Ollama), CI, `.env.example`, health checks.

**Gate:** `npm run check` · `npm run test` · `npm run db:validate` — ver `reports/epis2-01-monorepo-bootstrap.md`

---

## EPIS2-02 — Sistema visual y shell

**Entregables:** tema MUI EPIS2, login, Command Center vacío, power bar, layout clínico, errores, microcopy ES.

**Gate humano:** ¿Se entiende en 3 s? ¿Una acción principal? ¿No parece dashboard?

---

## EPIS2-03 — Autenticación, roles y seguridad

**Entregables:** usuarios sintéticos, RBAC, sesión, rutas protegidas, audit login.

**Gate:** Permiso por acción. Sin contraseñas reales en repo.

---

## EPIS2-04 — Núcleo PostgreSQL

**Entregables:** pacientes, encuentros, problemas, observaciones, notas, borradores, versiones, aprobaciones, auditoría.

**Gate:** Autor + timestamp en escrituras. Borradores ≠ notas finales.

---

## EPIS2-05 — Command Registry y router

**Entregables:** normalización → intent → slots → validación → permiso → ruta.

**Comandos:** buscar, resumir, evolucionar, epicrisis, receta, laboratorio.

**Gate:** Suite ≥100 comandos; ambiguos bloqueados; no autorizados bloqueados.

---

## EPIS2-06 — Formularios generados

**Entregables:** 6 páginas desde blueprints declarativos; registry unificado.

**Gate:** Sin duplicados; cada formulario funciona sin IA.

---

## EPIS2-07 — IA local segura

**Entregables:** `services/local-ai`, schemas, proxy en API, `ai_runs`.

**Gate:** App funciona sin Ollama; salida siempre validada.

---

## EPIS2-08 — Borradores y aprobación

**Entregables:** máquina de estados, versionado, `approvals`, UI revisión.

**Gate:** Sin auto-aprobación; versiones previas conservadas.

---

## EPIS2-09 — Datos demo sintéticos

**Entregables:** 5 casos clínicos ficticios completos.

**Gate:** UI muestra DEMO/SINTÉTICO; sin IDs reales.

---

## EPIS2-10 — Interoperabilidad FHIR

**Entregables:** export Patient, Encounter, DocumentReference, ServiceRequest.

**Gate:** FHIR no es modelo de UI; import diferido.

---

## EPIS2-11 — QA humano y piloto demo

**Flujo:** login → buscar → resumen → evolución → borrador → aprobar → comando.

**Resultado:** GO DEMO | PASS WITH FIXES | BLOCKED | NO GO

---

## Spike opcional (paralelo, no bloqueante)

**ADR-001:** Comparar backend propio vs Medplum — ver `DECISIONS.md`. No sustituye EPIS2-04 sin decisión explícita.
