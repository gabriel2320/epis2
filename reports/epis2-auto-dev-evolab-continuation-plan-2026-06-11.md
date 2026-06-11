# EPIS2 + Evolab — Plan de continuación 2026-06-11

**Alcance:** auto-dev OpenClaw/Ollama/Evolab (EPIS2) · Sprint 10 metamorphic (Evolab)  
**Estado gates EPIS2:** `npm run check` OK · `npm test` requiere Postgres (`npm run stack:dev`)

---

## 1. Completado en esta oleada

| Área | Entregable | Gate |
|------|------------|------|
| **Evolab S10 R0** | 3 relaciones YAML (MR-01…03), `inheritedContext`, CLI `metamorphic run`, 20+ tests | 517/517 vitest · dry-run smoke OK |
| **EPIS2 auto-dev** | Lock sesión, ledger lib, handoff `--agents auto`, lint orchestrator | `quality:openclaw-cycle-gate` |
| **EPIS2 clínico** | `PatientClinicalSummaryGrid` exactOptionalPropertyTypes | typecheck OK |

Detalle Evolab: `epis2-evolab/reports/evolution/evolab-sprint10-close-2026-06-11.md`

---

## 2. Próximo — Evolab (repo sibling)

### R1 — Estabilización evolve (1 noche)

```bash
cd ../epis2-evolab
npm run evolab:evolve -- --generations 15 --population 5 --budget-minutes 150 --json
```

- Actualizar `evolab-sprint9-gate.md` (objetivo ≥5 nichos MAP-Elites)
- No lanzar evolve en paralelo con PM-03 auto-dev

### R2 — Judge / triage (Sprint 11)

- Golden set 25 findings → `judge-golden-set.jsonl`
- `evolab judge triage` + dedup fingerprint (spec S11)
- Gate macro-F1 ≥80%

### R3 — Dependencias EPIS2 (cuando sandbox libre)

| ID | Repo | Notas |
|----|------|-------|
| R3.1 | EPIS2 | CDR lee `clinical_critical_results` (cierra `cdr_consistency` DEMO-004) |
| R3.2 | GitHub | `EPIS2_CHECKOUT_TOKEN` en GHA smoke |
| MR-03 T3 | Evolab | Cláusula `delta/drafts_count` cuando exista proyección count |

---

## 3. Próximo — EPIS2

1. **`npm run stack:dev`** → desbloquear `npm test` (5433)
2. **Smoke metamorphic vivo** (API :3001): `npm run evolab -- metamorphic run --tag smoke`
3. **PM-03 ciclo autorizado** (opcional):  
   `EPIS2_AUTO_DEV_AUTHORIZED=1 npm run dev:auto:orchestrate -- --commit --push`
4. **Hilo C clínico** — seguir tablero; no mezclar con auto-dev en misma sesión

---

## 4. Orden recomendado

```text
stack:dev + test EPIS2
  → smoke metamorphic vivo (Evolab)
  → R1 evolve nocturno
  → R2 judge (Evolab)
  → R3.1 CDR (EPIS2, sandbox libre)
```

---

## 5. Referencias

- Evolab repair: `epis2-evolab/reports/evolution/evolab-repair-plan-2026-06-11.md`
- Evolab agentes S10–12: `epis2-evolab/reports/evolution/evolab-agent-improvement-plan-2026-06-11.md`
- EPIS2 OpenClaw: `docs/product/EPIS2_OPENCLAW_INTEGRATION.md`
- Plan maestro producto: `reports/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md`
