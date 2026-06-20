# EPIS2 — Espacios de trabajo por rol (Material Design 3)

**Versión:** 1.0 · **Fecha:** 2026-06-04
**Home canónica:** CICA (`/app/buscar`) — **no** dashboard
**Implementación:** `apps/web/src/navigation/clinicalWorkspaceRegistry.ts` · `useClinicalWorkspace` · `useEpis2NavigationRailItems`

> Conciliar ~200 pantallas/formularios **sin menú único**. Cada contexto clínico carga un árbol de navegación distinto desde el Navigation Rail (Nivel 0).

---

## Principio de conciliación

| Anti-patrón | Patrón EPIS2 |
|-------------|--------------|
| Menú global con 200 ítems | **5 workspaces** conmutables |
| Misma densidad UI en UCI y ambulatorio | Shell adaptado por workspace |
| Saltar a módulo IAAS en ventana nueva | **Cross-linking inline** (Expandable Card) |
| Formularios vacíos en scroll infinito | **Empty states** con Text Button |
| Carga eager de secciones pesadas | **Lazy loading** — cards colapsadas + Scrollspy |

---

## Mapa de profundidad MD3 por workspace

| Nivel | Patrón MD3 | Rol |
|-------|------------|-----|
| **0** | Navigation Rail | Conmutador de workspace + ítems contextuales |
| **1** | Top App Bar / filtros | Paciente (clínico) o filtros globales (poblacional) |
| **2** | Primary Tabs (≤5) | Flujo del episodio o análisis institucional |
| **3** | Scrollspy / Expandable Cards | Formularios y dashboards técnicos |
| **4** | Extended FAB | Acción primaria del contexto |

---

## 1. Workspace: Práctica ambulatoria y consulta general

**Id:** `ambulatory` · **Velocidad, agendamiento, episodios discretos**

| Nivel | Contenido |
|-------|-----------|
| 0 Rail | Agenda diaria · Sala de espera · Mis honorarios · Pacientes |
| 1 Banner | Paciente + alergias + previsión |
| 2 Tabs | Resumen histórico · Consulta (SOAP) · Recetas · Exámenes · Certificados |
| 3 Scrollspy | Anamnesis · Signos vitales · Examen físico · CIE-10 · Plan · dictado IA local en SOAP |
| 4 FAB | Firmar y cerrar episodio |

**IDC dominante:** 27–40, 52–57, 61–64.

---

## 2. Workspace: Unidad de cuidados intensivos (UCI)

**Id:** `icu` · **Línea temporal continua, alta densidad**

| Nivel | Contenido |
|-------|-----------|
| 0 Rail | Mapa camas críticas · Monitorización UCI · Entregas de turno |
| 1 Banner | Paciente + alergias + días VM / días CVC |
| 2 Tabs | Sábana 24h · Evolución · Enfermería · Terapia IV · Lab acumulativo |
| 3 Cards | Parámetros ventilatorios · Noradrenalina · Balance hídrico · RASS/CAM-ICU · NPT |
| 4 FAB | Guardar registros horarios |

**IDC dominante:** 41–50 (solapado 131–140) — **una sola implementación**.

---

## 3. Workspace: Jefatura médica, calidad e IAAS

**Id:** `quality_iaas` · **Poblacional e institucional**

| Nivel | Contenido |
|-------|-----------|
| 0 Rail | Indicadores calidad · Vigilancia epidemiológica · Panel IAAS · Gestión camas |
| 1 Filtros | Rango fechas · Servicio · Tipo aislamiento |
| 2 Tabs | Curvas endémicas · Mapa aislamientos · PROA · Auditoría fichas |
| 3 Gestión | Brotes · Antibiogramas · Checklists NAVM/CVC · Eventos adversos |
| 4 FAB | Exportar reporte / alerta epidemiológica |

**IDC dominante:** 71–80, 81–90 (parcial), 161–170.

---

## 4. Workspace: Administración de sistemas e IA local

**Id:** `admin_system` · **Infraestructura y configuración**

| Nivel | Contenido |
|-------|-----------|
| 0 Rail | Config EMR · Roles · Monitor hardware · HL7 · Estudio formularios |
| 2 Tabs | Diccionarios · Vademécum · Modelos LLM · Interoperabilidad |
| 3 Dashboards | VRAM GPUs · Plantillas/macros · Auditoría trazabilidad |
| 4 FAB | Guardar configuración |

**IDC dominante:** 91–93, 181–196, admin `/espacio/admin`.

---

## 5. Workspace: Centro de Comando (default)

**Id:** `cica-search` · **Home canónica — CICA censo-first**

| Nivel | Contenido |
|-------|-----------|
| 0 Rail | Conmutador workspaces + Agenda · Pacientes · Mensajes · Ajustes |
| — | Barra de instrucción clínica; **no** reemplaza ficha M3 |

Persistencia: `clinicalWorkspace` en `epis2-theme-preferences-v2` (localStorage).

---

## Reglas de anidación (evitar caos visual)

### Lazy loading (Nivel 3)

- Secciones con `initialVisibility: 'collapsed'` en blueprint → `Accordion` en `EpisClinicalForm`.
- El Scrollspy (`EpisClinicalScrollspy`) expande la card al hacer clic en el índice lateral.
- Formularios pesados (NPT, calculadoras) **nunca** cargan expandidos por defecto.

### Cross-linking invisible

- Desde evolución UCI: botón contextual `copy.workspaces.nesting.crossLinkIaas` inyecta formulario IAAS **en la misma vista** (Expandable Card), vinculando entidades en SoT.
- **Prohibido:** redirigir al workspace `quality_iaas` mid-formulario.

### Empty states

- Sin antecedentes → mensaje `copy.workspaces.nesting.emptySection` + Text Button `emptyAdd`.
- **Prohibido:** campos en blanco que inflen scroll sin valor clínico.

---

## Referencias

- Matriz IDC 1–200 → workspace: [`EPIS2_INVENTORY_WORKSPACE_MATRIX.md`](../product/EPIS2_INVENTORY_WORKSPACE_MATRIX.md)
- Ficha paciente M3: [`EPIS2_PATIENT_CHART_NAVIGATION_M3.md`](./EPIS2_PATIENT_CHART_NAVIGATION_M3.md)
- Inventario maestro: [`EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`](../product/EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md)
- Registry código: `apps/web/src/navigation/clinicalWorkspaceRegistry.ts`
- **Árbol reconciliado:** [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](../architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md) · `apps/web/src/navigation/epis2NavigationTree.ts`
