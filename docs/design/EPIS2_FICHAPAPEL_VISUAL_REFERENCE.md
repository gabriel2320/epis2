# EPIS2 — Referencia visual FichaPapel (modo papel)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** Canónico · **Alcance:** `chartMode=paper` y vistas print enlazadas  
**Programa:** PROG-PAPER-MODE (cerrado) · mantenimiento visual transversal

---

## 1. Veredicto

El repositorio **[FichaPapel](https://github.com/gabriel2320/FichaPapel)** es la **referencia visual transversal** del modo papel EPIS2. No es donante de código runtime: EPIS2 **reimplementa** la estética en `@epis2/epis2-ui` + `apps/web/src/components/chart/paper/`.

| Uso | Permitido | Prohibido |
|-----|-----------|-----------|
| Paleta, tipografía, layout papelería | ✓ vía `epis2PaperChartTokens` + `paper-visual-reference.ts` | Copiar carpeta / dependencia npm |
| Prototipo Figma Make | ✓ inspección | Import shadcn/Tailwind a `apps/web` |
| Mock `FichaMedicaPage.tsx` | ✓ diff sección a sección | Segundo Form Registry / SoT mock |

**Frase guía:** *FichaPapel define cómo se ve; EPIS2 define qué es clínicamente válido.*

---

## 2. Fuentes

| Recurso | URL |
|---------|-----|
| Repo referencia | https://github.com/gabriel2320/FichaPapel |
| Figma origen | [Crear páginas de ficha médica](https://www.figma.com/design/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica) |
| Archivo ancla | `src/app/pages/FichaMedicaPage.tsx` |
| Ledger | `REF-20260611-001` en `docs/legacy/LEGACY_IMPORT_LEDGER.md` |

---

## 3. Tokens canónicos (implementación EPIS2)

Definidos en `packages/epis2-ui/src/theme/clinical/chart-modes-colors.ts` y helpers en `paper-visual-reference.ts`.

| Token FichaPapel | EPIS2 | Uso |
|------------------|-------|-----|
| `C.navy` `#0d2b5e` | `navyHeader` | Cabecera, secciones, pestaña activa |
| `C.navyMid` `#174080` | `navyMid` | Bordes cabecera, tabs inactivos |
| `C.navyLight` `#e8edf7` | `navyLight` | Franja paciente |
| `C.paper` `#fdfcf7` | `paperBg` | Hoja |
| `C.paperDark` `#f2f0e8` | `paperBgAlt` | Pie, chrome toolbar |
| `C.ruleLight` `#d8d4cc` | `ruledLine` | Pauta horizontal |
| `C.rule` `#b0aaa0` | `ruledLineStrong` | Subrayado campos |
| `#5fa3d8` | `sectionAccent` | Borde izquierdo sección |
| `#e8e6e0` (page bg) | `paperCanvasBg` | Escritorio detrás hoja |

### Tipografía

| Rol | Fuente |
|-----|--------|
| Institucional | Libre Baskerville |
| Etiquetas | Source Sans 3 |
| Cuerpo clínico | Courier Prime |

Cargadas en `apps/web/src/styles/epis2-fonts.css` (import desde `main.tsx`). **No** usar Inter/Roboto dentro del área imprimible.

---

## 4. Mapa componente → referencia

| EPIS2 | Patrón FichaPapel | Helper |
|-------|-------------------|--------|
| `PaperInstitutionalHeader` | Header oficial + cruz + badge Nº | `epis2PaperInstitutionalHeaderSx` |
| `PaperPatientStrip` | Franja identidad + alergia | `epis2PaperPatientStripSx` |
| `PaperSection` | `SectionTitle` banda navy | `epis2PaperSectionTitleSx` |
| `PaperFieldRow` | `Field` grid | `epis2PaperFieldLabelSx` / `ValueSx` |
| `PaperSubSection` | `SubTitle` A/B/C | `epis2PaperSubSectionTitleSx` |
| `PaperTable` | Tablas diagnóstico/lab | `epis2PaperTableHeaderCellSx` |
| `PaperRuleBlock` | `RuleBlock` líneas vacías | ruled lines |
| `PaperSignatureBlock` | Firmas epicrisis | `epis2PaperSignatureLineSx` |
| `PaperSectionChrome` | Orquestación por sección | `paperSectionChrome.tsx` |
| `PaperTextarea` | `RuleBlock` | CSS `.epis2-paper-chart-ruled` |
| `PaperFooter` | Footer confidencial + p. N/M | `epis2PaperFooterSx` |
| `PaperPageCanvas` | `S.page` fondo | `epis2PaperCanvasSx` |
| `PaperSectionNavigator` | Tab bar documento | `epis2PaperNavTabSx` |
| `PaperDocumentToolbar` | Toolbar imprimir tab | `epis2PaperChromeBarSx` + `ToolbarControlSx` |
| `PaperBridgeBackButton` | Botón volver | `epis2PaperBridgeControlSx` |
| `PaperChartPrintPage` | Hoja centrada preview | `PaperPageCanvas` |

---

## 5. Reglas transversales

1. **Todo** componente bajo `components/chart/paper/` importa tokens/helpers desde `@epis2/epis2-ui` — sin colores hardcoded.
2. **Chrome** (toolbar, nav, avisos) usa `epis2-paper-chart-no-print`; **hoja** usa clases `epis2-paper-page` + print CSS.
3. Vistas print con `returnChartMode=paper` usan `PaperBridgeBackButton` (misma estética chrome).
4. Cambios visuales papel: actualizar tokens → helpers → componentes → gate `quality:paper-mode-fichapapel-reference-gate`.
5. Subestructuras ricas (tablas diagnóstico, subsecciones A/B/C) se añaden **dentro** de `PaperChartTemplate` por sección, no en repo externo.

---

## 6. Gates

```bash
npm run quality:paper-mode-fichapapel-reference-gate
npm run quality:paper-mode-signoff-gate
```

---

## 7. Referencias cruzadas

- [EPIS2_DUAL_CHART_VISUAL_CANON.md](./EPIS2_DUAL_CHART_VISUAL_CANON.md) §5  
- [EPIS2_PAPER_MODE_DEV_PLAN.md](../product/EPIS2_PAPER_MODE_DEV_PLAN.md)  
- [EPIS2_PAPER_MIRROR_RECONCILIATION.md](../product/EPIS2_PAPER_MIRROR_RECONCILIATION.md)
