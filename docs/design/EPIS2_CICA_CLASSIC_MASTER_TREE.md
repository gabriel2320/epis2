# EPIS2 CICA — Árbol maestro · Ficha clásica completa

**Versión:** 1.0 · **Fecha:** 2026-06-17  
**Estado:** Norma de diseño · **Producto CICA:** NO-GO hasta reformulación CICA-L  
**Raíz runtime:** `/app/*` (opt-in `VITE_ENABLE_CICA_UI=true`) · **Runtime activo demo:** `/espacio/*`

**Documentos relacionados:**

| Documento | Rol |
|-----------|-----|
| [`EPIS2_CICA.md`](./EPIS2_CICA.md) | Algoritmo de intención clínica |
| [`EPIS2_CICA_L.md`](./EPIS2_CICA_L.md) | Loop pantalla a pantalla (wireframe → score ≥ 90) |
| [`EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md`](./EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md) | Header · pie · sidebar · grilla simétrica |
| [`EPIS2_CICA_SCREEN_MAP_v1.md`](./EPIS2_CICA_SCREEN_MAP_v1.md) | Inventario rutas implementadas hoy |
| [`EPIS2_CLINICAL_LAYOUT_MANIFESTO.md`](./EPIS2_CLINICAL_LAYOUT_MANIFESTO.md) | 1 intención · 1 acción primaria |
| [`reports/epis2-frontend-purge-cica-reform-plan.md`](../../reports/epis2-frontend-purge-cica-reform-plan.md) | Purga legacy + guardrails |

> **Frase guía:** Tres centros — (1) ficha longitudinal, (2) episodio hospitalario / atención ambulatoria, (3) documento clínico en página carta.

---

## 1. Principio composicional — modo tradicional

EPIS2 CICA debe parecer **ficha clínica electrónica clásica**, no dashboard ni consola técnica.

| Elemento | Función | Componente EPIS2 |
|----------|---------|-------------------|
| **Cabecera institucional** | Establecimiento, usuario, DEMO, estado IA | `CicaTopBar` + banda identidad paciente en ficha |
| **Barra lateral** | Navegación útil (no catálogo completo) | `CicaSidebar` dual: sistema + paciente |
| **Zona de contenido** | Una intención · grilla 12 columnas simétrica | `ClinicalScreen` + `ClinicalSection` + `ClinicalFieldGrid` |
| **Barra de acciones** | 1 primaria + 2 secundarias + «Más» | `ClinicalActionBar` / `ClinicalLayoutActionBar` |
| **Pie de página** | Sesión, versión, trazabilidad demo | `CicaAppShell` footer (institucional sobrio) |
| **Comando clínico** | Atajo transversal (no compite con primaria) | Dock NL — presente en legacy; CICA: toolbar secundaria |

**Formato documental:** carta (principal) · A5 solo receta/orden simple · **no** A4 como formato principal.

Detalle wireframe: [`EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md`](./EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md).

---

## 2. Cuatro shells (cuándo usar cada uno)

| Shell | ID | Rutas típicas | Sidebar | Tabs ficha |
|-------|-----|---------------|---------|------------|
| **A — Sistema** | `system-workspace` | `/app/buscar`, `/app/censo`, `/app/agenda` | Solo L1 | — |
| **B — Ficha** | `classic-chart` | `/app/pacientes/:id/resumen`, secciones | L1 + L2 | `CicaChartTabs` (5 + Más) |
| **C — Carta** | `letter-document` | `…/evoluciones/nueva`, `…/epicrisis/nueva` | Oculta | — |
| **D — Papel** | `paper-mode` | `…/papel/dia/:date`, `…/papel/libro` | Oculta | — |

Registro canónico: `packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts`.

---

## 3. Sidebar clásica recomendada

### 3.1 Nivel 1 — Entrada clínica (siempre visible)

```text
Entrada clínica
├── Buscar          → /app/buscar
├── Censo           → /app/censo
├── Agenda          → /app/agenda          [P2 ambulatorio]
├── Mi trabajo      → /app/mi-trabajo
└── Recientes       → /app/recientes
```

### 3.2 Nivel 2 — Paciente (solo con ficha abierta)

**Visible en barra (tabs + nav principal):**

