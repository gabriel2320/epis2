# EPIS2 — Clinical Layout Engine

**Versión:** 1.1 · **Programa:** PROG-AESTHETIC-RESET  
**Paquete:** `@epis2/epis2-ui` → `src/layout/clinical/`

**Norma:** [`EPIS2_CLINICAL_LAYOUT_MANIFESTO.md`](./EPIS2_CLINICAL_LAYOUT_MANIFESTO.md) · **CICA:** [`EPIS2_CICA.md`](./EPIS2_CICA.md)

> La pantalla no decide libremente su layout. Declara intención clínica, contenido y acciones; el motor decide estructura, espacios, columnas, botones y jerarquía visual.

---

## Pipeline

```text
Screen intent
→ Layout profile
→ Grid template
→ Density budget
→ Section ordering
→ Field alignment
→ Action governor
→ Visual validation gate
→ Render
```

---

## API pública

| Export | Rol |
|--------|-----|
| `ClinicalScreen` | Shell composicional (`data-testid="clinical-screen"`) |
| `ClinicalLayoutActionBar` | Gobernador 1+2+Más (`data-testid="clinical-action-bar"`) |
| `ClinicalSection` | Sección profundidad ≤ 2 |
| `ClinicalFieldGrid` / `ClinicalFieldCell` | Tabulación simétrica |
| `clinicalLayoutTokens` | Grilla 8dp, presupuestos |
| `clinicalLayoutProfiles` | Perfiles: census, classic-chart, clinical-form, paper-mode… |
| `normalizeClinicalActions` | Partición primaria/secundaria/overflow |
| `getFieldSpan` | Span por tipo de campo |
| `auditClinicalLayout` | Scoring composicional estético (90+ GO) |
| `auditCicaScreen` | Scoring CICA — fórmula pantalla correcta (90+ GO) |

---

## Perfiles

| Perfil | Uso |
|--------|-----|
| `classic-chart` | Ficha electrónica tradicional |
| `clinical-form` | Evolución, receta, órdenes |
| `paper-mode` | `/espacio/ficha/papel` |
| `census` | Home censo (futuro) |

---

## Integración actual

| Superficie | Componente |
|------------|------------|
| `TraditionalEhrMode` | `ClinicalScreen` + `ClassicChartTabs` (MF-AEST-02) |
| `GeneratedClinicalFormPage` | `ClinicalLayoutActionBar` profile `clinical-form` |
| `StandalonePaperChartPage` | `ClinicalScreen` profile `paper-mode` |

---

## Gates

```bash
npm run quality:gate -- quality:aesthetic-layout-gate
npm run quality:gate -- quality:classic-chart-composition-gate
```

E2E: `e2e/aesthetic-classic-mode.spec.ts`

---

*Canon: [`EPIS2_AESTHETIC_RESET_PROGRAM.md`](../product/EPIS2_AESTHETIC_RESET_PROGRAM.md)*
