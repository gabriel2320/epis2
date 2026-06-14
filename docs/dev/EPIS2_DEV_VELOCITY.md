# EPIS2 — Velocidad de desarrollo

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Relacionado:** `EPIS2_AI_ASSISTED_DEV.md` · `CURSOR_PLUGINS_EPIS2.md` · `AGENTS.md`

---

## Principio

**Un objetivo · contexto mínimo · gates del rol · CI completo solo pre-PR.**

La IA acelera; los gates evitan repetir errores de EPIS. El humano aprueba commit/push.

---

## Loop diario (recomendado)

```bash
npm run stack:dev                    # si hace falta Postgres/Ollama
npm run dev:velocity                 # estado + brief (regenera si falta)
# Cursor: /epis2-session + @reports/dev-agent-brief.md
# … trabajo: 1 objetivo, diff mínimo …
npm run dev:velocity:gates           # gates del subagente inferido
npm run dev:agent:close              # checklist + plantilla reporte
```

**Pre-push (opcional):**

```bash
npm run dev:install-hooks            # una vez — hook local check
EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci   # antes de PR grande
```

---

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run quality:fast` | Loop rápido: git + PHI scan + lint/typecheck/vitest tocados + architecture |
| `npm run quality:clinical` | fast + db:validate + gates rol (`dev:velocity:gates --fast`) |
| `npm run quality:full` | check + test + db:validate (pre-PR) |
| `npm run dev:velocity` | Tablero P1, subagente sugerido, estado brief |
| `npm run dev:agent:audit-diff` | Ollama auditor sobre git diff (MF-RAPID-02) |
| `npm run dev:velocity -- --refresh` | Fuerza `dev:session` + banner |
| `npm run dev:velocity -- --tramo J` | Contexto Tramo J |
| `npm run dev:velocity:gates` | Gates del subagente (git + rol) |
| `npm run dev:velocity:gates -- --subagent golden-guardian` | Override rol |
| `npm run dev:velocity:gates -- --fast` | Omite `check` (solo rol + db) |
| `npm run dev:install-hooks` | Pre-push local → `npm run check` |
| `npm run dev:session` | Brief + prompts (detalle en AI_ASSISTED_DEV) |
| `npm run quality:local-ci` | Paridad CI sin E2E (salvo env) |

Variables útiles:

| Variable | Efecto |
|----------|--------|
| `EPIS2_LOCAL_CI_E2E=1` | Incluye Playwright en local-ci |
| `EPIS2_LOCAL_CI_TRAMO_E2E=1` | + `test:e2e:tramo-j` |
| `EPIS2_SKIP_PREPUSH=1` | Omite hook pre-push (emergencia) |
| `EPIS2_DEV_AGENT_TRAMO=J` | Default tramo en velocity |

---

## Gates por rol (automático)

El script `dev:velocity:gates` lee gates de `scripts/dev-agent/subagents.mjs`:

| Subagente | Gates típicos |
|-----------|---------------|
| `layers-integrator` | `layers-integration-gate`, `ui-simplify-gate` |
| `golden-guardian` | `golden-journey`, `test:e2e:ux-g02` |
| `tramo-implementer` | `tramos-hygiene-gate` + tramo E2E si `--tramo` |
| `ollama-clinical` | `ollama-structured-output-gate`, `ai:evals:live` |
| `ci-parity` | `quality:local-ci`, `ci-parity` |
| `gate-runner` | `check`, `test`, `db:validate` |

Siempre al cierre mínimo: **`db:validate`**. **`check`** salvo `--fast`.

---

## Cursor

| Artefacto | Uso |
|-----------|-----|
| `/epis2-session` | Arranque SDEPIS2 |
| `/epis2-close` | Gates estándar + reporte |
| `/epis2-velocity` | Atajo al loop velocity |
| Hook `sessionStart` | `.cursor/hooks/session-start.mjs` — recordatorio brief |
| Skills | `epis2-session`, `epis2-close`, `epis2-ci`, `epis2-velocity` |

Doc MCP: `docs/dev/CURSOR_PLUGINS_EPIS2.md`

---

## Rutinas por tipo de trabajo

### UI / shell

```bash
npm run dev:velocity
npm run dev:velocity:gates -- --subagent layers-integrator
```

### E2E / golden journey

```bash
npm run dev:velocity:gates -- --subagent golden-guardian
npm run test:e2e:golden-v2-admission-discharge   # spec concreto si aplica
```

### Tramo J farmacia (P1 tablero)

```bash
npm run dev:velocity -- --tramo J --refresh
npm run dev:velocity:gates -- --subagent tramo-implementer --tramo J
npm run quality:ux-g02
```

### Pre-PR

```bash
npm run check && npm run test
EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci
```

---

## Qué no automatizar

- Commit/push sin revisión humana  
- Firma o aprobación clínica  
- Import masivo legacy sin manifiesto  
- Correr todos los `quality:*` en cada save  

---

## Métricas de sesión exitosa

1. Alcance SDEPIS2 declarado (Hilo / Tramo / MF-*)
2. Un objetivo cumplido
3. Gates del rol en verde
4. Reporte en `reports/` con próximo paso
5. Tablero actualizado si cerraste un pendiente

---

## Versión de Node (MF-NORM-104)

- **CI usa Node 20** (`.github/workflows/ci.yml`); `.nvmrc` fija `20` para paridad (`nvm use`).
- `engines` acota `>=20 <25`; local con Node 24 funciona, pero ante diferencias de comportamiento reproducir con 20.

## Troubleshooting

| Problema | Acción |
|----------|--------|
| Brief stale (>12h) | `npm run dev:velocity -- --refresh` |
| Gates lentos | `--fast` intra-sesión; CI completo pre-PR |
| pre-push bloquea | Fix `check` o `EPIS2_SKIP_PREPUSH=1` |
| Hook Cursor no inyecta contexto | Usar `/epis2-session` manualmente (bug Cursor conocido) |

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
