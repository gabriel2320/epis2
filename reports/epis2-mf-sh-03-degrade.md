# MF-SH-03 — Degradación IA (Ollama down)

**Programa:** PROG-STRENGTHEN-2026 / PROG-CORE-HARDEN  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:sh-03-degrade-gate`

## Alcance

- Formulario clínico operativo sin Ollama (`GeneratedClinicalFormPage.degrade.test.tsx`)
- `resolveCommand` determinístico sin `assistHint` (`aiDegradeContract.test.ts`)
- API + local-ai + command submit degradan sin bloquear flujo manual

## Evidencia

| Check | Resultado |
|-------|-----------|
| Formulario manual con Ollama down | ✓ campos + guardar + mensaje IA unavailable |
| resolveCommand sin assistHint | ✓ muestra frases COMMAND_PHRASE_SUITE |
| local-ai `runDraftAssist` unavailable | ✓ mensaje formulario manual |
| API `/api/commands/resolve` sin IA | ✓ resuelve `buscar paciente` |
| `useClinicalCommandSubmit` sin assist | ✓ no invoca `requestDraftAssist` |

## Comandos

```bash
npm run quality:sh-03-degrade-gate
npm run test
npm run quality:strengthen-next
```

## Próximo paso

**MF-SH-04** — registry meta Chile en blueprints · `npm run quality:registry-meta-gate`.
