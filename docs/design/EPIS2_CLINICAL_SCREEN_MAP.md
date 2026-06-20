# EPIS2 — Mapa de pantallas clínicas

> **SUPERSEDED_BY_CICA (2026-06-19):** mapa de norte estetico previo a CICA. Usar `docs/product/EPIS2_ROUTE_MAP.md` y `EPIS_CICA_SCREEN_REGISTRY.ts` como canon de pantallas activas.

**Versión:** 1.0 · **Fecha:** 2026-06-16  
**Programa:** PROG-AESTHETIC-RESET · **Estado:** Canon de producto (norte navegación)

**Documentos relacionados:**

| Documento | Rol |
|-----------|-----|
| [`EPIS2_CICA.md`](./EPIS2_CICA.md) | Algoritmo de Composición por Intención Clínica (CICA) |
| [`EPIS2_CLINICAL_LAYOUT_MANIFESTO.md`](./EPIS2_CLINICAL_LAYOUT_MANIFESTO.md) | Composición: una intención, una acción primaria |
| [`EPIS2_CLINICAL_LAYOUT_ENGINE.md`](./EPIS2_CLINICAL_LAYOUT_ENGINE.md) | Motor: `ClinicalScreen`, tabs, action bar |
| [`EPIS2_AESTHETIC_RESET_PROGRAM.md`](../product/EPIS2_AESTHETIC_RESET_PROGRAM.md) | Microfases MF-AEST-* |
| [`ADR-002-dual-chart-modes.md`](../adr/ADR-002-dual-chart-modes.md) | Ficha dual + command bar transversal |

> **Regla rectora (CICA):** intención clínica progresiva — paciente → problema → documento → acción → firma. Ver [`EPIS2_CICA.md`](./EPIS2_CICA.md).

---

## §0 — Barra de comando transversal (obligatoria)

La **barra de comando NL** (`EpisUniversalCommandBar`) es capa **fija y transversal** en todo el workspace clínico post-login. No es un modo ni una pantalla: es infraestructura de intención clínica (Command Registry + Ctrl+K palette).

### Dónde debe estar presente

| Superficie | Montaje | testId |
|------------|---------|--------|
| Censo | `ClinicalShellLayout` → `ChartEspacioCommandDock` | `epis2-census-command-bar` |
| Formularios `/espacio/*` | `EpisAppScaffold` → `ChartEspacioCommandDock` | `epis2-espacio-chart-command-bar` |
| Ficha dual tradicional | `ClinicalShell` → `ClinicalActionBar` | `epis2-chart-command-bar` |
| Modo papel standalone | `StandalonePaperChartPage` → `ClinicalTransversalCommandDock` | `epis2-paper-command-bar` |

### Excepciones permitidas

| Pantalla | Motivo |
|----------|--------|
| `/login` | Pre-autenticación |
| Rutas `/imprimir` | Vista print sin chrome interactivo |
| Legacy ficha sin dual-chart | `PatientWorkspaceCommandPanel` (migrar a barra unificada) |

### Gate

```bash
npm run quality:gate -- quality:clinical-command-bar-transversal-gate
```

**Implementación:** `ClinicalTransversalCommandDock` · `ChartEspacioCommandDock` · `ClinicalShell`.

---

## §1 — Árbol maestro (producto)

```text
EPIS2
│
├── 1. Login / Selección de usuario          [/login]
│
├── 2. Censo clínico                         [/espacio/buscar-paciente]
│   ├── Hospitalizados / Ambulatorio / Recientes / Buscar  (filtros UI — misma ruta)
│   └── Abrir ficha →
│
└── 3. Ficha clínica del paciente            [/espacio/ficha?patientId=…]
    │
    ├── [CAPA 0] Barra de comando NL         (siempre visible)
    ├── [CAPA 1] Identidad paciente          (PatientIdentityBand)
    ├── [CAPA 2] Tabs clínicos               (ClassicChartTabs — MF-AEST-02b)
    ├── [CAPA 3] Contenido principal         (una sección activa)
    └── [CAPA 4] Acción primaria + Más       (ClinicalLayoutActionBar)
    │
    ├── 3.1 Resumen clínico                  tab: Resumen
    ├── 3.2 Evoluciones                      tab: Evoluciones  → /espacio/evolucion
    ├── 3.3 Ingreso clínico                  subnav bajo Evoluciones + /espacio/ingreso
    ├── 3.4 Indicaciones                     tab: Indicaciones
    ├── 3.5 Medicamentos                     tab: Más
    ├── 3.6 Exámenes                         tab: Exámenes      → /espacio/laboratorio, resultados
    ├── 3.7 Documentos                       tab: Documentos    → epicrisis, certificados…
    ├── 3.8 Enfermería                       (fase 2 — papel hoy; tab futuro)
    ├── 3.9 Alta / traslado                  subnav Documentos + /espacio/epicrisis, traslado
    ├── 3.10 Línea de tiempo                 panel contextual (fase 2: tab)
    ├── 3.11 Modo papel                      [/espacio/ficha/papel] — pantalla exclusiva
    └── 3.12 Auditoría                       tab Más (navAudit) → /espacio/admin?tab=audit
```

