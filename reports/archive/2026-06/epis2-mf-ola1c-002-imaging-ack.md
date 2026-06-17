# MF-OLA1C-002 — Imagenología + acuse crítico

**Fecha:** 2026-06-07  
**Ola:** 1C  
**Estado:** ✅ Cerrada (unit + golden journey + gate estático)

## Alcance

Completar vertical slice órdenes/resultados: comando imagenología + acuse crítico en bandeja.

## Cambios

- `tests/golden-clinical-journey.spec.ts` — `solicitar radiografía de tórax` → `/espacio/imagenologia`
- `e2e/ola1c-results-journey.spec.ts` — imagenología + acuse DEMO-004 PCR
- `scripts/quality/validate-ola1c-journey-gate.mjs`
- `package.json` — `quality:ola1c-journey-gate`
- Matriz IDC 56 — nota journey

## Evidencia

| Gate | Resultado |
|------|-----------|
| ResultsInboxPage.test (ack) | ✅ preexistente |
| resultsInbox.integration.test (MF-162) | ✅ preexistente |
| golden journey | ✅ 17 tests |
| ola1c-journey-gate | ✅ |
| test suite | ✅ 416 |

## Pendiente

- E2E Playwright verde en CI (`test:e2e:ola1c`)
- IDC 56 sigue **Active** (formulario completo; no promover Done sin signoff M3)
