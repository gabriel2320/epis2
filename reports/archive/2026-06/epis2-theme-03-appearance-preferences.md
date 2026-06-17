# EPIS2-THEME-03 — Preferencias de apariencia

**Fecha:** 2026-06-05 · **Alcance:** Página dedicada + selector MTB (Clinical Blue / Calm Teal)

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | Ruta `/preferencias-apariencia` con sesión | ✓ |
| 2 | `EpisAppearancePreferencesPanel` — MTB + densidad + contraste + movimiento | ✓ |
| 3 | `EpisAppearancePreferencesLink` en Comando, shell clínico y tablero | ✓ |
| 4 | `contrast` en `EpisThemePreferences` → `createEpis2Theme` | ✓ |
| 5 | Copy producción en `design-system` | ✓ |
| 6 | Tests panel + página (M3-G14 roles clínicos inmutables) | ✓ |
| 7 | Catálogo dev reutiliza panel con `showLegacyAccents` | ✓ |

**Sin cambio:** roles clínicos protegidos, home, tablero secundario, modo «sistema».

## Gates

```bash
npm run theme:validate
npm run check
npm run test
npm run db:validate
```

## Próximo paso

**THEME-04** — Aplicar `epis2ClinicalProseSx` en blueprints evolución/epicrisis; modo sistema (`prefers-color-scheme`).
