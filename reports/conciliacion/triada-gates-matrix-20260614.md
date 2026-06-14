# Matriz de gates — tríada EPIS2 · Evolab · MedRepo

**Fecha:** 2026-06-14 · **Fase:** F5 cerrado

| Gate / comando | Repo | Cuándo (fase plan) | Estado F5 |
|----------------|------|-------------------|-----------|
| `npm run check` | EPIS2 | F2 pre-commit | ✓ S2 |
| `npm run test` | EPIS2 | F2 | ✓ S2 |
| `npm run db:validate` | EPIS2 | F2/F5 | ✓ 45 migraciones |
| `quality:di-context-gate` … `quality:di-signoff-gate` | EPIS2 | F2/F5 | ✓ signoff OK |
| `test:e2e` secretary + dual-chart | EPIS2 | F2 | ✓ 20/20 S2 |
| `npm run architecture:validate` | EPIS2 | F1 | ✓ S1 |
| `npm run evolab:doctor` | EPIS2→Evolab | F0/F3/F5 | ✓ stack up |
| `npm run evolab:smoke` | EPIS2→Evolab | F3/F5 | ✓ 14/14 |
| `npm run dev:evolab:sync` | EPIS2 | F3 | ✓ 2026-06-14 |
| `quality:evolab-bridge-gate` | EPIS2 | F3/F5 | ✓ |
| `npm run check` | Evolab | F3 | ✓ |
| `npm run evolab:validate` | Evolab | F5 | ✓ 590 tests |
| `npm run medrepo:doctor` | MedRepo | F4/F5 | ✓ |
| `npm run check` | MedRepo | F4 | ✓ 75/75 |
| `medrepo:export:verify` | MedRepo | **F6** | SKIP — sin pack |

## Notas F5

- **Evolab:** fix `registry.ts` — hypotheses path desde raíz monorepo (vitest cwd).
- **MedRepo export:** requiere `medrepo:export:epis2` previo; fuera de alcance F5.
- **EPIS2 HEAD docs:** ver `epis2-f5-close-2026-06-14.md`.
