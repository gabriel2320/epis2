# EPIS2 — Semana 1 automatización dev local (cerrada)

**Fecha:** 2026-06-07 · **Hardware:** Ryzen 7 · 64 GB · RTX 5070 · Ollama `qwen3:8b`

---

## Checklist Semana 1

| Item | Estado | Evidencia |
|------|--------|-----------|
| `stack:dev` + `.ps1` | ✅ | `npm run stack:dev` |
| `stack:reset` + `.ps1` | ✅ | `npm run stack:reset` |
| `.env` local (no commit) | ✅ | `quality:dev-env-gate` |
| Migrate auto superuser | ✅ | `scripts/db-url.mjs` |
| `ai:evals:live` | ✅ | 4 blueprints demo |
| `quality:stack-dev-gate` | ✅ | Gate Semana 1 |
| `quality:local-ci` | ✅ | check · test · ci-parity · db:validate |
| `quality:golden-journey` | ✅ | 17/17 API + spec |
| `test:e2e:tramo-j` | ✅ | 2/2 Playwright |
| Tramo J | ✅ | `quality:tramo-j-closure-gate` |

---

## Comandos diarios

```powershell
npm run stack:dev
npm run dev:api    # terminal 1
npm run dev:ai     # terminal 2
npm run dev:web    # terminal 3
npm run quality:local-ci
```

Evals Ollama (con `dev:ai`):

```powershell
npm run ai:evals:live
$env:EPIS2_AI_EVALS_LIVE="all"; npm run ai:evals:live
```

---

## Gates sesión

```bash
npm run quality:stack-dev-gate
npm run quality:dev-env-gate
npm run quality:tramo-j-closure-gate
npm run quality:tramos-hygiene-gate
npm run check && npm run test && npm run db:validate
```

---

## Próximo paso — Semana 2

1. Plantilla tramo en `.cursor/rules/80-tramo-scaffold.mdc` (✅ ya presente)
2. E2E por tramo tras scaffold (`test:e2e:tramo-j`)
3. Signoff clínico A–J · piloto 171–180

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
