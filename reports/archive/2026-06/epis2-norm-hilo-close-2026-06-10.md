# EPIS2 — Hilo NORM · cierre global

**Fecha:** 2026-06-10 · **Auditoría base:** [`epis2-norma-fullstack-compliance-2026-06-10.md`](./epis2-norma-fullstack-compliance-2026-06-10.md) (≈70%)

## Resultado

**16/16 microfases cerradas** · cumplimiento estimado **≈90%** (objetivo del hilo alcanzado).

| Tramo | MF | Reporte |
|-------|-----|---------|
| N1 Quick wins | 101–105 ✓ | [`epis2-norm-n1-quick-wins-2026-06-10.md`](./epis2-norm-n1-quick-wins-2026-06-10.md) |
| N2 Observabilidad | 201–203 ✓ | commits `21fc02e`, `a7d1fc8`, `60f4252` |
| N3 Contrato API | 301–303 ✓ | [`epis2-norm-n3-api-contract-2026-06-10.md`](./epis2-norm-n3-api-contract-2026-06-10.md) |
| N4 UI / a11y / E2E | 401, 401b, 402–404 ✓ | [`epis2-norm-n4-ui-a11y-e2e-2026-06-10.md`](./epis2-norm-n4-ui-a11y-e2e-2026-06-10.md) |

Precondición PEND-011 (CI E2E impresión) cerrada al inicio del hilo.

## Re-auditoría matriz (post-hilo)

| Sección | Antes | Después | Evidencia principal |
|---|---|---|---|
| §4 MD3 | 🟢/🟡 | 🟢 | axe CI + drawer móvil MD3 |
| §5 React/TS | 🟡 | 🟢 | tsconfig base + server→field RHF |
| §6 Node | 🟡 | 🟢 | correlationId, envelope, Node pin |
| §8 API | 🟡 | 🟢 | OpenAPI + paginación drafts |
| §9 Seguridad | 🟡 | 🟢 | threat model STRIDE |
| §10 Pruebas | 🟡 | 🟢/🟡 | role-first policy + axe; stock testid oportunístico |
| §11 Observabilidad | 🔴 | 🟢 | pino + OTel opt-in |
| §14 Gates CI | 🟡 ~9/14 | 🟢 ~12/14 | format:check, a11y, openapi-gate |

## Brechas residuales (fuera de alcance del hilo)

- RLS en todas las tablas (plan por olas clínicas).
- Migración masiva E2E `getByTestId` → role-first.
- Implementación `/v1` (ADR-001 defer).
- MSW, microservicios, pnpm (rechazados en auditoría).

## Gates de cierre

| Gate | Resultado |
|------|-----------|
| `npm run check` | ✓ |
| `npm run quality:openapi-gate` | ✓ |
| `npm run test` | ✓ (suite completa) |

## Próximo paso

Marcar PEND-012 cerrado en registro de pendientes; retomar P1 signoff visual M3-R o hitos clínicos del tablero.
