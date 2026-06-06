# MF-OLA6A-001 — Vista Print A5 certificado (IDC 40 parcial)

**Fecha:** 2026-06-07  
**Ola:** 6A  
**Estado:** ✅ Implementación (IDC 40 sigue **Active** — signoff humano impresión)

## Alcance

Vista documental A5 para certificado médico: preview desde borrador del formulario, sin auto-firma ni persistencia de documento impreso.

## Cambios

- `packages/epis2-ui/src/print/PrintA5Document.tsx` + test
- `apps/web/src/clinical/printPreviewStorage.ts`
- `apps/web/src/pages/MedicalCertificatePrintPage.tsx` + test
- Ruta `/espacio/certificado/imprimir` en `router.tsx` + `clinicalNavigate.ts`
- Botón `epis2-print-preview-medical_certificate` en `GeneratedClinicalFormPage.tsx`
- Copy `print.*` en `packages/design-system/src/copy/es.ts`
- `scripts/quality/validate-ola6a-print-gate.mjs`

## Evidencia

| Gate | Resultado |
|------|-----------|
| PrintA5Document.test | ✅ |
| MedicalCertificatePrintPage.test | ✅ |
| GeneratedClinicalFormPage.ola2 (botón print) | ✅ |
| ola6a-print-gate | ✅ |

## Riesgos

- Preview en `sessionStorage` — no sustituye documento firmado en SoT.
- Signoff clínico/legal pendiente antes de promover IDC 40 a Done.

## Próximo paso

Revisión humana impresión A5 → IDC 40 Done; luego MF-DOC-002 o MF-OLA1C-003.
