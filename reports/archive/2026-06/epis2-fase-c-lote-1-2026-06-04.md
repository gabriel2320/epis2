# EPIS2 — Fase C Lote 1 (CTAs ficha compacta UX-B.2)

**Fecha:** 2026-06-04  
**Alcance:** CTAs alergia/problema visibles en columna primaria de ficha sin abrir historial longitudinal.

## Entregables

| Artefacto | Cambio |
|-----------|--------|
| `PatientSummaryAntecedentsBlock.tsx` | Bloque IDC 27–29 con `epis2-ficha-register-allergy` / `epis2-ficha-register-problem` |
| `PatientSummaryAntecedentsBlock.test.tsx` | CTAs vacíos + listado con datos |
| `PatientWorkspacePage.tsx` | Monta bloque en columna primaria cuando hay datos longitudinales |
| `copy/es.ts` | `activePatient.antecedentsTitle` |
| `e2e/ola3-ficha-journey.spec.ts` | Alineado UX-B.2: compacto + historial bajo demanda |
| Gates `validate-ola3-ficha-gate.mjs`, `validate-ola3-ficha-hub-gate.mjs` | Evidencia bloque compacto + split historial |
| `EPIS2_GLOBAL_DEV_PLAN.md` | Ítem Fase C CTAs marcado |

## Comportamiento

- **DEMO-001:** sin alergias → CTA alergia en ficha compacta; con problema HTA → lista, sin CTA problema.
- **Historial:** panel longitudinal completo (timeline, resultados, quirúrgico) sigue en split secundario tras `epis2-ficha-history`.

## Gates

```bash
npm run check                    # OK 2026-06-04
npm run test                     # PatientSummaryAntecedentsBlock + PatientWorkspacePage OK
npm run db:validate              # OK — 33 migraciones
npm run quality:ola3-ficha-gate  # OK
npm run quality:ola3-ficha-hub-gate  # OK
npm run quality:ola3-ficha-depth-gate  # OK
```

## Riesgos

- E2E ola3 requiere stack levantado (login + API demo).
- Todos los casos DEMO tienen al menos un problema sembrado; el CTA problema solo se valida en unit test (estado vacío).

## Próximo lote (Fase C Lote 2 — sugerido)

1. Documentos UI en ficha / timeline dedicado.
2. RAD `patient-chart` notas IDC 27–29 si aplica.
3. Fase B-05 deferred: nota procedimiento clínico (distinto de solicitud).
