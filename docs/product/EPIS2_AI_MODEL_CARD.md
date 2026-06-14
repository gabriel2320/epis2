# Model Card IA — EPIS2 Assist

**Versión:** `epis2-model-card/2026-06-14`  
**Programa:** PROG-STRENGTHEN · MF-IM-07

## Resumen

EPIS2 expone asistencia clínica local mediante Ollama. Todo borrador generado por IA requiere **aprobación humana explícita** antes de persistirse como dato clínico aprobado. La IA **no aprueba, no firma y no escribe en la fuente de verdad** (PostgreSQL).

## Stack de asistencia

| Componente | Descripción |
|------------|-------------|
| Runtime | Ollama local (`services/local-ai`) |
| Modelo | Identificador Ollama (p. ej. `llama3.2:3b`) |
| Política | Borrador asistido → revisión clínica → approve humano |
| Auto-aprobación | **Prohibida** (invariante producto) |

## Campos de proveniencia exportados

| Campo | Uso |
|-------|-----|
| `model` | Identificador del modelo Ollama usado en la corrida |
| `promptHash` | Hash estable del prompt efectivo (reproducibilidad) |
| `blueprintId` | Blueprint clínico (p. ej. `evolution_note`, `discharge_summary`) |
| `cardVersion` | Versión de esta model card (`epis2-model-card/YYYY-MM-DD`) |
| `aiRunId` | UUID de corrida IA (en Provenance FHIR, no en model card) |

## Política de prompt

- Prompts construidos desde blueprints clínicos versionados.
- Contexto RAG limitado a chunks del expediente del paciente (demo/sintético).
- Guard anti-alucinación: citas obligatorias cuando hay contexto recuperado.
- El hash de prompt (`promptHash`) permite auditar qué instrucción produjo el borrador.

## Export FHIR

En bundles post-approve asistido, `buildAssistProvenanceExtras` incluye:

1. **Device** — modelo IA (`ai-device-{slug}`)
2. **DocumentReference** — esta model card en `text/markdown` (base64)
3. **Provenance** — enlace DocumentReference clínico → Device + entity model card

Identificador de model card: `EPIS2_MODEL_CARD_SYSTEM` + `cardVersion`.

## Invariantes

- Borrador ≠ dato aprobado.
- Tag `AIAST` solo en DocumentReference clínico aprobado con asistencia IA.
- Model card es documentación estática de política; no sustituye trazabilidad Provenance.
