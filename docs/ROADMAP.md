# EPIS2 — Roadmap por fases

> **Nomenclatura SDEPIS2:** los bloques `EPIS2-00…12` son **hitos bootstrap** (no «fases» del plan global). Hilos activos post-MVP → [`EPIS2_DEV_SYSTEM.md`](product/EPIS2_DEV_SYSTEM.md) · [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md).

Cada hito termina con **gate** documentado en `QUALITY_GATES.md` y reporte en `reports/`.

**Regla:** no iniciar hito N+1 sin cumplir gate de N.

---

## EPIS2-00 — Decisión y congelamiento ✓

**Objetivo:** Canon, alcance, migración, reglas Cursor. Sin código productivo.

**Entregables:** `docs/*`, `.cursor/rules/*`, `reports/archive/2026-06/epis2-00-*.md`

**Gate:** Sin `package.json` productivo. Visión en una página. MVP ≤8 actividades.

---

## EPIS2-01 — Bootstrap monorepo ✓

**Entregables:** estructura `apps/`, `packages/`, `services/`, TS strict, lint, test, Docker Compose (Postgres + Ollama), CI, `.env.example`, health checks.

**Gate:** `npm run check` · `npm run test` · `npm run db:validate` — ver `reports/archive/2026-06/epis2-01-monorepo-bootstrap.md`

---

## EPIS2-02 — Sistema visual y shell ✓

**Entregables:** tema MUI EPIS2, login, Command Center vacío, power bar, layout clínico, errores, microcopy ES.

**Gate humano:** ¿Se entiende en 3 s? ¿Una acción principal? ¿No parece dashboard? — ver `reports/archive/2026-06/epis2-02-visual-shell.md`

---

## EPIS2-03 — Autenticación, roles y seguridad ✓

**Entregables:** usuarios sintéticos, RBAC, sesión, rutas protegidas, audit login.

**Gate:** Permiso por acción. Sin contraseñas reales en repo. — ver `reports/archive/2026-06/epis2-03-auth-security.md`

---

## EPIS2-04 — Núcleo PostgreSQL ✓

**Entregables:** pacientes, encuentros, problemas, observaciones, notas, borradores, versiones, aprobaciones, auditoría.

**Gate:** Autor + timestamp en escrituras. Borradores ≠ notas finales. — `reports/archive/2026-06/epis2-04-postgres-core.md`

---

## EPIS2-05 — Command Registry y router ✓

**Entregables:** normalización → intent → slots → validación → permiso → ruta.

**Comandos:** buscar, resumir, evolucionar, epicrisis, receta, laboratorio.

**Gate:** Suite ≥100 comandos; ambiguos bloqueados; no autorizados bloqueados. — `reports/archive/2026-06/epis2-05-command-registry.md`

---

## EPIS2-06 — Formularios generados ✓

**Entregables:** 6 páginas desde blueprints declarativos; registry unificado.

**Gate:** Sin duplicados; cada formulario funciona sin IA. — `reports/archive/2026-06/epis2-06-generated-forms.md`

---

## EPIS2-07 — IA local segura ✓

**Entregables:** `services/local-ai`, schemas, proxy en API, `ai_runs`.

**Gate:** App funciona sin Ollama; salida siempre validada. — `reports/archive/2026-06/epis2-07-local-ai.md`

---

## EPIS2-08 — Borradores y aprobación ✓

**Entregables:** máquina de estados, versionado, `approvals`, UI revisión.

**Gate:** Sin auto-aprobación; versiones previas conservadas. — `reports/archive/2026-06/epis2-08-drafts-approval.md`

---

## EPIS2-09 — Datos demo sintéticos ✓

**Entregables:** 5 casos clínicos ficticios completos.

**Gate:** UI muestra DEMO/SINTÉTICO; sin IDs reales. — `reports/archive/2026-06/epis2-09-demo-data.md`

---

## EPIS2-10 — Interoperabilidad FHIR ✓

**Entregables:** export Patient, Encounter, DocumentReference, ServiceRequest.

