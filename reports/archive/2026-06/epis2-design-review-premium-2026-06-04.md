# EPIS2 — Design Review Premium (comité UX/UI)

**Fecha:** 2026-06-04 · **Post:** UX-A slice 1 · Tag `TRAMOS-AK-SIGNOFF-PREP`  
**Metodología:** EPIS2 Design Reviewer — revisión de producto, no de código  
**Referencia:** `reports/epis2-ux-ui-audit-2026-06-04.md`

---

## Veredicto ejecutivo (comité)

EPIS2 **no es un producto mediocre en arquitectura de interacción** — el Centro de Comando, la Power Bar y los formularios two-pane tienen ADN correcto (ChatGPT × clínica).

**Pero hoy no se siente premium.** Se siente como un **command-first excelente enterrado bajo capas de EHR acumulado**: rail, workspaces, 12 tabs, 19 quick-actions, tableros IDC con decenas de paneles outlined.

> *Los errores de EPIS no son recuerdos: son gates de EPIS2.*  
> Hoy el gate más urgente es **percepción**: el usuario ve Cerner-with-a-search-bar, no Notion-with-clinical-intent.

UX-A slice 1 mueve la aguja en **Modo Comando** (AppBar fija, hero reducido, rail colapsado en home). **No alcanza** para premium global: Dashboard y Ficha Paciente siguen contradiciendo el manifiesto.

---

## Puntuación

| Dimensión | /10 | Nota breve |
|-----------|-----|------------|
| Visual Premium | **4.5** | Comando mejor; tableros IDC = CRUD gubernamental |
| Material 3 | **6.0** | Tokens y tema sólidos; aplicación desigual (frames compuestos) |
| Claridad | **4.0** | Demasiados focos: rail + AppBar + tabs + chips + widgets |
| Navegación | **4.5** | Mejora UX-A; lattice menu-first persiste fuera de `/comando` |
| Command First | **5.5** | Resolución 1-clic funciona; accesos paralelos no justificados |
| Dashboard Quality | **3.0** | 12 tabs × N paneles; métricas demo sin jerarquía |
| Split Workspace | **6.5** | Two-pane + FAB + scrollspy — más Linear que el resto |
| Experiencia Clínica | **5.0** | Flujo borrador→aprobación claro; carga cognitiva alta en ficha |
| Coherencia Global | **4.5** | Tres modos parecen tres productos distintos |

**Promedio general: 4.8 / 10** — *funcional y ambicioso; aún no premium ni memorable.*

---

## Evaluación por modo canónico

### MODO 1 — Command Mode

**Qué funciona (premium-adjacent):**
- Power Bar como centro gravitacional — cercano a ChatGPT/Linear command palette.
- Sugerencias por rol + chips de clarificación.
- Resolución de intención → formulario en 1 paso (golden journey).
- UX-A: AppBar sticky, hero sin displayMedium gigante, isla interior eliminada en Comando.

**Qué impide premium:**
- AppBar **sobrecargada**: demo badge + 5–7 botones text + tema + logout — compite con la Power Bar por atención (Stripe nunca pondría 7 acciones primarias en header).
- Rail lateral **sigue visible** en Comando (aunque colapsado a «Espacios»): segundo sistema de navegación junto al header.
- Panel paciente opcional + widgets + alertas = **tercer y cuarto foco** en la misma pantalla.
- Toggle «mostrar contexto paciente» es patrón administrativo, no command-first puro.

**Pregunta command-first:** ¿Puedo evolucionar sin abrir panel ni ficha? **Sí, técnicamente.** ¿Por qué existen panel + 19 quick-actions en ficha? **Porque cada tramo añadió un atajo visual** — producto duplicado.

**Nota modo:** 5.5/10 → camino correcto, execution incompleta.

---

### MODO 2 — Dashboard Mode

**Qué impide premium (crítico):**
- `EpisDashboardShell`: canvas → isla → box borde tabs → box borde content → **Paper outlined × 24** (Quality) / × 22 (ICU).
- 12 tabs horizontales — sensación SAP de módulos, no Google Workspace.
- Cada IDC tramo = **scaffold de widgets demo** sin curaduría visual: todo mismo peso, mismo borde, mismo scroll infinito.
- «Volver al Centro de Comando» repetido (header AppBar + footer shell + rail) — redundancia nerviosa.

**Regla «cada widget justifica su existencia»:** **FAIL** en tableros tramo. Son placeholders de cobertura funcional, no monitoreo operativo diseñado.

**Comparación referente:** Stripe Dashboard muestra **3–5 métricas hero + tabla**; EPIS2 muestra **24 cajas equivalentes**.

**Nota modo:** 3.0/10 — el mayor drag al promedio premium.

---

### MODO 3 — Split Workspace Mode

**Qué funciona:**
- `EpisClinicalTwoPaneLayout` + context pane + action dock — proporción y continuidad cognitiva razonables.
- Un primary (Guardar/FAB) + nav secundaria — respeta jerarquía.
- Scrollspy en consulta ambulatoria — densidad clínica escaneable.

