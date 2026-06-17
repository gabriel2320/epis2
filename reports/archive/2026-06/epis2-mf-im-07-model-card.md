# MF-IM-07 — Model card estático (export)

**Programa:** PROG-STRENGTHEN · PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `quality:ai-provenance-gate`

## Alcance

| Entrega | Detalle |
|---------|---------|
| Canon | `docs/product/EPIS2_AI_MODEL_CARD.md` — política assist en español |
| Constantes | `EPIS2_MODEL_CARD_SYSTEM`, `EPIS2_MODEL_CARD_VERSION` |
| Mappers | `toFhirAiModelCardDocumentReference`, `buildAiModelCardMarkdown` |
| Bundle | `buildAssistProvenanceExtras` incluye model card + Provenance entity derivation |
| Perfil | `text/markdown` permitido en DocumentReference mínimo |
| Gate | `validate-ai-provenance-gate.mjs` extendido IM-07 |
| Tests | Round-trip base64, bundle con model card, assertExportClean |

## Diseño FHIR

- **DocumentReference (model card):** id `epis2-ai-model-card-{slug}`; attachment `text/markdown` base64; identifier con `cardVersion`.
- **Provenance:** entity adicional `derivation` → model card DocumentReference.
- **Orden extras:** Device → model card → Provenance.

## Evidencia

| Check | Resultado |
|-------|-----------|
| `npm run quality:ai-provenance-gate` | ✓ (10 tests) |
| `npm run check` | ✓ lint + typecheck + architecture:validate |
| Unit tests fhir-export | ✓ model card + bundle round-trip |

## Próximo paso

**MF-IM-08** — Anti feedback-loop (policy assist).
