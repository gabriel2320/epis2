# MF-IM-06 — Export FHIR Provenance + AIAST

**Programa:** PROG-STRENGTHEN · PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `quality:ai-provenance-gate`

## Alcance

| Entrega | Detalle |
|---------|---------|
| Constantes | `EPIS2_AIAST_SYSTEM`, perfiles `provenance` + `device` |
| Mappers | `toFhirProvenance`, `toFhirAiDevice`, `buildAssistProvenanceExtras` |
| DocumentReference | Tag `AIAST` en `meta.tag` cuando `aiProvenance` presente |
| Gate | `scripts/quality/validate-ai-provenance-gate.mjs` |
| Tests | `packages/fhir-export/src/mappers.test.ts` — AIAST + bundle Provenance/Device |

## Diseño FHIR

- **DocumentReference:** tag `{ system: EPIS2_AIAST_SYSTEM, code: 'AIAST' }` post-approve asistido.
- **Device:** id estable derivado del modelo (`ai-device-{slug}`); `deviceName` con nombre del modelo.
- **Provenance:** target `DocumentReference/{noteId}`; agent → Device; entity con `aiRunId`.

## Evidencia

| Check | Resultado |
|-------|-----------|
| `npm run quality:ai-provenance-gate` | ✓ |
| `npm run check` | ✓ lint + typecheck + architecture:validate |
| Unit tests fhir-export | ✓ AIAST tag + Provenance + Device en bundle |

## Próximo paso

**MF-IM-07** — Model card estático (export).
