# EPIS2 — Checklist QA de temas

## Gates automáticos

```bash
npm run theme:validate
npm run check
npm run test
```

## Tipografía y estética

Ver `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` — checklist de las 20 reglas al final del documento.

## Anti-patrones M3

Ver `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` — 20 prácticas prohibidas; revisar en cada PR de UI.

## THEME-06 (elevación tonal + journey tema)

- [ ] Sin `boxShadow` decorativo en BrandMark, charts, grids, dialogs
- [ ] `npm run test` — `golden-clinical-journey-theme.spec.ts` verde
- [ ] Preferencias sistema + MTB no alteran roles clínicos en journey

## THEME-05 (dark + alto contraste + grid)

- [ ] Modo oscuro — texto legible en Comando y formulario
- [ ] Alto contraste — cuerpo reforzado, roles clínicos intactos
- [ ] `EpisDataGrid` — columnas `type: number` alineadas a la derecha con tabular-nums
- [ ] Grid sin sombra pesada (borde tonal)

## Manual (15 min)

- [ ] Login — Clinical Blue claro, acción principal visible
- [ ] Centro de Comando — Power Bar dominante; tablero secundario
- [ ] Formulario evolución — borrador + IA discreta
- [ ] Modo oscuro — contraste legible
- [ ] Roles crítico / aprobado / borrador — icono + texto
- [ ] Sin «Ollama» en UI clínica
- [ ] `prefers-reduced-motion` respetado

## Por tema (THEME-02+)

- [ ] Clinical Blue claro/oscuro
- [ ] Calm Teal claro/oscuro
- [ ] Alto contraste
