# EPIS2 — Auditoría UX/UI y plan de simplificación

**Fecha:** 2026-06-04 · **Post:** tag `TRAMOS-AK-SIGNOFF-PREP`  
**Estado:** Auditoría cerrada · **Fase UX-A aprobada** (implementación pendiente)  
**Canon:** `docs/PRODUCT_CANON.md` · Invariante #6–8 (Command Center, no dashboard home, información oculta)

---

## Acta — Aprobación fase UX-A

**Veredicto:** EPIS2 no sufre de mala arquitectura; sufre de **acumulación de interfaz**. Eso es reversible sin reconstruir el producto.

**Decisión:** **Command-first manda.** El EHR clásico (rail + workspaces + tabs + quick-actions) queda como **acceso secundario**, no como segundo producto paralelo.

| Decisión | Estado |
|----------|--------|
| Aprobar **fase UX-A** | ✅ |
| Árbol de navegación definitivo (5 nodos) | ❌ Posponer — validar con uso real |
| Reestructuración masiva workspaces / eliminar tabs | ❌ Posponer |
| Patient Workspace compacto (tabs Resumen/Acciones/Registros) | ⏸ **UX-B**, no UX-A |

### Alcance UX-A (implementar ahora)

Orden de trabajo acordado:

```text
1. AppBar operativa fija
2. Quick actions → comando (Command Registry + sugerencias)
3. Fix router 12 tabs dashboard
4. Casos demo narrativos (episodios clínicos completos)
5. Reducir rail lateral en /comando (conservador: ocultar switcher 8→1)
6. Gate LAYOUT-G12 (nested frames)
```

### Fuera de UX-A (explícito)

- Rediseño completo del árbol de 39 superficies → 5 nodos.
- Reescritura del registry de workspaces.
- Eliminación masiva de tabs dashboard.
- Refactor Quality/ICU dashboard (24/22 Papers) — **UX-B**.

### Hipótesis Nivel 1 (no implementar aún)

Validar con usuarios antes de fijar Nivel 2:

```text
Comando · Pacientes · Hospitalización · Administración
```

---

## Diagnóstico ejecutivo

EPIS2 tiene **arquitectura y gates técnicos maduros**, pero la experiencia acumula patrones de **EHR tradicional** que contradicen el flujo canónico:

```text
Login → Centro de Comando → instrucción → formulario mínimo → borrador → aprobación humana
```

El riesgo no es MUI ni la falta de funcionalidad. Es **fragmentación visual y navegacional**:

```text
Arquitectura madura + muchas microfases + diseño acumulativo = experiencia fragmentada
```

**Veredicto:** Ficha técnicamente sólida, percibida como **compleja como los sistemas que EPIS2 quería superar**. La prioridad debe ser **simplificación radical**, no nuevas features.

---

## 1. Informe UX (experiencia clínica)

### 1.1 Alineación con canon

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Home = Centro de Comando | ✅ Gate OK | `command-center-home`, `/comando` |
| Command-first en teoría | ✅ | `EpisCommandBar`, Command Registry |
| Command-first en práctica | ⚠️ Parcial | Rail 8 workspaces + 12 tabs dashboard + 19 quick-actions en ficha |
| 1 pantalla = 1 tarea | ❌ | `PatientWorkspacePage` apila resumen + widgets + longitudinal + 19 botones + notas + borradores |
| Información no solicitada oculta | ❌ | Invariante #8 solo revisión manual; ficha muestra todo por defecto |

### 1.2 Densidad por pantalla (altura de trabajo)

| Pantalla | Problema | Severidad |
|----------|----------|-----------|
| **Ficha paciente** (`PatientWorkspacePage`) | Scroll infinito; ~30–35 botones en estado cargado | **Crítica** |
| **Tableros tramo** (`*DashboardTab.tsx`) | 6–24 paneles outlined apilados | **Alta** |
| **Longitudinal** (`PatientLongitudinalPanel`) | 8+ secciones Paper + acordeones | **Alta** |
| **Centro de Comando** | Aceptable si panel paciente cerrado; logo + título ocupan espacio vertical | **Media** |
| **Formularios clínicos** | Two-pane + dock FAB — disciplinado (1 primary) | **Baja** |
| **Revisión borrador** | 4–5 botones, jerarquía clara | **Baja** |

