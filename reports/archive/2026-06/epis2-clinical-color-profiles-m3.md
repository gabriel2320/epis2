# EPIS2 — 6 perfiles de color MTB clínico

**Fecha:** 2026-06-07 · **Alcance:** Tema visual + documentación MD3 EHR

## Entregado

| Artefacto | Contenido |
|-----------|-----------|
| 4 JSON MTB nuevos | `slate-professional`, `sage-clinical`, `ocean-depth`, `warm-linen` |
| 6 perfiles totales | + `clinical-blue`, `calm-teal` |
| UI | `/preferencias-apariencia` — 6 chips instantáneos |
| Canon diseño | `docs/design/EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md` |

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run theme:validate` | OK |
| `npm run check` | OK |
| Tests tema + preferencias | 39/39 OK |

## Riesgos

- Snapshots MTB actualizados — revisar diff en PR.
- Perfiles legacy (`calmGreen`, `soberViolet`, `neutral`) solo en catálogo dev.

## Próximo paso

Pasada visual V1 con los 6 perfiles (`npm run quality:m3-visual-pass` ampliado) o impresión clínica.
