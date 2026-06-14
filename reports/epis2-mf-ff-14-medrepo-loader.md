# MF-FF-14 — MedRepo knowledge-pack loader

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 5  
**Gate:** `npm run quality:medrepo-consumption-gate` ✓

---

## Alcance

Loader read-only del contrato MedRepo `KnowledgePack` en API (`apps/api/src/ai/**`), sin import `@medrepo/*` ni PHI en repo.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `medrepoKnowledgePack.ts` | Parse Zod, cache, rechazo `humanReviewed=false` o `containsPatientData=true` |
| `fixtures/medrepo-knowledge-pack-demo.json` | Pack sintético demo (metformina/insulina) |
| `routes.ts` | CDS silencioso vía `safetyNotes` en `/api/ai/assist/draft` |
| | `GET /api/ai/medrepo-pack/status` read-only |
| `validate-medrepo-consumption-gate.mjs` | Gate MF-FF-14 |

## Config

- `MEDREPO_KNOWLEDGE_PACK_PATH` — ruta opcional al JSON exportado (revisión humana obligatoria).
- Default: fixture sintético embebido.

## Próximo paso

**MF-FF-15** — Aliases `quality:ui` / `quality:ai`.