```text
Paciente actual
├── Resumen         → …/resumen
├── Evoluciones     → …/evoluciones
├── Indicaciones    → …/indicaciones
├── Exámenes        → …/examenes
├── Medicamentos    → …/medicamentos
├── Documentos      → …/documentos
├── Papel           → …/papel/dia/:hoy
└── Más ▾
    ├── Ingreso           → …/ingreso              [P1]
    ├── Enfermería        → …/hospitalizacion/enfermeria   [P1 plan]
    ├── Interconsultas    → …/interconsultas
    ├── Procedimientos    → …/procedimientos
    ├── Cirugía           → …/hospitalizacion/cirugia      [P3]
    ├── UCI               → …/hospitalizacion/uci          [P1 plan]
    ├── Alta / epicrisis  → …/alta
    ├── Timeline          → …/timeline
    └── Auditoría         → …/auditoria
```

**Regla Ley 7 CICA:** máximo 7 ítems visibles sin overflow; resto en «Más».

Implementación nav: `packages/epis2-ui/src/cica/cicaSidebarNav.ts` + `CICA_CHART_TAB_REGISTRY.ts`.

---

## 4. Árbol maestro completo

Leyenda: **✓** en registry hoy · **◐** parcial · **○** planificado · **—** fuera alcance demo v0.1

### 0. Acceso y contexto

```text
EPIS2
├── 0. Acceso y contexto
│   ├── Login                          ✓ /login
│   ├── Selección de rol               ○ P3 (RBAC demo fijo)
│   ├── Selección de establecimiento ○ P3
│   ├── Selección de servicio/unidad   ○ P3
│   ├── Estado DEMO / Producción       ✓ badge demo
│   ├── Estado IA local                ✓ `EpisAiDegradedChip`
│   └── Configuración de usuario       ✓ /preferencias-apariencia
```

### 1. Entrada clínica

```text
├── 1. Entrada clínica
│   ├── Buscar paciente
│   │   ├── Por RUT / nombre / cama / diagnóstico   ✓ búsqueda + lista
│   │   ├── Resultados                              ✓ CicaClinicalList
│   │   └── Abrir ficha                             ✓ → resumen
│   ├── Censo hospitalario
│   │   ├── Todos / mi servicio / UCI / riesgo      ○ filtros P0
│   │   └── Abrir ficha                             ✓
│   ├── Agenda ambulatoria                            ○ P2
│   ├── Pacientes recientes                           ◐ stub
│   ├── Mi trabajo
│   │   ├── Borradores / firmas / críticos            ◐ stub → P0 bandeja real
│   │   └── Documentos devueltos                      ○ P1
│   ├── Borradores pendientes (global)                ○ P1
│   ├── Firmas pendientes                             ○ P1
│   ├── Alertas clínicas                              ○ P1 (widget resumen)
│   └── Comando clínico                               ✓ legacy `/comando` · CICA dock P1
```

**Rutas sistema:**

| Pantalla | Ruta | Prioridad |
|----------|------|-----------|
| Buscar | `/app/buscar` | P0 |
| Censo | `/app/censo` | P0 |
| Agenda | `/app/agenda` | P2 |
| Recientes | `/app/recientes` | P1 |
| Mi trabajo | `/app/mi-trabajo` | P1 |

### 2. Ficha longitudinal del paciente

Episodio común hospital + ambulatorio (datos que persisten entre atenciones).

```text
├── 2. Ficha longitudinal
│   ├── Resumen clínico              ✓ …/resumen          [P0 · CICA-L-02]
│   ├── Carátula / identificación    ○ …/caratula         [P1]
│   ├── Antecedentes                 ○ …/antecedentes      [P1]
│   ├── Problemas activos            ○ …/problemas         [P1]
│   ├── Diagnósticos                 ○ …/diagnosticos      [P1]
│   ├── Alergias / RAM               ○ …/alergias          [P1]
│   ├── Medicación crónica           ○ …/medicacion-cronica[P1]
│   ├── Inmunizaciones               ○ …/inmunizaciones    [P2]
│   ├── Hábitos / factores riesgo    ○ …/habitos           [P2]
│   ├── Red familiar / social        ○ …/social            [P3]
│   ├── Contactos / tutor            ○ en carátula         [P1]
│   ├── Cobertura / previsión        ○ en carátula         [P2]
│   ├── Garantías / programas        ○ P3
│   ├── Documentos longitudinales    ◐ …/documentos        [P0]
│   └── Auditoría longitudinal       ◐ …/auditoria         [P0 básica]
```

**Acción primaria resumen:** Nueva evolución → `…/evoluciones/nueva` (carta).

