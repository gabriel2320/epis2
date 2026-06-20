# EPIS2 / CICA - Plan estetico de pantallas Codex

**Fecha:** 2026-06-19  
**Microfase:** MF-CICA-UX-01  
**Zona:** core UI + docs  
**Objetivo:** consolidar CICA como experiencia activa de EPIS2: modo clasico navegable + modo papel editable/imprimible.

## Alcance ejecutado

- CICA queda tratado como GO: home activa `/app/buscar`; `/espacio/*` queda fallback legacy congelado.
- No se creo shell, router, registry, modo nuevo ni modulo clinico nuevo.
- Pantallas clasicas siguen por `CicaPatientScreenFrame` / `CicaPatientBlueprintPage`.
- Pantallas papel consolidadas en `PaperModeScreen` + `PaperCanvas`.
- Acciones visibles siguen bajo presupuesto: maximo una primaria y hasta tres visibles.
- IA queda solo en roadmap asistivo con `requiresHumanReview=true`.

## Cambios de UI

| Area | Cambio | Resultado |
| --- | --- | --- |
| Layout clinico | Secciones con encabezado explicito, divisor superior, ancho seguro y grid 12 responsive | Mas jerarquia sin cards anidadas ni scroll horizontal |
| Action bar | Primaria con ancho estable, wrapping seguro y sombra discreta | Accion principal mas visible sin multiplicar botones |
| Blueprints Fase 1 | Titulos/subtitulos por intencion clinica | Cada pantalla comunica una intencion unica |
| Demos Fase 2 | Interconsultas, procedimientos y alta reciben copy de pantalla promovida | Demos mas legibles sin modulo nuevo |
| Modo papel | `paper-book` migra a `PaperModeScreen` + `PaperCanvas`; hoja con estado DEMO/BORRADOR | Libro clinico se siente como documento, no como pantalla generica |
| Paper canvas | Fondo, radio/sombra responsiva, banda superior no imprimible | Mejor lectura en pantalla y salida limpia en print |

## Alineacion documental

| Documento | Accion |
| --- | --- |
| `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` | Home y flujo actualizados a `/app/buscar` |
| `docs/product/VISION_EPIS2.md` | Version 2.1; anatomia activa CICA + fallback legacy |
| `docs/design/EPIS2_CLINICAL_LAYOUT_MANIFESTO.md` | Canon CICA `/app/*`, papel `/app/pacientes/:patientId/papel/*` |
| `docs/product/EPIS2_IA_LAST_PRODUCT_ARCHITECTURE.md` | Marcado `SUPERSEDED_BY_CICA` para estado operativo UI |
| `docs/product/EPIS2_TABLERO.md` | CICA GO y home `/app/buscar`; sin merge pendiente |
| Docs historicos dual/UX/form/ficha-first | Fence `SUPERSEDED_BY_CICA` agregado |

## Matriz de pantallas

