# EPIS2 — Cursor: plugins, MCP y flujo IA

**Versión:** 1.3 · **Fecha:** 2026-06-14 · **MF-TOOL-02…06**  
**Relacionado:** `AGENTS.md` · `docs/product/EPIS2_AI_ASSISTED_DEV.md` · `cursor-plugin/epis2/README.md`

---

## Qué está activo en el repo (sin pasos extra)

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| Reglas canon | `.cursor/rules/*.mdc` | Siempre aplicadas en este workspace |
| Skills proyecto | `.cursor/skills/epis2-*` | El agente las descubre por descripción |
| Comandos `/` | `.cursor/commands/epis2-*.md` | Menú `/` en chat → sesión o cierre |
| MCP plantilla | `.cursor/mcp.json` | GitHub, Figma, Context7, Playwright, Postgres RO |
| Plugin empaquetado | `cursor-plugin/epis2/` | Importar en Cursor o compartir con el equipo |
| Verificación | `npm run cursor:verify` | Comprueba MCPs, PAT GitHub y URL Postgres RO |
| Rol DB MCP | `database/migrations/045_epis2_mcp_ro.sql` | `epis2_mcp_ro` — solo SELECT (aplicar con `db:migrate`) |
| Velocidad dev | `npm run dev:velocity` | Tablero + brief + subagente · ver [EPIS2_DEV_VELOCITY.md](./EPIS2_DEV_VELOCITY.md) |

---

## Prioridad recomendada

### P1 — Ya en repo (usar hoy)

1. **`npm run dev:velocity`** → arranque rápido; luego `@reports/dev-agent-brief.md` en Cursor.
2. Comando **`/epis2-session`** o skill `epis2-session` para arranque SDEPIS2.
3. Comando **`/epis2-velocity`** para loop completo documentado.
4. Comando **`/epis2-close`** al terminar (gates + reporte).
5. Reglas `.cursor/rules/` (canon, legacy, gates, clínica).

### P0 — MCPs en `.cursor/mcp.json` (MF-TOOL-02)

