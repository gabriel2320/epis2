# EPIS2 — Fase C Lote 3 (timeline invocable + cierre Ola 3)

**Fecha:** 2026-06-04  
**Alcance:** Línea de tiempo invocable desde ficha compacta; foco en historial; RAD patient-chart IDC 21–29.

## Entregables

| Artefacto | Cambio |
|-----------|--------|
| `PatientRecentActivityBlock.tsx` | CTA `epis2-ficha-open-timeline` |
| `PatientLongitudinalPanel.tsx` | `focusSection` timeline/documentos + scroll |
| `PatientWorkspacePage.tsx` | `openHistory(focus)` unifica documentos y timeline |
| `radScreenRegistry.ts` | Notas `patient-chart` IDC 21–29 |
| `validate-ola3-timeline-gate.mjs` | Gate IDC 23 |
| `validate-ola3-longitudinal-gate.mjs` | Ampliado CTAs compactos + RAD |
| `e2e/ola3-ficha-journey.spec.ts` | Journey timeline desde actividad |

## Fase C — estado

| Ítem | Estado |
|------|--------|
| CTAs antecedentes compactos (Lote 1) | ✓ |
| Documentos UI compacta (Lote 2) | ✓ |
| Timeline invocable (Lote 3) | ✓ |
| Resultados bandeja | ✓ (previo) |

## Gates

```bash
npm run check                    # OK
npm run test                     # 29 tests OK (incl. Ollama + ficha)
npm run db:validate              # OK
npm run quality:ola3-timeline-gate       # OK
npm run quality:ola3-longitudinal-gate   # OK
npm run quality:ola3-ficha-gate          # OK
npm run quality:ola3-ficha-hub-gate      # OK
npm run quality:ollama-structured-output-gate  # OK
```

## Pendiente working tree

- Integración Ollama (sin commit) — `reports/epis2-ollama-integration-2026-06-04.md`
- Lotes C-01/C-02/C-03 sin commit conjunto

## Próximo paso

Commit + push de Ollama + Fase C completa; o abrir Fase D / comandos `revisa medicamentos` (Ola 3 roadmap).
