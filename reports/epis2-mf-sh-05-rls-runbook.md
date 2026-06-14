# MF-SH-05 — RLS staging runbook + EPIS2_RLS_FORCE

**Programa:** PROG-STRENGTHEN-2026 / PROG-CORE-HARDEN  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:sh-05-rls-gate`

## Alcance

- Runbook operador RLS ampliado (`docs/ops/RLS_STAGING_RUNBOOK.md`)
- `EPIS2_RLS_FORCE=1` documentado en `.env.production.example`
- Smoke staging C-4 (dual chart + ops/status) en runbook

## Evidencia

| Check | Resultado |
|-------|-----------|
| Runbook EPIS2_RLS_FORCE + epis2_app | ✓ |
| Smoke C-4 documentado | ✓ `test:e2e:dual-chart` |
| `.env.production.example` | ✓ `RLS_MODE=enforce` + `EPIS2_RLS_FORCE=1` |
| Migración 023 test | ✓ FORCE RLS |
| Fail-closed config | ✓ `config.test.ts` |

## Comandos

```bash
npm run quality:sh-05-rls-gate
npm run quality:strengthen-next
```

## Próximo paso

**MF-SH-06** — control migraciones Chile 035–040 · `db:validate`.
