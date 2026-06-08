# EPIS2 — MF-CLINICAL-TEXTBOX-TOOLS

**Fecha:** 2026-06-07  
**Estado:** ✅ Implementado — fases 1–3 completas, gates verdes, piloto en 3 formularios.

---

## Decisión de arquitectura

| Capa | Elección | Motivo |
|------|----------|--------|
| Wrapper | `@epis2/clinical-productivity/ClinicalTextBox` | Gate prohíbe Tiptap/LT directo en `apps/web` |
| Rich text | Tiptap (`ClinicalTextBoxRichEditor`) | Control total MD3 sobrio; **no** mui-tiptap (evita dependencia extra y toolbar implícita) |
| Plain text | `EpisTextField` multiline | Apariencia MUI MD3 nativa EPIS2 |
| Spellcheck | `LanguageToolAdapter` → API proxy o simulador local | Sugiere, nunca autocorrige |
| Diccionario | `chileClinicalDictionary` + dropdown inline | Abreviaturas, fármacos, unidades con confirmación |
| IA | Ollama/Qwen vía `/api/ai/assist/textbox` | Zod + `requiresHumanReview: true` |
| Estado | `useClinicalTextBoxState` | Lógica compartida plain/rich |
| Trazabilidad | `_epis2TextOrigins` en body borrador | Revisión en `DraftReviewPage` |

```
apps/web/clinicalTextBoxField.tsx
  └── ClinicalTextBox
        ├── ClinicalTextBoxMiniToolbar (≤4 visibles + ⋯)
        ├── ClinicalTextBoxTermDropdown (autocomplete inline)
        ├── ClinicalTextBoxRichEditor | EpisTextField
        ├── useClinicalTextBoxState
        │     ├── pasteSanitizer
        │     ├── clinicalSnippets / clinicalTextCommands
        │     ├── clinicalDictionary / clinicalSpellcheck
        │     └── clinicalAiAssist
        └── draftTextOrigins → GeneratedClinicalFormPage
```

---

## Trazabilidad spec → implementación

| # | Requisito | Implementación |
|---|-----------|----------------|
| 1 | Texto plano / rich controlado | `ClinicalTextBox` `mode: 'plain' \| 'rich'` |
| 2 | Autocompletar términos clínicos | `ClinicalTextBoxTermDropdown` + `autocompleteClinicalTerms` |
| 3 | Corrector ortográfico ES | `runClinicalSpellcheck` + LT adapter + `/api/clinical/text-spellcheck` |
| 4 | Lista blanca abreviaturas | `chileClinicalDictionary` + `isWhitelistedClinicalTerm` |
| 5 | Expansión abreviaturas | `expandWhitelistedAbbreviation` en blur (skip tokens sensibles) |
| 6 | Snippets `.uci` `.alta` `.epicrisis` `.soap` `.iaas` | `CLINICAL_SNIPPETS` + blur/menu ⋯ |
| 7 | Slash `/diagnostico` `/orden` `/examen` `/resumen` | `clinicalTextCommands.ts` + menú ⋯ |
| 8 | Copiar fragmento | `copyFragment` en mini-toolbar |
| 9 | Pegar limpio | `pasteSanitizer` + `handlePaste` |
| 10 | Insertar datos paciente | `buildPatientInsert` + toolbar |
| 11 | Insertar exámenes | `buildLabsInsert` + confirmación |
| 12 | Insertar medicamentos | `buildMedicationInsert` + `confirmPending` |
| 13 | Reformular texto | `onReformulate` → Ollama o heurística |
| 14 | Convertir a SOAP | `onSoapConvert` + Zod `soapStructureSchema` |
| 15 | Detectar omisiones | `onDetectOmissions` + `clinicalOmissionSchema` |
| 16 | IA como sugerencia editable | Badge `textBoxAiBadge`, origen `ai_suggestion`, `mayAutoSign → false` |

---

## Reglas UI (verificadas)

