# F5 — Matriz gates tríada (smoke integrado)

**Fecha:** 2026-06-14 · **Plan:** [`epis2-plan-conciliacion-triada-2026-06-14.md`](../epis2-plan-conciliacion-triada-2026-06-14.md)

**Stack:** EPIS2 sandbox up (`stack:dev` + API/web) · Evolab `246fc27` + fix registry local · MedRepo `3e1181b`

---

## Resultado por repo

| Gate | Repo | Resultado | Notas |
|------|------|-----------|-------|
| `quality:evolab-bridge-gate` | EPIS2 | ✓ | puente PM-03 |
| `evolab:doctor` | EPIS2→Evolab | ✓ | API health/ready · DB epis2_evolab · 28 escenarios |
| `evolab:smoke` | EPIS2→Evolab | ✓ | **14/14** passed · 0 human_review |
| `quality:di-signoff-gate` | EPIS2 | ✓ | MF-DI-10 / PROG-DI-CLOSE |
| `db:validate` | EPIS2 | ✓ | 45 migraciones |
| `evolab:validate` | Evolab | ✓ | typecheck · **590/590** tests · boundary OK |
| `medrepo:doctor` | MedRepo | ✓ | Postgres + Ollama OK · Drive no configurado (warning) |
| `medrepo:export:verify` | MedRepo | **SKIP F6** | sin pack exportado — Zod `versionNumber`/`contentSha256` vacíos |

---

## Fix Evolab (F5 hygiene)

Vitest corre desde `apps/evolution-lab`; `readHypotheses()` buscaba `reports/evolution/hypotheses.jsonl` bajo cwd del workspace.

**Fix:** `findEvolabRoot()` en `registry.ts` — sube directorios hasta encontrar `hypotheses.jsonl`.

| Test afectado | Antes | Después |
|---------------|-------|---------|
| `archive-promote-command.test.ts` | hyp-b-rbac no encontrada | ✓ |
| `dev-registration.test.ts` | hyp-c-audit-trail ausente | ✓ |

---

## Criterio F5

| Criterio | Estado |
|----------|--------|
| Gates EPIS2 bridge + DI + db | ✓ |
| Smoke Evolab contra sandbox | ✓ |
| `evolab:validate` verde | ✓ |
| MedRepo doctor OK | ✓ |
| Export verify | Diferido **F6** (plan §F6.3) |

**F5:** ✓ cerrado con export verify documentado como SKIP F6.

---

## Siguiente

1. **F6** — `medrepo:export:epis2` + verify · triage backlog Evolab high
2. **MF-SH-02** — evals intent top-10 (`ai:evals:live`)
3. Push Evolab fix registry + EPIS2 F5 docs