### 3. Atención hospitalaria

Namespace objetivo P1: `/app/pacientes/:id/hospitalizacion/*`  
**Hoy (v1):** rutas planas bajo `…/:id/` — migración documentada en §8.

```text
├── 3. Atención hospitalaria
│   ├── Censo de hospitalizados      ✓ /app/censo
│   ├── Episodio hospitalario        ○ …/hospitalizacion/resumen
│   ├── Ingreso hospitalario           ◐ …/ingreso           [P1 · carta]
│   ├── Evoluciones médicas            ✓ …/evoluciones       [P0]
│   ├── Indicaciones médicas           ✓ …/indicaciones      [P0]
│   ├── Medicamentos hospitalarios     ◐ …/medicamentos      [P0]
│   ├── Administración / MAR           ○ …/hospitalizacion/mar
│   ├── Enfermería                     ○ …/hospitalizacion/enfermeria
│   ├── Signos vitales                 ○ …/hospitalizacion/signos-vitales
│   ├── Balance hídrico                ○ sub-sección enfermería
│   ├── Exámenes                       ✓ …/examenes          [P0]
│   ├── Imagenología                   ◐ bajo exámenes
│   ├── Interconsultas                 ◐ …/interconsultas    [P1]
│   ├── Procedimientos                 ◐ …/procedimientos    [P1]
│   ├── Cirugía / pabellón             ○ …/hospitalizacion/cirugia [P3]
│   ├── UCI / intermedio               ○ …/hospitalizacion/uci     [P1]
│   ├── Urgencia hospitalaria          ○ módulo aparte P3
│   ├── Traslados                      ○ episodio P2
│   ├── Alta                           ◐ …/alta              [P1]
│   ├── Epicrisis                      ✓ …/epicrisis/nueva   [P0 carta]
│   └── Cierre de episodio             ○ alta + auditoría P1
```

### 4. Atención ambulatoria

Namespace objetivo P2: `/app/pacientes/:id/ambulatorio/*`

```text
├── 4. Atención ambulatoria
│   ├── Agenda médica                  ○ /app/agenda + …/ambulatorio
│   ├── Lista de espera                ○ P2
│   ├── Consulta ambulatoria           ○ …/ambulatorio/consulta
│   ├── Control ambulatorio            ○ …/ambulatorio/control
│   ├── Recetas                        ◐ …/indicaciones/nueva + …/ambulatorio/recetas
│   ├── Órdenes de examen              ◐ formularios clínicos
│   ├── Derivaciones                   ○ P2
│   ├── Interconsultas ambulatorias    ◐ …/interconsultas
│   ├── Certificados                   ✓ …/documentos/nuevo
│   ├── Licencias / reposo             ◐ certificados
│   ├── Programas crónicos             ○ …/ambulatorio/programas [P2]
│   ├── Seguimiento                    ○ P2
│   └── Cierre de atención             ○ P2
```

### 5. Documentos clínicos (páginas carta)

Cada acción mayor = shell **C — Carta** (`CicaLetterPageShell`).

```text
├── 5. Documentos clínicos (carta)
│   ├── Nueva evolución                ✓ …/evoluciones/nueva
│   ├── Ingreso clínico                ◐ …/ingreso
│   ├── Epicrisis                      ✓ …/epicrisis/nueva
│   ├── Receta médica                  ✓ …/indicaciones/nueva
│   ├── Orden médica                    ◐ indicaciones
│   ├── Solicitud de examen            ◐ laboratorio/imagen legacy
│   ├── Interconsulta                  ○ P1
│   ├── Respuesta interconsulta         ○ P1
│   ├── Consentimiento informado       ○ P2
│   ├── Protocolo procedimiento         ○ P1
│   ├── Certificado médico             ✓ …/documentos/nuevo
│   ├── Informe médico                  ○ P2
│   ├── Alta médica                     ◐ …/alta
│   ├── Traslado                        ○ P2
│   └── Documento libre                 ○ P3
```

### 6. Modo papel

```text
├── 6. Modo papel
│   ├── Hoja clínica diaria            ✓ …/papel/dia/:date
│   ├── Libro de evoluciones           ✓ …/evoluciones/libro + …/papel/libro
│   ├── Página de evolución            ✓ …/evoluciones/:evolutionId
│   ├── Página indicaciones/receta     ○ P2
│   ├── Vista semanal / mensual        ○ P2
│   ├── Índice episodio                ◐ …/papel/libro
│   ├── Imprimir                       ✓ print routes
│   └── Exportar PDF                   ○ P3
```

