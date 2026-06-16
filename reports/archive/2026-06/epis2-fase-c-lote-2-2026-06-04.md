# EPIS2 — Fase C Lote 2 (documentos UI compacta)

**Fecha:** 2026-06-04  
**Alcance:** Resumen de documentos indexados en ficha compacta UX-B.2, enlace al índice completo en historial.

## Entregables

| Artefacto | Cambio |
|-----------|--------|
| `PatientSummaryDocumentsBlock.tsx` | Lista hasta 2 docs + `epis2-ficha-open-documents-index` |
| `PatientSummaryDocumentsBlock.test.tsx` | Lista + vacío |
| `PatientWorkspacePage.tsx` | Monta bloque; abre split historial al pulsar índice |
| `copy/es.ts` | `documentsTitle`, `viewDocumentsIndex` |
| `e2e/ola3-ficha-journey.spec.ts` | DEMO-001 documentos compactos → árbol en historial |
| Gates ola3 ficha + hub | Evidencia bloque documentos |
| `EPIS2_GLOBAL_DEV_PLAN.md` | Ítem documentos UI marcado |

## Comportamiento

- **DEMO-001:** muestra «Informe laboratorio control HTA (demo)» en ficha compacta.
- **Ver índice completo:** abre panel longitudinal con `epis2-longitudinal-documents-tree`.
- **DEMO-005:** documento demo en mock unitario; vacío muestra copy longitudinal estándar.

## Gates

```bash
npm run check                    # OK 2026-06-04
npm run test                     # PatientSummaryDocumentsBlock + workspace OK
npm run quality:ola3-ficha-gate  # OK
npm run quality:ola3-ficha-hub-gate  # OK
npm run db:validate              # OK — 33 migraciones
```

## Pendiente en working tree (lote previo)

Integración Ollama (`extractOllamaJson`, dev-agent) sin commit — ver `reports/epis2-ollama-integration-2026-06-04.md`.

## Próximo lote (Fase C Lote 3 — sugerido)

1. Timeline dedicado invocable desde comando/ficha.
2. RAD `patient-chart` notas IDC 27–29.
3. Commit conjunto Ollama + C-01/C-02 si el usuario lo pide.
