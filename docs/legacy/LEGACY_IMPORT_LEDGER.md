# EPIS2 — Ledger de importaciones legacy

Registro humano de cada extracción desde EPIS. Fuente de verdad estructurada: `legacy-import-manifest.json`.

---

## Cómo registrar

| Campo | Descripción |
|-------|-------------|
| ID | `IMP-YYYYMMDD-NNN` |
| Fuente | Ruta en `../Epis` |
| SHA | Commit o blob SHA del donante |
| Destino | Ruta EPIS2 |
| Modo | `rewrite` \| `extract` \| `reference` |
| Motivo | Por qué se importa |
| Responsable | Persona o agente |
| Tests | Archivos de test que cubren el port |

---

## Importaciones

| ID | Fuente | Destino | Modo | Fecha | Tests | Estado |
|----|--------|---------|------|-------|-------|--------|
| IMP-20260605-001 | EPIS `epis-document-intake-ocr` (concepto) | `apps/api/src/clinical/documentIntake.ts` | rewrite | 2026-06-05 | `clinical.integration.test.ts` | hecho |
| IMP-20260605-002 | EPIDOS `epidos-rag-pgvector` (concepto) | `apps/api/src/clinical/documents.ts`, `embeddings.ts`, migración 019 | rewrite | 2026-06-05 | `embeddings.test.ts`, `golden-clinical-journey.api.spec.ts` | hecho |

---

## Referencias externas (sin manifiesto — no runtime)

| ID | Fuente | Destino | Modo | Fecha | Estado |
|----|--------|---------|------|-------|--------|
| REF-20260607-001 | Tesser Lyra export 2026-05-28 | `migration/candidates/lyra/lyra-clinical-catalogs-export/clean/` | reference | 2026-06-07 | archivado |

Ver `migration/candidates/lyra/lyra-clinical-catalogs-export/SOURCE.md`.

---

## Reglas

- No marcar «hecho» sin entrada en manifiesto.
- No borrar filas; usar estado `reverted` si se deshace.
- Revisar allowlist antes de abrir PR.