### 7. IA clínica asistiva (transversal)

**No es rama de navegación.** Capa sobre borradores — nunca aprueba ni firma.

```text
├── 7. IA clínica asistiva
│   ├── Barra de comando               ✓ legacy transversal
│   ├── Sugerir borrador               ✓ assist campos
│   ├── Completar campos               ✓ clinicalTextBoxAssist
│   ├── Resumir historia               ○ P2
│   ├── Detectar pendientes            ○ mi-trabajo P1
│   ├── Explicar datos relevantes      ○ P2
│   ├── Estado IA degradada            ✓ chip
│   └── Registro sugerencias IA        ○ auditoría P2
```

### 8. Administración clínica

```text
├── 8. Administración clínica          ○ /admin/* P3 · fuera CICA demo
└── 9. Seguridad y auditoría
    ├── Bitácora accesos               ◐ …/auditoria
    ├── Versiones / firmas             ○ P2
    └── Exportación legal              ○ P3
```

---

## 5. Rutas sugeridas — mapa completo

### 5.1 Entrada clínica

```text
/app/buscar
/app/censo
/app/agenda
/app/recientes
/app/mi-trabajo
```

### 5.2 Ficha longitudinal (plan)

```text
/app/pacientes/:patientId/resumen              ✓ hoy
/app/pacientes/:patientId/caratula             ○ P1
/app/pacientes/:patientId/antecedentes         ○ P1
/app/pacientes/:patientId/problemas            ○ P1
/app/pacientes/:patientId/diagnosticos         ○ P1
/app/pacientes/:patientId/alergias             ○ P1
/app/pacientes/:patientId/medicacion-cronica   ○ P1
```

### 5.3 Hospitalización

**v1 actual (plano):**

```text
/app/pacientes/:patientId/ingreso
/app/pacientes/:patientId/evoluciones
/app/pacientes/:patientId/evoluciones/libro
/app/pacientes/:patientId/evoluciones/nueva
/app/pacientes/:patientId/evoluciones/:evolutionId
/app/pacientes/:patientId/indicaciones
/app/pacientes/:patientId/indicaciones/nueva
/app/pacientes/:patientId/examenes
/app/pacientes/:patientId/medicamentos
/app/pacientes/:patientId/interconsultas
/app/pacientes/:patientId/procedimientos
/app/pacientes/:patientId/alta
/app/pacientes/:patientId/epicrisis/nueva
```

**v2 objetivo (namespace):**

```text
/app/pacientes/:patientId/hospitalizacion
/app/pacientes/:patientId/hospitalizacion/ingreso
/app/pacientes/:patientId/hospitalizacion/evoluciones
/app/pacientes/:patientId/hospitalizacion/evoluciones/libro
/app/pacientes/:patientId/hospitalizacion/evoluciones/nueva
/app/pacientes/:patientId/hospitalizacion/indicaciones
/app/pacientes/:patientId/hospitalizacion/medicamentos
/app/pacientes/:patientId/hospitalizacion/enfermeria
/app/pacientes/:patientId/hospitalizacion/signos-vitales
/app/pacientes/:patientId/hospitalizacion/examenes
/app/pacientes/:patientId/hospitalizacion/interconsultas
/app/pacientes/:patientId/hospitalizacion/procedimientos
/app/pacientes/:patientId/hospitalizacion/cirugia
/app/pacientes/:patientId/hospitalizacion/uci
/app/pacientes/:patientId/hospitalizacion/alta
/app/pacientes/:patientId/hospitalizacion/epicrisis
```

Migración: redirects 301 en router · una MF por grupo de rutas.

### 5.4 Ambulatorio · documentos · papel · transversal

```text
/app/pacientes/:patientId/ambulatorio/consulta
/app/pacientes/:patientId/ambulatorio/control
/app/pacientes/:patientId/ambulatorio/recetas
/app/pacientes/:patientId/ambulatorio/ordenes
/app/pacientes/:patientId/ambulatorio/certificados
/app/pacientes/:patientId/ambulatorio/derivaciones
/app/pacientes/:patientId/ambulatorio/programas

/app/pacientes/:patientId/documentos              ✓
/app/pacientes/:patientId/documentos/nuevo        ✓
/app/pacientes/:patientId/timeline                ✓
/app/pacientes/:patientId/auditoria               ✓

/app/pacientes/:patientId/papel/dia/:date         ✓
/app/pacientes/:patientId/papel/libro             ✓
/app/pacientes/:patientId/papel/evoluciones/libro   ○ alias
/app/pacientes/:patientId/papel/evolucion/:evolutionId
/app/pacientes/:patientId/papel/documento/:documentId
/app/pacientes/:patientId/papel/semana/:week
/app/pacientes/:patientId/papel/mes/:month
```

