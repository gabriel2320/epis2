# EPIS2-THEME-05 — Grid numérico, contraste y anti-patrones M3

**Fecha:** 2026-06-05 · **Alcance:** Data Grid + gates dark/alto contraste + canon 20 prohibidos

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `enhanceEpisDataGridColumns` — tabular-nums + align right | ✓ |
| 2 | `EpisDataGrid` — borde tonal, sin `boxShadow` | ✓ |
| 3 | `create-epis2-theme.contrast.test.ts` — dark + high + roles clínicos | ✓ |
| 4 | `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` — 20 prohibidos | ✓ |
| 5 | QA checklist THEME-05 | ✓ |

## Gates

```bash
npm run check
npm run test
npm run db:validate
```

## Riesgos

- Columnas numéricas sin `type: 'number'` no reciben clase automática — usar `type: 'number'` o `align: 'right'`.
- QA manual dark/alto contraste pendiente en entorno real (checklist).

## Próximo paso

**THEME-06** — Auditoría visual de sombras/elevación en primitivos; journey golden con preferencias sistema.
