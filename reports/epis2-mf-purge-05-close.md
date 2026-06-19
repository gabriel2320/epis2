# MF-PURGE-05 — Cierre (perímetro legacy `/espacio/*`)

**Fecha:** 2026-06-18 · **Programa:** PROG-PURGE-CICA

## Alcance

Etiquetar entrypoints legacy clínico y extraer helpers PR6 sin borrar rutas `/espacio/*`.

| Archivo | Cambio |
|---------|--------|
| `ClinicalShellLayout.tsx` | `@legacy-runtime` (preexistente) |
| `PatientWorkspacePage.tsx` | `@legacy-runtime` |
| `routes/home.ts` | `@legacy-runtime` en `EPIS2_LEGACY_CLINICAL_HOME` |
| `routes/router.tsx` | `@legacy-runtime` en `clinicalLayoutRoute`; imports desde helper |
| `routes/cicaLegacyRedirects.ts` | **Nuevo** — mapa PR6 + redirects CICA |

## Gates

| Gate | Resultado |
|------|-----------|
| `node scripts/quality/validate-purge-05-gate.mjs` | OK |
| `npm run quality:clinical` | OK |

## Prohibido cumplido

- No se eliminaron rutas `/espacio/*`.
- `quality:cica-no-legacy-shell-gate` sin cambios — `/app` sigue clean room.

## Próximo paso

**CICA-L-01 Censo** — wireframe + reformulación `/app/censo`.
