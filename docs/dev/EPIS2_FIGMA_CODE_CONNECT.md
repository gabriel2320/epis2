# EPIS2 — Figma Code Connect + GitHub

**Repo:** [gabriel2320/epis2](https://github.com/gabriel2320/epis2)  
**Objetivo:** Vincular componentes `@epis2/epis2-ui` y pantallas `apps/web` con tu biblioteca Figma (Dev Mode + MCP).

---

## Requisitos

| Requisito | Notas |
|-----------|-------|
| Plan Figma **Organization o Enterprise** | Code Connect no está en Free/Pro solo |
| Asiento **Dev Mode** o Design | Para mapear y ver snippets |
| GitHub.com | Repo `gabriel2320/epis2` — no GHES |
| Node 18+ | CLI `@figma/code-connect` (devDependency del monorepo) |

---

## Paso 1 — Cursor: Figma MCP (cuenta Figma)

1. **Cursor Marketplace** → instalar plugin **Figma**.
2. **Settings → Tools & MCP → Figma** → **Connect** (OAuth).
3. Si expira: en chat, pedir reautenticación o repetir Connect.

Verificación local:

```bash
npm run figma:verify
```

---

## Paso 2 — Token Figma (CLI publish)

1. Figma → **Settings → Security → Personal access tokens**.
2. Crear token con scopes:
   - **Code Connect** → Write
   - **File content** → Read
3. En `.env` local (no commitear):

```bash
FIGMA_ACCESS_TOKEN=figd_...
```

---

## Paso 3 — GitHub en Figma (vincular este repo)

Esto conecta **un archivo biblioteca** de Figma con **un repo** (1 biblioteca = 1 repo).

1. Abre tu **archivo biblioteca EPIS2 MD3** en Figma (componentes publicados).
2. Activa **Dev Mode**.
3. Menú del archivo → **Library** → **Connect components to code**.
4. Icono **⚙ Settings** → **Connect to GitHub**.
5. Autoriza la app Figma en GitHub (`Install and authorize` o `Request access` si no eres admin del org).
6. Selecciona repositorio: **`gabriel2320/epis2`**.
7. Directorios de componentes UI:

```text
packages/epis2-ui/src
apps/web/src/components
```

8. Mapea componentes Figma ↔ rutas de código (autocompletado con rutas del repo).

Docs oficiales: [Connect to your GitHub repository](https://developers.figma.com/docs/code-connect/code-connect-ui-github/)

---

## Paso 4 — Archivos Code Connect en el repo

Configuración en raíz: `figma.config.json`.

Plantillas `.figma.ts` junto al código o en:

```text
packages/epis2-ui/src/**/*.figma.ts
apps/web/src/**/*.figma.ts
```

Crear mapeos con el skill **figma-code-connect** en Cursor (necesita Figma MCP conectado + URL Figma con `node-id`).

Publicar a Figma:

```bash
npm run figma:connect:publish
```

Vista previa sin publicar:

```bash
npm run figma:connect:preview
```

---

## Paso 5 — Verificación

```bash
npm run figma:verify
npm run figma:connect:publish -- --dry-run
```

En Figma Dev Mode, un componente mapeado debe mostrar snippet real de `@epis2/epis2-ui` en lugar de código autogenerado.

---

## Directorios EPIS2 recomendados para mapeo

| Área | Ruta | Ejemplos |
|------|------|----------|
| Primitivos UI | `packages/epis2-ui/src/primitives/` | `EpisButton`, `EpisM3Text` |
| Layout clínico | `packages/epis2-ui/src/forms/` | `EpisClinicalFormRhf` |
| Ficha / resumen | `apps/web/src/components/clinical-summary/` | `EpisClinicalSummaryCard` |
| Modo clásico | `apps/web/src/components/classic-md3/` | Shell, header, dock |
| Comando | `apps/web/src/components/command/` | `EpisUniversalCommandBar` |

Canon estético: [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md)

---

## Seguridad

- No commitear `FIGMA_ACCESS_TOKEN` ni PAT de GitHub.
- `.env` está en `.gitignore`.
- Code Connect publica **metadatos de mapeo**, no PHI ni datos clínicos demo de runtime.

---

## Troubleshooting

| Síntoma | Acción |
|---------|--------|
| No aparece «Connect to GitHub» | Plan sin Code Connect o sin Dev Mode |
| MCP Figma timeout en Cursor | Settings → MCP → Figma → Connect de nuevo |
| `publish` falla 401 | Regenerar token con scopes correctos |
| Un repo por biblioteca | Crear biblioteca Figma separada o usar subcarpetas del monorepo |
| Sin `.figma.ts` | Normal al inicio; mapear primero en UI o generar con figma-code-connect |

---

## Referencias

- [Code Connect UI setup](https://developers.figma.com/docs/code-connect/code-connect-ui-setup/)
- [Code Connect CLI](https://developers.figma.com/docs/code-connect/quickstart-guide/)
- [`CURSOR_PLUGINS_EPIS2.md`](./CURSOR_PLUGINS_EPIS2.md) — MCP Figma en Cursor