**Qué impide premium:**
- Context pane + form canvas + rail + AppBar + patient chrome = **4 capas** en viewport.
- Algunos formularios mezclan `EpisButton` y `Button` MUI — micro-inconsistencia de peso visual.
- Certificado / impresión A5 — correcto funcionalmente; tipografía Times en print vs Google Sans en UI — ruptura intencional pero poco pulida en preview.

**Nota modo:** 6.5/10 — **el modo más cercano a Linear/Notion**; debería ser la plantilla del resto del producto.

---

## 1. Hallazgos críticos (P0 — bloquean premium)

| # | Hallazgo | Modo | Por qué es crítico |
|---|----------|------|-------------------|
| C1 | **Ficha paciente = scroll infinito + ~19 quick-actions** | Clínico | Viola «una pantalla = una tarea»; parece CRUD admin; destruye confianza clínica |
| C2 | **Tableros tramo (Quality/ICU/…) = 4–5 capas de frame + 20+ Papers** | Dashboard | Anti-premium absoluto; evoca Cerner/SAP; contradice anti-patrón §5 |
| C3 | **Dos productos en uno: command-first + EHR menu lattice** | Global | Usuario no sabe si escribir o navegar; identidad de producto diluida |
| C4 | **AppBar operativa incompleta y sobrecargada** | Command | Objetivo UX-A correcto pero ejecución = fila de botones text, sin tareas/alertas, compite con Power Bar |
| C5 | **Demo percibido como basura** | Clínico | Aunque fixtures sean coherentes, la UI expone dump longitudinal — no episodio narrativo memorable |

---

## 2. Hallazgos importantes (P1)

| # | Hallazgo |
|---|----------|
| I1 | Rail + AppBar + patient tabs = **triple chrome** en rutas clínicas |
| I2 | Dashboard 12 tabs sin curaduría — 6 tramos solo alcanzables por menú, no por comando |
| I3 | Jerarquía botones rota en ficha (19 outlined = mismo peso visual) |
| I4 | Widgets en Comando y ficha **duplican** summary + longitudinal |
| I5 | Identidad visual **correcta en tokens, débil en composición** — no hay «momento memorable» (no hero craft, no empty states premium) |
| I6 | Tema: percepción inconsistente en capas transparentes / frames múltiples (UX-A mitigó barra, no dashboards) |
| I7 | Información crítica (alertas CDS) compite visualmente con demo badge y navegación |

---

## 3. Hallazgos menores (P2)

| # | Hallazgo |
|---|----------|
| M1 | Logout + tema + preferencias repetidos (rail footer + AppBar) |
| M2 | `displayMedium` eliminado en Comando — bien; subtítulo aún genérico |
| M3 | Chips demo siempre visibles — necesario para piloto, resta elegancia |
| M4 | 7 ítems rail disabled — dead clicks, sensación producto incompleto |
| M5 | Documentación nav desactualizada vs UI — confunde stakeholders, no usuario final |

---

## 4. Quick Wins (sin nuevos componentes)

| # | Acción | Impacto premium |
|---|--------|-----------------|
| Q1 | **Ocultar** grid 19 quick-actions en ficha (no reemplazar aún — solo ocultar) | ↑ claridad inmediata |
| Q2 | Colapsar longitudinal en ficha bajo «Ver historial» | ↑ una pantalla = una tarea |
| Q3 | Dashboard: quitar **inner bordered boxes** en `EpisDashboardShell` (1 diff, todo tablero mejora) | ↑ M3 premium |
| Q4 | AppBar: **una** fila primaria (buscar + paciente + alertas); resto en overflow «⋯» | ↑ Stripe-like density |
| Q5 | Comando: panel paciente **cerrado por defecto**; paciente activo solo en AppBar title | ↑ command focus |
| Q6 | Unificar botones ficha → `EpisButton` con 1 filled + 2 outlined max visibles | ↑ jerarquía |

---

## 5. Refactors recomendados (P1–P2)

1. **EpisDashboardShell** — una superficie, tabs integrados sin caja interior, contenido = secciones tipográficas.
2. **PatientWorkspacePage** — tabs Resumen / Historial / Acciones (UX-B); Resumen = summary + alertas solo.
3. **Command Registry** — absorber quick-actions; sugerencias = único descubrimiento secundario.
4. **Chrome unificado** — AppBar global reemplaza duplicación rail-footer tema/logout en Comando.
5. **Demo narrativo** — presentación curada (timeline 8 eventos max en UI), no API dump.

---

## 6. Elementos a eliminar