### 1.3 Botonería (Problema 8)

**Regla objetivo:** 1 acción principal · 2 secundarias · resto en menú/comando.

| Página | Primary | Secondary | Terciaria | Cumple regla |
|--------|---------|-----------|-----------|--------------|
| CommandCenter | 1 (Ejecutar) | 2–3 | 0 | ✅ |
| PatientWorkspace (cargada) | 1 (Volver Comando) | **~24 outlined** | 4–6 | ❌ |
| GeneratedClinicalForm | 1–2 (Guardar/FAB) | 2–3 | 1 | ✅ |
| DraftReview | 1 (Aprobar) | 2–3 | 0 | ✅ |

**Peor caso:** 19 botones `outlined` idénticos en “Acciones rápidas” — mismo peso visual, sin jerarquía.

### 1.4 AppBar operativa (Problema 4)

Estado actual:

- Barra superior **no es centro operativo** en rutas clínicas (paciente en chrome separado, tema/logout dispersos).
- `EpisTopAppBar`: `position="static"`, estilo “tarjeta” con bordes redondeados — **decorativa**, no fija.
- `ClinicalPatientChartChrome` solo visible con paciente activo.

**Objetivo canónico (usuario):**

```text
[Buscar paciente] [Comando] [Paciente activo] [Tareas] [Alertas] [Usuario]
```

Siempre visible, sin logo gigante ni título displayMedium dominante.

---

## 2. Informe visual M3

### 2.1 El problema no es MUI

Los anti-patrones documentados (`EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` §5) ya prohíben tarjetas anidadas. **No hay gate automatizado** que lo enforce.

### 2.2 Contenedores y “cajas dentro de cajas” (Problemas 1–2)

**Literal EpisCard-in-EpisCard / Paper-in-Paper:** 0 archivos.

**Framing compuesto (deuda real):**

```text
EpisDashboardShell
 └─ epis2IslandSx (capa 1)
     └─ Box border:1 tabs (capa 2)
         └─ Box border:1 content (capa 3)
             └─ Paper outlined × N (capa 4+)
                 └─ EpisMetric mini-card (capa 5)
```

| Prioridad | Archivos | Instancias Paper outlined |
|-----------|----------|---------------------------|
| P0 | `QualityDashboardTab.tsx` | **24** |
| P0 | `IcuDashboardTab.tsx` | **22** |
| P1 | `PharmacyDashboardTab`, `OrDashboardTab`, `ApsDashboardTab`, `SpecialtyDashboardTab` | 11–12 c/u |
| P1 | `EpisDashboardShell.tsx`, `Epis2WidgetSurface.tsx` | Shell sistémico |
| P2 | `PatientLongitudinalPanel.tsx`, `ResultsInboxPage.tsx` | Clínico |

**Regla propuesta LAYOUT-G12:**

```text
No nested visual frames > 1 nivel
(Pantalla → Sección; nunca Pantalla → Caja → Caja → Caja)
```

Implementación sugerida: gate estático que flaggee `Paper variant="outlined"` bajo ancestros `epis2IslandSx` / `EpisDashboardShell`.

### 2.3 Tema y colores (Problema 3)

| Ámbito | Hallazgo |
|--------|----------|
| `apps/web/src` | **0** hex/rgb hardcodeados en UI |
| `packages/epis2-ui/src` (fuera theme/) | **0** violaciones |
| Gate `validate-no-hardcoded-colors` | OK en producto |
| `topBarBg: 'transparent'` en `visual-identity.ts` | Barra no hereda superficie → **percepción** de tema roto |
| Componentes raw MUI `Button` en ficha | Mezcla `variant`/`appearance` — inconsistencia visual, no color hardcodeado |

**Conclusión:** El tema **falla en percepción** (capas transparentes, frames múltiples, botones sin sistema unificado), no en tokens faltantes.

### 2.4 Regla de diseño EPIS2 (propuesta canon)

