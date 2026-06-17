# MF-CM-07 — Evals + frases coloquiales ampliadas

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Programa:** PROG-BARRA-COMANDO · **Gate:** `quality:cm-07-evals-gate`

## Alcance

Ampliar cobertura NL coloquial en barra de comando y añadir evals estáticas por intent top-10 + suite `COMMAND_PHRASE_SUITE`.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `colloquial-rules.ts` | +8 reglas (lab, nota, MAR, derivación, imagen, farmacia, alergia, problema) |
| `clinical-phrase-suite-colloquial.ts` | 25 frases coloquiales con expectativas CE-0 |
| `command-intent-top10.ts` | 10 intents × 3 frases — eval ≥90% resolve |
| `assist-route-phrases.ts` | +15 frases long-tail para CE-3 |
| `scripts/ai/evals/run-command-phrase-evals.mjs` | Runner `npm run ai:evals:command` |

## Verificación

```bash
npm run ai:evals:command
npm run quality:cm-07-evals-gate
```

Evals assist live (Ollama/OpenAI) siguen en `ai:evals:live` — no bloquean este MF.

## Riesgos

- Frases muy ambiguas quedan en `needs_clarification` con candidatos guiados (comportamiento deseado).
- Signoff MF-CM-08 requiere E2E `test:e2e:ux-g02` + ≥90% suite demo en piloto.

## Próximo paso

**MF-CM-08** — signoff barra comando inteligente (`test:e2e:ux-g02`).
