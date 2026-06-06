# EPIS2 Clinical Material 3 Design System — Conciliación adaptativa

**Versión:** 1.0 · **Fecha:** 2026-06-06  
**Estado:** Canónico — gobierna diseño visual y cierre de olas  
**Nombre del sistema:** **EPIS2 Clinical Material 3 Design System** (ECM3)

> Las 21 olas agregan **capacidades clínicas**, no lenguajes visuales nuevos.  
> Material 3 resuelve interacción y consistencia; **EPIS2 Clinical UI** resuelve significado médico.

**Complementa:** [`EPIS2_WAVE_EXECUTION_CANON.md`](../product/EPIS2_WAVE_EXECUTION_CANON.md) · [`EPIS2_IDC_EXECUTION_MATRIX.md`](../product/EPIS2_IDC_EXECUTION_MATRIX.md) · [`M3_ADOPTION_PLAN.md`](./M3_ADOPTION_PLAN.md)

**Referencias M3 oficiales:** [Adaptive design](https://m3.material.io/foundations/adaptive-design) · [Applying layout](https://m3.material.io/foundations/layout/applying-layout) · [Window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes) · [Material density on web](https://m3.material.io/blog/material-density-web) · [M3 Expressive (web parcial)](https://m3.material.io/blog/building-with-m3-expressive)

---

## 1. Decisión de conciliación (resumen ejecutivo)

| Tema | Propuesta externa | Estado EPIS2 | Decisión |
|------|-------------------|--------------|----------|
| Sistema único para todas las olas | ECM3 sobre M3 estable | M3-00…09 **completado** | **Adoptado** — sin estética por ola |
| M3 Expressive | Solo inicio, comando, onboarding, IA no crítica | Login + Comando expresivos | **Adoptado** — no UCI/MAR/alertas |
| M3 web nativo vs MUI | M3 estable, no depender de Expressive web | MUI 6 interpretado vía `createEpis2Theme` | **Adoptado** — ver §2 |
| Paquetes separados tokens/theme/clinical-ui | 6 paquetes npm | `epis2-ui` consolidado + `design-system` copy | **Diferido** — split solo si volumen lo exige (§3) |
| 6 áreas de navegación visibles | Inicio…Administración | 5 workspaces rail + ficha transversal | **Conciliado** — §4 |
| Olas en UI | Prohibido | Olas solo en docs/agentes | **Adoptado** |
| Paleta institucional fija | Seeds petróleo `#35606A`… | 6 perfiles MTB + preferencias usuario | **Conciliado** — default institucional + personalización acotada (§5) |
| Tipografía Roboto Flex | UI + Roboto Mono datos | **Inter** + tabular nums | **Mantiene Inter** — Roboto como alternativa documentada |
| 3 densidades | Comfortable / Compact / Clinical dense | comfortable + compact | **Compact = operación**; **clinical dense = compact + tokens UCI** (§6) |
| Shell 3 zonas | Rail + trabajo + supporting pane | Two-pane + context pane implementados | **Adoptado** — §7 |
| Impresión independiente | Screen / Print Letter / Print A5 | Norma canónica; primitivas `Print*` pendientes producto | **Adoptado** — gate por ola (§11) |
| Gate M3-UI por ola | Checklist 16 ítems | Gates funcionales existentes | **Añadido** gate **M3-UI** obligatorio (§11) |

---

## 2. Stack técnico conciliado

```text
Material Design 3 (especificación)
        ↓
Material UI 6 + MUI X (React, bajo demanda lazy)
        ↓
@epis2/epis2-ui  ← EPIS2 Clinical Material 3 Design System
        ↓
apps/web (rutas, hooks, sin @mui/* directo)
```

**Regla invariante:** `apps/web` importa solo `@epis2/epis2-ui` (y copy de `@epis2/design-system`).

**M3 Expressive:** reservado para Comando, Login, empty states y transiciones no críticas. Formularios clínicos, firma, UCI, MAR, documentos firmados = **M3 Standard**.

---

## 3. Arquitectura de paquetes — hoy vs objetivo

### 3.1 Propuesta conceptual (capas)

```text
epis2-design-tokens     → color, spacing, shape, motion, breakpoints, clinical-status, print
epis2-material-theme    → createEpis2Theme, MTB profiles, CSS variables
epis2-ui                → primitivos M3 (Button, TextField, DataTable, NavigationRail…)
epis2-clinical-ui       → PatientContextHeader, ClinicalAlert, SignaturePanel, AIProvenance…
epis2-print             → temas Carta/A5, componentes documentales
epis2-icons             → iconografía clínica consistente
```

### 3.2 Implementación actual (2026-06-06)

| Capa propuesta | Ubicación real | Notas |
|----------------|----------------|-------|
| Tokens + theme | `packages/epis2-ui/src/theme/` | `color-roles`, `clinical-roles`, `shape`, `motion`, `density`, `breakpoints` |
| Primitivos M3 | `packages/epis2-ui/src/primitives/` | EpisButton, EpisTextField, EpisM3Chips… |
| Clinical UI | `packages/epis2-ui/src/clinical/` + `forms/` + `command/` | No paquete separado aún |
| Print | `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` | Primitivas `Print*` en roadmap `epis2-ui` |
| Copy ES | `packages/design-system/src/copy/es.ts` | Sin MUI |
| Widgets clínicos | `packages/epis2-widgets/` | Registro + permisos |

**Decisión:** no fragmentar npm en esta fase. El **barrel** `@epis2/epis2-ui` ya exporta la API pública; subpaths `data|charts|tree` para lazy MUI X.

**Split futuro (trigger):** cuando `epis2-ui` supere ~150 archivos de tema+print o haya segundo consumidor (app móvil).

---

## 4. Navegación — seis áreas vs cinco workspaces

### 4.1 Regla

> El usuario **nunca** ve «Ola N». Ve **áreas de trabajo** filtradas por rol.

### 4.2 Mapa de conciliación

| Área visible (IA) | Workspace rail (`EpisClinicalWorkspaceId`) | Rutas / patrones M3 | Roles típicos |
|-------------------|--------------------------------------------|----------------------|---------------|
| **Inicio** | `command` | Search bar expresiva · sugerencias · accesos recientes | Todos |
| **Pacientes** | transversal + `ambulatory` | List-detail · ficha M3 · two-pane | Médico, enfermería |
| **Operación** | `ambulatory` · `icu` · **`emergency`** *(planificado)* | Agenda 3 paneles · board urgencia · grid UCI | Médico, enfermería, farmacia |
| **Calidad** | `quality_iaas` | Filtros + tabla principal + excepciones | IAAS, jefatura |
| **Analítica** | pestañas dentro `quality_iaas` + `/epis2/dashboard` | KPIs · gráficos secundarios — **no** dashboard home | Jefatura, admin |
| **Administración** | `admin_system` | Data tables · forms admin · consola interop | Admin, auditor |

### 4.3 Visibilidad por rol (sin cambiar home)

```text
Médico          → command, ambulatory, (emergency)
Enfermería      → command, ambulatory, icu
Farmacia        → command, ambulatory (farmacia tab), quality_iaas
IAAS            → command, quality_iaas
Jefatura        → command, quality_iaas (+ analítica dashboard)
Administrador   → admin_system (+ quality según permiso)
```

Implementación: `clinicalWorkspaceRegistry.ts` · `allowedRoles` · **no** menú de 200 ítems.

### 4.4 Adaptación por breakpoint (M3 window classes)

| Clase | Layout EPIS2 |
|-------|--------------|
| **Expanded** (≥1200px) | Navigation rail + área principal + supporting pane (two-pane) |
| **Medium** (840–1199px) | Rail + list/detail; supporting pane bajo demanda (drawer) |
| **Compact** (<840px) | Navigation bar inferior · una vista · contexto en bottom sheet |

**Breakpoints primarios clínicos:** 1366×768 · 1440×900 · 1920×1080. UCI/sábana no se replica íntegramente en compact.

---

## 5. Sistema visual conciliado

### 5.1 Color — institucional + roles clínicos inmutables

| Rol propuesto | Rol EPIS2 | Implementación |
|---------------|-----------|----------------|
| Azul petróleo marca | Primary | Perfil MTB **`calm-teal`** (`#006A6A`) — **default institucional recomendado** |
| Verde azulado normal | `clinical.approved` | `#18794E` — inmutable |
| Violeta IA | `clinical.aiAssistance` | `#7455A6` — inmutable |
| Ámbar advertencia | `clinical.warning` | `#9A6700` — inmutable |
| Rojo peligro real | `clinical.critical` | `#B42318` — inmutable |

**Personalización:** `/preferencias-apariencia` — 6 perfiles MTB; **roles clínicos no cambian** al alternar acento.

**Regla clínica (M3-G03):** icono + texto + color — nunca solo ● rojo.

### 5.2 Tipografía

| Propuesta | EPIS2 actual | Decisión |
|-----------|--------------|----------|
| Roboto Flex UI | **Inter** 14px base | Mantener Inter (gates contraste, `typography-rules.test`) |
| Roboto Mono | Tabular nums en grids/resultados | Usar `fontFeatureSettings: 'tnum'` en Inter donde aplique |

### 5.3 Formas (radios conciliados)

| Elemento | Radio |
|----------|-------|
| Barra de comando | 24–28px |
| Botones principales | 20px (`shape.large`) |
| Contenedores / islas clínicas | 16px |
| Campos outlined | 8–12px |
| Tablas / paneles densos | 8px |
| Documentos impresos | 0px |

### 5.4 Elevación

Separación por **tono de superficie** + espacio — sombras mínimas (THEME-06). Niveles 0–3 alineados a `epis2-elevation.ts`.

---

## 6. Tres densidades de interfaz

| Modo | EPIS2 | Aplicación | IDC / olas |
|------|-------|------------|------------|
| **Comfortable** | `density: 'comfortable'` | Comando, consulta, formularios largos | 1–3, 31–40 |
| **Compact** | `density: 'compact'` | Agenda, farmacia, resultados, admin | 4–9, 16–17, 58 |
| **Clinical dense** | `compact` + tokens workspace `icu` / `emergency` | UCI, urgencia, MAR, IAAS tableros | 10–14, 41–50, 111–120, 131–140 |

**Gate:** objetivos táctiles ≥48dp en clinical dense (M3 density guidance).

**Preferencia usuario:** solo comfortable ↔ compact; clinical dense **automático por workspace**, no toggle libre.

---

## 7. Shell clínico — layout adaptativo

```text
┌───────┬───────────────────────────────┬───────────────────┐
│ NAV   │ PatientContextBar (estable)   │ Supporting pane   │
│ RAIL  ├───────────────────────────────┤ (contexto / IA)   │
│       │ Área clínica principal        │ alertas, resumen  │
│       │ (form · tabla · timeline)     │ pendientes        │
└───────┴───────────────────────────────┴───────────────────┘
```

| Zona | Componente EPIS2 | Patrón M3 |
|------|------------------|-----------|
| Izquierda | `EpisNavigationRail` | Navigation rail / drawer adaptativo |
| Superior | `EpisPatientContextBar` | Top app bar contextual — alergias sin franja roja total |
| Centro | `EpisClinicalTwoPaneLayout` · `GeneratedClinicalFormPage` | List-detail · max-width lectura ≤65ch |
| Derecha | `EpisClinicalContextPane` · `PatientClinicalAiPanel` | Supporting pane — **IA aquí, no chat flotante** |
| Comando | `EpisCommandBar` | Search M3 expresiva — identidad producto |

**Anatomía formulario única (todas las olas):**

```text
1. Título y contexto
2. Estado documento (borrador / firmado)
3. Contenido clínico
4. Ayuda o IA contextual (supporting pane)
5. Validaciones
6. Acciones persistentes (EpisClinicalFormFooter)
7. Firma y trazabilidad
```

Campos clínicos: **outlined**. Comando y filtros: **filled** permitido.

---

## 8. Integración visual por ola (sin nueva estética)

Cada ola consume **patrones M3 existentes** + variantes de dominio. Ver matriz IDC para Estado/Prioridad/Horizonte/Decisión.

| Ola | Patrón M3 dominante | Superficies EPIS2 | Gate visual clave |
|-----|----------------------|-------------------|-------------------|
| **0** | Login, estados, dialogs, snackbar | `EpisAuthScreen`, skeletons, session expired | Estados vacío/error/offline/denied |
| **1A–1D** | Search, rail, forms, side sheet | Comando, ficha, SOAP, receta, lab, IA | Una acción primaria · supporting pane |
| **2** | Tabs, scrollspy, action bar | `outpatient_visit` una superficie | Completitud secciones visible |
| **3** | List-detail, timeline, viewer | Antecedentes, documentos | Timeline funcional, no ornamental |
| **4** | Calendar, filter chips, 3 paneles | Recepción/agenda | Estados texto + tono |
| **5** | Data tables, status chips | Facturación *(Defer/Future)* | Mismo tema — no branch visual |
| **6** | Editor \| preview \| firma | Documentos Carta/A5 | Modo inmutable post-firma |
| **7–8** | Filtro + KPI + tabla + excepciones | IAAS, admin | No dashboard de tarjetas infinitas |
| **9** | IA disclosure, supporting pane | Assist, RAG | Violeta IA + provenance |
| **10** | Board operacional + detail | **`emergency`** workspace | ESI etiqueta + color |
| **11** | Task lists, MAR matrix | Enfermería, MAR | Teclado + SR en MAR |
| **12** | Longitudinal summary | APS | Tendencias, no episodio único |
| **13** | Clinical dense grid | UCI workspace | Sin Expressive |
| **14** | Alert board, surveillance tables | IAAS avanzada | Aislamiento en header/censo |
| **15** | Checklist + timeline quirúrgico | Pabellón *(Future)* | Canvas especializado §9 |
| **16** | Medication workspace 3 paneles | Farmacia | Estados prescrito/validado/… |
| **17** | Dense tables + review panel | Calidad/auditoría | List-detail sin abandonar lista |
| **18** | Clinical canvases | Especialidades *(Defer)* | Mismo shell, canvas propio |
| **19** | Consola observabilidad IA | Admin ops | No estética terminal principal |
| **20** | Consola interop | HL7/FHIR ops | Estados textuales operativos |

---

## 9. Ola 18 — clinical canvases (conciliación)

Partograma, odontograma, heridas corporales **no** van en `TextField` genérico.

Deben ser **clinical canvases** con shell compartido:

```text
PatientContextBar + navegación + acciones M3 + roles color + firma + auditoría + print theme
```

---

## 10. Micro-ola M3-0 — propuesta vs realidad

| ID propuesto | Entregable | Estado EPIS2 | Gap |
|--------------|------------|--------------|-----|
| M3-0.1 | Tokens | ✅ M3-01 | — |
| M3-0.2 | Tema claro/oscuro | ✅ M3-02 | — |
| M3-0.3 | Navegación adaptativa | ✅ M3-05, M3-06 | Workspace `emergency` pendiente |
| M3-0.4 | PatientContextHeader | ✅ `EpisPatientContextBar` | — |
| M3-0.5 | Form shell | ✅ `EpisClinicalForm`, two-pane | — |
| M3-0.6 | Clinical alerts | ✅ `ClinicalAlertsPanel`, `EpisSafetyBanner` | — |
| M3-0.7 | Data tables | ✅ `EpisDataGrid` lazy | — |
| M3-0.8 | Supporting pane | ✅ context pane, LAYOUT-01…05 | — |
| M3-0.9 | IA provenance | ◐ `EpisAiDisclosure`, `ai_runs` | Completar en Ola 9 |
| M3-0.10 | Print Carta/A5 | ◐ Norma canónica | Implementar `Print*` producto |
| M3-0.11 | Storybook | ◐ `/dev/ui-catalog`, `VisualThemeCatalogPage` | Storybook formal opcional |
| M3-0.12 | Visual regression | ❌ | Añadir a CI post-piloto |

**Conclusión:** la plataforma visual **base está construida** (M3-00…09). Las olas 2+ **consumen** ECM3; no reinician diseño.

---

## 11. Gate M3-UI (obligatorio al cerrar ola/MF)

Añadir al checklist de `reports/epis2-mf-*.md` y cierre de ola:

```text
□ Solo tokens EPIS2 / CSS variables — sin hex sueltos en apps/web
□ Sin radios arbitrarios fuera de shape.ts
□ Componentes desde @epis2/epis2-ui — sin @mui/* en apps/web
□ Loading · empty · error · read-only · permission denied
□ Teclado + foco visible (WCAG)
□ No comunicar solo con color (icono + texto)
□ Expanded + medium probados (compact donde aplique)
□ Impresión Carta/A5 con tema print independiente (si la ola emite documentos)
□ IA en supporting pane con disclosure (si la ola usa IA)
□ Captura visual en catálogo / signoff clínico
□ Sin Expressive en UCI/MAR/alertas críticas/firma
```

Una ola **no cierra** porque «la pantalla existe». Cierra cuando integra ECM3 + gates §10 del canon de ejecución.

---

## 12. Jerarquía de acciones M3 (EPIS2)

| Acción | Componente |
|--------|------------|
| Firmar, confirmar | `EpisButton` filled |
| Secundaria importante | Filled tonal |
| Cancelar, volver | Text |
| Alternativa | Outlined |
| Herramienta puntual | Icon button |
| Filtro / estado | Filter / assist chip |
| Selección exclusiva | Segmented button |

**Máximo un filled dominante por viewport** (M3-G13). Secundarias en menú overflow.

---

## 13. Movimiento

**Permitido:** supporting pane, list↔detail, confirmación, carga, sugerencia IA no crítica.

**Prohibido:** resultados críticos, MAR, tablas UCI, documentos firmados, impresión.

Respetar `prefers-reduced-motion` (`motion.ts`).

---

## 14. Impresión — tres temas

```text
EPIS2 Screen Theme          → epis2-ui / createEpis2Theme
EPIS2 Print Letter Theme    → EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md
EPIS2 Print A5 Theme        → idem
```

Pantalla: tonal, chips, navegación. Impresión: B/N seguro, márgenes normados, sin sombras, sin captura de pantalla.

Documentos firmados en UI: fondo neutro + banner firmado + sello temporal + rectificación (no editar).

---

## 15. Índice documental ECM3

| Documento | Contenido |
|-----------|-----------|
| Este archivo | Conciliación olas × M3 adaptativo |
| `EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md` | Tokens, perfiles MTB, componentes clave |
| `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` | Standard vs Expressive |
| `EPIS2_UI_ARCHITECTURE.md` | Paquetes, wrappers, reglas import |
| `EPIS2_ROLE_WORKSPACES_M3.md` | Workspaces × profundidad MD3 |
| `EPIS2_CLINICAL_TWO_PANE_LAYOUT.md` | Enfoque ↔ contexto |
| `EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` | Carta/A5 |
| `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` | 20 prohibidos |
| `M3_ADOPTION_PLAN.md` | Historial M3-00…09 |
| `EPIS2_IDC_EXECUTION_MATRIX.md` | 200 IDC × cuatro campos |

---

**Frase guía:** *Un producto clínico, un Material 3 — las olas añaden significado, no skin.*
