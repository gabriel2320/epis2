# EPIS2 — Semana 3 IA producto en el loop

**Fecha:** 2026-06-07 · **Tramo activo:** J

---

## Entregables

| Item | Evidencia |
|------|-----------|
| Mapa tramo → blueprints | `scripts/ai-tramo-blueprints.mjs` |
| Evals por tramo | `npm run ai:evals:tramo-j` |
| Métricas p95 + validJson | `reports/ai-evals-live-latest.json` |
| Catálogo + assist smoke | `npm run ai:catalog-assist-smoke` |
| E2E Semana 3 | `npm run test:e2e:week3` |
| Doc | `docs/product/EPIS2_AI_TRAMO_EVALS.md` |

---

## Gates

```bash
npm run dev:ai
npm run quality:week3-gate
npm run ai:evals:tramo-j
npm run ai:catalog-assist-smoke
npm run test:e2e:week3
```

### Verificación (2026-06-07)

| Gate | Resultado |
|------|-----------|
| `quality:week3-gate` | OK |
| `quality:ai-tramo-evals-gate` | OK |
| `quality:ai-catalog-smoke-gate` | OK |
| `npm run check` | OK |
| `database/tests/ai-evals-metrics.test.mjs` | 3/3 OK |
| `npm run db:validate` | OK |
| `ai:catalog-assist-smoke` / `ai:evals:tramo-j` | Requieren `dev:ai` (+ `dev:api` para E2E) en terminal aparte |
| `test:e2e:week3` | Requiere stack web+api levantado |

---

## Próximo paso — Semana 4

Orquestación SDK / evals `EPIS2_AI_EVALS_LIVE=all` en cierre de tramo · signoff clínico A–J · tramo K (171–180 calidad).

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
