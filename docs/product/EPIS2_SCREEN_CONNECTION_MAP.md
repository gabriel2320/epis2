# EPIS2 — Mapa de conexiones pantalla ↔ sistema

**Versión:** 1.0 · **Fecha:** 2026-06-05  
**Cadena obligatoria:**

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
  ✗ bandeja resultados
  ✗ ejecución CPOE
  ✗ notificación crítico UI
```

### Ingreso hospitalario

```text
comando admit_patient_hospital → tablero servicio (sin blueprint)
  → POST /api/inpatient/admissions
  ✗ formulario ingreso
  ✗ página dedicada
  ✗ retorno comando con contexto encuentro
```

### Traslado / alta inpatient

```text
API POST transfer / discharge
  ✗ comandos con blueprint
  ✗ formularios clínicos
  ✗ actualización automática timeline UI
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
| `admit_patient_hospital` | service tab | — | **PARTIAL** |

**Diseño intencional:** dashboard intents sin blueprint (`registry.ts`).

---

## 3. Conexiones MISSING

| Capacidad | Eslabón roto |
|-----------|--------------|
| Resultados bandeja | Todo el pipeline UI |
| Conciliación farmacéutica | blueprint + comando + API write |
| Consulta ambulatoria | blueprint + comando |
| Admin usuarios/roles | UI + API CRUD |
| FHIR import | Solo export implementado |
| Comando «revisa medicamentos» | Sin intent |
| Comando «ver pendientes» | Sin intent dedicado |
| Comando «traslada al paciente» | Sin intent (solo API) |
| Comando «haz ingreso» | Parcial → dashboard, no formulario |

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
| abre el tablero | `open_dashboard` | — | `/epis2/dashboard` |
| ingreso hospitalario | `admit_patient_hospital` | — | `/epis2/dashboard?tab=service` |

**Total comandos:** 17 (`packages/command-registry/src/definitions.ts`)

### Comandos catálogo producto sin intent

| Comando propuesto | Estado |
|-------------------|--------|
| resume últimas 24 horas | **PARTIAL** — alias de resumen + IA panel |
| haz ingreso | **PARTIAL** — `admit_patient_hospital` |
| traslada al paciente | **MISSING** |
| revisa medicamentos | **MISSING** |
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
| FHIR | export bundle | read-only |
| Auth | login, session, audit | sessions demo |

---

## 7. Cadenas incompletas priorizadas

| ID | Cadena | Severidad |
|----|--------|-----------|
| C1 | Ingreso: comando → sin blueprint → sin formulario | P1 |
| C2 | Resultados: sin UI ni comando | P1 |
| C3 | Documentos: API → sin pantalla → sin comando | P2 |
| C4 | Traslado/alta: API → sin comando/formulario | P2 |
| C5 | Widgets: registry → sin montaje Comando/ficha | P2 |
| C6 | Dashboard nursing/pharmacy: router validateSearch | P3 |
| C7 | Rutas canónicas `/trabajo` `/pacientes` vs `/espacio` | P3 (DEFERRED) |

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
