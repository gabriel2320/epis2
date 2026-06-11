# EPIS2 — Cursor: plugins, MCP y flujo IA

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Relacionado:** `AGENTS.md` · `docs/product/EPIS2_AI_ASSISTED_DEV.md` · `cursor-plugin/epis2/README.md`

---

## Qué está activo en el repo (sin pasos extra)

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| Reglas canon | `.cursor/rules/*.mdc` | Siempre aplicadas en este workspace |
| Skills proyecto | `.cursor/skills/epis2-*` | El agente las descubre por descripción |
| Comandos `/` | `.cursor/commands/epis2-*.md` | Menú `/` en chat → sesión o cierre |
| MCP plantilla | `.cursor/mcp.json` | GitHub vía variable de entorno (ver abajo) |
| Plugin empaquetado | `cursor-plugin/epis2/` | Importar en Cursor o compartir con el equipo |
| Verificación | `npm run cursor:verify` | Comprueba token GitHub y MCP local |
| Velocidad dev | `npm run dev:velocity` | Tablero + brief + subagente · ver [EPIS2_DEV_VELOCITY.md](./EPIS2_DEV_VELOCITY.md) |

---

## Prioridad recomendada

### P1 — Ya en repo (usar hoy)

1. **`npm run dev:velocity`** → arranque rápido; luego `@reports/dev-agent-brief.md` en Cursor.
2. Comando **`/epis2-session`** o skill `epis2-session` para arranque SDEPIS2.
3. Comando **`/epis2-velocity`** para loop completo documentado.
4. Comando **`/epis2-close`** al terminar (gates + reporte).
5. Reglas `.cursor/rules/` (canon, legacy, gates, clínica).

### P2 — Requiere un paso tuyo (5–10 min)

| Integración | Para qué | Cómo activar |
|-------------|----------|--------------|
| **GitHub MCP** | PRs, checks CI, issues sin salir del IDE | Ver [GitHub MCP](#github-mcp) |
| **Notion MCP** | Tablero, tareas, docs de producto | Ver [Notion MCP](#notion-mcp) |
| **Figma MCP** | Tokens M3, pantallas clínicas | Ver [Figma MCP](#figma-mcp) |

### P3 — Opcional / no prioritario

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
npm run dev:session        # genera brief + prompts
npm run cursor:verify      # opcional: MCP GitHub OK
```

En Cursor:

1. `/epis2-session` o `@reports/dev-agent-brief.md`
2. Trabajar con alcance declarado (Hilo / Tramo / MF-*)
3. `/epis2-close` antes de commit (humano aprueba commit/push)

---

## Seguridad

- **Nunca** commitear PAT, tokens Notion/Figma ni `.env`.
- `.cursor/mcp.json` usa `${env:GITHUB_PERSONAL_ACCESS_TOKEN}` — sin secretos en git.
- MCP con acceso a GitHub/Notion = tratar prompts como operaciones sensibles; no pegar PHI real.

---

## Troubleshooting

| Síntoma | Acción |
|---------|--------|
| GitHub MCP rojo | `npm run cursor:verify`; reiniciar Cursor; comprobar PAT y scopes |
| Notion/Figma «needs auth» | Settings → MCP → Connect; OAuth de nuevo |
| Skills no aparecen | Importar plugin o usar `.cursor/skills/` del repo |
| Agente ignora canon | `@AGENTS.md` + `@docs/product/PRODUCT_INVARIANTS.md` |

---

## Referencias externas

- [Cursor MCP docs](https://cursor.com/docs/mcp)
- [Cursor Plugins](https://cursor.com/docs/plugins)
- [GitHub MCP — install Cursor](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md)
