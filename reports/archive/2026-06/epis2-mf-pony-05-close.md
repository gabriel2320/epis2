# MF-PONY-05 — Cierre (lista clínica + búsqueda unificada)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Un componente de lista clínica compartido entre CICA (buscar/censo) y legacy `/espacio/buscar-paciente`.

## Cambios

| Acción | Detalle |
|--------|---------|
| epis2-ui | `EpisClinicalList` con perfiles `default` \| `cica` |
| CICA | `CicaClinicalList` → alias sobre `EpisClinicalList` |
| Web | `patientListRowPresentation.ts` — `patientListRowMeta` compartido |
| Legacy | `PatientSearchResults` delega en `EpisClinicalList` |
| Gate | `validate-patient-search-layout-gate` verifica unificación |
| Tests | `EpisClinicalList.test.tsx`, `patientListRowPresentation.test.ts` |

## Qué evitamos construir

- Segunda implementación de filas búsqueda/censo
- Duplicar `resultMeta` / `patientListRowMeta` en componentes UI

## Gates

| Gate | Resultado |
|------|-----------|
| `validate-patient-search-layout-gate` | OK |
| `validate-cica-clean-room-close-gate` | OK |
| `quality:fast` | OK |

## Riesgos

Medio — testIds legacy (`epis2-patient-search-*`) y CICA (`cica-*`) preservados por perfil.

## Próximo paso

**MF-PONY-06** — registry-driven CICA routes.