```text
No Card por defecto.
Usar: espaciado · tipografía · divisores · superficies tonales.
```

Referencia: anti-patrón §5 + reglas 60-30-10 ya en canon.

---

## 3. Informe navegación (Problemas 7, 9, 10)

### 3.1 Árbol actual vs árbol objetivo

**Canon producto:**

```text
Comando → (opcional paciente) → instrucción → página mínima
```

**Implementación actual:**

```text
Rail 8 workspaces (N0)
 + hasta 8 ítems contextuales
 + 12 tabs dashboard
 + 5 tabs ficha paciente
 + 19 rutas /espacio/*
 + nav sticky Comando/Ficha/Tablero
 = lattice menu-first paralelo al comando
```

### 3.2 Conteos

| Artefacto | Cantidad | Nota |
|-----------|----------|------|
| Workspaces rail | **8** | Objetivo usuario: 5–7 nodos |
| Máx. iconos rail (ambulatorio) | **~16** + divider | Objetivo: Comando, Pacientes, Trabajo, Hospitalización, Admin |
| Tabs dashboard (UI) | **12** | |
| Tabs dashboard (router válidos) | **6** ⚠️ | Bug: reception/emergency/icu/or/aps/specialty → coerced a `work` |
| Tabs ficha paciente | **5** | |
| Rutas clínicas `/espacio/*` | **24** | |
| Superficies reconciliadas | **39** | `epis2NavigationTree.ts` |
| Intents → dashboard | **5** | Sin comando para 6 tabs tramo |

### 3.3 Profundidad de clics desde `/comando`

| Tarea | Command-first | Menu-first |
|-------|---------------|------------|
| Evolución (paciente activo) | **1** | — |
| Tablero trabajo | **1** | **1** (rail) |
| Ficha → formulario | **1–2** | **3–5** |
| Tablero recepción | — (router roto) | **1** → cae en `work` |
| APS / UCI / farmacia tablero | — | **2+** |

**Máxima cadena menu-only:** 5 clics (workspace → buscar → paciente → tab → formulario).

### 3.4 Drift documental

- `EPIS2_RECONCILED_NAVIGATION_TREE.md`: 5 workspaces, 6 tabs — **desactualizado** vs código (8 / 12).
- `clinicalWorkspaceRegistry.patientTabIds` incluye `certificates`, `flowsheet` — **no existen** en `PATIENT_CHART_TABS`.
- Recepción: 3 ítems rail → **misma URL** (`tab=reception`).

### 3.5 Árbol objetivo — hipótesis, no spec de implementación

Dirección acordada (emergente tras UX-A + uso real):

```text
COMANDO
├── Paciente (…)
├── Hospitalización (…)
├── Ambulatorio / Calidad (según uso)
└── Configuración
```

**No aprobar como árbol definitivo.** Riesgo: simplificar → perder atajo → frustración → menús ocultos reaparecen. Nivel 2 lo decide el piloto, no el diseño abstracto.

---

## 4. Informe datos demo (Problema 6)

### 4.1 Veredicto vs percepción usuario

Los datos **no son basura aleatoria** en código (`demoCases.ts` + migraciones 004/006/009/011):

| Código | Escenario | Realismo |
|--------|-----------|----------|
| DEMO-001 | HTA ambulatoria | ★★★★☆ |
| DEMO-002 | DM2 + borrador en revisión | ★★★★☆ |
| DEMO-003 | Asma pediátrica | ★★★☆☆ (delgado) |
| DEMO-004 | Postoperatorio D2 | ★★★★☆ |
| DEMO-005 | FA + polifarmacia + conflicto penicilina | ★★★★★ |

**Problema de percepción:** la UI **expone todo el ruido acumulado** (migraciones duplicadas, longitudinal completo, timeline largo, widgets redundantes con summary). El usuario ve “Juan Pérez + laboratorio aleatorio” aunque el fixture sea coherente.

### 4.2 Episodios narrativos objetivo (UX-A)

Un sistema clínico se juzga por los casos que muestra. Objetivo mínimo — **línea temporal completa** (ingreso/evento → tratamiento → alta o control):

