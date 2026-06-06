# EPIS2 — Mapa de conexiones pantalla ↔ sistema

**Versión:** 1.1 · **Fecha:** 2026-06-07  
**Actualización:** Ciclo A — MF-157…182 reflejados en cadenas

```text
comando → intent → permiso → blueprint → página → API → persistencia → borrador → aprobación → auditoría
```

---

## 1. Conexiones COMPLETE (cadena cerrada)

### Evolución médica (golden V0)

| Eslabón | Implementación | Estado |
|---------|----------------|--------|
| Comando | `evoluciona al paciente` → intent `create_evolution_draft` | ✓ |
| Intent | `packages/command-registry/src/definitions.ts` | ✓ |
| Permiso | `command.execute` + `draft.write` + `draft.approve` | ✓ |
| Blueprint | `evolution_note` → `/espacio/evolucion` | ✓ |
| Página | `GeneratedClinicalFormPage` + `ClinicalShellLayout` | ✓ |
| API | `POST /api/drafts`, `PATCH`, `POST approve` | ✓ |
| Persistencia | PostgreSQL `clinical_drafts` → `clinical_notes` | ✓ |
| Borrador | Versionado en draft | ✓ |
| Aprobación | Humana, rol physician | ✓ |
| Auditoría | Evento append-only | ✓ |
| IA (opcional) | `POST /api/ai/assist/draft` → borrador | ✓ |
| Retorno | `ClinicalPageNav` → `/comando` | ✓ |

### Receta (seguridad medicamentosa DEMO-005)

| Eslabón | Estado |
|---------|--------|
| Comando `prepare_prescription` | ✓ |
| CDS `GET /api/patients/:id/clinical-alerts` | ✓ |
| Blueprint `prescription` | ✓ |
| Borrador → aprobación (alertas no bloquean) | ✓ |

### Epicrisis, interconsulta, búsqueda paciente

Cadenas análogas — **COMPLETE** con profundidad demo.

### Ingreso hospitalario (MF-157…158)

```text
comando admit_patient_hospital → intent → admission_note → /espacio/ingreso
  → borrador → aprobación → POST /api/inpatient/admissions (SoT)
  → retorno comando con contexto paciente
```

### Traslado (MF-167)

```text
comando transfer_patient → transfer_note → /espacio/traslado
  → borrador → aprobación → POST /api/inpatient/transfer
```

### Conciliación, ambulatorio, informe interconsulta (MF-166…169)

Cadenas blueprint → borrador → aprobación — **COMPLETE** (`/espacio/conciliacion`, `/espacio/ambulatorio`, `/espacio/informe-interconsulta`).

### Alergias y problemas (MF-159…160)

Rutas `/espacio/alergia` y `/espacio/problema` — **COMPLETE** (acceso vía ficha/resumen; borrador → aprobación → SoT).

### Resultados (MF-161…165)

```text
comando open_results_inbox → /espacio/resultados
  → GET /api/patients/:id/results-inbox
  → acuse crítico, tendencias, trazabilidad orden → resultado
```

---

## 2. Conexiones PARTIAL (cadena incompleta)

### Resumen clínico

```text
comando summarize_patient → patient_summary → /espacio/resumen
  → API contexto demo (no regeneración live completa)
  → IA resumen 24h en panel ficha (paralelo, no mismo flujo)
```

**Brecha:** resumen blueprint es lectura estática; longitudinal API no alimenta todos los campos.

### Laboratorio / imagenología

```text
comando → blueprint orden → borrador → aprobación
  ✓ bandeja lectura → GET /api/patients/:id/results-inbox → /espacio/resultados
  ✗ ejecución CPOE
  ✓ acuse crítico en bandeja → POST /api/inpatient/critical-results/:id/acknowledge
  ✓ trazabilidad orden → resultado (`clinical_order_id` en bandeja)
  ✓ tendencias (`EpisTrendChart` en `/espacio/resultados`)
  ✓ comando `open_results_inbox` → `/espacio/resultados`
```

### Ingreso hospitalario (legacy tablero)

