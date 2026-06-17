# EPIS2 — Cierre sesión MF-CASE (2026-06-13)

**Hilo:** Clinical-Case-Intel (casos clínicos sintéticos)  
**SDEPIS2:** Microfases MF-CASE-09 → MF-CASE-11  
**HEAD EPIS2:** `fa74bb8` · **HEAD epis2-evolab:** `98205fb`

---

## Alcance sesión

| MF | Entrega | Commit |
|----|---------|--------|
| **09** | CI + local-ci gates; catálogo 12 (depresión + ERC); gates dinámicos desde `catalog.json` | `a1accaf` |
| **10** | Matriz assist SIM; golden v6; `ai:evals:sim`; assist `503` si local-ai caído | `da3fb62` |
| **11** | Golden v7 (borrador→aprobación SIM); matriz 13 entradas / 12 casos; `quality:case-intel-closure-gate` | `fa74bb8` |

**Repos**

| Repo | Push | Notas |
|------|------|-------|
| EPIS2 | `origin/master` ✓ | `a1accaf` → `fa74bb8` |
| epis2-evolab | `origin/master` ✓ | `98205fb` — 2 escenarios nuevos (depresión, ERC) |

---

## Pipeline operativo (canon)

```text
scrape → validate → export-fixtures (simCases + 042)
      → export-evolab (YAML + demo-fixtures)
      → db:migrate → verify-sim-seed
      → golden journey v6/v7 + ai:evals:sim (live)
```

**12 casos SIM** (`EPIS2-SIM`), tier `L0_synthetic`, `is_synthetic=true`, IA no aprueba.

---

## Gates cierre

| Gate | Resultado |
|------|-----------|
| `npm run check` | ✓ (pre-push ×3) |
| `npm run quality:case-intel-closure-gate` | ✓ |
| `npm run quality:golden-journey` | ✓ — 19 tests (incl. v6 + v7) |
| `npm run db:validate` | ✓ — 42 migraciones |
| `npm run quality:case-intel-gate` | ✓ (vía closure) |

**CI** (`.github/workflows/ci.yml`): tras `db:migrate` → `quality:case-intel-closure-gate`.

---

## Artefactos clave

| Área | Ruta |
|------|------|
| Canon sesión | `reports/epis2-mf-case-clinical-case-intel.md` |
| Servicio CLI | `services/clinical-case-intel/` |
| Fixtures SIM | `packages/test-fixtures/src/simCases.ts` |
| Matriz assist | `packages/test-fixtures/src/simAssistEvals.ts` |
| Seed SoT | `database/migrations/042_sim_clinical_cases_seed.sql` |
| Golden API | `tests/golden-clinical-journey.api.spec.ts` (v6, v7) |
| Evals live SIM | `scripts/ai-evals-sim-live.mjs` → `reports/ai-evals-sim-latest.json` |

---

## Comandos útiles post-sesión

```bash
npm run quality:case-intel-closure-gate
npm run case-intel:verify-sim-seed
npm run quality:golden-journey
npm run ai:evals:sim          # requiere npm run dev:ai
```

---

## Decisiones

- Tamaño de catálogo **dinámico** desde `catalog.json` (no constantes `10` hardcodeadas).
- `quality:case-intel-gate` unifica catalog + promote + assist; CI usa **closure** como signoff único.
- Assist API: errores de red a local-ai → `503 unavailable` (flujo manual sigue operativo).
- Matriz assist: **≥1 blueprint por caseCode**; DM2 tiene segunda entrada `pharmacy_validation`.

---

## Riesgos / fuera de alcance (sin commit)

Cambios locales **no** incluidos en commits MF-CASE (otras sesiones):

- `local-ai` auth / headers
- `apps/api` security headers, command-registry, print tests
- Trabajo F5/evolve en epis2-evolab (más allá de `98205fb`)

`ai:evals:sim` requiere Ollama + `dev:ai` — no corre en CI (solo gate estático + golden sin Ollama).

---

## Invariantes verificados

- PostgreSQL = SoT; staging ≠ datos aprobados
- Sin scrape HTML PMC/MedEd; solo JSON curado
- IA no aprueba ni firma; `requiresHumanReview: true` en assist
- Sin segundo registry temporal; sin import EPIS sin manifiesto

---

## Próximo paso sugerido

1. **Operador:** `npm run ai:evals:sim` con `dev:ai` activo y archivar `reports/ai-evals-sim-latest.json`.
2. **Producto:** E2E Playwright selección paciente SIM en Centro de Comando (opcional).
3. **Tablero:** retomar hilo activo en `docs/product/EPIS2_TABLERO.md` (programa MF-CASE cerrado MF-01…11).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
