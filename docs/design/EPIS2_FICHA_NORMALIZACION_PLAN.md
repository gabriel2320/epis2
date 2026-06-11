# EPIS2 — Plan de normalización ficha electrónica ↔ papel

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Programa:** **PROG-FICHA-NORM** (dentro de PROG-EXPERIENCIA-CORE-2026)  
**Estado:** Canónico diseño · pendiente implementación por microfases  
**Relacionado:** [EPIS2_PAPER_MIRROR_RECONCILIATION.md](../product/EPIS2_PAPER_MIRROR_RECONCILIATION.md) · [EPIS2_DUAL_CHART_VISUAL_CANON.md](./EPIS2_DUAL_CHART_VISUAL_CANON.md) · [EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md](./EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md)

> **Principio:** La ficha electrónica es el **espejo operativo** del modo papel: **misma información clínica**, **misma barra de comando**, **distinto renderizador** (tabular MD3 denso vs documento institucional). Un contrato de campos, dos superficies.

**Frase guía:** *Un paciente, un contrato clínico, dos pieles — comando siempre visible, cero acción duplicada.*

---

## 1. Diagnóstico (problemas reportados → causa raíz)

| Síntoma visible | Causa raíz en EPIS2 hoy | Regla de normalización |
|-----------------|-------------------------|------------------------|
| Páginas fuera de pantalla | Scroll doble (shell + panel); nav 17 secciones sin viewport lock | `100dvh` + scroll **solo** en panel central |
| Scrolls muy largos | Resumen + 16 secciones vacías + panel lateral siempre abierto | Una sección = un viewport; resumen acotado ≤2 scrolls |
| Demasiados botones | Fila 2 `ClinicalActionBar` (7+) **+** chips comando **+** CTAs tarjetas **+** Ctrl+K | Presupuesto acciones (§4) |
| Cuadros muy redondos | Perfil `calm` (20–24px) aplicado a ficha **traditional** | Perfil `traditional` max **10px** estricto |
| Tipografía pegada a bordes | Padding inline inconsistente en chips/cards/fields | Grid 8px + padding mínimo campo (12px horizontal) |
| Páginas mal alineadas | Mezcla `px: 2` sueltos sin grid común shell/panel | Columnas alineadas al nav (240px) + gutter 16px |
| Textos encimados | `lineHeight` bajo + `flexWrap` sin minHeight en chips | Truncation + `lineHeight` contextual (reglas tipográficas) |
| Tipografías poco atractivas / tamaños incoherentes | Mezcla tokens + bold ad hoc | Solo escala `epis2TypeScale`; un peso 600 por tarjeta |
| Demasiado bold | Títulos + chips + botones todos 600–700 | 600 solo título sección; cuerpo 400; meta 400 variant |
| Demasiadas sugerencias | Barra + palette + clarification + dictionary | Máx **3** chips barra · palette acotada · sin duplicar |
| Acciones repetidas | Evolución en barra, tarjeta resumen y comando NL | Catálogo único acciones (§4) |
| Color sin gradualidad | Saltos bruscos surface/surfaceContainer | Escalera tonal M3 (5 niveles) — no gradientes decorativos |
| Sin animaciones | `motion.ts` infra usada parcialmente | Transiciones 150–200ms en switch modo, panel, sección |
| Gráficos mal diseñados | Labs/demo sin escala ni meta temporal | Patrón sparkline + valor grande (C-3b) obligatorio |
| Demos basura / incompletos | `summaryFields` genéricos en 16 secciones | 5 casos demo curados · sección vacía = oculta en demo |
| Sin benchmark estético | Docs dispersos | Tablero referencias §2 (obligatorio en cada MF) |

---

## 2. Benchmark estético MD3 (referencias obligatorias)

Cada entrega PROG-FICHA-NORM debe citar **≥2 referencias** y capturar diff contra EPIS2.

### 2.1 Sistemas y premios

