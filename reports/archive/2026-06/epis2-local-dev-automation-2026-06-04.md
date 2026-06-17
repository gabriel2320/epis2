# EPIS2 — Automatización dev local (2026-06-04)

## Alcance

Implementación del plan hardware local: stack dev, evals Ollama en vivo, regla Cursor tramo scaffold.

---

## Entregables

| Item | Uso |
|------|-----|
| `npm run stack:dev` | Postgres + migrate + ai:enable + ai:smoke |
| `.\scripts\stack-dev.ps1` | Wrapper Windows → `stack:dev` |
| `npm run ai:evals:live` | Evals assist contra Ollama (requiere `dev:ai`) |
| `.cursor/rules/80-tramo-scaffold.mdc` | Patrón tramos IDC en Cursor |

Variables opcionales: `EPIS2_STACK_STRICT`, `EPIS2_STACK_SKIP_MIGRATE`, `EPIS2_AI_EVALS_LIVE=all`, `EPIS2_AI_EVALS_MAX_LATENCY_MS`.

---

## Gates sesión

```bash
npm run stack:dev
npm run check
```

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| `db:migrate` permisos | Auto-derive superuser `epis2` desde `DATABASE_URL` epis2_app |
| BD inconsistente | `npm run stack:reset` |
| `ai:smoke` sin `dev:ai` | Levantar terminal 2 antes de evals live |
| Evals live lentos | Subset default 4 blueprints; `EPIS2_AI_EVALS_LIVE=all` solo en cierre |

---

## Próximo paso

1. `npm run dev:ai` + `npm run ai:evals:live`
2. `EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci` con Postgres migrado

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
