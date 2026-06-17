# EPIS2-MUI-02 — Catálogo UI interno

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

- Ruta **`/dev/ui-catalog`** (`UiCatalogPage`): paleta, tipografía, EpisButton, EpisTextField, chips, alertas, diálogo, estados carga/vacío.
- Guard `isUiCatalogEnabled()`: activo en `import.meta.env.DEV`; en producción solo con `VITE_ENABLE_UI_CATALOG=true`; `false` lo desactiva siempre.
- Sin enlaces desde UI clínica; acceso directo URL en desarrollo.
- Tests: `uiCatalogEnv.test.ts`, `UiCatalogPage.test.tsx`.

## Uso

```bash
npm run dev:web
# Navegar a http://127.0.0.1:5173/dev/ui-catalog (sesión demo requerida)
```

## Próximo paso

**MUI-03:** wrappers Command Center (`EpisCommandBar`, `EpisCommandSuggestions`).
