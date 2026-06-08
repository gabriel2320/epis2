# EPIS2 — Auditoría estética M3 (formularios y pantallas recientes)

**Fecha:** 2026-06-04  
**Alcance:** Ficha paciente (Ola 3 UX-B), formularios clínicos (`GeneratedClinicalFormPage`), borrador/revisión (`DraftReviewPage`), primitivos `epis2-ui`.  
**Canon:** `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`, `EPIS2_M3_SYMMETRY_AND_FRAMING.md`, `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md`, `M3_ANTI_DRIFT_GATES.md`.

**Gates automáticos:** `rad-m3-discipline`, `ola2-m3-ui`, `m3-scaffold`, `no-direct-mui-imports`, `layout-g12` — OK.

---

## Resumen

La base arquitectónica es sólida (RAD surfaces, `EpisClinicalFormRhf`, una ActionBar por formulario, sin `@mui/*` en `apps/web`). Hay **drift estético** concentrado en bloques compactos de ficha, en `EpisWorkspaceSection` (primitivo compartido) y en mezcla `Button` / `EpisButton`. También hay **redundancia de contenido** cuando el panel historial está abierto — intencional en producto, pero ruidosa visualmente.

---

## Errores (corregir)

### E1 — Cuadrícula 8dp: `spacing={0.75}` (6px)

**Regla:** `epis2M3Spacing` solo admite 0.5 (4dp), 1 (8dp), 2 (16dp)… (`EPIS2_M3_SYMMETRY_AND_FRAMING.md` §1).

| Archivo | Líneas |
|---------|--------|
| `PatientSummaryAntecedentsBlock.tsx` | 42, 74 |
| `ClinicalAlertsPanel.tsx` | 51 |
| `EpisClinicalSoapHints.tsx` | 27 |

**Fix:** usar `spacing={1}` (8dp) o `epis2M3Spacing.tight`.

---

### E2 — Rol tipográfico de sección incorrecto en `EpisWorkspaceSection`

```25:27:packages/epis2-ui/src/layout/EpisWorkspaceSection.tsx
      <EpisM3Text role="headlineMedium" component="h2" sx={{ m: 0, mb: 1.5 }}>
        {title}
      </EpisM3Text>
```

**Problema:** `headlineMedium` = rol de **página** (mapeado a `h4`). Secciones de ficha deben usar **`titleLarge` o `titleMedium`** (`EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` § Tipografía).

**Impacto:** todos los bloques Ola 3 (antecedentes, documentos, actividad, resumen clínico) compiten jerárquicamente con el título de página.

**Fix:** `role="titleLarge"` + `mb: 2` (16dp, alineado a `sectionLabelGap`).

---

### E3 — Margen bajo título off-grid (`mb: 1.5` = 12px)

En `EpisWorkspaceSection` y `ClinicalAlertsPanel` (`mb: 1.5`). Canon formularios: **16dp** entre título y contenido.

---

### E4 — Botón falso en timeline compacto

```44:57:apps/web/src/components/PatientRecentActivityBlock.tsx
                    <Typography
                      component="button"
                      variant="body2"
                      onClick={() => onOpenDraft(event.entityId!)}
                      sx={{ border: 0, background: 'none', cursor: 'pointer', color: 'primary.main', p: 0 }}
```

**Problema:** no usa `EpisButton appearance="text"` → touch target &lt; 48dp (M3-G08 / anti-patrón accesibilidad), foco inconsistente.

**Fix:** `EpisButton appearance="text" size="small"` o `ListItemButton`.

---

### E5 — API de botones inconsistente (M3)

Bloques ficha usan **`Button`** MUI re-export; resto de flujo clínico usa **`EpisButton`** con `appearance`.

| Patrón correcto | Uso actual erróneo |
|-----------------|-------------------|
| `EpisButton appearance="outlined"` | `Button variant="outlined"` en `PatientSummary*`, `PatientLongitudinalPanel` |
| `EpisButton appearance="filled"` | `EpisButton variant="contained"` en `DraftReviewPage` (approve OK), `GeneratedClinicalFormPage` L930 |
| `EpisButton appearance="outlined"` | `EpisButton variant="outlined"` en `DraftReviewPage` L173 |

**Fix:** unificar en `appearance`; reservar `variant` solo para casos legacy en catálogo dev.

---

### E6 — `ClinicalAlertsPanel`: Paper disfrazado de isla plana

