# MF-178 — Checklist signoff M3 (modo oscuro y offline)

**Entorno:** staging local · **Duración:** gates auto ~5 min + recorrido visual M3 ~15 min

**Norma visual canónica:** [`M3_VISUAL_SIGNOFF_STEPS.md`](M3_VISUAL_SIGNOFF_STEPS.md) (Material Design 3 Clinical documentado).

## Gates automatizados

```bash
npm run quality:m3-signoff
```

Ejecuta contra canon M3:

- `theme:validate` — tokens, sombras, anti-deriva tema
- `golden-clinical-journey-theme` — preferencias no alteran roles clínicos
- tests modo oscuro MTB, contraste roles clínicos, motion/reduced-motion
- banner offline + widgets offline

## Checklist humano (pasos V1–V6)

Seguir **`M3_VISUAL_SIGNOFF_STEPS.md`** — resumen:

| Paso | Tema M3 | Manual |
|------|---------|--------|
| V1 | Preferencias MTB instantáneas; M3-G02/G14 | [ ] |
| V2 | Modo oscuro + sistema; M3 Standard en formulario | [ ] |
| V3 | Alto contraste; roles clínicos intactos; M3-G13 | [ ] |
| V4 | Catálogo visual dev; elevación tonal THEME-06 | [ ] |
| V5 | Recorrido Login → Comando → Evolución → Aprobación | [ ] |
| V6 | Offline banner + estados widget | [ ] |

Referencias cruzadas: `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`, `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`, `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md`, `M3_ANTI_DRIFT_GATES.md`.

## Resultado

| Campo | Valor |
|-------|--------|
| Fecha staging | 2026-06-04 |
| Resultado | **PASS WITH FIXES** — gates auto verdes; completar V1–V6 con norma M3 |
| Reporte | `reports/epis2-mf-178-m3-human-signoff.md` |
