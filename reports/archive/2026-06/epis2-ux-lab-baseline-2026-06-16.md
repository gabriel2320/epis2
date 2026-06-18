# PROG-UX-LAB — Tramo A baseline (MF-UXLAB-00)

**Fecha:** 2026-06-16 · **HEAD:** `d9b5ba7` · **Programa:** PROG-UX-LAB  
**Plan:** [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)  
**Baseline histórico:** GO DEMO UX/CE 2026-06-04 · [`PILOT_DEMO_CHECKLIST.md`](../docs/quality/PILOT_DEMO_CHECKLIST.md)

---

## Alcance MF-UXLAB-00

Charter + corrida baseline de gates hard + delta cualitativo vs GO 2026-06-04. **Sin código UI** (Tramo B).

---

## Precondiciones corrida

| Requisito | Estado |
|-----------|--------|
| `npm run stack:dev` (Postgres :5433) | ✓ ejecutado |
| Ollama / local-ai | opcional · Modo A no requiere IA |
| API en marcha | no requerida — golden API usa vitest + app inject |

---

## Resultados gates (local)

| Gate | Resultado | Detalle |
|------|-----------|---------|
| `quality:fast` | ✓ OK | architecture:validate · PHI scan |
| `quality:security-promote-gate` | ✓ OK | RH-09/10/11 + RH-12 workflow |
| `quality:golden-journey` | ✓ **19/19** | 8 API + 11 vitest (con Postgres) |
| `validate-ux-pilot-gate.mjs` | ✗ FAIL | scripts `quality:ux-g02` / `quality:ux-pilot` ausentes en root `package.json` (regresión post-CONSOLIDATE) |
| `quality:m3-human-pilot` | — omitido | E2E Playwright · defer Tramo D o CI |
| CI `master` post-PR #28 | ✓ | required + security checks verdes |

### Nota golden journey sin stack

Sin Postgres (`ECONNREFUSED :5433`): **11/19** pasan (vitest estático); **8/8 API fallan**.  
**Prerrequisito local documentado:** `npm run stack:dev` antes de `quality:golden-journey`.

---

## Delta vs GO DEMO 2026-06-04

| Dimensión | Jun 2026-04 | Jun 2026-16 | Implicación UX Lab |
|-----------|-------------|-------------|-------------------|
| Flujo core | GO · golden 17/17 | golden **19/19** (v1–v7) | No re-certificar — **elevar percepción** |
| Home | command-first en transición | **censo-first** PROG-FICHA-FIRST ✓ | Shift Context Strip va en censo, no landing |
| Seguridad CI | report-only | RH-09/10/11 **blocking** + branch protection | Confianza operativa ↑ |
| Tag demo | UX-COMMAND-FIRST | `v0.1-demo-rc3` + POST-RC3 | Demo institucional más madura |
| Piloto humano | GO UX/CE | sin re-run post-RC3 | Tramo D: 3–5 usuarios |

### Brechas UX objetivo (Tramos B–D)

1. Censo sin **pendiente principal** ni **acción primaria única** por fila.
2. Sin **Shift Context Strip** (turno sintético visible al entrar).
3. Estados demo/borrador/aprobado **no unificados** en todas las superficies papel.
4. Command bar: sugerencias contextuales **determinísticas** mejorables (registry ya existe).
5. Métricas soft (tiempos 15–20 min) **sin instrumentar** aún.

---

## Hallazgos / deuda

| ID | Severidad | Hallazgo | Acción |
|----|-----------|----------|--------|
| UXLAB-01 | Media | `ux-pilot-gate` falla por scripts podados | Tramo B o MF higiene: shims `quality:gate -- quality:ux-pilot*` |
| UXLAB-02 | Baja | Golden API requiere stack local | Documentar en plan + dev:velocity |
| UXLAB-03 | Info | `build:packages` falla en `local-ai` (langfuse) | No bloquea UX lab · CI Linux OK |

---

## Criterio Tramo A

| Criterio | Estado |
|----------|--------|
| Plan UX canónico en repo | ✓ PR #28 |
| Auditoría estado | ✓ `epis2-audit-estado-2026-06-16.md` |
| Baseline gates core | ✓ fast + security + golden (con stack) |
| Delta vs GO 2026-04 documentado | ✓ este reporte |
| Gate MF-UXLAB-00 | ✓ `quality:fast` |

**Resultado Tramo A:** **PASS** — listo para **Tramo B (MF-UXLAB-01)**.

---

## Próximo tramo

**MF-UXLAB-01** — Censo narrativo + Shift Context Strip + fixtures DEMO enriquecidos.

```text
Allowlist: packages/test-fixtures, apps/web/src/fixtures, PatientListGrid,
           buscar-paciente, e2e/ux-lab-census.spec.ts
Gate:      quality:ux-pilot (cuando shims restaurados) + quality:fast
```

---

## Comandos reproducir

```bash
npm run stack:dev
npm run quality:fast
npm run quality:security-promote-gate
npm run quality:golden-journey
node scripts/quality/validate-ux-pilot-gate.mjs   # falla scripts — ver UXLAB-01
```