Usa `Paper variant="outlined"` pero anula borde/sombra → mismo peso visual que `EpisWorkspaceSection`, con **doble tratamiento** de componente (anti-patrón #5 adyacente).

En ficha paciente conviven:

- `PatientClinicalSummaryPanel` (campo `clinicalAlerts` en texto)
- `ClinicalAlertsPanel` (reglas CDS/CDR)

**Fix medio plazo:** migrar alertas a `EpisWorkspaceSection` + `EpisAlert`; deduplicar copy si el resumen ya lista alertas activas.

---

## Redundancias (producto / UX)

### R1 — Ficha compacta vs panel historial (split abierto)

Con `EpisSplitWorkspace` abierto, el usuario ve **dos veces**:

| Compacto (columna primaria) | Completo (secundaria) |
|----------------------------|------------------------|
| `PatientSummaryAntecedentsBlock` | Secciones alergias / problemas / quirúrgicos |
| `PatientSummaryDocumentsBlock` (2 ítems) | `DocumentIndexTree` + búsqueda |
| `PatientRecentActivityBlock` (8 ítems) | Timeline completo |

**No es bug M3** — es UX-B.2 progresivo — pero viola espíritu M3-G04 (*información no solicitada*) cuando el panel ya está abierto.

**Fix sugerido:** ocultar bloques compactos cuando `historyOpen === true`, o colapsarlos a enlaces ancla.

---

### R2 — CTAs duplicados de registro

«Registrar alergia / problema» aparecen en ficha compacta **y** en `PatientLongitudinalPanel` cuando historial visible.

**Fix:** mantener CTA solo en compacto; en panel largo mostrar solo listas + acciones de exportación.

---

### R3 — Cinco islas `EpisWorkspaceSection` apiladas

Ficha primaria: resumen clínico + antecedentes + documentos + actividad — cada una con mismo `bgcolor`, `borderRadius: 2`, `p: 2`. Visualmente **cinco “tarjetas” contiguas** (riesgo anti-patrón #5).

**Fix:** una isla contenedora + secciones internas con `Divider` o `Stack spacing={3}` sin repetir fondo.

---

### R4 — `PatientLongitudinalPanel.Section` local

Wrapper interno duplica `EpisWorkspaceSection` (misma estructura título + empty + children). Mantener un solo primitivo evita drift futuro.

---

## Inconsistencias menores

| # | Detalle | Dónde |
|---|---------|-------|
| I1 | `spacing={1.5}` (12dp) en resumen clínico — aceptable (múltiplo de 4) pero preferir `epis2M3Spacing.row` (16dp) | `PatientClinicalSummaryPanel` |
| I2 | Títulos panel longitudinal con `Typography variant="subtitle2"` mientras bloques usan `EpisM3Text` | `PatientLongitudinalPanel` L108 |
| I3 | `EpisDockReserveLayout` usa `spacing={{ sm: 2.5 }}` (20dp, off-grid) | `EpisWorkspaceSection.tsx` L57 |
| I4 | Accordion formulario `borderRadius: 1` (8dp) vs inputs `14px` en tema — aceptable pero no alineado a tabla forma M3 (medium 12) | `EpisClinicalForm.tsx` |

---

## Lo que está bien

- Formularios: `EpisClinicalFormRhf` + grid `epis2M3FormGridSx` + footer con `epis2ClinicalFormFooterSx`.
- Una sola `EpisClinicalFormActionBar` por pantalla (gate RAD-M3).
- `DraftReviewPage`: una acción **filled** principal (aprobar) + secundarias outlined/text (M3-G13 OK).
- Bloques Ola 3: `EpisWorkspaceSection` sin `Paper` outlined anidado (LAYOUT-G12).
- Copy visible en español; estados vacío con `body2` secondary.
- Sin imports directos MUI en `apps/web`.

---

## Prioridad de remediación

| Prioridad | Ítem | Esfuerzo |
|-----------|------|----------|
| P0 | E2 + E3 — corregir `EpisWorkspaceSection` (afecta toda ficha) | Bajo |
| P1 | E1, E4, E5 — bloques `PatientSummary*` + timeline | Bajo |
| P1 | R1 — ocultar compactos con historial abierto | Medio |
| P2 | E6, R3 — unificar alertas e islas | Medio |
| P3 | I1–I4, R2, R4 | Bajo |

---

## Verificación manual sugerida

```bash
npm run dev:web
# Rutas: /espacio/ficha, formularios /espacio/*, /espacio/borrador/:id
npm run ollama:route   # no aplica UI; usar:
npm run quality:rad-m3-discipline-gate
npm run quality:layers-integration-gate   # si se toca UI
```

Checklist PR (`M3_ANTI_DRIFT_GATES.md`): confirmar tratamiento **M3 Standard** en formularios y ficha; **Expressive** solo Comando/Login.

---

## Próximo paso

1. PR focalizado: `EpisWorkspaceSection` (E2/E3) + bloques Patient (E1/E4/E5).  
2. PR UX: condicional `historyOpen` (R1).  
3. Opcional: gate lint `spacing={0.75}` prohibido en `apps/web`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