| Especialidad | Episodio demo | Mapeo sugerido desde DEMO actual |
|--------------|---------------|----------------------------------|
| Medicina interna | IAMCEST → angioplastia → alta | Expandir DEMO-001 o nuevo DEMO-001 |
| UCI | Shock séptico → VM → alta | Nuevo o expandir censo DEMO-004 |
| Cardiología | IC descompensada → eco → optimización | Expandir **DEMO-005** (FA/IC) |
| Infectología | Bacteriemia → hemocultivos → tratamiento | Nuevo caso |
| Cirugía vascular | Pie diabético → angioplastia → curaciones | Nuevo o expandir DEMO-004 |

Mantener códigos `DEMO-001`…`DEMO-005` donde sea posible para golden journey y tests; enriquecer narrativa y seeds, no solo labels.

### 4.3 Entregables demo (UX-A)

1. Fixtures + migraciones con episodios completos (problemas, órdenes, evoluciones, alta).
2. API: vista curada — no dump longitudinal crudo en UI principal.
3. Deduplicar filas 004 vs 006 en problems/observations.
4. Documentos demo legibles clínicamente (no solo `demo://` stubs).

---

## 5. Propuesta de simplificación radical

### 5.1 Principios rector (nueva fase EPIS2-UX-01)

| # | Principio | Enforce |
|---|-----------|---------|
| UX-01 | Command-first primario; menú secundario colapsado | Product review + nav gate |
| UX-02 | 1 pantalla = 1 tarea | Page budget checklist |
| UX-03 | Máx. 1 frame visual por pantalla | **LAYOUT-G12** (nuevo) |
| UX-04 | 1 primary + 2 secondary buttons visibles | Action audit per page |
| UX-05 | AppBar = centro operativo fijo | Shell spec |
| UX-06 | Rail ≤ 5 ítems N0 visibles en Comando | Nav registry trim |
| UX-07 | Demo = historia clínica, no dump de filas | Fixture + API curation |

### 5.2 Qué eliminar / colapsar (no borrar código aún — priorizar ocultación)

| Eliminar de vista principal | Mover a |
|----------------------------|---------|
| 19 quick-actions en ficha | Comando + sugerencias por rol |
| Longitudinal completo en ficha resumen | Tab “Historial” o comando «mostrar historial» |
| 12 tabs dashboard en header | Comando «mostrar farmacia / UCI / …» + max 3 tabs recientes |
| 8 workspace icons en Comando | Menú “Espacios clínicos” (1 icono) |
| Logo + displayMedium hero en Comando | Una línea en AppBar; prompt = power bar |
| Paper outlined por widget IDC | Secciones con `Typography` + `Divider` |

### 5.3 Shell objetivo

```text
┌─ AppBar fija (operativa) ─────────────────────────────┐
│ Buscar · Comando · Paciente · Alertas · Usuario       │
├─ Patient chrome (solo si paciente) ───────────────────┤
│ Nombre · DEMO-00x · tabs mínimos (≤5)                 │
├─ Contenido (1 tarea, sin isla interior) ──────────────┤
│ …                                                     │
└─ Action bar (1+2 botones) ────────────────────────────┘
```

Rail lateral: **solo en modo tablero/hospitalización**, no en Centro de Comando home.

---

## 6. Backlog priorizado (orden acordado post-acta)

### P0 — UX-A (implementar ahora)

| Orden | ID | Cambio | Esfuerzo | Archivos clave |
|-------|-----|--------|----------|----------------|
| 1 | **UX-P0-02** | AppBar operativa fija (`Buscar · Comando · Paciente · Tareas · Alertas · Usuario`) | M | `EpisAppShellLayout`, `EpisTopAppBar`, shell web |
| 2 | **UX-P0-03** | Quick actions → comando (intents: evolución, epicrisis, farmacia, orden, certificado…) | M | `command-registry`, `CommandCenterPage`, quitar grid ficha |
| 3 | **UX-P0-05** | Fix router 12 tabs = UI = `DashboardTab` | S | `router.tsx`, `clinicalNavigate.ts` |
| 4 | **UX-P0-04** | Casos demo narrativos (5 episodios §4.2) | L | `demoCases.ts`, migraciones, API curation |
| 5 | **UX-P0-06** | Rail en `/comando`: ocultar switcher 8 workspaces → 1 “Espacios” | M | `epis2NavigationRail.tsx` |
| 6 | **UX-P0-07** | Gate **LAYOUT-G12** (script + CI) | M | `scripts/architecture/` |