| Servidor | Para qué | Activación |
|----------|----------|------------|
| **github** | PRs, CI, issues (tríada repos) | [GitHub MCP](#github-mcp) |
| **figma-desktop** | M3, pantallas clínicas, FigJam | [Figma MCP](#figma-mcp) |
| **context7** | Docs actuales React/Fastify/Playwright | Reiniciar Cursor (npx automático) |
| **playwright** | Debug E2E tramos/olas desde chat | `npm run test:e2e:install` + reiniciar Cursor |
| **postgres-readonly** | Schema clínico, FKs, migraciones | [Postgres MCP](#postgres-mcp-read-only) |

### P1 — Marketplace OAuth + GitHub App (5–15 min)

| Integración | Para qué | Cómo activar |
|-------------|----------|--------------|
| **Notion MCP** | Tablero, tareas, docs de producto | Ver [Notion MCP](#notion-mcp) |
| **CodeRabbit** | Review automático en PRs GitHub | Ver [CodeRabbit](#coderabbit) |
| **Cursor Bugbot** | Review local pre-commit | Ver [Bugbot](#cursor-bugbot) |
| **OTel collector** | Trazas HTTP local (MF-TOOL-05) | Ver [Observabilidad](./EPIS2_OBSERVABILITY_OTEL.md) |

### P2 — Opcional / no prioritario

| Integración | Notas |
|-------------|-------|
| **Datadog MCP** | Solo si hay org Datadog; hoy suele fallar sin credenciales |
| **Hugging Face MCP** | Útil para ML genérico, no para flujo clínico EPIS2 |
| **GitKraken/GitLens MCP** | Ya disponible si tienes la extensión |

---

## GitHub MCP

El paquete npm `@modelcontextprotocol/server-github` está **obsoleto**. Usar el servidor oficial (HTTP o Docker).

### Opción A — HTTP (recomendada)

1. Crear [Personal Access Token](https://github.com/settings/personal-access-tokens/new) con scopes: `repo`, `read:org`, `workflow` (ajustar según necesidad).
2. En Windows (PowerShell, sesión persistente):

   ```powershell
   [System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'ghp_...', 'User')
   ```

   O añadir a tu `.env` local (no commitear):

   ```bash
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
   ```

3. El repo ya incluye `.cursor/mcp.json` con `${env:GITHUB_PERSONAL_ACCESS_TOKEN}`.
4. **Reiniciar Cursor** por completo.
5. Verificar: `npm run cursor:verify` y en chat: *«Lista mis repos de GitHub»*.

### Opción B — Docker local

Si prefieres contenedor, copia `.cursor/mcp.json.example` → `.cursor/mcp.local.json` (gitignored) con el bloque `docker` del example y reinicia Cursor.

### Deep link (alternativa)

[Instalar GitHub MCP en Cursor](https://cursor.com/en/install-mcp?name=github&config=eyJ1cmwiOiJodHRwczovL2FwaS5naXRodWJjb3BpbG90LmNvbS9tY3AvIiwiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyIFlPVVJfR0lUSFVCX1BBVCJ9fQ%3D%3D) y sustituir el PAT en Settings → Tools & Integrations → MCP.

---

## Notion MCP

1. **Cursor Marketplace** → buscar «Notion» → Install.
2. **Settings → Tools & Integrations → MCP** → servidor `notion` → **Connect** / autenticar OAuth.
3. En chat, si pide auth: decir *«autentica Notion MCP»* o usar el botón Connect en ajustes.
4. Uso típico EPIS2:
   - Sincronizar tareas con `EPIS2_TABLERO.md`
   - Buscar specs: `/notion-search` o skills del plugin Notion
   - Crear filas en base de tareas del proyecto

**Permisos:** conectar solo las páginas/bases que el agente deba leer (principio mínimo privilegio).

**Checklist MF-TOOL-03:**

1. Marketplace → Notion → Install → OAuth en Settings → MCP.
2. Conectar base de tareas EPIS2 + página tablero (mínimo privilegio).
3. Probar: *«Busca en Notion tareas PROG-DI pendientes»*.
4. Al cerrar sesión: crear/actualizar fila con MF-* y gate ejecutado.

---

## CodeRabbit

Review automático en PRs de `gabriel2320/epis2` (y luego evolab / medrepo).

### Setup (MF-TOOL-04)

1. [Instalar CodeRabbit](https://coderabbit.ai/) en GitHub → org `gabriel2320` → repo `epis2`.
2. El repo incluye `.coderabbit.yaml` con instrucciones por path clínico.
3. No activar auto-merge; el humano aprueba push.

**Uso:** abrir PR → CodeRabbit comenta → corregir → gates EPIS2 (`npm run check`, E2E) siguen siendo obligatorios.

---

## Cursor Bugbot

Review local antes de commit (complementa gates, no los reemplaza).

1. Cursor → **Settings → Bugbot** → habilitar para workspace EPIS2.
2. Antes de `/epis2-close`: pedir review con skill `review-bugbot` o comando Bugbot.
3. Enfocar en: RLS, PHI en logs, borradores vs aprobados, regresiones E2E.

---

## Figma MCP

1. **Cursor Marketplace** → «Figma» → Install.
2. Autenticar en MCP settings (OAuth Figma).
3. Uso típico EPIS2:
   - Revisar componentes M3 vs `packages/epis2-ui`
   - Generar diagramas de flujo clínico (FigJam) para tramos
   - **No** copiar diseño a código sin pasar por canon UI (`50-material-ui.mdc`)

Skills Figma del marketplace: `figma-use`, `figma-generate-design` (solo cuando pidas explícitamente diseño en Figma).

### Code Connect + GitHub (este repo)

Para vincular `gabriel2320/epis2` con tu biblioteca Figma:

1. Completar OAuth Figma MCP (arriba).
2. En Figma: Dev Mode → Library → **Connect components to code** → ⚙ → **Connect to GitHub** → repo `epis2`.
3. Token CLI en `.env`: `FIGMA_ACCESS_TOKEN=figd_...` (scopes Code Connect Write + File Read).
4. Verificar: `npm run figma:verify` · publicar: `npm run figma:connect:publish`.

Guía completa: [`EPIS2_FIGMA_CODE_CONNECT.md`](./EPIS2_FIGMA_CODE_CONNECT.md)

---

## Context7 MCP

Incluido en `.cursor/mcp.json`. Arranca vía `npx @upstash/context7-mcp` al conectar Cursor.

**Uso típico EPIS2:** pedir al agente documentación versionada de React 19, Fastify, Zod, Playwright o OpenTelemetry antes de tocar API/clinical-domain.

**Verificación:** en chat — *«Usa Context7: API de @playwright/test fixtures»*.

No requiere API key en la configuración por defecto del repo.

---

## Playwright MCP

Incluido en `.cursor/mcp.json`. Complementa la suite `e2e/` (CI sigue siendo fuente de verdad).

1. `npm run test:e2e:install` — browsers Chromium.
2. Reiniciar Cursor.
3. Uso típico: depurar `test:e2e:dual-chart`, capturas de three-modes, reproducir fallos CI.

**No sustituye** `npm run test:e2e` en gates de cierre.

---

## Postgres MCP (read-only)

Rol dedicado **`epis2_mcp_ro`** — solo `SELECT`. Nunca usar `DATABASE_URL` de la app (`epis2_app` escribe).

### Setup

```bash
npm run stack:up
npm run db:migrate    # aplica 045_epis2_mcp_ro.sql
```

En `.env` local (no commitear):

```bash
EPIS2_MCP_DATABASE_URL=postgresql://epis2_mcp_ro:epis2@127.0.0.1:5433/epis2
```

Reiniciar Cursor. Verificar: `npm run cursor:verify`.

**Uso típico:** *«Describe la tabla approvals y sus FKs»*, *«¿Qué columnas tiene ai_runs?»*.

**Seguridad:** no pegar PHI en prompts; el rol respeta RLS (`NOBYPASSRLS`). En staging/prod usar password distinto al dev.

---

## Langfuse (MF-TOOL-06)

Trazas LLM opt-in para `services/local-ai`. **Off por defecto** — aislado del SoT clínico (Postgres EPIS2).

### Setup

```bash
npm run stack:langfuse
# UI: http://127.0.0.1:3100 · dev@epis2.local / epis2-dev-only
```

En `.env` local:

```bash
LANGFUSE_ENABLED=true
LANGFUSE_BASE_URL=http://127.0.0.1:3100
LANGFUSE_PUBLIC_KEY=lf_pk_epis2_dev_local
LANGFUSE_SECRET_KEY=lf_sk_epis2_dev_local
LANGFUSE_TRACE_INPUT=false   # true solo evals L0_synthetic
```

Reiniciar `npm run dev:ai`. Cada inferencia registra trace `ai.inference` → generation `structured-json`.

**Política PHI:** con `LANGFUSE_TRACE_INPUT=false` (default), prompt/output se redactan por tamaño. Solo activar input completo en evals sintéticos (`L0_synthetic`).

Detalle técnico: `services/local-ai/src/langfuseTrace.ts` · hook en `inference/router.ts`.

---

## Plugin EPIS2 (`cursor-plugin/epis2`)

Empaqueta skills, plantilla MCP y referencia a reglas del repo.

### Instalar en Cursor (local)

1. **Settings → Plugins → Import plugin from folder**
2. Elegir: `cursor-plugin/epis2` (ruta completa del clone)
3. Reiniciar Cursor si no aparecen skills/comandos

### Instalar desde Git (equipo)

1. Settings → Plugins → Add Git repository  
2. URL del repo EPIS2, ruta del plugin: `cursor-plugin/epis2`  
3. Opcional: Enable Auto Refresh en la rama `master`

### Contenido del plugin

- `skills/epis2-session` — arranque SDEPIS2 + brief
- `skills/epis2-close` — gates de cierre + reporte
- `skills/epis2-ci` — investigar fallo CI / E2E
- `mcp.json` — plantilla GitHub (misma que `.cursor/mcp.json`)

Las reglas canon siguen en `.cursor/rules/` del repo (no duplicadas en el plugin).

---

## Comandos slash del proyecto

| Comando | Acción |
|---------|--------|
| `/epis2-session` | `dev:session`, leer tablero, declarar alcance SDEPIS2 |
| `/epis2-close` | `check`, `test`, `db:validate`, reporte en `reports/` |

---

## Flujo diario recomendado

```bash
npm run stack:dev          # si hace falta Postgres/Ollama
npm run db:migrate         # incluye rol epis2_mcp_ro (045)
npm run stack:observability  # opcional — OTel collector :4318
npm run dev:session        # genera brief + prompts
npm run cursor:verify      # MCPs + PAT + EPIS2_MCP_DATABASE_URL
```

En Cursor:

1. `/epis2-session` o `@reports/dev-agent-brief.md`
2. Trabajar con alcance declarado (Hilo / Tramo / MF-*)
3. `/epis2-close` antes de commit (humano aprueba commit/push)

---

## Seguridad

- **Nunca** commitear PAT, tokens Notion/Figma ni `.env`.
- `.cursor/mcp.json` usa `${env:...}` — sin secretos en git.
- Postgres MCP: rol **`epis2_mcp_ro`** (solo SELECT); migración `045_epis2_mcp_ro.sql`.
- MCP con acceso a GitHub/Notion/Postgres = tratar prompts como operaciones sensibles; no pegar PHI real.

---

## Troubleshooting

| Síntoma | Acción |
|---------|--------|
| GitHub MCP rojo | `npm run cursor:verify`; reiniciar Cursor; comprobar PAT y scopes |
| Postgres MCP rojo | `db:migrate`; `EPIS2_MCP_DATABASE_URL` en `.env`; reiniciar Cursor |
| Playwright MCP falla | `npm run test:e2e:install`; comprobar Node ≥20 |
| OTel sin spans | `npm run stack:observability`; `OTEL_ENABLED=true`; `docker logs epis2-otel-collector` |
| CodeRabbit silencioso | Verificar app instalada en GitHub; `.coderabbit.yaml` en rama del PR |
| Notion/Figma «needs auth» | Settings → MCP → Connect; OAuth de nuevo |
| Skills no aparecen | Importar plugin o usar `.cursor/skills/` del repo |
| Agente ignora canon | `@AGENTS.md` + `@docs/product/PRODUCT_INVARIANTS.md` |

---

## Referencias externas

- [Cursor MCP docs](https://cursor.com/docs/mcp)
- [Cursor Plugins](https://cursor.com/docs/plugins)
- [GitHub MCP — install Cursor](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md)
