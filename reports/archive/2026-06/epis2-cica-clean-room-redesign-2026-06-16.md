# EPIS2 — CICA Clean Room Redesign (cierre PR6)

**Fecha:** 2026-06-16  
**Alcance:** SDEPIS2 · CICA Clean Room PR1–PR6 (foundation + redirects legacy)  
**Veredicto:** **GO-CANDIDATE** — sala blanca operativa; epicrisis y formularios secundarios permanecen legacy

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
| `/app/pacientes/:id/indicaciones` | Indicaciones (lista) | Stub sección |
| `/app/pacientes/:id/indicaciones/nueva` | Nueva receta / prescripción | **Implementada** |
| `/app/pacientes/:id/examenes` | Exámenes / resultados | Stub sección |
| `/app/pacientes/:id/documentos` | Documentos (lista) | Stub sección |
| `/app/pacientes/:id/documentos/nuevo` | Nuevo certificado médico | **Implementada** |
| `/app/pacientes/:id/papel/dia/:date` | Modo papel standalone | **Implementada** |

## Redirects legacy → CICA (PR6)

Solo activos cuando `isCicaUiEnabled()`. Legacy sin cambios con `VITE_ENABLE_CICA_UI=false`.

| Legacy | CICA destino | Helper |
|--------|--------------|--------|
| `/espacio/buscar-paciente` | `/app/buscar` | `redirectLegacyPatientSearchToCicaIfEnabled` |
| `/espacio/ficha?patientId=` | `/app/pacientes/$patientId/resumen` | `redirectLegacyFichaToCicaIfEnabled` |
| `/comando?intent=selectPatient` | `/app/pacientes/$patientId/resumen` | inline en `commandCenterRoute` |
| `/espacio/resumen?patientId=` | `/app/pacientes/$patientId/resumen` | `redirectLegacyFormToCicaPatientIfEnabled` |
| `/espacio/evolucion?patientId=` | `/app/pacientes/$patientId/evoluciones/nueva` (+ `draftId`) | `redirectLegacyEvolutionToCicaIfEnabled` |
| `/espacio/receta?patientId=` | `/app/pacientes/$patientId/indicaciones/nueva` (+ `draftId`) | `redirectLegacyPrescriptionToCicaIfEnabled` |
| `/espacio/certificado?patientId=` | `/app/pacientes/$patientId/documentos/nuevo` (+ `draftId`) | `redirectLegacyCertificateToCicaIfEnabled` |
| `/espacio/resultados?patientId=` | `/app/pacientes/$patientId/examenes` | `redirectLegacyFormToCicaPatientIfEnabled` |
| `/espacio/epicrisis?patientId=` | *(sin redirect)* | Legacy — pantalla CICA epicrisis pendiente |

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

- `docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md`
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
| `quality:cica-clean-room-close-gate` | OK |

### Validación ejecutada

```bash
npm run typecheck -w @epis2/web
npm run quality:gate -- quality:cica-clean-room-close-gate
```

## E2E

- `e2e/cica-clean-room-journey.spec.ts` — buscar → resumen → tabs evoluciones
- Login CICA vía `loginAsPhysicianCica` (helpers/demoPatient)

## Screenshots

**N/A** — sin infra de captura automatizada en CI para before/after estético PR6. Signoff visual manual opcional (CICA-L).

## Riesgos residuales

- `/espacio/epicrisis` sigue legacy — comandos y tableros hospitalización apuntan ahí
- Stubs en tabs indicaciones / exámenes / documentos (lista)
- Bookmarks a `/espacio/*` redirigen con CICA ON — print routes (`/imprimir`) no redirigen
- `PaperChartMode` aún conoce rutas `/espacio` internamente (deuda menor)

## Próximos pasos

1. Pantalla CICA epicrisis + redirect `/espacio/epicrisis`
2. Contenido real en tabs indicaciones / exámenes / documentos (lista)
3. E2E redirects PR6 (receta, certificado, resultados)
4. Signoff visual CICA-L before/after (opcional)
5. Actualizar command-registry routes a `/app/*` cuando CICA sea default institucional

## Frase guía

**EPIS2 CICA UI no hereda pantallas. Hereda intención clínica.**
