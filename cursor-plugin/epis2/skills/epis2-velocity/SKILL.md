---
name: epis2-velocity
description: >-
  Flujo de velocidad EPIS2: dev:velocity, gates por rol, pre-push opcional.
  Usar al planificar sesión eficiente o cerrar con gates mínimos del subagente.
---

# EPIS2 — Velocidad de desarrollo

Guía completa: `docs/dev/EPIS2_DEV_VELOCITY.md`

## Arranque

```bash
npm run stack:dev          # si hace falta
npm run dev:velocity       # banner + brief
```

Cursor: `/epis2-session` + `@reports/dev-agent-brief.md`

## Durante

- Un objetivo · diff mínimo · declarar alcance SDEPIS2
- No correr CI completo en cada cambio

## Cierre

```bash
npm run dev:velocity:gates -- --subagent <rol>   # inferido si omites
npm run dev:agent:close
```

Pre-PR: `EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci`

## Subagentes comunes

| Señal | `--subagent` |
|-------|--------------|
| UI / web | `layers-integrator` |
| E2E / golden | `golden-guardian` |
| Tramo clínico | `tramo-implementer` + `--tramo J` |
| CI / scripts quality | `ci-parity` |
