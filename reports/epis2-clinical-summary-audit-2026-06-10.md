# Auditoría — Resumen clínico Fase A

**Fecha:** 2026-06-10  
**Alcance:** Ficha paciente (`PatientWorkspacePage`) — modo clásico MD3  
**Tramo:** MF-CLINICAL-SUMMARY-A  

## Veredicto

| Área | Antes | Después (Fase A) |
|------|-------|------------------|
| Escaneabilidad | Lista plana de secciones (`EpisWorkspaceSection`) | Grid 2 columnas **Ahora / Contexto** |
| Duplicación UX | Split + supporting mostraban el mismo longitudinal | Main = grid; longitudinal solo en supporting (≥1280px) |
| Identidad paciente | Nombre + chips en una fila | Avatar iniciales + nombre/meta en columna |
| Alertas | Panel separado + campo summary | Tarjeta crítica live + campos summary |
| CTAs | Dispersos en bloques distintos | Por tarjeta (`Ver más`, gestionar, abrir labs) |
| Modo moderno | Sin cambio | Sin cambio (stack UX-B.2 intacto) |

## Hallazgos auditados

### P0 — Resuelto en Fase A

1. **Sin jerarquía “ahora vs contexto”** — benchmark EHR (Oracle/DrChrono) prioriza estado actual; EPIS2 mezclaba todo en stack homogéneo.
2. **Doble pane longitudinal** — `EpisClassicMd3SplitPane` + `supportingContent` duplicaban `PatientLongitudinalPanel`.
3. **Header clínico pobre** — sin ancla visual (avatar) para identidad en turno rápido.

### P1 — Pendiente (Fases B–C)

1. Medicación no estructurada en zonas de riesgo
2. Cola de firma no transversal entre modos
3. Labs sin orden “crítica primero”
4. Signoff visual humano sigue **NO-GO** (`reports/epis2-ux-audit-visual-2026-06-10.md`)

### P2 — Mejoras cosméticas futuras

1. Iconografía por tipo de tarjeta (allergy, labs, meds)
2. Timestamp relativo (“hace 2 h”) en meta de tarjetas
3. Densidad compacta en grid vía preset UI

## Archivos tocados

| Archivo | Cambio |
|---------|--------|
| `EpisClinicalSummaryCard.tsx` | Nueva tarjeta MD3 |
| `PatientClinicalSummaryGrid.tsx` | Grid Ahora/Contexto |
| `patientSummaryFieldLabels.ts` | Etiquetas compartidas |
| `PatientWorkspacePage.tsx` | Clásico → grid; elimina split duplicado |
| `EpisClassicMd3PatientHeader.tsx` | Avatar iniciales |
| `ClassicMd3WorkspaceLayout.tsx` | Prop `patientDisplayName` |
| `PatientClinicalSummaryPanel.tsx` | Reutiliza labels compartidos |
| `packages/design-system/src/copy/es.ts` | Sección `clinicalSummary` |
| `docs/design/EPIS2_CLINICAL_SUMMARY_MD3.md` | Canon diseño |

## Gates

```bash
npm run check
npx vitest run apps/web/src/components/clinical-summary/PatientClinicalSummaryGrid.test.tsx
npx vitest run apps/web/src/pages/PatientWorkspacePage.test.tsx
```

## Próximo paso

**Fase B** — medicación 3 zonas + alergias estructuradas + labs crítica-first (producto).

**Estética** — tramos `THEME-CALM-01` + `UX-AESTHETIC P3` según [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md).

## Riesgos

- Tarjetas duplican texto de `summaryFields` y datos longitudinal (aceptable en demo; consolidar en Fase B).
- Supporting pane oculto en viewport &lt;1280px: usuario debe usar nav “Historia” o CTA timeline.
