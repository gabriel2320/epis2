# EPIS2 — Hilo C P1: impresión receta A5

**Fecha:** 2026-06-09  
**Hilo:** C — Ola 3 · **P1** · PEND-006 (parcial)  
**Norma:** [`EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`](../docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md) §2.3 A5

---

## Entrega

Vista documental A5 para **receta médica** (`prescription`), mismo patrón que certificado:

| Artefacto | Ruta |
|-----------|------|
| Página impresión | `apps/web/src/pages/PrescriptionPrintPage.tsx` |
| Ruta | `/espacio/receta/imprimir` |
| CTA formulario | `epis2-print-preview-prescription` en `GeneratedClinicalFormPage` |
| Copy ES | `packages/design-system/src/copy/es.ts` → `print.prescriptionTitle` … |

Preview vía `sessionStorage` — **no sustituye** borrador firmado en PostgreSQL.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `PrescriptionPrintPage.test` | ✓ |
| `GeneratedClinicalFormPage.ola2` (receta + print CTA) | ✓ |
| `quality:ola6a-print-gate` | ✓ |
| `npm run check` | ✓ (sesión) |

---

## PEND-006 — estado

| Ítem | Estado |
|------|--------|
| Certificado A5 | ✓ (previo MF-OLA6A) |
| Receta A5 | ✓ esta entrega |
| Piloto humano M3 | Pendiente — `npm run quality:m3-human-pilot` (+ `stack:dev`) |
| Otros docs A5/Carta | Backlog Ola 3 |

---

## Próximo paso P1

1. `npm run stack:dev` → `npm run quality:m3-human-pilot`
2. E2E receta impresión (opcional, fuera set CI)
3. Carta vertical — evolución / epicrisis (Ola 3)

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
