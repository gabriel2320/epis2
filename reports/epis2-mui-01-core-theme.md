# EPIS2-MUI-01 — Core, tema y paquete epis2-ui

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

- Paquete `packages/epis2-ui` (`@epis2/epis2-ui`): tema `#1E6FD6`, locale `esES`, primitivos Epis*.
- `Epis2ThemeProvider` movido desde `apps/web`.
- `@epis2/design-system`: solo copy (tema retirado).
- `apps/web`: imports vía `@epis2/epis2-ui`; Login, PowerBar y ErrorState usan primitivos Epis*.
- Validador CI `no-direct-mui-imports.mjs`.

## Próximo paso

**MUI-02:** ruta `/dev/ui-catalog`.
