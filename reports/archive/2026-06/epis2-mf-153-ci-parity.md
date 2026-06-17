# EPIS2 — MF-153 Paridad local con CI y PostgreSQL

**Fecha:** 2026-06-05  
**Ola:** 0 — Verdad operativa y gates  
**Alcance:** Documentación `DATABASE_URL`, skips explícitos, gate `quality:ci-parity` en CI.

---

## 1. Entregables

| Artefacto | Ruta |
|-----------|------|
| Guía integración | `docs/quality/INTEGRATION_DATABASE.md` |
| Helper tests | `packages/test-fixtures/src/integrationDatabase.ts` |
| Gate paridad | `scripts/quality/validate-ci-test-parity.mjs` |
| CI workflow | `.github/workflows/ci.yml` → `quality:ci-parity` tras `test` |
| Aviso local | `vitest.setup.ts` (warn sin DATABASE_URL) |

---

## 2. Cambios de comportamiento

**Antes:** 10 suites con `describe.skipIf(!DATABASE_URL)` — skip silencioso en salida Vitest.

**Después:**
- `describeIntegration()` — título incluye `[omitido: sin DATABASE_URL — ver docs/quality/INTEGRATION_DATABASE.md]`
- `vitest.setup.ts` — aviso único al arrancar tests sin URL
- `npm run quality:ci-parity` — con `DATABASE_URL` exige **0 skipped** (falla CI si hay omisiones)

**Suites migradas (10):** listadas en `INTEGRATION_TEST_SUITES`.

---

## 3. Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK — 15/15 architecture gates |
| `npm run test` | OK — 302 passed, 20 skipped (sin Postgres local); skips con etiqueta explícita |
| `npm run db:validate` | OK — 22 migraciones |
| `npm run ai:evals` | OK — 5 casos |
| `npm run quality:microphases` | OK — próxima READY: MF-154 |
| `npm run quality:ci-parity` | Validado en CI (Postgres servicio); local requiere `docker compose` + migrate |

---

## 4. Ledger

- **MF-153:** DONE  
- **MF-154:** READY — Playwright E2E crítico en CI

---

## 5. Riesgos

- Desarrolladores sin Postgres local siguen con ~20 skips **etiquetados**; paridad completa requiere `docker compose` + migrate.
- `quality:ci-parity` duplica ejecución de tests en CI (coste ~15s); aceptable para gate explícito.

---

## 6. Próximo paso

**MF-154** — Playwright E2E obligatorio en CI (journey comando→evolución mínimo).
