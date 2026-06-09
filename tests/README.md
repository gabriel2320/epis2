# tests/ — Golden Clinical Journey (vitest)

Specs de **journey de producto** ejecutados con vitest (`npm run quality:golden-journey`).
No son E2E de navegador: los E2E Playwright viven en [`e2e/`](../e2e/).

| Spec | Capa |
|---|---|
| `golden-clinical-journey.spec.ts` | Contratos comando/formularios (sin Postgres) |
| `golden-clinical-journey.api.spec.ts` | Flujo API completo (requiere `DATABASE_URL`) |
| `golden-clinical-journey-theme.spec.ts` | Tema M3 del journey (gate `quality:m3-signoff`) |

Canon: [`docs/quality/GOLDEN_CLINICAL_JOURNEY.md`](../docs/quality/GOLDEN_CLINICAL_JOURNEY.md).
No agregar specs aquí salvo extensiones del golden journey.
