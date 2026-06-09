# Plugin EPIS2 para Cursor

Empaqueta skills y plantilla MCP GitHub. Las reglas canon viven en `.cursor/rules/` del repo raíz.

## Instalar

1. Cursor → **Settings → Plugins → Import plugin from folder**
2. Seleccionar esta carpeta (`cursor-plugin/epis2`)
3. Reiniciar Cursor

Documentación completa: [`docs/dev/CURSOR_PLUGINS_EPIS2.md`](../../docs/dev/CURSOR_PLUGINS_EPIS2.md)

## Skills incluidas

| Skill | Uso |
|-------|-----|
| `epis2-session` | Arranque SDEPIS2 + brief |
| `epis2-close` | Gates + reporte |
| `epis2-ci` | Fallos CI/E2E |

Duplicadas también en `.cursor/skills/` para uso inmediato sin importar el plugin.
