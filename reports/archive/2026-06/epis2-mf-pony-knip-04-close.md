# MF-KNIP-04 — Cierre (unlisted dependencies)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Declarar en package.json las deps usadas pero no listadas; ajustar `knip.json` para scripts/tests y opcionales.

## package.json

| Workspace | Dep añadida |
|-----------|-------------|
| Root | `zod`, `drizzle-orm`, `drizzle-kit` |
| `@epis2/web` | `zod` (dev — design-agents schemas) |
| `@epis2/epis2-ui` | `@testing-library/user-event` (dev — tests) |

## knip.json

- Entry/project `tests/**` en workspace root
- `ignoreDependencies`: `@cursor/sdk` (import dinámico opcional en dev-agent)
- `ignoreBinaries`: `taskkill`, `ollama`, `vite` (scripts QA/dev)

## Knip post-MF

- **0** unlisted dependencies (antes 13)
- Sin regresión en unused files / unused deps / duplicates

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK |
| `npx knip --reporter compact` | sin unlisted deps |

## Próximo paso

**MF-PONY-GATE-01** o cierre PR `chore/pony-knip-trim-00`.
