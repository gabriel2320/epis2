# EPIS2 — MF-CON-11 CI tiers

**Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE ola 2 PR 011

## Entrega

| Workflow | Manifiesto | Trigger |
|----------|------------|---------|
| `ci.yml` | `required.json` | PR / push |
| `ci-nightly.yml` | `nightly.json` | cron 04:00 UTC + manual |
| `ci-experimental.yml` | `experimental.json` | domingo 06:00 UTC + manual |

- `npm run quality:experimental` registrado en root
- PR tier acotado: `quality:required` + job `e2e-dual-chart`
- Paridad extendida movida a nightly (E2E legacy, evals, golden journey, etc.)

## Gate

`npm run tool:consolidate:verify-phase4` · CI verde
