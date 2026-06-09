# EPIS2 — Guía para agentes (Cursor)

> Los errores de EPIS no son recuerdos: son gates de EPIS2.

## Antes de modificar código

0. **Arranque IA:** `npm run dev:session` → adjuntar `@reports/dev-agent-brief.md` + prompt del subagente primario.
1. Leer `docs/PRODUCT_CANON.md` y `docs/product/PRODUCT_INVARIANTS.md`.
2. Leer **`docs/product/EPIS2_DEV_SYSTEM.md`** — nomenclatura SDEPIS2 (ola · hilo · tramo · microfase · entrega).
3. Leer `docs/product/EPIS2_TABLERO.md` — estado vivo y siguiente paso.
4. Leer `docs/product/EPIS2_WAVE_EXECUTION_CANON.md` — olas, tramos, gates (no cola lineal automática).
5. Ejecutar `npm run quality:microphase-next` — microfase READY o hilo activo del tablero.
6. Leer `docs/quality/MICROPHASE_PROGRAM.md` y `docs/quality/microphase-ledger.json`.
7. Leer `docs/legacy/EPIS_POSTMORTEM.md` si tocas integración o migración.
8. **Declarar alcance** (nivel SDEPIS2 + ID MF-* / Hilo * + archivos permitidos).
9. No importar desde `../Epis` sin entrada en `legacy-import-manifest.json`.

Guía IA: `docs/product/EPIS2_AI_ASSISTED_DEV.md` · cierre `npm run dev:agent:close`.

## Gates obligatorios al cerrar

```bash
npm run stack:dev   # Postgres + Ollama smoke (antes de sesión)
npm run check
npm run test
npm run db:validate
```

Con `dev:ai` activo: `npm run ai:evals:live` (Ollama + blueprints assist).

Semana 1 dev local: `npm run stack:dev` · gates `quality:stack-dev-gate` · `quality:dev-env-gate` · `quality:local-ci`.

Semana 2 scaffold: `docs/product/EPIS2_TRAMO_SCAFFOLD_CANON.md` · `quality:week2-gate` · `test:e2e:tramo-j`.

Semana 3 IA producto: `docs/product/EPIS2_AI_TRAMO_EVALS.md` · `quality:week3-gate` · `ai:evals:tramo-j` · `ai:catalog-assist-smoke` · `test:e2e:week3` (requiere `dev:ai` para evals live).

Semana 4 orquestación: `docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md` · `docs/product/EPIS2_DEV_SUBAGENTS.md` · `quality:week4-gate` · `dev:agent:orchestrate` · `dev:agent:ollama` · `dev:agent:tramo-k` · `ai:evals:closure` · `quality:tramos-clinical-signoff-gate` · Tramo K inventario (`quality:tramo-k-inventory-gate`).

Capas UI + IA asistida: **`npm run dev:session`** → `@reports/dev-agent-brief.md` · cierre **`npm run dev:agent:close`**.

Signoff A–K: `docs/product/EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md` · `quality:tramos-signoff-prep-gate` · `quality:tramos-run-ak-closure-gates`.

Tres modos MD3 (**EPIS2-PM-01** / PROG-THREE-MODES): [`EPIS2_THREE_MODES_DEV_PLAN.md`](docs/product/EPIS2_THREE_MODES_DEV_PLAN.md) · `quality:three-modes-gate` · importar modos desde `apps/web/src/modes/index.js`.

Si la fase lo exige: `npm run quality:golden-journey`.

Reporte en `reports/` con decisiones, riesgos y próximo paso exacto.

## Detenerse si

- `architecture:validate` falla.
- La tarea contradice invariantes o allowlist.
- Se pide segundo Command/Form Registry «temporal».
- Aparece OpenMRS, Carbon o dashboard como home.

## Fases

```text
EPIS2-00 ✓ … EPIS2-12 ✓ · MUI-01…10 ✓ · M3-00…09 ✓ · GO DEMO ✓ · Plan A–G ✓
Planes F+G cerrados: reports/epis2-plan-f-complete.md · reports/epis2-plan-g-complete.md
```

## Memoria legacy

| Documento | Uso |
|-----------|-----|
| `docs/legacy/EPIS_POSTMORTEM.md` | Errores → gates |
| `docs/legacy/EPIS_REJECTED_PATTERNS.md` | Patrones prohibidos |
| `docs/legacy/EPIS_DONOR_ALLOWLIST.md` | Qué puede portarse |
| `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` | Gate producto final |

## Prohibido

OpenMRS, O3, Carbon, overlays EPIS, dashboard home, auto-aprobación, PHI real, carpetas completas desde EPIS.