| Eliminar de vista principal | Razón |
|---------------------------|-------|
| 19 quick-actions en ficha | Duplican comando |
| Longitudinal completo en resumen ficha | Duplica comando «mostrar historial» |
| Logo/hero histórico en Comando | ✅ ya reducido UX-A |
| Paper outlined por widget IDC | Decoración sin jerarquía |
| Rail workspace switcher en `/comando` | ✅ parcial UX-A — completar ocultación |
| Footer «Volver a Comando» cuando AppBar visible | Redundante |
| Widget panel en Comando con paciente cerrado | Ruido |

---

## 7. Elementos a fusionar

| A | B | Resultado |
|---|---|-----------|
| AppBar nav + ClinicalPageNav sticky | Una barra acciones inferior **o** header único |
| Patient summary panel + widgets patient-summary | Un bloque resumen escaneable |
| Dashboard tabs tramo + workspace rail | Acceso vía comando «mostrar UCI/farmacia» |
| Alertas CDS + hint blueprint | Una tira alerta contextual en AppBar |
| Tema toggle + preferencias link | Un solo control «Apariencia» |

---

## 8. Elementos a simplificar

- **Comando:** Power Bar + sugerencias + (opcional) 1 línea paciente activo. Nada más above the fold.
- **Dashboard:** máx 3 tabs visibles por rol; resto vía comando.
- **Ficha:** 5 tabs paciente → 3 (Resumen · Trabajo · Datos).
- **AppBar endActions:** máx 4 visibles + overflow.
- **Demo:** 1 episodio visible por sesión piloto, no catálogo de 5 casos en grid.

---

## 9. Componentes / pantallas sospechosas

| Superficie | Síntoma premium-killer |
|------------|------------------------|
| `PatientWorkspacePage` | Scroll infinito, botonera plana |
| `QualityDashboardTab` | 24 Papers — referencia anti-premium |
| `IcuDashboardTab` | 22 Papers |
| `EpisDashboardShell` | Triple frame |
| `PatientLongitudinalPanel` | 8+ secciones Paper + acordeones |
| `ClinicalGlobalTopBar` | 7+ acciones mismo peso (post UX-A) |
| `Epis2WidgetSurface` | EpisCard + island mismo nodo |
| `CommandCenterPage` (panel abierto) | 4 zonas focales simultáneas |
| `*DashboardTab.tsx` (familia) | Patrón IDC scaffold repetido 12× |

**Pantallas más premium hoy:** `GeneratedClinicalFormPage` (two-pane), `DraftReviewPage`, `LoginPage` / auth shell.

---

## 10. Backlog priorizado P0–P3 (comité)

### P0 — Sin esto no hay premium

| ID | Acción |
|----|--------|
| DR-P0-1 | Quick actions → comando; **eliminar grid ficha** |
| DR-P0-2 | AppBar: buscar · paciente · **alertas/tareas** · overflow (no 7 botones text) |
| DR-P0-3 | `EpisDashboardShell` flatten — 1 frame |
| DR-P0-4 | Demo narrativo + UI curada |
| DR-P0-5 | Comando: above-the-fold = **solo Power Bar** |

### P1 — Premium perceptible

| ID | Acción |
|----|--------|
| DR-P1-1 | Ficha tabs Resumen/Historial/Acciones |
| DR-P1-2 | Quality + ICU: Paper → secciones |
| DR-P1-3 | LAYOUT-G12 extendido a dashboards |
| DR-P1-4 | Chrome único: quitar duplicación tema/logout rail |
| DR-P1-5 | Dashboard ≤6 tabs visibles por rol |

### P2 — Validación

| ID | Acción |
|----|--------|
| DR-P2-1 | UX-G01–G05 en piloto |
| DR-P2-2 | Medir clics tareas frecuentes desde Comando |
| DR-P2-3 | Ocultar rail items disabled |

### P3 — Identidad memorable

| ID | Acción |
|----|--------|
| DR-P3-1 | Empty states craft (Notion-like) |
| DR-P3-2 | Motion mínima en transiciones comando→form |
| DR-P3-3 | Árbol nav definitivo solo con datos de uso |

---

## Regla final del comité

**No añadir componentes** (sidebar nueva, widget library, otro dashboard) hasta haber **eliminado, fusionado o simplificado** lo listado arriba.

La ruta a premium no es más UI. Es **menos UI con mejor jerarquía** — exactamente lo que Notion, Linear y ChatGPT demostraron.

---

## Alineación con UX-A aprobada

| UX-A ítem | Estado | Nota comité |
|-----------|--------|-------------|
| Router 12 tabs | ✅ | Necesario; invisible al usuario — bien |
| AppBar fija | ⚠️ Parcial | Existe pero **no es aún centro operativo premium** |
| Rail reducido Comando | ⚠️ Parcial | Mejor; rail contextual sigue ruido |
| Quick actions → comando | ❌ Pendiente | **Bloqueador premium #1** |
| Demo narrativo | ❌ Pendiente | **Bloqueador confianza clínica** |
| LAYOUT-G12 | ⚠️ Baseline | Solo Comando; dashboards ignorados |

---

*Comité EPIS2 Design Reviewer · 2026-06-04*