- Mini-toolbar: **4 acciones visibles** + menú `EpisContextMenu` ⋯
- Sin toolbar de formato Tiptap visible (MD3 sobrio)
- Sin pantallas nuevas; integrado en formularios existentes
- Gate falla si toolbar >5 visibles o imports directos en `apps/web`

---

## Reglas clínicas (verificadas)

- `mayAutoSign()` → siempre `false`
- Paste / IA / snippet / OCR → `requiresHumanReview: true`
- Fármacos, dosis, unidades → `confirmPending` o dropdown con confirmación
- Nada pegado ni generado por IA es SoT hasta aprobación humana del borrador

---

## Formularios piloto

| Blueprint | Ruta | Campo(s) | Modo |
|-----------|------|----------|------|
| `allergy_entry` | `/espacio/alergia` | `reactionNotes` | plain |
| `evolution_note` | `/espacio/evolucion` | `subjective` | **rich** |
| `evolution_note` | `/espacio/evolucion` | O/A/P | plain |
| `nursing_note` | `/espacio/enfermeria` | notas | plain |

Primera integración de baja complejidad: **alergia** (`reactionNotes`).

---

## Gates npm

| Script | Valida |
|--------|--------|
| `quality:clinical-textbox-gate` | Wrapper, Tiptap, trazabilidad, draft resume, autocomplete |
| `quality:clinical-textbox-assist-gate` | API spellcheck + IA textbox + local-ai |
| `quality:clinical-spellcheck-gate` | No autocorrección silenciosa + LT docker profile |
| `quality:clinical-snippets-gate` | `.soap` `.alta` `.uci` `.epicrisis` `.iaas` |
| `quality:clinical-ai-text-safety-gate` | Zod, badge IA, confirmación meds, `mayAutoSign` |

---

## Tests

| Archivo | Cobertura |
|---------|-----------|
| `clinicalTextBox.test.ts` | Snippets, paste, spellcheck, slash, IA, origins, tokens |
| `languageToolAdapter.test.ts` | Mapeo LT → sugerencias |
| `e2e/clinical-textbox-evolution-draft.spec.ts` | Rich + paste → borrador → orígenes → aprobar |

---

## Config opcional

```env
LANGUAGETOOL_BASE_URL=http://127.0.0.1:8010
OLLAMA_MODEL=qwen3:8b
```

```bash
docker compose --profile languagetool up -d languagetool
```

---

## Verificación

```bash
npm run quality:clinical-textbox-gate
npm run quality:clinical-textbox-assist-gate
npm run quality:clinical-spellcheck-gate
npm run quality:clinical-snippets-gate
npm run quality:clinical-ai-text-safety-gate
npm run check
npm run db:validate
npx vitest run packages/clinical-productivity/src/textbox/
npm run test:e2e:clinical-textbox
```

---

## Fases entregadas

| Fase | Entregable |
|------|------------|
| 1 | Componente base, mini-toolbar, snippets primarios, paste, gates |
| 2a | `_epis2TextOrigins` + `DraftReviewPage` |
| 2b | Tiptap rich, LT proxy, Ollama assist, `?draftId=` |
| 2c | Hidratación idempotente, expansión abreviaturas, gate assist |
| 3 | Dropdown autocomplete, profile docker LT, E2E golden |
| 4 | `_epis2TextBoxMeta`, revisión enriquecida, LT integration script opcional |
| 5 | Validación Zod meta `_epis2` en API create/patch borrador |

---

## Validación API (fase 5)

`validateDraftBodyEpis2Meta` en `@epis2/clinical-productivity` — usada en `POST /api/drafts` y `PATCH /api/drafts/:id`:

- Rechaza claves `_epis2*` desconocidas
- Valida forma de `_epis2TextOrigins` y `_epis2TextBoxMeta`
- Exige consistencia origen/meta por campo
- Normaliza: meta completa → sincroniza origins

---

## Próximo paso

1. Autocomplete semántico opcional (embeddings) detrás de feature flag.
2. CI job con `docker compose --profile languagetool` + `quality:clinical-spellcheck-integration`.
3. Test integración API: borrador con meta inválida → 400.
