# EPIS2 — MF-162 Resultados críticos y acuse

**Fecha:** 2026-06-06

## Alcance

Acuse de resultados críticos desde la **bandeja de resultados** (`/espacio/resultados`), no solo desde el tablero de servicio.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `ResultsInboxPage` | Botón «Acusar recibo» en críticos sin acuse |
| API existente | `POST /api/inpatient/critical-results/:id/acknowledge` |
| Auditoría | Evento `critical.acknowledged` verificado en test integración |
| Copy | `copy.results.acknowledgeCritical` / `acknowledgeSuccess` |

## Gates

- `npm run check`
- `npm run test`
- `npm run quality:microphases` → próxima READY: **MF-163**

## Próximo paso

**MF-163** — Enlace orden → resultado en API y UI.
