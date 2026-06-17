# EPIS2 — Semana 4 orquestación avanzada

**Fecha:** 2026-06-07 · **Tramo siguiente:** K (171–180 calidad)

---

## Entregables

| Item | Evidencia |
|------|-----------|
| Evals cierre tramo (all blueprints) | `npm run ai:evals:closure` |
| Prompt agente Tramo K | `npm run dev:agent:tramo-k` |
| Checklist signoff A–J | `docs/product/EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md` |
| Orquestación SDK | `docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md` |
| Inventario Tramo K | `docs/product/EPIS2_TRAMO_K_QUALITY_INVENTORY.md` |

---

## Gates

```bash
npm run quality:week4-gate
npm run quality:tramos-clinical-signoff-gate
npm run quality:tramo-closure-evals-gate
npm run quality:dev-agent-orchestration-gate
npm run quality:tramo-k-inventory-gate
npm run dev:agent:tramo-k
```

Live (requiere `dev:ai`):

```bash
npm run ai:evals:closure
```

---

## Próximo paso

**MF-TRAMO-K-002** — scaffold panel IDC 171 (centinela) siguiendo `EPIS2_TRAMO_SCAFFOLD_CANON.md`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