**Gate:** FHIR no es modelo de UI; import diferido. — `reports/archive/2026-06/epis2-10-fhir-export.md`

---

## EPIS2-11 — QA humano y piloto demo ✓

**Flujo:** login → buscar → resumen → evolución → borrador → aprobar → comando.

**Resultado:** GO DEMO | PASS WITH FIXES | BLOCKED | NO GO — `reports/archive/2026-06/epis2-11-pilot-demo.md`, `docs/quality/PILOT_DEMO_CHECKLIST.md`

---

## EPIS2-12 — Modo tablero secundario ✓

**Entregables:** `/epis2/dashboard` (Mi trabajo / Paciente / Servicio / Calidad), lazy MUI X, «Volver al Centro de Comando».

**Gate:** Tablero no es home; una vía de retorno al Comando. — `reports/archive/2026-06/epis2-12-dashboard-mode.md`

**Experiencia M3:** track M3-00…09 completado en paralelo — `docs/design/M3_ADOPTION_PLAN.md`

---

## Numeración post-MVP (no confundir)

| Serie | Uso |
|-------|-----|
| **EPIS2-00…12** | MVP bootstrap — cerrado en este documento |
| **EPIS2-PM-01…** | Post-MVP UX transversal — ver abajo |
| **EPIS2-13…16** | Versiones producto V2–V4 — ver [`EPIS2_RELEASE_ROADMAP.md`](product/EPIS2_RELEASE_ROADMAP.md) (p. ej. EPIS2-13 = Hospitalización) |

---

## EPIS2-PM-01 — Tres modos MD3 (Command · Classic · Dashboard) ✓

**Programa:** PROG-THREE-MODES · **Hilo plan global:** Fase UX-1 (**cerrada** 2026-06-04)

**Objetivo:** Orquestar tres experiencias complementarias con una sesión y sin routers paralelos. Home sigue siendo `/comando`.

**Microfases:**

| MF | Estado |
|----|--------|
| MF-CLASSIC-MD3 | ✓ |
| MF-DASHBOARD-MD3 | ✓ |
| MF-THREE-MODES-01…08 | ✓ |

**Entregables:** `apps/web/src/modes/`, `EpisSessionContext`, `EpisModeSwitcher`, shells MD3 classic/dashboard, gates `quality:three-modes-gate`.

**Docs:** [`EPIS2_THREE_MODES_DEV_PLAN.md`](product/EPIS2_THREE_MODES_DEV_PLAN.md) · [`EPIS2_MODES_LAYER.md`](architecture/EPIS2_MODES_LAYER.md)

**Gate (PM01-A…E):** ver [`QUALITY_GATES.md`](QUALITY_GATES.md) § EPIS2-PM-01

Reportes: `reports/epis2-mf-three-modes-*.md` · auditorías `reports/epis2-three-modes-*.md`

---

## Frontera actual (post-MVP v1 + M3)

| Hito | Estado |
|------|--------|
| **PILOT-HUMAN** GO DEMO | ✓ `reports/epis2-pilot-human-2026-06-05.md` |
| **UI plana + formularios** | ✓ `reports/epis2-chips-forms-completion.md` |
| **Plan A** estabilización UX/docs | ✓ `reports/epis2-ux-stabilization.md` |
| **WIDGET-00** fundación | ✓ `reports/epis2-widget-foundation.md` |
| **Slices V1–V5** | ◐ demo; gates completos abiertos — `reports/epis2-audit-and-dev-plans-2026-06-05.md` |
| **EPIS2-PM-01 Tres modos MD3** | ✓ PROG-THREE-MODES MF-01…08 · CI E2E verde 2026-06-09 |
| **CI master** | ✓ run [27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125) — 10/10 E2E preview |

**Siguiente recomendado:** **Hilo D — Tramo J farmacia** — ver [`EPIS2_DEV_SYSTEM.md`](product/EPIS2_DEV_SYSTEM.md) · [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md)

---

## Spike opcional (paralelo, no bloqueante)

**ADR-001:** Comparar backend propio vs Medplum — ver `DECISIONS.md`. No sustituye EPIS2-04 sin decisión explícita.
