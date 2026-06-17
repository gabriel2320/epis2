# EPIS2 — MF-TRAMO-D-007/008 + cierre Tramo D

**Fecha:** 2026-06-07

## MF-TRAMO-D-007 — Vías invasivas (IDC 45)

- API `invasiveLines` — CVC, arterial, días en sitio
- UI `epis2-icu-invasive-lines`
- Gate `quality:tramo-d-invasive-gate`

## MF-TRAMO-D-008 — Epicrisis traslado UCI (IDC 50)

- Panel `epis2-icu-discharge-actions` → `/espacio/epicrisis`
- Gate `quality:tramo-d-icu-discharge-gate`
- E2E journey epicrisis en `e2e/tramo-d-icu.spec.ts`

## MF-TRAMO-D-CLOSURE

- `docs/product/EPIS2_TRAMO_D_CLOSURE.md`
- Gate `quality:tramo-d-closure-gate`
- Tramo D ✅ técnico (scaffold UCI demo)

## IDC Active Tramo D

41 · 42 · 43 · 44 · 45 · 50 · 135

## Próximo paso

Signoff clínico · golden journey · pabellón 121–130.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
