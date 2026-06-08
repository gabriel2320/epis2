# EPIS2 — MF-CLINICAL-TEXTBOX-TOOLS

**Fecha:** 2026-06-07 (fase 3)  
**Estado:** Implementación funcional en producción piloto — alergia, evolución SOAP, enfermería.

## Resumen por fase

| Fase | Entregable clave |
|------|------------------|
| 1 | `ClinicalTextBox` plain, mini-toolbar, snippets, paste seguro, gates |
| 2a | `_epis2TextOrigins` en borrador + revisión en `DraftReviewPage` |
| 2b | Tiptap rich (Subjetivo evolución), LanguageTool proxy, Ollama textbox, `?draftId=` |
| 2c | Hidratación borrador idempotente, expansión abreviaturas whitelist, gate assist API |
| 3 | Dropdown autocomplete inline, profile docker LanguageTool, E2E evolución→borrador→aprobar |

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

```bash
docker compose --profile languagetool up -d languagetool
npm run test:e2e:clinical-textbox
```

## Riesgos abiertos

| Riesgo | Mitigación actual |
|--------|-------------------|
| Rich editor sin toolbar de formato visible | Intencional MD3 sobrio; formato vía teclado |
| LanguageTool docker en CI | Profile `languagetool` en compose; API usa simulador si no hay URL |
| Autocomplete inline en tokens cortos (<2 chars) | Umbral mínimo evita ruido en cada tecla |

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

## Próximo paso sugerido

1. Persistir `ClinicalTextBoxChangeMeta` completo en API de borrador (más allá de `_epis2TextOrigins`).
2. Autocomplete semántico opcional (embeddings) detrás de flag — sin sustituir diccionario local.
3. CI profile con postgres + languagetool para spellcheck integration tests.
