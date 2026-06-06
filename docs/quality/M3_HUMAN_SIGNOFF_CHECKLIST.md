# MF-178 — Checklist signoff M3 (modo oscuro y offline)

**Entorno:** staging local · **Duración:** gates auto ~5 min + recorrido visual M3 ~15 min

**Norma visual canónica:** [`M3_VISUAL_SIGNOFF_STEPS.md`](M3_VISUAL_SIGNOFF_STEPS.md) (Material Design 3 Clinical documentado).

## Gates automatizados + E2E

```bash
npm run quality:m3-human-pilot   # verify-m3-signoff + Playwright V1–V6 + reporte
npm run quality:m3-signoff       # solo gates unitarios / theme
npm run test:e2e e2e/m3-visual-signoff.spec.ts
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
| V1 | Preferencias MTB instantáneas; M3-G02/G14 | [x] E2E |
| V2 | Modo oscuro + sistema; M3 Standard en formulario | [x] E2E |
| V3 | Alto contraste; roles clínicos intactos; M3-G13 | [x] E2E |
| V4 | Catálogo visual dev; elevación tonal THEME-06 | [x] E2E |
| V5 | Recorrido Login → Comando → Evolución → Aprobación | [x] E2E |
| V6 | Offline banner + estados widget | [x] E2E |

Referencias cruzadas: `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`, `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`, `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md`, `M3_ANTI_DRIFT_GATES.md`.

## Resultado

| Campo | Valor |
|-------|--------|
| Fecha staging | 2026-06-06 |
| Resultado | **GO DEMO M3** — E2E + pasada visual con capturas |
| Reporte | `reports/epis2-m3-visual-pass-2026-06-06.md` |
| Capturas | `reports/m3-visual-evidence/2026-06-06/` (16 PNG) |