Alta operativa rápida sigue disponible en `ServiceDashboardTab` + API; la cadena canónica command-first es `admission_note` (§1).

### Traslado / alta inpatient

```text
Alta: API POST discharge + epicrisis blueprint (COMPLETE demo)
Traslado: transfer_note (COMPLETE — §1)
  ✗ timeline UI automática post-traslado
```

### MAR programado

```text
DB migración 021_v3_mar_schedule
  → dashboard nursing
  → blueprint medication_administration (admin puntual)
  ✗ UI schedule completa / barcode
```

### Documentos

```text
POST intake / OCR / search (API)
  ✗ comando «importar documento»
  ✗ pantalla revisión OCR
  ✗ aprobación documento
```

### Modo tablero (intents sin blueprint)

| Intent | Destino | Blueprint | Estado |
|--------|---------|-----------|--------|
| `open_dashboard` | `/epis2/dashboard?tab=work` | — | ✓ navegación |
| `open_dashboard_work` | work tab | — | ✓ |
| `open_dashboard_patient` | patient tab | — | ✓ |
| `open_dashboard_service` | service tab | — | ✓ |
| `open_dashboard_quality` | quality tab | — | ✓ |
| `admit_patient_hospital` | `/espacio/ingreso` | `admission_note` | **COMPLETE** |

**Diseño intencional:** dashboard intents sin blueprint (`registry.ts`).

---

## 3. Conexiones MISSING

| Capacidad | Eslabón roto |
|-----------|--------------|
| Alta clínica dedicada | Sin blueprint `discharge` separado de epicrisis |
| Admin usuarios/roles | UI read-only demo; CRUD productivo pendiente |
| FHIR import | Solo export implementado |
| Comando «ver pendientes» | Sin intent dedicado |
| Timeline post-traslado | UI no refresca automáticamente |
| HL7 writeback productivo | Borrador humano demo (MF-182); sin interfaz HIS real |

---

## 4. Diagrama flujo principal (implementado)

```mermaid
flowchart TD
  A[Login /login] --> B[Centro de Comando /comando]
  B --> C{Comando NL}
  C --> D[POST /api/commands/resolve]
  D --> E{Estado}
  E -->|resolved| F[Permiso + paciente]
  E -->|needs_patient| B
  E -->|forbidden| B
  F --> G{Ruta}
  G -->|/espacio/*| H[GeneratedClinicalFormPage]
  G -->|/epis2/dashboard| I[DashboardModeContent]
  H --> J[POST /api/drafts]
  J --> K[IA opcional /api/ai/assist/draft]
  K --> L[/espacio/borrador/id]
  L --> M[POST approve]
  M --> N[(PostgreSQL notes)]
  N --> O[Auditoría]
  O --> B
```

---

## 5. Matriz comando → intent → blueprint

| Comando (ejemplo) | Intent | Blueprint | Ruta |
|-------------------|--------|-----------|------|
| buscar paciente | `search_patient` | `patient_search` | `/espacio/buscar-paciente` |
| resume al paciente | `summarize_patient` | `patient_summary` | `/espacio/resumen` |
| evoluciona al paciente | `create_evolution_draft` | `evolution_note` | `/espacio/evolucion` |
| haz epicrisis | `prepare_discharge_draft` | `discharge_summary` | `/espacio/epicrisis` |
| prepara receta | `prepare_prescription` | `prescription` | `/espacio/receta` |
| solicita laboratorio | `request_laboratory` | `lab_request` | `/espacio/laboratorio` |
| interconsulta | `request_referral` | `referral` | `/espacio/interconsulta` |
| imagenología | `request_imaging` | `imaging_request` | `/espacio/imagenologia` |
| nota enfermería | `create_nursing_note` | `nursing_note` | `/espacio/enfermeria` |
| mar / administrar | `record_medication_administration` | `medication_administration` | `/espacio/mar` |
| validación farmacia | `prepare_pharmacy_review` | `pharmacy_validation` | `/espacio/farmacia` |
| ingreso hospitalario | `admit_patient_hospital` | `admission_note` | `/espacio/ingreso` |
| abre resultados | `open_results_inbox` | — | `/espacio/resultados` |
| concilia medicamentos | `reconcile_medications` | `medication_reconciliation` | `/espacio/conciliacion` |
| traslada paciente | `transfer_patient` | `transfer_note` | `/espacio/traslado` |
| consulta ambulatoria | `create_outpatient_visit` | `outpatient_visit` | `/espacio/ambulatorio` |
| informe interconsulta | `respond_referral` | `referral_report` | `/espacio/informe-interconsulta` |
| abre el tablero | `open_dashboard` | — | `/epis2/dashboard` |

