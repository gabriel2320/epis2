# EPIS2 M3-00…M3-09 — Implementación Material 3 Clinical

**Fecha:** 2026-06-04 · **Estado:** fases 00–09 entregadas (QA humano pendiente de signoff formal)

---

## Resumen por fase

| Fase | Entregable | Artefacto principal |
|------|------------|---------------------|
| M3-00 | Auditoría baseline | `reports/epis2-m3-00-baseline-audit.md` |
| M3-01 | Tokens roles M3 | `theme/color-roles.ts`, `clinical-roles.ts`, `shape.ts`, `motion.ts`, `typography.ts`, `breakpoints.ts` |
| M3-02 | `createEpis2Theme` | `theme/create-epis2-theme.ts`, gate `single-epis2-theme.mjs` |
| M3-03 | Primitivos M3 | `EpisButton` appearances, `EpisM3Text`, `EpisTopAppBar`, `EpisAssistChip`, `EpisFilterChip`, `EpisSnackbar` |
| M3-04 | Login + Comando | `LoginPage`, `CommandCenterPage`, layouts auth/comando, panel paciente colapsable |
| M3-05 | Workspace clínico | `EpisClinicalFormPage` canvas documento |
| M3-06 | Adaptativo | `EpisCommandCenterLayout` breakpoints, `breakpoints.ts` |
| M3-07 | Tablero | `EpisDashboardShell` surfaces M3 |
| M3-08 | Personalización | `EpisThemePreferences` + demo en catálogo UI |
| M3-09 | CI parcial | validador tema único, tests `createEpis2Theme`, checklist QA abajo |

---

## Validación automática

- **175 tests** (incl. `create-epis2-theme.test.ts`)
- **`architecture:validate`** incluye `single-epis2-theme` (M3-G01)

---

## QA humano (M3-09 — signoff pendiente)

Checklist para cierre formal (`reports/epis2-m3-09-qa-signoff.md`):

- [ ] Prueba 3 s: usuario identifica Power Bar en `/comando`
- [ ] Teclado: tab order Login → Comando → formulario
- [ ] Lector de pantalla: alertas críticas con icono + texto
- [ ] Contraste WCAG AA roles clínicos (`critical`, `approved`)
- [ ] `prefers-reduced-motion`: sin animaciones decorative en error/aprobación
- [ ] Bundle analyze (`vite build --analyze`) — presupuesto grid/charts/scheduler

---

## Próximo paso

Signoff QA humano + bundle budget documentado; modo oscuro activable tras QA.
