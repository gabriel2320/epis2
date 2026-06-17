# EPIS2 — Cursor plugins y MCP (activación)

**Fecha:** 2026-06-04  
**Alcance:** documentación, plugin local, skills/comandos proyecto, MCP GitHub plantilla

---

## Entregado

| Artefacto | Estado |
|-----------|--------|
| `docs/dev/CURSOR_PLUGINS_EPIS2.md` | Guía completa P1–P3 |
| `.cursor/mcp.json` | GitHub HTTP vía `${env:GITHUB_PERSONAL_ACCESS_TOKEN}` |
| `.cursor/skills/epis2-{session,close,ci}` | Activas en workspace |
| `.cursor/commands/epis2-{session,close}.md` | Slash commands |
| `cursor-plugin/epis2/` | Plugin importable + marketplace manifest |
| `npm run cursor:verify` | Diagnóstico local |
| `AGENTS.md` | Enlace a guía Cursor |

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run cursor:verify` | exit 1 sin PAT (esperado hasta configurar token) |
| `npm run check` | OK |

---

## Qué falta (acción humana)

1. **GitHub MCP:** definir `GITHUB_PERSONAL_ACCESS_TOKEN` (User env o `.env`) y reiniciar Cursor.
2. **Notion / Figma:** Marketplace → Install → Connect OAuth en MCP settings.
3. **Plugin opcional:** Import folder `cursor-plugin/epis2` si quieres empaquetado explícito (skills ya están en `.cursor/skills/`).

---

## Riesgos

- PAT en git: mitigado con env var + `.gitignore` para `mcp.local.json`.
- Notion/Figma sin auth: tools no disponibles hasta Connect.

---

## Próximo paso

Usuario: completar P2 en `docs/dev/CURSOR_PLUGINS_EPIS2.md` (GitHub PAT + auth Notion/Figma).  
Producto (sin cambio Cursor): PEND-001 Tramo J farmacia / PEND-003 E2E admission drift.
