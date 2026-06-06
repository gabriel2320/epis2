# MF-178 — Signoff M3, modo oscuro y offline

## Alcance
Cierre staging del checklist M3 con gates automatizados y banner offline global.

## Entregables
- `docs/quality/M3_HUMAN_SIGNOFF_CHECKLIST.md`
- `npm run quality:m3-signoff`
- `OfflineStatusBanner` en shell clínico
- Tests: dark theme, offline widgets, banner

## Gates
- `npm run quality:m3-signoff` ✓
- `npm run check` ✓

## Riesgos
Confirmación visual THEME-07 pasos 1 y 3 pendiente de revisor humano en demo presencial.

## Próximo paso
MF-179 ensayo piloto formal.
