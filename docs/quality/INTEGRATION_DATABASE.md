# EPIS2 — Base de datos para tests de integración

Paridad local ↔ CI: GitHub Actions ejecuta **todos** los tests de integración con PostgreSQL 16 + pgvector. Sin `DATABASE_URL`, ~20 tests se omiten con mensaje explícito (no silencioso).

---

## Contrato

| Variable | Obligatoria | Uso |
|----------|-------------|-----|
| `DATABASE_URL` | Sí (integración) | Conexión Postgres para API + journey API |
| Migraciones | Sí | `npm run db:migrate` antes de tests |

**CI:** `postgresql://epis2:epis2@localhost:5432/epis2` (servicio en workflow).

**Local (docker compose):** `postgresql://epis2:epis2@127.0.0.1:5433/epis2` — ver `.env.example`.

---

## Inicio rápido

```bash
cp .env.example .env
docker compose up -d postgres
npm run db:migrate
npm run test                    # carga .env automáticamente; ~319 tests, 0 skipped
npm run quality:ci-parity       # carga .env; falla si queda algún skip
npm run quality:golden-journey  # spec + API journey
```

Vitest y `quality:ci-parity` leen `.env` si existe (sin sobrescribir variables del shell/CI).

---

## Suites de integración (10)

Definidas en `@epis2/test-fixtures` → `INTEGRATION_TEST_SUITES`:

| Archivo | Dominio |
|---------|---------|
| `clinical.integration.test.ts` | Borradores / aprobación |
| `search.integration.test.ts` | Búsqueda pacientes |
| `v3-mar.integration.test.ts` | MAR enfermería |
| `dashboard.test.ts` | Tableros por rol |
| `rls.integration.test.ts` | RLS piloto |
| `fhir.integration.test.ts` | Export FHIR |
| `inpatient.integration.test.ts` | Hospitalización |
| `v4.integration.test.ts` | Interoperabilidad / calidad |
| `v5.integration.test.ts` | IA trazable |
| `golden-clinical-journey.api.spec.ts` | Journey dorado API |

Helper: `describeIntegration()` — skip con etiqueta `[omitido: sin DATABASE_URL …]` si falta la variable.

---

## Gates

| Comando | Sin DATABASE_URL | Con DATABASE_URL + migrate |
|---------|------------------|----------------------------|
| `npm run test` | ~299 passed, ~20 skipped (explícito) | ~319 passed, **0 skipped** |
| `npm run quality:ci-parity` | **FALLA** (exige URL) | OK solo si 0 skipped |
| CI `.github/workflows/ci.yml` | N/A | migrate → test → ci-parity → golden-journey |

---

## Troubleshooting

| Síntoma | Acción |
|---------|--------|
| `connection refused` | `docker compose up -d postgres`; puerto host **5433** |
| MAR / V3 fallan | `npm run db:migrate` (seed con ventanas relativas a `NOW()`) |
| Skips con DATABASE_URL definida | Revisar URL, migraciones y `npm run quality:ci-parity` |