---

## §2 — Navegación visible (MF-AEST-02b)

### Nivel 1 — Censo

```text
Censo → Abrir ficha
```

Acción primaria: **Abrir ficha**.

### Nivel 2 — Ficha del paciente (tabs visibles)

```text
Resumen | Evoluciones | Indicaciones | Exámenes | Documentos | Más
```

Máximo **6 entradas** en barra tabulada (5 clínicas + Más). Modo **Papel** se accede desde acción secundaria o selector de modo — no compite con tabs clínicos.

### Tab «Más» (overflow)

```text
Medicamentos          (navMeds — hoy)
Enfermería            (fase 2)
Interconsultas        (navConsults — hoy bajo Documentos subnav)
Procedimientos        (navProcedures)
Alta                  (navEpicrisis + forms traslado)
Auditoría             (navAudit)
```

---

## §3 — Composición ideal ficha clásica

```text
┌──────────────────────────────────────────────────────────────┐
│ [Barra de comando NL — instrucción clínica / búsqueda]        │
├──────────────────────────────────────────────────────────────┤
│ Paciente · edad · RUT · cama · servicio · DEMO · borrador/IA  │
├──────────────────────────────────────────────────────────────┤
│ Resumen | Evoluciones | Indicaciones | Exámenes | Docs | Más │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                  CONTENIDO CLÍNICO PRINCIPAL                 │
│                  (una sección por vista)                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                      [Acción principal] [Más] │
└──────────────────────────────────────────────────────────────┘
```

---

## §4 — Modo papel (árbol propio)

Ruta exclusiva: `/espacio/ficha/papel?patientId=…&paperDate=…`

```text
[Barra de comando NL]
[← Volver]  [← Día ant.] [Hoy] [Día sig. →]  [Imprimir…]
─────────────────────────────────────────────
        Hoja clínica centrada (documento)
─────────────────────────────────────────────
```

Acción primaria: **Imprimir** o **Navegar día** (según contexto).  
No embeber papel dentro de ficha clásica (MF-AEST-03).

---

## §5 — Regla de acción primaria por pantalla

| Pantalla | Acción primaria |
|----------|-----------------|
| Censo | Abrir ficha |
| Resumen | Nueva evolución |
| Evoluciones | Crear evolución |
| Nueva evolución (form) | Guardar borrador |
| Indicaciones | Agregar indicación |
| Exámenes | Solicitar examen |
| Medicamentos | Crear receta |
| Documentos | Crear documento |
| Alta | Crear epicrisis |
| Modo papel | Imprimir / navegar día |

Nunca más de **una** acción primaria visible (`data-action-kind="primary"`).

---

## §6 — Mapa semántico ↔ rutas EPIS2 (implementación)

El producto usa rutas `/espacio/*` + query `patientId` — **no** migrar a `/pacientes/:id/…` sin ADR.

| Intención clínica | Ruta canónica EPIS2 |
|-------------------|---------------------|
| Censo | `/espacio/buscar-paciente` |
| Ficha / resumen | `/espacio/ficha?patientId=&chartMode=traditional` |
| Evolución nueva | `/espacio/evolucion?patientId=` |
| Receta | `/espacio/receta?patientId=` |
| Laboratorio | `/espacio/laboratorio?patientId=` |
| Epicrisis | `/espacio/epicrisis?patientId=` |
| Modo papel | `/espacio/ficha/papel?patientId=&paperDate=` |
| Revisión borrador | `/espacio/borrador/$draftId` |

Breadcrumb objetivo (MF-AEST-05): `Censo → [Paciente] → [Sección]` sin cambiar URLs.

---

## §7 — Diez pantallas mínimas demo

```text
1. Login
2. Censo
3. Ficha / Resumen clínico
4. Evoluciones
5. Nueva evolución
6. Indicaciones médicas
7. Exámenes
8. Medicamentos / receta
9. Documentos / epicrisis
10. Modo papel exclusivo
```

Todas excepto login incluyen **barra de comando transversal**.

---

## §8 — Fases de adopción

| Fase | Entregable | Estado |
|------|------------|--------|
| A | Screen Map + command bar gate | ✓ |
| B | 5 tabs + Más (MF-AEST-02b) | ✓ |
| C | Breadcrumb censo→ficha (MF-AEST-05) | ✓ |
| D | CICA canon + `auditCicaScreen` (MF-AEST-06) | ✓ parcial |
| D2 | CICA-L loop por pantalla ([`EPIS2_CICA_L.md`](./EPIS2_CICA_L.md)) | ✓ CICA-L-08 activo |
| E | Tabs Enfermería / Alta propios | Fase clínica 2 |
| F | Censo segmentado (filtros UI) | Fase demo |

---

## §9 — Prohibiciones

```text
NO dashboard como home del flínico
NO modo papel embebido en ficha clásica
NO ocultar barra de comando en /espacio/* clínico
NO más de 1 acción primaria visible por pantalla
NO rail de 17 ítems como navegación principal (MF-AEST-02)
```

---

*EPIS2 — ficha electrónica sobria. Modo papel — hoja clínica viva. Command bar — siempre presente.*