### P1 — UX-B (post UX-A)

| ID | Cambio |
|----|--------|
| **UX-P1-01** | Patient Workspace: tabs Resumen / Acciones / Registros; ocultar longitudinal en resumen |
| **UX-P1-02** | Refactor `EpisDashboardShell` — 1 frame |
| **UX-P1-03** | Tableros Quality + ICU: Paper → secciones planas |
| **UX-P1-04** | Comando: quitar hero logo/displayMedium |
| **UX-P1-05** | `topBarBg` → surface; botones ficha → `EpisButton` 1+2 |
| **UX-P1-06** | Intents comando para tabs tramo faltantes |

### P2 — Validación con usuarios

- Medir UX-G01–G05 en walkthrough piloto.
- Decidir Nivel 2 navegación desde uso real.
- Reconciliar registry vs chart tabs; actualizar doc reconciliado.

### P3 — Árbol definitivo

- Rediseño navegación solo **después** de AppBar + Comando como centro operativo real.
- Refactor restante `*DashboardTab.tsx` (IDC Papers).

---

## 7. Fases

```text
UX-A  ✅ Aprobada — P0 (§6)
UX-B  Patient Workspace + anti-EHR visual (P1)
UX-C  Validación usuarios + métricas (P2)
UX-D  Árbol navegación definitivo (P3)
```

**Cierre UX-A:** todos los ítems P0 + gates §8 + `npm run check` + `npm run test` + walkthrough acotado piloto.

---

## 8. Gates de cierre (UX-A y piloto)

| Gate | Criterio |
|------|----------|
| **UX-G01** | Ninguna tarea clínica **frecuente** requiere **>2 clics** desde Centro de Comando |
| **UX-G02** | Ninguna pantalla principal supera **altura de trabajo razonable** sin cambio de contexto |
| **UX-G03** | Máximo **7 iconos persistentes** en navegación principal visible |
| **UX-G04** | Máximo **1 acción primaria visible** por contexto |
| **UX-G05** | Cada paciente demo representa **episodio clínico completo** (arco temporal) |
| **LAYOUT-G12** | No nested visual frames > 1 nivel (Pantalla → Sección) |
| **UX-G04b** | Router tabs dashboard = tabs UI = tipo `DashboardTab` (12/12) |

Lista frecuente para UX-G01 (golden journey + piloto): evolucionar, abrir ficha, tablero trabajo, revisar borrador, farmacia demo.

---

## 9. Riesgos si no se actúa

1. **Piloto institucional** rechaza UX aunque gates técnicos pasen.
2. **Invariante #8** (información oculta) violada de facto en ficha y tableros.
3. **Command-first** queda teórico; usuarios navegan como EHR clásico.
4. **IA** aprende de UI ruidosa y datos mal presentados (aunque fixtures sean buenos).
5. Cada tramo nuevo **multiplica** Papers outlined (Quality 24, ICU 22 — tendencia empeora).

---

## 10. Próximo paso

1. **Implementar UX-A** en orden §6 P0 (AppBar → comando → router → demo → rail → LAYOUT-G12).
2. No mezclar features tramo ni rediseño de árbol en la misma sesión.
3. Cerrar con gates §8 + `npm run check` + `npm run test` + reporte `reports/epis2-ux-a-*.md`.
4. Piloto acotado → decidir UX-B / P2 con evidencia de uso.

---

## Anexos — comandos de verificación usados

```bash
# Colores hardcodeados (producto)
npm run theme:validate

# Arquitectura
npm run architecture:validate

# Journey
npm run quality:golden-journey
```

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*

*Acta UX-A aprobada 2026-06-04. Implementación UX-A pendiente.*
