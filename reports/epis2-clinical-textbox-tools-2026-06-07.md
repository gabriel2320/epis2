# EPIS2 — MF-CLINICAL-TEXTBOX-TOOLS

**Fecha:** 2026-06-07 (revisión fase 2c)  
**Estado:** Implementación funcional en producción piloto — alergia, evolución SOAP, enfermería.

## Resumen por fase

| Fase | Entregable clave |
|------|------------------|
| 1 | `ClinicalTextBox` plain, mini-toolbar, snippets, paste seguro, gates |
| 2a | `_epis2TextOrigins` en borrador + revisión en `DraftReviewPage` |
| 2b | Tiptap rich (Subjetivo evolución), LanguageTool proxy, Ollama textbox, `?draftId=` |
| 2c | Hidratación borrador idempotente, expansión abreviaturas whitelist, gate assist API |

## Arquitectura (wrapper EPIS2)

```
apps/web/clinicalTextBoxField.tsx  →  @epis2/clinical-productivity/ClinicalTextBox
                                      ├── useClinicalTextBoxState (lógica)
                                      ├── ClinicalTextBoxRichEditor (Tiptap)
                                      ├── languageToolAdapter → /api/clinical/text-spellcheck
                                      └── onRequestAiAssist → /api/ai/assist/textbox
```

**Prohibido:** `@tiptap/*`, `languagetool` directo en `apps/web` (gate).

## Formularios con ClinicalTextBox

| Blueprint | Ruta | Modo |
|-----------|------|------|
| `allergy_entry` | `/espacio/alergia` | plain — `reactionNotes` |
| `evolution_note` | `/espacio/evolucion` | rich — `subjective`; plain — O/A/P |
| `nursing_note` | `/espacio/enfermeria` | plain — notas |

## Reglas clínicas (verificadas)

- `mayAutoSign` → siempre `false`
- IA / paste / snippet → borrador editable + origen trazable
- Medicamentos / exámenes → confirmación humana (`confirmPending`)
- Fármacos sensibles → no expansión automática de abreviaturas

## Gates

| Script | Qué valida |
|--------|------------|
| `quality:clinical-textbox-gate` | Wrapper, Tiptap, trazabilidad, draft resume |
| `quality:clinical-textbox-assist-gate` | API spellcheck + IA textbox + local-ai |
| `quality:clinical-spellcheck-gate` | Sugerencias no invasivas + LT adapter |
| `quality:clinical-snippets-gate` | `.soap` / `.alta` / `.uci` |
| `quality:clinical-ai-text-safety-gate` | Zod, badge IA, confirmación |

## Tests

- `packages/clinical-productivity/src/textbox/clinicalTextBox.test.ts`
- `packages/clinical-productivity/src/textbox/languageToolAdapter.test.ts`

## Config opcional

```env
LANGUAGETOOL_BASE_URL=http://127.0.0.1:8010
OLLAMA_MODEL=qwen3:8b
```

## Riesgos abiertos

| Riesgo | Mitigación actual |
|--------|-------------------|
| Autocompletar términos clínicos inline (dropdown) | Diccionario + expansión abreviaturas en blur; dropdown pendiente |
| Rich editor sin toolbar de formato visible | Intencional MD3 sobrio; formato vía teclado |
| Tests e2e rich + LT docker | Pendiente CI profile |

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
```

## Próximo paso sugerido

1. Dropdown autocomplete clínico (sin saturar UI) en `ClinicalTextBox`.
2. Profile docker LanguageTool en `docker-compose.yml`.
3. Test e2e: evolución rich → guardar borrador → revisar orígenes → aprobar humano.
