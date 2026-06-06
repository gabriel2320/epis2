# MF-178 — Checklist signoff M3 (modo oscuro y offline)

**Entorno:** staging local · **Duración:** 10 min automatizado + 5 min visual opcional

## Gates automatizados

```bash
npm run quality:m3-signoff
```

Ejecuta: `theme:validate`, journey tema, tests modo oscuro, banner offline, widgets offline.

## Checklist humano (THEME-07)

| # | Ítem | Auto | Manual |
|---|------|------|--------|
| 1 | Preferencias apariencia — paletas MTB | — | [ ] |
| 2 | Modo oscuro legible en Comando y evolución | ✓ tests | [ ] |
| 3 | Alto contraste — roles clínicos intactos | ✓ theme:validate | [ ] |
| 4 | Banner offline global en shell clínico | ✓ OfflineStatusBanner | [ ] |
| 5 | Widgets `offline` sin crash | ✓ Epis2WidgetSurface | [ ] |
| 6 | `prefers-reduced-motion` respetado | ✓ motion test | [ ] |

## Resultado

| Campo | Valor |
|-------|--------|
| Fecha staging | 2026-06-04 |
| Resultado | **PASS WITH FIXES** — gates auto verdes; confirmación visual opcional |
| Reporte | `reports/epis2-mf-178-m3-human-signoff.md` |
