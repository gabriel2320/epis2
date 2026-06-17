# EPIS2-THEME-02 — Clinical Blue en runtime

**Fecha:** 2026-06-05  
**Commit:** pendiente  
**Alcance:** Conectar `createEpis2Theme` a esquemas MTB generados.

---

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `m3-palette-from-scheme.ts` — MTB → MUI palette | ✓ |
| 2 | `material-theme-registry.ts` — clinical-blue + calm-teal | ✓ |
| 3 | `createEpis2Theme` usa MTB cuando accent/themeId mapea | ✓ |
| 4 | Default: `clinicalBlue` / `clinical-blue` | ✓ |
| 5 | `cssVarPrefix: 'epis2'` | ✓ |
| 6 | `visual-identity` deriva canvas/power bar de superficies MTB | ✓ |
| 7 | Tests `create-epis2-theme.mtb.test.ts` | ✓ |
| 8 | Preferencias default `clinicalBlue` | ✓ |

**Sin cambio:** roles clínicos protegidos, home, tablero secundario.

---

## Gates

```bash
npm run theme:validate
npm run check
npm run test
npm run db:validate
```

---

## Próximo paso

**THEME-03** — Calm Teal en selector de preferencias + UI «Preferencias de apariencia».
