# EPIS2 — MF-161 Bandeja mínima de resultados

**Fecha:** 2026-06-06

## Alcance

Microfase **MF-161** — lectura agregada de resultados clínicos por paciente (sin acuse ni writeback).

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `GET /api/patients/:patientId/results-inbox` | Agrega `observations`, `clinical_critical_results` y órdenes `lab`/`imaging` activas |
| `@epis2/contracts` `patientResultsInboxResponseSchema` | Contrato Zod de la bandeja |
| `/espacio/resultados` | UI lectura con `LabObservationsGrid` + listas críticos/órdenes |
| Ficha paciente | Acción rápida «Bandeja de resultados» |
| `resultsInbox.integration.test.ts` | Suite integración DEMO-001/004/005 |

## Gates

- `npm run check`
- `npm run test`
- `npm run db:validate`
- `npm run quality:microphases` → próxima READY: **MF-162**

## Fuera de alcance (MF-162+)

- Acuse de críticos en bandeja (hoy solo en tablero servicio)
- Trazabilidad orden → resultado (MF-163)
- Tendencias dedicadas (MF-164)
- Comandos de resultados (MF-165)

## Riesgos

- Bandeja reutiliza SoT existente; no introduce tabla nueva.
- Acuse sigue desacoplado hasta MF-162.

## Próximo paso

**MF-162** — Resultados críticos y acuse en UI de bandeja + auditoría.
