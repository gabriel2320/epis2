# EPIS2-THEME-07 — Catálogo visual M3

**Fecha:** 2026-06-05 · **Alcance:** `/desarrollo/catalogo-visual` + PILOT_DEMO_CHECKLIST tema

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | Ruta `/desarrollo/catalogo-visual` (sesión + gate dev) | ✓ |
| 2 | `VisualThemeCatalogPage` — preferencias, paleta, roles, tipografía, elevación, prosa | ✓ |
| 3 | `VITE_ENABLE_VISUAL_THEME_CATALOG` | ✓ |
| 4 | Enlace desde `/dev/ui-catalog` | ✓ |
| 5 | PILOT_DEMO_CHECKLIST pasos 10–13 (tema) | ✓ |
| 6 | Copy `visualThemeCatalog` en design-system | ✓ |

**Sin cambio:** no enlazar catálogo desde UI clínica de producción.

## Uso

```text
http://127.0.0.1:5173/desarrollo/catalogo-visual
```

Requiere sesión demo. En producción: `VITE_ENABLE_VISUAL_THEME_CATALOG=true`.

## Gates

```bash
npm run check
npm run test
npm run db:validate
```

## Próximo paso

**THEME-08** — Snapshot visual automatizado (`theme:snapshot`) en CI opcional; auditoría MUI-G15 catálogos en build piloto.
