# MF-178 — Signoff M3, modo oscuro y offline

## Alcance
Cierre staging del checklist M3 con gates automatizados y recorrido visual según **normas Material Design 3 documentadas**.

## Entregables
- `docs/quality/M3_VISUAL_SIGNOFF_STEPS.md` — pasos V1–V6 alineados a canon M3
- `docs/quality/M3_HUMAN_SIGNOFF_CHECKLIST.md`
- `npm run quality:m3-signoff` — theme:validate + tests M3 (dark, contrast, motion, roles clínicos)
- `OfflineStatusBanner` en shell clínico

## Normas aplicadas
- `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` — Standard/Expressive, roles, layout
- `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` — 20 reglas
- `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` — 20 prohibidos
- `M3_ANTI_DRIFT_GATES.md` — M3-G01…G15
- `EPIS2_THEME_QA_CHECKLIST.md` — THEME-05…07

## Gates
- `npm run quality:m3-signoff` ✓
- Pasos visuales V1–V6: checklist humano con criterios M3 en `M3_VISUAL_SIGNOFF_STEPS.md`

## Riesgos
V1–V4 requieren confirmación en navegador; criterios de fallo explícitos en norma visual.

## Próximo paso
MF-179 — `npm run quality:pilot-trial` incluye golden journey + signoff M3.
