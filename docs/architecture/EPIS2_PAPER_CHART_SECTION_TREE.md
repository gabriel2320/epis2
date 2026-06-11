# EPIS2 — Árbol secciones ficha papel (I–XIV)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Fuente de verdad código:**

| Artefacto | Ruta |
|-----------|------|
| IDs + schema | `packages/clinical-forms/src/paper-chart/schema.ts` |
| Árbol secciones | `packages/clinical-forms/src/paper-chart/paperChartSectionTree.ts` |
| Navegación dual-chart | `apps/web/src/navigation/paperChartNavigationTree.ts` |
| UI labels | `packages/design-system/src/copy/es.ts` → `chartModes.paperSections` |

> Referencia visual externa: [FichaPapel](https://github.com/gabriel2320/FichaPapel) (14 tabs, estética v1 EPIS2).

---

## 1. Estructura canónica

```text
paper_chart (blueprint SoT, no en registry 19 formularios scrollspy)
│
├── Modo dual-chart (DualChartPatientPage)
│   ├── ?chartMode=traditional   → 17 secciones TraditionalEhrLayout
│   └── ?chartMode=paper         → documento I–XIV
│
└── Secciones I–XIV (EPIS2_PAPER_CHART_SECTION_TREE)
    ├── I    cover
    ├── II   anamnesis
    ├── III  physicalExam
    ├── IV   orders
    ├── V    soap
    ├── VI   labs
    ├── VII  discharge
    ├── VIII nursing
    ├── IX   fluidBalance
    ├── X    consults
    ├── XI   procedures
    ├── XII  imaging
    ├── XIII consent
    └── XIV  socialWork
```

---

## 2. Conciliación con árbol de navegación

El árbol reconciliado principal (`epis2NavigationTree.ts`) mantiene **19 blueprints** sin duplicar rutas base.

Las superficies **dual-chart** y **secciones papel** viven en `paperChartNavigationTree.ts`:

| Superficie | Ruta |
|------------|------|
| Ficha tradicional | `/espacio/ficha?chartMode=traditional` |
| Ficha papel | `/espacio/ficha?chartMode=paper` |
| Impresión | `/espacio/ficha/papel/imprimir` |
| Sección N | `/espacio/ficha?chartMode=paper&section={id}` |

Hub padre: `patient-chart-hub` (`/espacio/ficha`).

---

## 3. Gates

```bash
npm run quality:paper-chart-section-tree-gate
npm run quality:paper-mode-nav-gate
npm run quality:dual-chart-scaffold-gate
```

---

## 4. Invariantes

- `PAPER_CHART_SECTION_IDS.length === 14`
- `EPIS2_PAPER_CHART_SECTION_TREE` derivado del schema (no duplicar orden en web)
- Labels UI desde design-system; labels cortos en `PAPER_CHART_SECTION_LABELS_ES` para árbol/documentación
- Estética v1 EPIS2 (bandas navy, Source Sans) — no import runtime FichaPapel
