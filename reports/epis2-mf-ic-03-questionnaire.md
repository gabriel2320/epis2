# MF-IC-03 — Questionnaire export piloto (evolution_note)

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-INTEROP-CHILE fase 3  
**Gate:** `npm run quality:interop-chile-gate` ✓ · `npm run test -- packages/fhir-export` ✓

---

## Alcance

Blueprint `evolution_note` (`clinical-forms`) → FHIR Questionnaire con perfil demo `epis2-evolution-note-questionnaire`. Campos S/O/A/P + `encounterDate`. Sin servidor FHIR externo ni envío MINSAL real.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `packages/fhir-export/src/questionnaireExport.ts` | `buildEvolutionNoteQuestionnaire`, `validateEvolutionNoteQuestionnaire`, schema Zod |
| `packages/fhir-export/src/questionnaireExport.test.ts` | Round-trip blueprint · linkIds · tipos date/text · perfil |
| `packages/fhir-export/src/validateExport.ts` | Rama `Questionnaire` en `assertExportClean` |

## Gates

```bash
npm run quality:interop-chile-gate
npm run test -- packages/fhir-export
npm run dev:rapid
```

## Próximo paso

**PROG-STRENGTHEN** ✓ cerrado — [`epis2-prog-strengthen-close-2026.md`](./epis2-prog-strengthen-close-2026.md)

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
