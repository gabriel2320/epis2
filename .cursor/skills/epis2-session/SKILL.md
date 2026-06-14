---
name: epis2-session
description: >-
  Arranque de sesión EPIS2 (SDEPIS2): AGENT_CONTEXT_MINIMAL, dev:velocity,
  STRENGTHEN ledger, MF-RAPID. Usar al empezar trabajo en el repo EPIS2.
---

# EPIS2 — Arranque de sesión

## Contexto mínimo (obligatorio)

1. `@docs/AGENT_CONTEXT_MINIMAL.md` — reglas + gates por alcance
2. `npm run dev:velocity` — banner vivo (HEAD, STRENGTHEN, subagente)
3. Si el brief está stale: `npm run dev:session`
4. `@reports/dev-agent-brief.md` + prompt del subagente primario

## Declarar alcance

- Nivel SDEPIS2 (Ola / Hilo / Tramo / Microfase MF-*)
- Archivos permitidos y prohibidos
- Gates de cierre previstos

**No** iniciar la MF READY de `quality:strengthen-next` salvo petición explícita.

## Loop iteración (MF-RAPID)

```bash
npm run dev:rapid              # post-cambio
npm run quality:clinical       # cierre MF clínico
npm run quality:full           # pre-PR
```

## Estado programa

```bash
npm run quality:strengthen-next
```

Guía: `docs/dev/EPIS2_DEV_VELOCITY.md` · `docs/product/EPIS2_AI_ASSISTED_DEV.md`