---

## 6. Prioridad de construcción

### P0 — Núcleo (golden journey CICA)

| # | Pantalla | CICA-L | Gate cierre |
|---|----------|--------|-------------|
| 1 | Buscar paciente | L-01 Censo* | score ≥ 90 · `quality:golden-journey` |
| 2 | Censo | L-01 | idem |
| 3 | Ficha resumen | L-02 | idem |
| 4 | Evoluciones lista | L-03 | idem |
| 5 | Nueva evolución carta | L-04 | wrap `CicaLetterPageShell` |
| 6 | Indicaciones | L-05 | idem |
| 7 | Exámenes | L-06 | idem |
| 8 | Medicamentos | L-07 | idem |
| 9 | Documentos | L-08 | idem |
| 10 | Modo papel diario | L-10 | idem |
| 11 | Auditoría básica | L-11 | idem |

\* CICA-L-01 pendiente en censo/buscar — **bloqueador** para activar CICA como home.

### P1 — Hospital completo

Ingreso · enfermería · signos vitales · balance · interconsultas · procedimientos · UCI · alta · epicrisis · mi-trabajo real · recientes real.

### P2 — Ambulatorio completo

Agenda · consulta · control · recetas · órdenes · certificados · derivaciones · programas crónicos · papel semana/mes.

### P3 — Avanzado

Cirugía · pabellón · gestión documental · PDF import · integraciones · admin · analítica secundaria.

**Regla:** no construir P1+ hasta P0 con veredicto **GO** en walkthrough institucional.

---

## 7. Loop de entrega por pantalla (CICA-L)

Por cada pantalla del árbol:

```text
1. reports/cica-l/NN-<slug>.md     → inventario + wireframe ASCII (Fase C)
2. EPIS_CICA_SCREEN_REGISTRY.ts   → id, ruta, intent, primaryAction, layoutProfile
3. Implementación mínima          → ClinicalScreen + grilla simétrica
4. auditCicaScreen()              → score ≥ 90
5. Walkthrough humano             → ¿parece ficha médica?
6. Merge                          → un PR por pantalla o grupo mínimo
```

Plantilla wireframe: [`EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md`](./EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md) §6.

---

## 8. Matriz implementación vs objetivo

| Área | Pantallas objetivo | En registry hoy | Con UI real | Stub |
|------|-------------------|-----------------|-------------|------|
| Entrada clínica | 9 | 5 | 2 | 3 |
| Ficha longitudinal | 15 | 4 | 2 | 2 |
| Hospital | 22 | 14 | 8 | 6 |
| Ambulatorio | 18 | 2 | 1 | 1 |
| Documentos carta | 17 | 8 | 6 | 2 |
| Modo papel | 12 | 4 | 4 | 0 |
| IA transversal | 8 | — | 4 | — |

Fuente vivo: `EPIS_CICA_SCREEN_REGISTRY.ts` + [`EPIS2_CICA_SCREEN_MAP_v1.md`](./EPIS2_CICA_SCREEN_MAP_v1.md).

---

## 9. Prohibiciones (reformulación CICA)

```text
✗ Dashboard / tablero / Centro-Ficha-Dashboard
✗ Importar shell legacy en apps/web/src/cica/
✗ Más de 1 botón primario por pantalla
✗ Sidebar con catálogo completo del árbol
✗ Bloques composicionales sin wireframe aprobado
✗ Default ON de CICA hasta P0 GO
✗ IA que aprueba, firma o escribe SoT
```

---

## 10. Próximos entregables documentales

| Archivo | Contenido |
|---------|-----------|
| `reports/cica-l/01-censo-reform.md` | Wireframe buscar + censo P0 |
| `reports/cica-l/02-resumen-reform.md` | Grilla simétrica resumen |
| `docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md` | Header · pie · sidebar · 12 cols |

Plan operativo agentes: [`reports/epis2-cica-classic-implementation-roadmap.md`](../../reports/epis2-cica-classic-implementation-roadmap.md).
