# MF-CM-01 — Barra NL unificada (censo · ficha · papel)

**Estado:** DONE · **Gate:** `quality:cm-01-barra-gate` + `quality:ux-g02` · **Fecha:** 2026-06-11

## Entregables

- `EpisUniversalCommandBar` — variantes `clinical-chart` + `census-search` con layout Calm unificado
- `ClinicalShell` — barra embedded en capa 3 (traditional + paper)
- `ChartEspacioCommandDock` — censo vs ficha con misma barra
- `episUniversalCommandBarLayoutSx` — radius 16px, minHeight 32px, `surfaceContainerHigh`

## Verificación

```bash
npm run quality:cm-01-barra-gate
npm run quality:ux-g02
npm run test:e2e:ux-g02   # requiere stack dev
```

## Próximo

**MF-CM-02** — Ctrl+K misma resolución NL.
