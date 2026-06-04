# EPIS2 — Modo tablero (diseño)

**Nombre visible en UI:** **Modo tablero** (no «Dashboard» como home)  
**Ruta objetivo:** `/epis2/dashboard` (alias de producto; implementación puede mapear bajo router EPIS2 existente)  
**Estado:** Implementado (EPIS2-12)

---

## 1. Principios

| Regla | Descripción |
|-------|-------------|
| No es home | La home permanece en el **Centro de Comando** (`/comando`) |
| Opcional | Solo se abre por comando, alias o acción discreta |
| Reversible | Botón fijo **Volver al Centro de Comando** |
| Sin infraestructura | No muestra Ollama, RAG, PostgreSQL ni métricas técnicas |
| No reemplaza páginas | Cada tarjeta navega al flujo command-first (formulario → borrador) |
| Sin aprobación masiva | No firma ni aprueba lotes |
| Contextual | Rol, paciente activo y servicio filtran widgets |
| Carga perezosa | Solo widgets solicitados / visibles |

---

## 2. Acceso desde el Centro de Comando

### UI

```text
¿Qué necesitas hacer?

[ Escribe una instrucción clínica... ]

Resumen · Evolución · Epicrisis · Laboratorio · Modo tablero
```

### Comandos / alias (Command Registry)

| Frase ejemplo | Intent objetivo |
|---------------|-----------------|
| abre el tablero | `open_dashboard` |
| modo dashboard | `open_dashboard` |
| ver indicadores | `open_dashboard` (vista según rol) |
| ver mi trabajo | `open_dashboard_work` |
| ver el servicio | `open_dashboard_service` |
| ver tablero del paciente | `open_dashboard_patient` |

Todos los intents deben:

1. Respetar RBAC (`dashboard.read` o equivalente por vista).
2. Redirigir a `/epis2/dashboard?tab=...` sin perder paciente activo en contexto.
3. Registrar evento de auditoría `dashboard.opened`.

---

## 3. Tipos de tablero

### 3.1 Mi trabajo (V0 — EPIS2-12)

**Audiencia:** cualquier profesional autenticado.

| Widget | Fuente de datos | Acción al clic |
|--------|-----------------|----------------|
| Borradores pendientes | API `drafts` filtro autor/estado | Ir a revisión de borrador |
| Solicitudes de revisión | API drafts `pending_review` | Revisión |
| Pacientes recientes | Contexto sesión / lista | Fijar paciente → Centro de Comando |
| Tareas demo sintéticas | Fixtures / agenda demo | Comando sugerido |

**Gate V0:** tras aprobar evolución en journey dorado, abrir tablero y ver la tarea/borrador reflejado.

### 3.2 Tablero del paciente (V1)

**Condición:** paciente activo fijado.

| Widget | Contenido |
|--------|-----------|
| Problemas activos | SoT PostgreSQL |
| Últimas observaciones | Observaciones / signos |
| Medicamentos | Lista activa |
| Laboratorio reciente | Resultados |
| Pendientes | Órdenes / estudios |
| Encuentros | Timeline corto |
| Alertas | CDS/CDR advisory (mismo panel que ficha) |

Navegación: cada ítem abre **página clínica** (no modal de edición masiva).

### 3.3 Tablero del servicio (V2)

**Condición:** permiso `dashboard.service` + unidad asignada (demo).

| Widget | Contenido |
|--------|-----------|
| Censo | Camas ocupadas |
| Por ubicación | Agrupación sala/cama |
| Críticos sin acuse | Labs / órdenes |
| Altas probables | Reglas demo |
| Pendientes por equipo | Worklist |

### 3.4 Calidad y administración (V4)

**Condición:** rol administrador / calidad.

| Widget | Contenido |
|--------|-----------|
| Indicadores documentales | Agregados demo |
| Tiempos de aprobación | Auditoría |
| Uso del sistema | Eventos agregados |
| Calidad de borradores | Métricas sintéticas |

**Prohibido:** exponer tokens, URLs de Ollama, tamaño de índice vectorial.

---

## 4. Arquitectura UI

```text
Centro de Comando
       │
       ├─ comando "abre el tablero"
       ├─ chip "Modo tablero"
       │
       ▼
/epis2/dashboard
       │
       ├─ tab=work        (V0)
       ├─ tab=patient      (V1, requiere patientId)
       ├─ tab=service      (V2)
       └─ tab=quality      (V4, RBAC estricto)
       │
       └─ [ Volver al Centro de Comando ]  → /comando
```

### Componentes (futuro)

| Componente | Responsabilidad |
|------------|-----------------|
| `DashboardModePage` | Layout tabs + permisos |
| `WorkDashboardWidgets` | Mi trabajo |
| `PatientDashboardWidgets` | Contexto paciente |
| `ServiceDashboardWidgets` | Censo / servicio |

Sin dependencias Radix/Carbon/EPIONE UI.

---

## 5. API y contratos (plan)

| Endpoint | Uso |
|----------|-----|
| `GET /api/dashboard/work` | Agregado Mi trabajo |
| `GET /api/dashboard/patient/:id` | Widgets paciente |
| `GET /api/dashboard/service` | Censo demo |

Contratos en `packages/contracts` (`dashboardWorkSummary`, etc.) antes de UI.

---

## 6. Lo que se rechaza de EPIONE

| Elemento EPIONE | Decisión |
|-----------------|----------|
| `EpioneMasterDashboard` como home | REJECT |
| KPIs de infraestructura | REJECT |
| localStorage como SoT | REJECT |
| Aprobación desde tarjetas | REJECT |

Se conserva solo el **concepto** de worklist y agregación contextual.

---

## 7. Criterios de aceptación (EPIS2-12)

1. Ruta `/epis2/dashboard` accesible solo con sesión.
2. No aparece como ruta post-login por defecto.
3. Comando «abre el tablero» resuelve y navega.
4. Botón volver siempre visible.
5. Widget «borradores» coherente con journey dorado.
6. Validador `command-center-home` sigue pasando.
7. Copy 100 % español («Modo tablero», no «Dashboard Home»).

---

## Referencias

- [EPIS2_RELEASE_ROADMAP.md](./EPIS2_RELEASE_ROADMAP.md) — V0 gate
- [../quality/EPIS2_GOLDEN_JOURNEYS.md](../quality/EPIS2_GOLDEN_JOURNEYS.md) — paso tablero
- [../PRODUCT_CANON.md](../PRODUCT_CANON.md) — home = Centro de Comando
