# EPIS2 — Fix CI chips role order

**Fecha:** 2026-06-04  
**Alcance:** `packages/command-registry/src/chips.ts` + sync docs modos  
**CI fallido:** [run 27176351429](https://github.com/gabriel2320/epis2/actions/runs/27176351429)

## Problema

`chips.test.ts` — médico sin chip `/evoluciona/` en top 8. Orden solo por `priority` desplazaba `create_evolution_draft` tras nuevos intents.

## Fix

Ordenar chips por índice en `ROLE_COMMAND_INTENTS[role]`, luego `priority`.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test --workspace=@epis2/command-registry` | OK (chips) |

## Riesgos

Ninguno clínico — solo orden UI de sugerencias en paleta de comandos.

## Próximo paso

Commit + push; verificar CI verde; retomar Fase B (Ola 2) o Tramo J según `EPIS2_GLOBAL_DEV_PLAN.md`.
