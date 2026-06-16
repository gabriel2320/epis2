# P1 — Impresión epicrisis Carta vertical (PEND-006 parcial)

**Fecha:** 2026-06-09 · **Alcance:** Hilo C / Ola 3 longitudinal · norma `EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` §2.1 / §19.1

## Qué se entregó

Primera vista documental **Carta vertical** del producto (familia longitudinal). La epicrisis
(`discharge_summary`) es el documento insignia de la norma §19.1 y completa el tramo
«carta» de PEND-006.

### Primitiva nueva — `@epis2/epis2-ui`

| Archivo | Contenido |
|---|---|
| `packages/epis2-ui/src/print/PrintLetterDocument.tsx` | `PrintLetterDocument` (216×279 mm, márgenes 16/18 mm §6.1, tipografía §9.2, estado documental visible §14) + `PrintSection` (secciones planas §11, `breakInside: avoid` §17.2) |
| `packages/epis2-ui/src/print/index.ts` | Export de ambas primitivas |

Decisiones de norma aplicadas:

- Estado documental `BORRADOR — NO VÁLIDO COMO DOCUMENTO CLÍNICO FIRMADO` visible en el encabezado (§14.1) — los borradores demo nunca se presentan como documento final.
- Secciones documentales planas con borde fino, sin tarjetas M3 (§11, §10.4).
- Fuente local serif, sin recursos remotos (§9.1, §24.3).

### Página de impresión — `apps/web`

| Archivo | Contenido |
|---|---|
| `apps/web/src/pages/DischargeSummaryPrintPage.tsx` | Vista Carta: secciones Diagnósticos / Hospitalización / Alta e indicaciones (§19.1) · CTA imprimir + volver fuera de `@media print` |
| `apps/web/src/pages/GeneratedClinicalFormPage.tsx` | Botón `epis2-print-preview-discharge_summary` (mismo patrón que receta/certificado) |
| `apps/web/src/routes/router.tsx` | Ruta `/espacio/epicrisis/imprimir` |
| `apps/web/src/routes/clinicalNavigate.ts` | Tipo de ruta nuevo |
| `packages/design-system/src/copy/es.ts` | Copy `print.*`: `previewLetter`, `printLetter`, `dischargeSummaryTitle`, `statusDraftDocument`, secciones y etiquetas de campos |

### Tests y gates

| Pieza | Evidencia |
|---|---|
| Unit primitiva | `packages/epis2-ui/src/print/PrintLetterDocument.test.tsx` ✓ |
| Unit página | `apps/web/src/pages/DischargeSummaryPrintPage.test.tsx` ✓ |
| E2E (en CI vía `test:e2e`) | `e2e/ola6a-print-discharge-summary.spec.ts` — journey formulario → CTA → vista Carta |
| Gate ampliado | `quality:ola6a-print-gate` ahora exige `PrintLetterDocument`, página, ruta y E2E Carta ✓ |
| `npm run check` | ✓ lint + typecheck + architecture:validate |
| `npm run test` | ✓ (suite completa) |

## Qué queda de PEND-006

- Otros A5 transaccionales: orden de laboratorio (`lab_request`) y orden de imagenología (`imaging_request`) — §19.7. Mismo patrón ya establecido (3 ejemplos en el código).
- Signoff visual humano opcional del piloto M3 (no bloqueante).

## Próximo paso exacto

Replicar el patrón A5 para `lab_request` / `imaging_request`, o continuar con P1b
(alto contraste ampliado) según prioridad del tablero.
