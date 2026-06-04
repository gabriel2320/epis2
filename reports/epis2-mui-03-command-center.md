# EPIS2-MUI-03 — Login y Centro de Comando

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Wrapper | Ubicación | Uso |
|---------|-----------|-----|
| `EpisCommandBar` | `packages/epis2-ui/src/command/` | Entrada principal del Centro de Comando |
| `EpisCommandSuggestions` | idem | Chips por rol + IA |
| `EpisCommandResult` | idem | Vista previa / aclaración |
| `EpisCommandCenterLayout` | `packages/epis2-ui/src/clinical/` | Shell home `/comando` |
| `EpisAuthScreen` | idem | Login demo |

- Eliminados `PowerBar.tsx` y `CommandSuggestionChips.tsx` de `apps/web`.
- `LoginPage` y `CommandCenterPage` migrados a wrappers `epis2-ui`.
- Catálogo `/dev/ui-catalog` ampliado con sección command-first.
- Orden de build: `command-registry` antes de `epis2-ui`.

## Próximo paso

**MUI-04:** formularios clínicos (`EpisClinicalForm`, `EpisApprovalGate`, `EpisDraftStatus`).