**Total comandos:** 22 (`packages/command-registry/src/definitions.ts`)

### Comandos catálogo producto sin intent

| Comando propuesto | Estado |
|-------------------|--------|
| resume últimas 24 horas | **PARTIAL** — alias de resumen + IA panel |
| haz ingreso | ✓ `admit_patient_hospital` → `/espacio/ingreso` |
| traslada al paciente | ✓ `transfer_patient` |
| revisa medicamentos | ✓ `reconcile_medications` |
| ver pendientes | **MISSING** |
| pide imagenología | ✓ `request_imaging` |

---

## 6. API ↔ persistencia

| Dominio | Endpoints clave | Tablas / migraciones |
|---------|-----------------|----------------------|
| Pacientes | `GET /api/patients` | `patients` |
| Borradores | `/api/drafts/*` | `clinical_drafts`, versions |
| Notas aprobadas | via approve | `clinical_notes` |
| Longitudinal | `GET .../longitudinal` | encounters, timeline demo |
| Documentos | intake, OCR, search | `clinical_documents` |
| Inpatient | admissions, transfer, discharge | migraciones V2 |
| MAR schedule | dashboard nursing | `021_v3_mar_schedule` |
| IA | assist, rag, summary, runs | `ai_runs` |
| Dashboard | work, patient, service, nursing, pharmacy, quality | agregaciones demo |
| HL7 | validate, quarantine, mapping, writeback borrador | `interop_hl7_quarantine` (031) |
| Admin | users, catalogs (read demo) | `/espacio/admin`, migración 029 |
| FHIR | export bundle | read-only |
| Auth | login, session, audit | sessions demo |

---

## 7. Cadenas incompletas priorizadas

> **Actualización Ciclo A (2026-06-07):** C1, C2 y C4 **resueltos** (MF-157…167). C3, C5, C6 siguen resueltos.

| ID | Cadena | Severidad | Estado |
|----|--------|-----------|--------|
| C1 | Ingreso: comando → blueprint → formulario | P1 | **RESUELTO** — MF-157…158 |
| C2 | Resultados: UI + comando | P1 | **RESUELTO** — MF-161…165 |
| C3 | Documentos: API → pantalla → comando | P2 | **RESUELTO** — `DocumentSearchPanel`, LAYOUT-05 |
| C4 | Traslado: API → comando/formulario | P2 | **RESUELTO** — MF-167 `transfer_note` |
| C5 | Widgets: registry → montaje Comando/ficha | P2 | **RESUELTO** — WIDGET-01 |
| C6 | Dashboard nursing/pharmacy: router validateSearch | P3 | **RESUELTO** — `router.tsx` |
| C7 | Rutas canónicas `/trabajo` `/pacientes` vs `/espacio` | P3 (DEFERRED) | DEFERRED |

---

## 8. Verificación registries

| Registry | Ubicación | Duplicado |
|----------|-----------|-----------|
| Command Registry | `packages/command-registry` | No |
| Form Registry | `packages/clinical-forms` | No |
| Intent routes | `packages/command-registry/src/routes.ts` | No |
| Web wiring | `getBlueprintByRoutePath()` only | No |

Gate: `scripts/architecture/` — **14/14 verdes** (sesión auditoría).

---

## Referencias

- Resolve API: `apps/api/src/commands/routes.ts`
- Clinical service: `apps/api/src/clinical/service.ts`
- Navigate: `apps/web/src/routes/clinicalNavigate.ts`
- Golden journeys: `docs/quality/EPIS2_GOLDEN_JOURNEYS.md`
