# EPIS2 — CICA Clean Room Redesign (cierre PR6–PR7)

**Fecha:** 2026-06-17  
**Alcance:** SDEPIS2 · CICA Clean Room PR1–PR7 (foundation, redirects legacy, secciones ficha, formularios)  
**Veredicto:** **GO-CANDIDATE** — sala blanca operativa; epicrisis permanece legacy

## Principio aplicado

> El legacy dona datos y contratos; **no** dona composición visual.

Nueva raíz `/app/*` con `VITE_ENABLE_CICA_UI=true` (default ON). Legacy `/espacio/*` intacto como fallback cuando flag OFF.

## Rutas `/app` implementadas

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/app/buscar` | Buscar paciente | **Implementada** |
| `/app/censo` | Censo clínico | **Implementada** |
| `/app/pacientes/:id/resumen` | Ficha resumen (5 bloques clásicos) | **Implementada** |
| `/app/pacientes/:id/evoluciones` | Lista evoluciones | **Implementada** |
| `/app/pacientes/:id/evoluciones/nueva` | Nueva evolución SOAP | **Implementada** |
| `/app/pacientes/:id/indicaciones` | Indicaciones (lista clínica) | **Implementada** |
| `/app/pacientes/:id/indicaciones/nueva` | Nueva receta / prescripción | **Implementada** |
| `/app/pacientes/:id/examenes` | Exámenes / resultados relevantes | **Implementada** |
| `/app/pacientes/:id/documentos` | Documentos (lista cronológica) | **Implementada** |
| `/app/pacientes/:id/documentos/nuevo` | Nuevo certificado médico | **Implementada** |
| `/app/pacientes/:id/papel/dia/:date` | Modo papel standalone | **Implementada** |

## Redirects legacy → CICA (PR6)

Solo activos cuando `isCicaUiEnabled()`. Legacy sin cambios con `VITE_ENABLE_CICA_UI=false`.

| Legacy | CICA destino | Helper / mecanismo |
|--------|--------------|-------------------|
| `/espacio/buscar-paciente` | `/app/buscar` | `redirectLegacyPatientSearchToCicaIfEnabled` |
| `/espacio/ficha?patientId=` | `/app/pacientes/$patientId/resumen` | `redirectLegacyFichaToCicaIfEnabled` |
| `/comando?intent=selectPatient` | `/app/pacientes/$patientId/resumen` | inline en `commandCenterRoute` |
| `/espacio/resumen?patientId=` | `/app/pacientes/$patientId/resumen` | `redirectLegacyFormToCicaPatientIfEnabled` |
| `/espacio/evolucion?patientId=` | `/app/pacientes/$patientId/evoluciones/nueva` (+ `draftId`) | `redirectLegacyEvolutionToCicaIfEnabled` |
| `/espacio/receta?patientId=` | `/app/pacientes/$patientId/indicaciones/nueva` (+ `draftId`) | `redirectLegacyPrescriptionToCicaIfEnabled` |
| `/espacio/certificado?patientId=` | `/app/pacientes/$patientId/documentos/nuevo` (+ `draftId`) | `redirectLegacyCertificateToCicaIfEnabled` |
| `/espacio/resultados?patientId=` | `/app/pacientes/$patientId/examenes` | `redirectLegacyFormToCicaPatientIfEnabled` |
| `/espacio/epicrisis?patientId=` | *(sin redirect)* | Legacy — pantalla CICA epicrisis pendiente |
| `/espacio/laboratorio` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/imagenologia` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/interconsulta` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/procedimiento` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/enfermeria` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/mar` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/farmacia` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/ingreso` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/alergia` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/problema` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/conciliacion` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/traslado` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/ambulatorio` | *(sin redirect PR6)* | Legacy formulario |
| `/espacio/informe-interconsulta` | *(sin redirect PR6)* | Legacy formulario |
| Rutas `/espacio/*/imprimir` | *(sin redirect)* | Print routes legacy |

## Componentes + hooks + registries

### Package `@epis2/epis2-ui` — `packages/epis2-ui/src/cica/`

```
CicaAppShell.tsx
CicaTopBar.tsx
CicaClinicalNav.tsx
CicaPatientIdentityBand.tsx
CicaContextStrip.tsx
CicaChartTabs.tsx
CicaScreenFrame.tsx
CicaPatientScreenFrame.tsx
ClinicalActionBar.tsx
PaperModeScreen.tsx
EPIS_CICA_SCREEN_REGISTRY.ts
CICA_CHART_TAB_REGISTRY.ts
cicaRoutes.ts
cicaTokens.ts
index.ts
```

### Web — `apps/web/src/cica/`

```
CicaAppLayout.tsx
CicaPatientSearchPage.tsx
CicaCensusPage.tsx
CicaPatientSummaryPage.tsx
CicaPatientEvolutionsPage.tsx
CicaNewEvolutionPage.tsx
CicaNewPrescriptionPage.tsx
CicaNewDocumentPage.tsx
CicaPatientOrdersPage.tsx
CicaPatientExamsPage.tsx
CicaPatientDocumentsPage.tsx
CicaPatientSectionPages.tsx
CicaPaperDayPage.tsx
cicaPatientPresentation.ts
hooks/useCicaPatientPage.ts
hooks/useCicaNavigate.ts
```

### Policy + feature flag

- **Modifiability guide:** [`docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md`](docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md) — registry, tabs, rutas, frames, gates
- `apps/web/src/dev/cicaUiEnv.ts` → `VITE_ENABLE_CICA_UI`
- `EPIS2_CLINICAL_HOME` → `/app/buscar` cuando CICA ON

## Gates status

| Gate | Estado |
|------|--------|
| `quality:cica-no-legacy-shell-gate` | OK |
| `quality:cica-no-dashboard-mode-gate` | OK |
| `quality:cica-screen-registry-gate` | OK (+ PR6 redirect checks) |
| `quality:cica-action-density-gate` | OK |
| `quality:cica-paper-standalone-gate` | OK |
| `quality:cica-clean-room-close-gate` | OK (+ PR7 formularios/secciones) |

### Validación ejecutada

```bash
npm run quality:gate -- quality:cica-clean-room-close-gate
```

## E2E

| Spec | Alcance |
|------|---------|
| `e2e/cica-clean-room-journey.spec.ts` | buscar → resumen → tabs evoluciones; sin shell legacy |
| `e2e/cica-evolution-draft.spec.ts` | resumen → nueva evolución → guardar borrador → lista |
| `e2e/cica-form-drafts.spec.ts` | **N/A** — spec no existe aún |

Login CICA vía `loginAsPhysicianCica` (`e2e/helpers/demoPatient.ts`).

## Screenshots

**N/A** — sin infra de captura automatizada en CI para before/after estético. Signoff visual manual opcional (CICA-L).

## Riesgos residuales

- `/espacio/epicrisis` sigue legacy — comandos y tableros hospitalización apuntan ahí
- Formularios secundarios (laboratorio, imagenología, interconsulta, etc.) sin redirect CICA
- Bookmarks a `/espacio/*` redirigen con CICA ON — print routes (`/imprimir`) no redirigen
- Tab exámenes: acción «Ver resultados» aún navega a `/espacio/resultados` (redirect loop a CICA)
- `PaperChartMode` aún conoce rutas `/espacio` internamente (deuda menor)
- E2E prescripción/certificado y spec `cica-form-drafts` pendientes

## Próximos pasos

1. Pantalla CICA epicrisis + redirect `/espacio/epicrisis`
2. E2E redirects PR6 (receta, certificado, resultados) y `cica-form-drafts.spec.ts`
3. Signoff visual CICA-L before/after (opcional)
4. Actualizar command-registry routes a `/app/*` cuando CICA sea default institucional

## Frase guía

**EPIS2 CICA UI no hereda pantallas. Hereda intención clínica.**
