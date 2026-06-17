# MF-AEST-04 — clinical-calm default

**MF:** MF-AEST-04 · **Fecha:** 2026-06-11 · **Programa:** PROG-AESTHETIC-RESET  
**Tramo:** Post PR-AEST-07 · sin lógica clínica nueva

---

## Objetivo

Clinical Calm Premium como **default de producto**: acento MTB `clinical-calm`, canvas `#F7F9FC`, ficha clásica alineada.

---

## Cambios

| Área | Cambio |
|------|--------|
| `material-theme-registry.ts` | `DEFAULT_THEME_ID = clinical-calm` · `DEFAULT_EPIS2_ACCENT = clinicalCalm` |
| `create-epis2-theme.ts` | Default acento → `DEFAULT_EPIS2_ACCENT` |
| `EpisThemePreferences.tsx` | Preferencias nuevas → `clinicalCalm` |
| `chart-modes-colors.ts` | Shell ficha tradicional → canvas calm `#F7F9FC` |
| Ficha CICA | `surfaceProfile="calm"` (ya en TraditionalEhrMode / PatientClinicalSummaryGrid) |
| Papel | `epis2PaperCalmCanvasSx` (sin cambio) |

Usuarios con preferencias guardadas en localStorage conservan su acento.

---

## Gates

```bash
npm run quality:gate -- quality:clinical-calm-default-gate
npm run quality:gate -- quality:aesthetic-reset-close
```

---

## Veredicto

**GO** — default calm activo · regresión tema blue vía preferencias explícitas.

---

## Próximo paso

```text
CICA-SG scoring en código
quality:ux-lab-close + rc4 (stack completo)
```
