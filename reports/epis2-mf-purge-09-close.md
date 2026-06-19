# MF-PURGE-09 — Cierre (design-agents → lab)

**Fecha:** 2026-06-18 · **Programa:** PROG-PURGE-CICA

## Alcance

Mover agentes Ollama de diseño fuera del árbol clínico productivo y gatear frontera de imports.

| Cambio | Detalle |
|--------|---------|
| `apps/web/src/design-agents/` → `apps/web/src/lab/design-agents/` | Move git |
| `lab/README.md` | Índice lab |
| Imports | `EpisDesignModeProvider`, tests dashboard/modes |
| Gates legacy | Paths actualizados en validate-*-design-agents* |

## Allowlist imports productivos

- `design/EpisDesignModeProvider.tsx`
- `pages/dev/**`
- `lab/**`
- `*.test.ts(x)`

## Gates

| Gate | Resultado |
|------|-----------|
| `node scripts/quality/validate-purge-09-gate.mjs` | OK |
| `npm run quality:fast` | OK |

## Próximo paso

**CICA-L-01 Censo** — wireframe + reformulación `/app/censo` (Tramo 3 reform plan).