| Referencia | URL | Qué copiar | Qué NO copiar |
|------------|-----|------------|---------------|
| **Material 3 Expressive** (UX Design Awards 2026) | [ux-design-awards.com/.../material-3-expressive](https://ux-design-awards.com/winners/2026-1-material-3-expressive) | Jerarquía, research-backed clarity, motion responsable | Radii 28–48dp en ficha EMR densa |
| **M3 Foundations** | [m3.material.io/foundations](https://m3.material.io/foundations) | Tokens color/shape/motion, contraste | Dashboard marketing |
| **M3 Color roles** | [m3.material.io/styles/color/roles](https://m3.material.io/styles/color/roles) | `surfaceContainer*` tonal steps | Primary al 100% como fondo |
| **Figma M3 Design Kit** | [Community file 1035203688168086460](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit) | Spacing, component states | Copiar píldoras en tablas clínicas |

### 2.2 Productos de referencia (densidad clínica / enterprise)

| Producto | Por qué | Patrón EPIS2 |
|--------|---------|--------------|
| **Google Workspace** (Gmail, Calendar) | Barra búsqueda única, 80% neutros, foco contenido | Barra comando tipo Workspace en capa 3 |
| **Google Health / FHIR UIs** | Datos densos, filas tabulares | Secciones órdenes/labs/MAR |
| **Cliniva HMS (Angular M3)** | EMR template M3 hospitalario | Nav lateral + panel central |
| **Android Health Connect** | Listas compactas, chips estado | Banda paciente + chips alergia |

### 2.3 Anti-referencias (explícitas)

OpenMRS O3 · dashboards Excel · cards anidadas con sombra · gradientes decorativos · neón · FAB múltiples · wizard “Siguiente”.

### 2.4 Tablero visual interno (crear en MF-NORM-00)

```text
docs/design/references/
  benchmark-board.md          ← URLs + capturas anotadas
  captures/
    ref-workspace-command.png
    ref-m3-surface-ladder.png
    ref-cliniva-density.png
    epis2-before-traditional.png
    epis2-before-paper.png
    epis2-target-parity.png
```

Gate: `quality:ficha-norm-benchmark-gate` — board existe + ≥6 capturas referencia.

---

## 3. Contrato espejo papel ↔ electrónica

### 3.1 Mapa de secciones (canon unificado)

| ID canon | Papel (I–XIV) | Nav traditional | Fuente SoT |
|----------|---------------|-----------------|------------|
| cover | I Portada | navAdmin | patient + encounter meta |
| anamnesis | II Anamnesis | navAnamnesis | draft / observation |
| antecedents | III Antecedentes | navAntecedents | problems history |
| allergies | IV Alergias | navAllergies | `patient_allergies` |
| physicalExam | V Examen | navPhysicalExam | observations |
| diagnoses | VI Diagnósticos | navDiagnoses | `problems` |
| orders | VII Indicaciones | navOrders | `clinical_orders` |
| meds | VIII Medicación | navMeds | `patient_medications` |
| evolution | IX Evolución | navEvolution | drafts evolution |
| labs | X Laboratorio | navLabs | results inbox |
| imaging | XI Imagen | navImaging | service requests |
| consults | XII Interconsulta | navConsults | referrals |
| documents | XIII Documentos | navDocuments | `clinical_documents` |
| discharge | XIV Epicrisis | navEpicrisis | discharge draft |
| — | — | navSummary | agregador (solo electronic) |
| — | — | navProcedures / navAudit | trazabilidad |

**Regla:** Si un campo existe en papel, **debe** tener binding en electrónica (`fieldId` compartido en `packages/clinical-forms`).

### 3.2 Barra de comando (obligatoria en ambos modos)

Ya montada en `ClinicalShell` → `ClinicalActionBar` + `EpisUniversalCommandBar` + `CommandPaletteOverlay`.

**Normalización:**

```text
Capa 3 (única fila de acciones primarias):
  [Ficha Electrónica | Ficha Papel]  │  Campo NL comando  │  Ctrl+K hint
  (máx 3 chips sugerencia contextual)

Capa 3b (colapsable "Más acciones" — default cerrado en ≥1280px):
  Guardar · Firmar · Imprimir  (+ 0–2 contextuales)

PROHIBIDO en normalización:
  Fila duplicada + Evolución + Lab + Receta + Orden como botones si están en NL/comando
  CTAs repetidos en tarjeta resumen que dupliquen comando
```

Implementación objetivo: `ClinicalActionBar` → **modo compacto**; acciones frecuentes solo vía comando NL.

### 3.3 Layout espejo (viewport)

```text
┌─ Header 56px ─────────────────────────────────────────┐
├─ Banda paciente 48–56px (1–2 líneas, truncar) ──────┤
├─ Barra comando 56–72px (embedded, sin scroll) ──────┤
├ Nav │ Panel central (scroll ÚNICO) │ Contexto (opt) ┤
│240px│ flex 1 · minHeight 0          │ 280px colaps   │
├─ Footer legal 32px ─────────────────────────────────┤
└─ total: 100dvh · overflow: hidden en shell ──────────┘
```

| Modo | Panel central | Contexto |
|------|---------------|----------|
| **Electrónica** | Sección activa · tabular denso | Timeline, IA, pendientes |
| **Papel** | Hoja documento · grilla 6mm | Oculto en print; panel IA fuera área impresa |

---

## 4. Presupuesto de UI (normativo)

Extiende `apps/web/src/quality/uiDensityRules.ts`.

| Recurso | Máximo ficha dual |
|---------|-------------------|
| Botones visibles capa 3 | **4** (modo switch cuenta como 1 control) |
| Chips sugerencia comando | **3** (`EPIS_COMMAND_BAR_MAX_SUGGESTIONS` → 3) |
| CTAs por tarjeta resumen | **1** primario |
| Acciones locales por card | **2** (ya definido) |
| Cards verticales resumen | **6** antes de tabs |
| Iconos visibles workspace | **10** (reducir de 12) |
| Pesos tipográficos 600+ por card | **1** (título) |
| Border radius traditional | **≤10px** (`epis2ShapeProfiles.traditional.max`) |
| Border radius paper campos | **0–4px** (línea institucional) |
| Scroll máximo resumen | **2** viewport heights |
| Secciones demo vacías visibles | **0** (ocultar nav item si no hay data demo) |

Gate: `quality:ficha-norm-density-gate`.

---

## 5. Sistema visual normalizado

### 5.1 Forma — resolver conflicto Calm vs Traditional

| Superficie | Perfil | Radius max |
|------------|--------|------------|
| Ficha **electrónica** traditional | `epis2ShapeProfiles.traditional` | **10px** |
| Ficha **papel** | 0–4px campos · 8px shell | documento |
| Barra comando / palette | `epis2ShapeProfiles.command` | 8–10px barra · no píldora 28px |
| Resumen Calm (mosaico) | `calm.island` **solo** en `navSummary` | 20px **solo** tarjetas resumen |

**Acción MF-NORM-04:** grep audit — ningún `borderRadius: 16|20|24` fuera de `navSummary` y comando premium.

### 5.2 Color — gradualidad tonal (no gradientes decorativos)

Escalera obligatoria (light):

```text
background.default     #F7F9FC   (canvas)
surfaceContainerLowest #FFFFFF (panel central)
surfaceContainerLow   #EEF3F7   (nav / supporting)
surfaceContainer      #E2E8EE   (hover filas)
surfaceContainerHigh  #D5DEE6   (selected nav)
outlineVariant        #C5CDD6   (bordes 1px)
```

Tema objetivo: **`clinical-calm`** 8º perfil MTB (petróleo `#0B5C66`).

### 5.3 Tipografía

Aplicar [EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md](./EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md) sin excepciones:

- Padding input: **12px 14px** mínimo
- Chip: **8px 12px**
- Botón small: altura **32px**, padding horizontal **12px**
- Piso **13px** — prohibido menor
- Bold 600: solo un elemento dominante por bloque

### 5.4 Motion (animaciones sutiles)

Desde `packages/epis2-ui/src/theme/motion.ts`:

| Interacción | Duración | Curva |
|-------------|----------|-------|
| Switch traditional↔paper | 200ms | standard |
| Colapsar panel contexto | 180ms | emphasized decelerate |
| Cambio sección nav | 150ms | fade + slide 4px |
| Apertura palette Ctrl+K | 200ms | ya MUI Dialog |

Prohibido: bounce, parallax, animaciones >300ms en flujo clínico.

### 5.5 Gráficos y labs

Patrón único `EpisLabHighlight` (C-3b):

- Valor numérico: token `headline` (17px), peso 500
- Unidad + rango: `body` secondary
- Sparkline: altura 24px, sin grid decorativo
- Estado: color + **texto** (no solo color)

---

## 6. Datos demo normalizados

| Caso | Uso | Regla |
|------|-----|-------|
| DEMO-001 | Ambulatorio simple | Solo secciones con data real |
| DEMO-002 | Ingreso hospitalario | Alergias + órdenes + labs |
| DEMO-003 | Epicrisis pendiente | Papel + electrónica sync |
| DEMO-004 | Farmacia / MAR | Meds 3 zonas |
| DEMO-005 | Documentos + RAG | PDF indexado |

**Prohibido:** lorem ipsum clínico · strings “TODO” · números aleatorios sin unidad · duplicar alergias en 3 paneles.

MF-NORM-06: script `scripts/demo/audit-demo-cases.mjs` + gate.

---

## 7. Microfases PROG-FICHA-NORM

Integrar en Frente B (electrónica) y A (papel mirror). Orden sugerido:

| ID | Entrega | Frente | Gate |
|----|---------|--------|------|
| **MF-NORM-00** | Benchmark board + capturas before | — | `quality:ficha-norm-benchmark-gate` |
| **MF-NORM-01** | Contrato sección `fieldId` papel↔nav (doc + types) | B+A | typecheck |
| **MF-NORM-02** | Viewport shell: scroll único, 100dvh fix | B+A | E2E dual-chart |
| **MF-NORM-03** | Barra comando compacta; dedupe acciones | C | `test:e2e:ux-g02` |
| **MF-NORM-04** | Audit radius + shape profiles | B | grep gate |
| **MF-NORM-05** | Audit tipografía + padding + bold budget | B+A | Storybook ficha |
| **MF-NORM-06** | Demo cases curados (5) | B+A | demo audit script |
| **MF-NORM-07** | Escalera tonal clinical-calm default | B | `theme:validate` |
| **MF-NORM-08** | Motion switch modo + panel + sección | B+A | visual |
| **MF-NORM-09** | Secciones espejo batch 1 (alergias…evolución) | B+A | mirror test |
| **MF-NORM-10** | Secciones espejo batch 2 + ocultar vacías demo | B+A | E2E |
| **MF-NORM-11** | Signoff paridad visual papel↔electrónica | B+A | `quality:ficha-norm-signoff-gate` |

**Dependencia:** MF-NORM-00 antes de cualquier pixel change.

---

## 8. Checklist signoff (MF-NORM-11)

Capturas light/dark · traditional + paper · mismo paciente DEMO-002:

- [ ] Barra NL visible sin scroll en 1366×768
- [ ] Ctrl+K abre en <1s; no tapa banda paciente
- [ ] 0 secciones demo vacías visibles
- [ ] 0 botones duplicados (comando vs barra vs card)
- [ ] 0 radius >10px fuera resumen Calm
- [ ] 0 texto <13px
- [ ] 0 solapamiento chips alergia
- [ ] Switch modo sin perder paciente ni comando
- [ ] Print papel oculta shell; electrónica no
- [ ] Piloto clínico 15 min: “¿parece ficha real?” ≥4/5

---

## 9. Relación con otros programas

| Programa | Relación |
|----------|----------|
| PROG-FICHA-ELECTRONICA (MF-TE-*) | TE-02…04 absorbidos por NORM-09/10 |
| PROG-FICHA-PAPEL (MF-PA-05 mirror) | NORM-01/09 entregan contrato espejo |
| PROG-BARRA-COMANDO (MF-CM-01) | NORM-03 alinea barra compacta |
| PROG-FICHA-NORM | **Precede** signoff MF-TE-08 y MF-PA-08 |

---

## 10. Próxima sesión sugerida

```text
MF-NORM-00 — Benchmark board
Permitido: docs/design/references/**, reports/epis2-mf-norm-00-benchmark.md
Prohibido: cambios componentes producto
Gate: quality:ficha-norm-benchmark-gate (crear script)
```

---

## Referencias internas

- [EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md](./EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md)
- [EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md](./EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md)
- [EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md](./EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md) § conflicto radius
- [EPIS2_TRES_FRENTES_DEV_PLAN.md](../product/EPIS2_TRES_FRENTES_DEV_PLAN.md)