| Screen / item | Estado | Accion Codex | Siguiente decision |
| --- | --- | --- | --- |
| `patient-summary` | existing | Pulido blueprint + jerarquia de seccion | Mantener como primera vista clinica |
| `patient-admission` | existing | Subtitulos por anamnesis/admin | Mantener; no agregar campos |
| `patient-evolutions` | existing | Intencion "Historia evolutiva" | Mantener; libro via accion secundaria |
| `patient-orders` | existing | Intencion "Indicaciones activas" | Mantener; nueva prescripcion ya registrada |
| `patient-exams` | existing | Intencion "Examenes y tendencias" | Mantener; resultados legacy solo como compat |
| `patient-documents` | existing | Intencion "Documentos clinicos" | Mantener; nuevo documento por registry |
| `patient-medications` | existing | Intencion "Medicamentos" | Mantener; accion papel secundaria |
| `patient-audit` | existing | Intencion "Auditoria del episodio" | Mantener; consola admin sigue compat |
| `patient-discharge` | demo -> promote | Copy de alta/epicrisis promovida | No crear modulo hasta MF clinica autorizada |
| `patient-interconsultas` | demo -> promote | Copy de solicitudes/respuestas demo | Requiere pantalla/form real en MF futura |
| `patient-procedures` | demo -> promote | Copy de procedimientos/pabellon demo | Requiere pantalla/form real en MF futura |
| `paper-day` | existing | Canvas papel reforzado | Estable para imprimir hoja diaria |
| `paper-book` | existing -> consolidated | Migrado a `PaperModeScreen` + `PaperCanvas` | Estable como indice documental |
| `paper-week` | future | No implementado | Solo despues de estabilidad paper-day/book |
| `paper-month` | future | No implementado | Solo despues de paper-week |
| `export PDF` | future | No implementado | Requiere MF de export/print |
| `impresion por rango` | future | No implementado | Requiere MF de export/print |
| `resumen sugerido IA` | future | No implementado | `requiresHumanReview=true` obligatorio |
| `evolucion SOAP IA` | future | No implementado | Borrador sugerido; humano aprueba |
| `epicrisis IA` | future | No implementado | Borrador sugerido; humano aprueba |
| `indicaciones IA` | future | No implementado | Sugerencia no SoT; humano aprueba |
| `examenes IA` | future | No implementado | Lectura/sugerencia read-only |
| `papel IA` | future | No implementado | Sugerencia documental; humano aprueba |

## Audit CICA

Comprobacion local con `auditCicaScreen` desde build generado:

| Clase | Score | Veredicto |
| --- | --- | --- |
| classic-fase1 | 100 | GO |
| paper-day | 100 | GO |
| paper-book | 100 | GO |
| demo-promote | 100 | GO |

Supuestos de auditoria: identidad paciente visible, retorno visible, una primaria, estado documental visible, intencion unica, sin overflow horizontal, hasta tres acciones visibles, profundidad visual 1.

## Gates

| Comando | Resultado | Nota |
| --- | --- | --- |
| `npm run check` | PASS | eslint, typecheck y `architecture:validate` OK |
| `npx vitest run packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.test.ts packages/epis2-ui/src/cica/resolveCicaBlueprint.test.ts apps/web/src/cica/cicaPatientDemoSections.test.ts` | PASS | 10 tests CICA/layout |
| `npx vitest run apps/web/src/pages/ResultsInboxPage.test.tsx` | PASS aislado | Fallo en suite completa parece contencion/flake |
| `npx vitest run apps/web/src/pages/GeneratedClinicalFormPage.test.tsx` | PASS aislado | Fallo en suite completa parece contencion/flake |
| `npm run quality:fast` | FAIL | Falla en `vitest apps/web`: `ResultsInboxPage.test.tsx` y timeout `GeneratedClinicalFormPage.test.tsx` |
| `npm run quality:clinical` | FAIL | Hereda fallo de `quality:fast` |
| `npm run quality:required` | No ejecutado | No era PR grande y `quality:fast` quedo bloqueado |

## Riesgos

| Riesgo | Mitigacion |
| --- | --- |
| Fences `SUPERSEDED_BY_CICA` en docs historicos pueden convivir con contenido interno viejo | Canon vivo apunta a `EPIS2_CURRENT_STATE`, `EPIS2_ROUTE_MAP` y registry |
| Demos promovidas aun no tienen logica clinica real | Copy explicito de demo; no se crean modulos ni forms |
| `quality:fast` falla por suite completa web | Tests fallidos pasan aislados; registrar como deuda de estabilidad del gate |

## Proximo paso recomendado

1. Resolver flake/contencion de `vitest apps/web` para desbloquear `quality:fast`.
2. Hacer walkthrough humano CICA en `/app/buscar` -> resumen -> papel libro/dia.
3. Abrir MF futura solo si se decide promover interconsultas/procedimientos/alta a formularios clinicos reales.
