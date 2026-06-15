# EPIS2 — Historial de fases y tracks (archivo)

**Estado:** histórico · **No usar para alcance actual**

Verdad vigente: [`../EPIS2_CURRENT_STATE.md`](../EPIS2_CURRENT_STATE.md) · Gobierno: [`../DOCUMENTATION_GOVERNANCE.md`](../DOCUMENTATION_GOVERNANCE.md)

---

## Fases EPIS2-00 … EPIS2-12

| Fase | Estado | Entrega resumida |
|------|--------|------------------|
| **EPIS2-00** | Completada | Canon, alcance, migración, reglas Cursor |
| **EPIS2-01** | Completada | Monorepo, tooling, health checks, Docker |
| **EPIS2-02** | Completada | MUI, Centro de Comando `/comando` (compat redirect) |
| **EPIS2-03** | Completada | Auth API, RBAC, sesión cookie, auditoría login |
| **EPIS2-04** | Completada | Núcleo PostgreSQL, borradores, aprobaciones |
| **EPIS2-05** | Completada | Command Registry, router, API resolve |
| **EPIS2-06** | Completada | 6 formularios desde blueprints (sin IA) |
| **EPIS2-07** | Completada | IA local Ollama, proxy API, `ai_runs` |
| **EPIS2-08** | Completada | Borradores, versiones, aprobación humana UI |
| **EPIS2-09** | Completada | 5 casos demo sintéticos, badge DEMO |
| **EPIS2-10** | Completada | Export FHIR R4 (frontera API) |
| **EPIS2-11** | Completada | Journey dorado API + checklist piloto humano |
| **EPIS2-12** | Completada | Modo tablero «Mi trabajo» (`/epis2/dashboard`, secundario) |

Detalle por fase: [`../ROADMAP.md`](../ROADMAP.md) · informes `reports/epis2-0*.md`.

---

## Capa experiencia (MUI + Material 3 Clinical)

| Track | Estado | Notas |
|-------|--------|-------|
| **MUI-01…10** | Completado | Tema, catálogo, formularios, Data Grid, Date Pickers, Charts, Tree, Dashboard shell, Scheduler spike |
| **M3-00…09** | Completado | Tokens M3, `createEpis2Theme`, primitivos, reskin clínico/tablero, preferencias, QA signoff |
| **UI plana + slices** | Completado | Tema monocromático, chips, 11 blueprints, WIDGET-00 |
| **EPIS2-PM-01 Tres modos** | Completado | PROG-THREE-MODES MF-01…08 |

---

## Planes de estabilización (A–G)

| Plan | Estado | Reporte |
|------|--------|---------|
| **Plan A** — UX + docs | ✓ | `reports/archive/2026-06/epis2-ux-stabilization.md` |
| **Plan B** — WIDGET-01 | ✓ | `reports/archive/2026-06/epis2-widget-01-mount.md` |
| **Plan C** — V1 completo | ✓ | `reports/archive/2026-06/epis2-v1-plan-c-complete.md` |
| **Plan D** — V2 slice ingreso/alta | ✓ | `reports/archive/2026-06/epis2-v2-plan-d-slice.md` |
| **Plan E** — V3 | ✓ | `reports/archive/2026-06/epis2-v3-plan-e-slice.md` |
| **Plan F** — V4/V5 + hardening | ✓ | `reports/archive/2026-06/epis2-plan-f-complete.md` |
| **Plan G** — CI calidad | ✓ | `reports/archive/2026-06/epis2-plan-g-complete.md` |

---

## Programas posteriores (2026)

| Programa | Cierre |
|----------|--------|
| PROG-FICHA-FIRST | `reports/epis2-prog-ficha-first-close-2026.md` |
| PROG-STRENGTHEN | `reports/epis2-prog-strengthen-close-2026.md` |
| PROG-CONSOLIDATE ola 1 | `reports/epis2-prog-consolidate-close-2026.md` |
| PROG-RAPID | `reports/epis2-mf-rapid-close-2026.md` |

---

## CI histórico

Referencia de run verde (2026-06): [Actions run 27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125) — no sustituye el estado actual de workflows; ver `.github/workflows/`.
