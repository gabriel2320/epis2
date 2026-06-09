# EPIS2 — Fix CI E2E MUI / Vite webServer

**Fecha:** 2026-06-04  
**Run fallido:** [27177722988](https://github.com/gabriel2320/epis2/actions/runs/27177722988)

## Problema

Tras fix `.env` (API OK), `test:e2e` timeout: Vite dev no levanta web en Linux CI.

```text
packages/epis2-ui/src/theme/create-epis2-theme.ts
SyntaxError: @mui/material/styles does not provide an export named 'createTheme'
Timed out waiting 120000ms from config.webServer
```

Node ESM en CI no resuelve subpath MUI igual que el bundler de Vite en dev.

## Fix

1. **CI:** `npm run build -w @epis2/web` antes de E2E.
2. **Playwright:** en `CI`, web server = `vite preview` (bundle) en lugar de `vite dev`.
3. **vite.config.ts:** `optimizeDeps.include` MUI/emotion (dev local más estable).

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run build -w @epis2/web` | OK local |
| `npm run check` | pendiente sesión |

## Próximo paso

Push y verificar CI verde en `test:e2e` → `golden-journey`.
