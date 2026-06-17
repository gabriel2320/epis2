# MF-DUAL-CHART-00 — Scaffold dual ficha

**Fecha:** 2026-06-10 · **Estado:** DONE  
**Gate:** `npm run quality:dual-chart-scaffold-gate`

## Alcance

ADR-002, tokens, ClinicalShell, modos traditional/paper, preview `/dev/chart-modes`, Storybook, E2E opt-in.

## Evidencia

- [x] `docs/adr/ADR-002-dual-chart-modes.md`
- [x] `apps/web/src/components/chart/*`
- [x] `packages/epis2-ui/src/theme/chart-modes-tokens.ts`
- [x] `e2e/dual-chart-modes.spec.ts`
- [x] `npm run quality:dual-chart-scaffold-gate`

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:dual-chart-scaffold-gate` | OK |
| `check` | OK (sesión scaffold) |

## Riesgos

- Fase 1 gate fallará hasta `chartModeSearch.ts` y grid en TraditionalEhrMode — esperado.

## Próximo paso

**MF-DUAL-CHART-01** — `npm run dev:dual-chart:session`
