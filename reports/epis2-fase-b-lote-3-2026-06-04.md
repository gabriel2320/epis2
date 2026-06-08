# EPIS2 — Fase B Lote 3 (Golden V2 UI + RAD forms + docs)

**Fecha:** 2026-06-04  
**Alcance:** Playwright golden-v2 · cierre RAD evolución/borrador · sync roadmap  
**Gates:** `check` ✓ · `db:validate` ✓ · `layers-integration-gate` ✓

---

## Lote 3a — Journey V2 UI (Playwright)

| Entregable | Detalle |
|------------|---------|
| Spec | `e2e/golden-v2-admission-discharge.spec.ts` |
| npm | `test:e2e:golden-v2` · bundle `test:e2e` (corrige script ausente en CI) |
| Pasos | servicio → censo/órdenes → acuse INR (si visible) → ingreso borrador → evolución diaria |

---

## Lote 3b — Cierre RAD form/document

| Pantalla | Antes | Después |
|----------|-------|---------|
| `clinical-form-evolution` | partial | **done** — two-pane + acordeones |
| `draft-review` | partial | **done** — `EpisRadDocumentSurface` + ActionBar única |

`DraftReviewPage.tsx` migrado a superficie document RAD; test ids preservados (`epis2-draft-review`, `epis2-draft-approve`).

---

## Lote 3c — Documentación

- `EPIS2_COMPLETION_ROADMAP.md` — Ola 2 estado, 19 blueprints, journey UI
- `EPIS2_GLOBAL_DEV_PLAN.md` — Fase B ítems cerrados
- `EPIS2_GOLDEN_JOURNEYS.md` — referencia Playwright V2

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| E2E requiere API+PG en CI | Playwright webServer + Postgres service en CI |
| Acuse crítico ya hecho en DB | Test condicional `if visible` |
| Ingreso borrador ≠ admisión operativa API | Journey UI documenta borrador clínico; alta operativa en tab servicio (tests unitarios) |

---

## Próximo lote (Fase B-04)

1. Blueprint procedimiento + comando
2. Cierre encuentro UI
3. Migrar tabs reception/aps/or a RAD o exclusión documentada
4. `dashboard-pharmacy` → `done`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
