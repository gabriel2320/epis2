# EPIS2-11 — QA humano y piloto demo

**ID:** EPIS2-11  
**Estado:** Completada (automatización + checklist humano)  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Journey API | `tests/golden-clinical-journey.api.spec.ts` — flujo login → comando → borrador → aprobación → auditoría → FHIR doc |
| Journey contratos | `tests/golden-clinical-journey.spec.ts` — pasos, 5 casos demo, registry evolución |
| Checklist humano | `docs/quality/PILOT_DEMO_CHECKLIST.md` |
| Comando | `npm run quality:golden-journey` (specs UI + API) |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Journey API con Postgres | `describe.skipIf(!DATABASE_URL)` |
| Sin dependencia de Ollama en journey | IA no invocada en test API |
| Checklist humano publicado | 9 pasos alineados a `GOLDEN_CLINICAL_JOURNEY.md` |
| Resultado piloto documentable | GO DEMO / PASS WITH FIXES / BLOCKED / NO GO |

---

## Resultado del piloto humano

> Completar tras ejecutar `docs/quality/PILOT_DEMO_CHECKLIST.md`.

| Resultado | Fecha | Notas |
|-----------|-------|-------|
| _Pendiente revisión humana_ | | |

**Automatización (CI/local con DB):** journey API verde = precondición técnica para **GO DEMO**; no sustituye la pasada humana de UI.

---

## Cómo ejecutar

```bash
docker compose up -d
# .env: DATABASE_URL=postgresql://epis2:epis2@127.0.0.1:5432/epis2
npm run db:migrate
set DATABASE_URL=postgresql://epis2:epis2@127.0.0.1:5432/epis2   # Windows
npm run quality:golden-journey
npm run dev:api
npm run dev:web
# Seguir PILOT_DEMO_CHECKLIST.md
```

---

## MVP v1 — cierre de fases

Con EPIS2-11, el roadmap **EPIS2-00 … EPIS2-11** queda implementado en código. Mantener gates (`npm run check`, `architecture:validate`) antes de ampliar alcance.

---

## Commit sugerido

```text
feat(epis2-11): golden clinical journey API automation and human pilot checklist
```
