# EPIS2 — Simetría y encuadre Material Design 3

**Versión:** 1.0 · **Fecha:** 2026-06-07  
**Implementación:** `packages/epis2-ui/src/theme/m3-layout-tokens.ts` · `EpisClinicalFormFooter`  
**Relacionado:** [EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md](./EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md) · [EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md](./EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md)

> La simetría en fichas clínicas de alta densidad no depende del ojo del diseñador: depende de reglas matemáticas y espaciales estrictas codificadas en tokens.

---

## 1. Cuadrícula 8dp y espaciado

| Regla MD3 | Token EPIS2 | Valor | Uso |
|-----------|-------------|-------|-----|
| Unidad base | `epis2M3GridUnitPx` / `epis2GridUnit` | **8px** | Todas las medidas derivadas |
| Ajuste fino | `epis2M3Spacing.fine` | **4dp** (0.5) | Icono ↔ etiqueta en botón |
| Controles contiguos | `epis2M3Spacing.tight` | **8dp** (1) | Par Cancelar / Guardar |
| Filas / padding tarjeta | `epis2M3Spacing.row` | **16dp** (2) | Filas de formulario, padding simétrico |
| Bloques / márgenes | `epis2M3Spacing.block` | **24dp** (3) | Márgenes exteriores, bloques grandes |
| Secciones | `epis2M3Spacing.section` | **32dp** (4) | Separación entre secciones clínicas |
| Columnas escritorio | `epis2M3FormColumns` | **12** | Anchos proporcionales de campo |

**Islas:** `epis2M3IslandPadding` → 24dp (compacto) · 32dp (expandido). Sin valores fuera de cuadrícula (p. ej. 28dp prohibido).

---

## 2. Formularios clínicos

| Regla MD3 | Token / componente | Valor |
|-----------|-------------------|-------|
| Altura de campo estándar | `MuiOutlinedInput` + `clinicalFieldShellSx` | **48dp** mínimo |
| Espacio entre campos | `epis2M3FormLayout.fieldRowGap` | **16dp** |
| Título → campos | `epis2M3FormLayout.sectionLabelGap` | **16dp** |
| Entre secciones | `epis2M3FormLayout.sectionGap` | **32dp** |
| Prosa clínica | `epis2ProseMaxWidth` | **65ch**, alineación izquierda |
| Grid proporcional | `epis2M3FormGridSx` + `epis2M3ColumnSpanSx(n)` | 12 columnas (cuando el blueprint declare span) |

**Alta densidad:** no reducir altura ad hoc; usar tokens de layout y, si hace falta, modo denso MUI en tablas (`EpisDataGrid`), no en campos outlined clínicos.

**Anti-patrón:** todos los campos al 100% del ancho. Campos cortos (presión, pulso, temperatura) deben compartir fila vía grid 12 cols cuando el blueprint lo permita.

---

## 3. Botones — jerarquía y cierre

| Regla MD3 | Implementación EPIS2 |
|-----------|---------------------|
| Alineación de cierre (escritorio) | `EpisClinicalFormFooter` + `epis2ClinicalFormFooterSx` → `justifyContent: flex-end` |
| Gap entre botones | **8dp** (`epis2M3Spacing.tight`) |
| Jerarquía | `EpisButton` `appearance`: **filled** (primario) · **outlined** / **tonal** (secundario) · **text** (cancelar) |
| Un solo filled por grupo | Nunca dos `appearance="filled"` contiguos |
| Touch target | `epis2M3TouchTargetMinPx` = **48dp** en `MuiButton` y inputs clínicos |

**Componentes:** `EpisClinicalFormFooter`, `EpisApprovalGate`, footer de `EpisClinicalTwoPaneLayout`.

---

## 4. Texto

| Regla MD3 | Token EPIS2 |
|-----------|-------------|
| Alineación | `textAlign: 'left'` (`epis2ClinicalProseSx`) |
| Ancho máximo lectura | **65ch** (`epis2ProseMaxWidth`) — rango MD3 60–70 |
| Interlineado cuerpo | **1.5** (`epis2LineHeight.body`) |
| Baseline icono + texto | Stack con `alignItems: 'center'` en filas de acción; labels sobre campos, no inline con inputs |

**Estados vacíos:** alineación centrada permitida solo en empty states (`copy.longitudinal.emptySection`, etc.).

---

## 5. Contenedores (Cards / islas)

| Regla MD3 | Token EPIS2 |
|-----------|-------------|
| Padding simétrico | `epis2IslandPaddingSx` / `epis2M3IslandPadding` — 24–32dp |
| Sin cajas anidadas fuertes | Isla blanca (`epis2ClinicalFormCanvasSx`); separación por espacio o `divider`, no fondos grises |
| Encuadre página | `epis2PageIslandSx` — margen exterior + padding interior |

---

## Mapa código → regla

```text
m3-layout-tokens.ts       → escala 4/8/16/24/32, grid 12, touch 48, footer sx
clinical-forms/layout.ts  → columnSpan, resolveFieldColumnSpan, validateBlueprintLayout
EpisClinicalForm.tsx      → epis2M3FormGridSx + celdas proporcionales
EpisClinicalFormFooter    → acciones alineadas derecha, gap 8dp
clinical-field-layout     → input 48dp, label gap 8dp
components.ts             → MuiButton minHeight 48
island-layout.ts          → padding 24/32dp (sin 28dp)
```

---

## columnSpan en blueprints (fase 2 ✓)

| Blueprint | Campos cortos | Span típico |
|-----------|---------------|-------------|
| `nursing_note` | PA, FC, SatO2, T° | 3+3+3+3 |
| `prescription` | medicamento, dosis, vía… | 8+4, 4+4+4 |
| `medication_administration` | medicamento, dosis, vía, horas | 6+3+3, 3+3 |
| `patient_search` | nombre, identificador | 8+4 |
| `allergy_entry` | sustancia, severidad | 8+4 |
| `lab_request` / `imaging_request` | fecha, prioridad, modalidad | 4+4 (+4) |
| `admission_note` / `transfer_note` | cama destino | 6 |
| `evolution_note` / `discharge_summary` | fecha | 4 |

**Regla:** `textarea` siempre `columnSpan: 12` (validado en registry). En compacto (`xs`) todos los campos ocupan 12 columnas.

---

## Verificación

```bash
npm run check
npm run test
npm run quality:m3-visual-pass   # opcional tras cambios visuales
```
