# EPIS2 — Auditoría PROG-DUAL-CHART

**Fecha:** 2026-06-10 · **Alcance:** MF-DUAL-CHART-00…09 · **Base:** `eab749c` (origin/master)

---

## Resumen ejecutivo

Programa **PROG-DUAL-CHART** cerrado en ledger (10/10 DONE). Gates DC-00…09 pasan tras fixes menores de esta sesión (redirect runtime `?mode=classic`, testId nav, sync docs). `npm run check` OK. Tests unitarios chart + `clinicalNavigate` OK.

**Siguiente paso exacto:** activar `VITE_ENABLE_DUAL_CHART_MODES=true` en entorno objetivo y opt-in E2E CI; continuar **Hilo C** / **Clinical Calm Premium** según tablero.

---

## Ledger (docs/quality/dual-chart-ledger.json)

| Fase | ID | Estado | Gate |
|------|-----|--------|------|
| 0 | MF-DUAL-CHART-00 | DONE | `quality:dual-chart-scaffold-gate` |
| 1 | MF-DUAL-CHART-01 | DONE | `quality:dual-chart-traditional-gate` |
| 2 | MF-DUAL-CHART-02 | DONE | `quality:dual-chart-paper-sot-gate` |
| 3 | MF-DUAL-CHART-03 | DONE | `quality:dual-chart-router-gate` |
| 4 | MF-DUAL-CHART-04 | DONE | `quality:dual-chart-shell-anatomy-gate` |
| 5 | MF-DUAL-CHART-05 | DONE | `quality:dual-chart-traditional-layout-gate` |
| 6 | MF-DUAL-CHART-06 | DONE | `quality:dual-chart-paper-layout-gate` |
| 7 | MF-DUAL-CHART-07 | DONE | `quality:dual-chart-legacy-freeze-gate` |
| 8 | MF-DUAL-CHART-08 | DONE | `quality:dual-chart-census-gate` |
| 9 | MF-DUAL-CHART-09 | DONE | `quality:dual-chart-launcher-gate` |

`npm run quality:dual-chart-ledger` → **OK** (programa completo).

---

## Gates ejecutados

| Script | Resultado | Notas |
|--------|-----------|-------|
| `quality:dual-chart-ledger` | PASS | |
| `quality:dual-chart-scaffold-gate` | PASS | |
| `quality:dual-chart-traditional-gate` | PASS | Falló pre-fix: testId nav ausente en `TraditionalEhrMode` |
| `quality:dual-chart-paper-sot-gate` | PASS | |
| `quality:dual-chart-router-gate` | PASS | |
| `quality:dual-chart-shell-anatomy-gate` | PASS | |
| `quality:dual-chart-traditional-layout-gate` | PASS | |
| `quality:dual-chart-paper-layout-gate` | PASS | |
| `quality:dual-chart-legacy-freeze-gate` | PASS | incluye `three-modes-gate` |
| `quality:dual-chart-census-gate` | PASS | |
| `quality:dual-chart-launcher-gate` | PASS | |
| `quality:dual-chart-gate` | PASS | umbrella MF-00 |
| `quality:dual-chart-plan -- --verify` | PASS | ledger + check + scaffold + `test:unit:chart` |
| `npm run check` | PASS | lint + typecheck + architecture:validate |

---

## Tests

| Comando | Resultado |
|---------|-----------|
| `npm run test:unit:chart` | 3/3 PASS |
| `vitest run apps/web/src/routes/clinicalNavigate.test.ts` | 5/5 PASS |
| `npm run test` (suite completa) | **No ejecutada** — plan verify + gates suficientes para cierre MF |

---

## Git vs origin

| Item | Valor |
|------|-------|
| Branch | `master` |
| Pre-audit HEAD | `eab749c` (= origin/master) |
| Cambios locales (post-audit) | redirect classic, testId nav, tests, tablero, dev plan |
| Push | Pendiente commit local |

---

## Gaps corregidos (esta sesión)

1. **Redirect runtime MF-07** — `PatientWorkspacePage` llama `classicModeToDualChartSearch()` cuando dual ficha activo y URL trae `?mode=classic`.
2. **Gate MF-01 / E2E** — `TraditionalEhrMode` pasa `testId="epis2-traditional-ehr-nav"` a `TraditionalSectionNav` (antes default `epis2-traditional-section-nav`).
3. **Test** — cobertura `classicModeToDualChartSearch` en `clinicalNavigate.test.ts`.
4. **Doc drift** — `EPIS2_DUAL_CHART_DEV_PLAN.md` fases 03–09 → DONE; `EPIS2_TABLERO.md` PROG-DUAL-CHART en Hecho + P1d flag prod.

---

## Riesgos / pendientes

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Flag off por defecto en prod | Dual ficha solo en DEV o flag explícito | P1d tablero: activar cuando signoff ops |
| `three-modes-journey` vs dual flag | Con flag=true, classic URL redirige | CI three-modes mantiene flag=false |
| Suite `npm run test` completa no corrida | Regresión no detectada fuera chart | Correr en CI o cierre sesión |
| Signoff humano dual ficha | Evidencia automatizada only | `EPIS2_DUAL_CHART_CLINICAL_SIGNOFF.md` |

---

## Doc drift (hallazgos)

| Documento | Drift | Acción |
|-----------|-------|--------|
| `EPIS2_DUAL_CHART_DEV_PLAN.md` | Fases 03–09 READY/BLOCKED vs ledger DONE | Corregido |
| `EPIS2_TABLERO.md` | PROG-DUAL-CHART ausente en Hecho | Corregido |
| `TraditionalEhrMode` vs gate/E2E | testId nav inconsistente | Corregido |
| `classicModeToDualChartSearch` | Helper existía, sin uso runtime | Corregido |

---

## Próximo paso

1. Merge/commit fixes de auditoría → push `master`.
2. **P1d:** `VITE_ENABLE_DUAL_CHART_MODES=true` + job CI opt-in `dual-chart-modes.spec.ts`.
3. **Hilo C** longitudinal / **Clinical Calm Premium** (tablero P1b).
