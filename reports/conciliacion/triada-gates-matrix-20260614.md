# Matriz de gates — tríada EPIS2 · Evolab · MedRepo

**Fecha:** 2026-06-14 · **Fase:** F0 inventario

| Gate / comando | Repo | Cuándo (fase plan) | Estado S1 |
|----------------|------|-------------------|-----------|
| `npm run check` | EPIS2 | F2 pre-commit | ☐ pendiente |
| `npm run test` | EPIS2 | F2 (requiere `stack:dev`) | ☐ pendiente |
| `npm run db:validate` | EPIS2 | F2 | ☐ pendiente |
| `quality:di-context-gate` … `quality:di-signoff-gate` | EPIS2 | F2 | ☐ pendiente |
| `test:e2e` secretary + dual-chart | EPIS2 | F2 | ☐ pendiente |
| `npm run architecture:validate` | EPIS2 | F1 post-docs | ✓ OK S1 |
| Gates DI + check + test + db | EPIS2 | S2 F2-A | ✓ OK S2 |
| E2E secretary + dual-chart | EPIS2 | S2 F2-B | ✓ 20/20 |
| `npm run evolab:doctor` | EPIS2→Evolab | F0/F3 | ✓ OK (EPIS2 sandbox down, Evolab DB down — esperado sin stack) |
| `npm run evolab:smoke` | EPIS2→Evolab | F3 | ☐ requiere stack EPIS2 |
| `npm run dev:evolab:sync` | EPIS2 | F3 | ☐ findings stale 2026-06-11 |
| `quality:evolab-bridge-gate` | EPIS2 | F3/F5 | ☐ pendiente |
| `npm run check` | Evolab | F3 push | ☐ pendiente |
| `npm run evolab:validate` | Evolab | F5 | ☐ pendiente |
| `npm run medrepo:doctor` | MedRepo | F4 | ✗ falló (CLI error — ver snapshot) |
| `npm run check` | MedRepo | F4 | ✗ 8 ESLint errors |
| `medrepo:export:verify` | MedRepo | F6 | ☐ pendiente |

## Notas S1

- **Evolab doctor:** guards OK · 28 escenarios · target EPIS2 `/health` ✗ (sandbox apagado) · DB `epis2_evolab` ✗ (migrate pendiente).
- **MedRepo:** sin `.git` · doctor no completó en esta estación.
- **EPIS2 WIP:** 105 archivos porcelain — ver `epis2-wip-manifest-20260614.txt`.
