# EPIS2 — Auditoría de proyecto

> **Nota MF-152:** Piloto humano superseded por GO DEMO (`docs/quality/GOLDEN_CLINICAL_JOURNEY.md`). Mantener solo como histórico pre-V5.

**Fecha:** 2026-06-05 (actualizado post-P0) · **Commit:** `0caa0f6` · **Remote:** https://github.com/gabriel2320/epis2 (privado)

---

## Resumen ejecutivo

| Área | Veredicto |
|------|-----------|
| Canon de producto / invariantes | **OK** — 12 gates arquitectónicos verdes |
| Calidad técnica | **OK** — check, test (182/182 con DB), db:validate |
| Seguridad dependencias | **OK** — `drizzle-orm` 0.45.2; `npm audit --omit=dev` = 0 CVE |
| CI GitHub | **OK** — Postgres 16 + migrate + golden journey (`0caa0f6`) |
| Documentación vs código | **OK** — README, ROADMAP, manifiesto, M3 plan, AGENTS (2026-06-05) |
| Piloto clínico humano | **Pendiente** — `PILOT_DEMO_CHECKLIST.md` |

**Veredicto global:** repositorio **apto para demo técnica y piloto controlado**. Producción clínica real requiere signoff humano del journey y hardening operativo (P1/P2).

---

## Cambios desde auditoría inicial (misma fecha)

| Ítem | Antes (`da61d4c`) | Ahora (`0caa0f6`) |
|------|-------------------|-------------------|
| CVE `drizzle-orm` | 1 high | **Cerrado** — ^0.45.2 |
| Tests skipped | 10 (sin DB) | **0** con `DATABASE_URL` |
| CI Postgres | No | **Sí** — servicio + `db:migrate` |
| `quality:golden-journey` en CI | No | **Sí** |
| `qa:bundle-analyze` en CI | No | Sigue pendiente (P2) |

---

## Gates (2026-06-05, con Postgres local)

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm test` | **182 passed**, 0 skipped |
| `npm run db:validate` | OK — 18 migraciones |
| `npm run quality:golden-journey` | 7 passed (spec + API) |
| `npm audit --omit=dev` | 0 vulnerabilities |
| `npm run qa:bundle-analyze` | OK (sesión M3-09) |

CI push `0caa0f6`: https://github.com/gabriel2320/epis2/actions/runs/26989138493

---

## Producto e invariantes

Cumple canon EPIS2: home = `/comando`, command-first, IA no aprueba, PostgreSQL SoT, UI español, sin OpenMRS/Carbon, M3-00…M3-09 con signoff QA.

---

## Fortalezas

- Monorepo EPIS2-00…12 + MUI + Material 3 Clinical
- 12 validadores arquitectónicos automatizados
- Golden journey spec **y API** verdes con Postgres
- 7 suites de integración API activas con DB
- Lazy barrels MUI X; presupuestos dentro de límites
- Modo oscuro piloto; contraste WCAG en roles críticos

---

## Riesgos restantes (priorizados)

### P1 — Piloto humano
Ejecutar `docs/quality/PILOT_DEMO_CHECKLIST.md` y registrar GO DEMO / PASS WITH FIXES.

### P1 — UX modo oscuro
Toggle en Comando; falta revisión en formularios y tablero.

### ~~P2 — Documentación~~ ✓ 2026-06-05
README, `legacy-import-manifest.json`, `M3_ADOPTION_PLAN.md`, `ROADMAP.md`, `AGENTS.md`.

### P2 — CI bundle budget
Añadir `qa:bundle-analyze` al pipeline con fallo si excede presupuesto.

### P3 — Deuda
- Scheduler MUI X 9 alpha (MUI 7+ peer) — solo `/dev/scheduler-spike`
- `mui-core` ~164 KB gzip (date pickers en entry)

---

## Bundle (M3-09)

| Chunk | gzip | Límite |
|-------|------|--------|
| Entry app | ~111 KB | — |
| mui-x-grid | 98 KB | 150 KB ✓ |
| mui-x-charts | 61 KB | 120 KB ✓ |
| mui-core | 164 KB | monitorear |

---

## Próximo paso recomendado

**Piloto humano** con checklist — es la frontera producto actual.

---

## Frase guía

> Los errores de EPIS no son recuerdos: son gates de EPIS2.
