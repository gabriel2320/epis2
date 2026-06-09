# EPIS2 — Mapa completo de capacidades

> **HISTÓRICO (2026-06-09):** snapshot de planificación pre-tramos A–K. El «siguiente paso»
> canónico vive en [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md); no usar este mapa para decidir prioridades.

**Versión:** 1.0 · **Estado:** Plan maestro (sin implementación productiva nueva)  
**Frase guía:** *EPIS2 incorpora la experiencia acumulada, pero conserva una arquitectura limpia y una sola verdad.*

---

## 1. Flujo vertical obligatorio

Toda capacidad clínica nueva debe atravesar el mismo pipeline:

```text
Comando
  → intención
  → permiso
  → página clínica
  → formulario
  → borrador
  → aprobación humana
  → dato clínico versionado
  → auditoría
```

Si una función no puede demostrarse en este flujo, **no está lista** para producción demo.

---

## 2. Capacidades por dominio

Leyenda de madurez:

| Símbolo | Significado |
|---------|-------------|
| ✓ | Implementado en código actual (MVP / piloto) |
| ◐ | Parcial o solo demo / advisory |
| ○ | Diseñado en roadmap, sin código productivo |
| — | Fuera de alcance inmediato |

### 2.1 Identidad, acceso y gobierno

| Capacidad | V0 | V1 | V2 | V3 | V4 | V5 | Estado actual |
|-----------|----|----|----|----|----|----|---------------|
| Login y sesión segura | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ EPIS2-03 |
| RBAC explícito | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ roles demo |
| Auditoría append-only | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ login + aprobaciones |
| Permisos sin wildcards | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ gates |
| Registro de acceso IA | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ `ai_runs` + listado API |
| Cifrado / backups operativos | — | ○ | ○ | ○ | ✓ | ✓ | ○ |

### 2.2 Command-first y navegación

| Capacidad | V0 | V1+ | Estado actual |
|-----------|----|-----|---------------|
| Centro de Comando (home) | ✓ | ✓ | ✓ `/comando` |
| Command Registry único | ✓ | ✓ | ✓ `packages/command-registry` |
| Resolución intent → ruta | ✓ | ✓ | ✓ API `/api/commands/resolve` |
| Sinónimos es-CL | ✓ | ✓ | ✓ adaptado EPIS |
| MAU / ranking NL | ✓ | ✓ | ✓ `rank.ts` concepto EPIONE |
| Modo tablero opcional | ✓ | ✓ | ✓ EPIS2-12 |
| Chips de comando sin truncar | ✓ | ✓ | ✓ `pickChipSampleEs` + M3 chips |
| Navegación clínica (volver ficha/comando) | ✓ | ✓ | ✓ `ClinicalPageNav` |
| Power bar / una acción principal | ✓ | ✓ | ✓ |

### 2.3 Pacientes e identidad clínica

| Capacidad | V0 | V1 | V2+ | Estado actual |
|-----------|----|----|-----|---------------|
| Pacientes sintéticos DEMO | ✓ | ✓ | ✓ | ✓ DEMO-001…005 |
| Búsqueda paciente | ✓ | ✓ | ✓ | ✓ |
| RUT sintético / validación Chile | ✓ | ✓ | ✓ | ✓ `clinical-domain/chile` |
| Contactos y antecedentes | — | ✓ | ✓ | ○ |
| Encuentros ambulatorios / hospitalarios | — | ✓ | ✓ | ○ |
| Ficha longitudinal (resumen) | ✓ | ✓ | ✓ | ✓ slice demo + timeline |

### 2.4 Historia clínica longitudinal

| Capacidad | V0 | V1 | V2+ | Estado actual |
|-----------|----|----|-----|---------------|
| Problemas activos | ◐ | ✓ | ✓ | ◐ campos resumen demo |
| Diagnósticos estructurados | — | ✓ | ✓ | ○ |
| Alergias | ◐ | ✓ | ✓ | ✓ tabla demo + CDS (slice V1) |
| Medicamentos activos | ◐ | ✓ | ✓ | ✓ contexto + tabla demo |
| Observaciones / signos vitales | — | ✓ | ✓ | ◐ blueprint enfermería |
| Línea de tiempo | — | ✓ | ✓ | ◐ API longitudinal + panel UI |
| Documentos versionados | — | ✓ | ✓ | ◐ `clinical_documents` + búsqueda |
| Notas clínicas versionadas | ✓ | ✓ | ✓ | ✓ borrador → aprobación |
| Historial de cambios | ✓ | ✓ | ✓ | ✓ versiones borrador |

### 2.5 Atención médica (páginas clínicas)

| Capacidad | Blueprint | V0 | V1+ | Estado actual |
|-----------|-----------|----|-----|---------------|
| Resumen clínico | `patient_summary` | ✓ | ✓ | ✓ |
| Evolución médica | `evolution_note` | ✓ | ✓ | ✓ |
| Epicrisis | `discharge_summary` | ✓ | ✓ | ✓ |
| Receta | `prescription` | ✓ | ✓ | ✓ |
| Solicitud laboratorio | `lab_request` | ✓ | ✓ | ✓ |
| Ingreso | `admission_note` | ✓ | ✓ | ✓ blueprint demo |
| Interconsulta | `referral`, `referral_report` | ✓ | ✓ | ✓ blueprint demo |
| Indicaciones / órdenes | — | — | ✓ | ◐ `clinical_orders` demo |
| Imagenología | — | — | ✓ | ✓ blueprint demo |
| Procedimientos | — | — | ✓ | ○ |
| Traslado / alta | `transfer_note`, epicrisis | ✓ | ✓ | ◐ traslado form; alta parcial |

### 2.6 Hospitalización

| Capacidad | Versión objetivo | Estado |
|-----------|------------------|--------|
| Censo y camas | V2 | ✓ demo CIRUGIA-DEMO |
| Ingreso hospitalario | V2 | ✓ `admission_note` |
| Evolución diaria | V2 | ✓ alias evolución |
| Órdenes activas | V2 | ✓ tablero servicio |
| Resultados y críticos con acuse | V2 | ✓ bandeja + acuse + tendencias |
| Pendientes / worklist servicio | V2 | ✓ tablero servicio |
| Preparación de alta | V2 | ○ |

### 2.7 Enfermería

| Capacidad | Versión | Estado |
|-----------|---------|--------|
| Nota de enfermería | V3 | ✓ blueprint demo |
| Signos vitales | V3 | ◐ blueprint enfermería (demo) |
| Balance hídrico | V3 | ○ |
| Plan de cuidados | V3 | ○ |
| MAR (administración) | V3 | ✓ CDR + `mar_administration_records` |
| Eventos y alertas | V3 | ○ |
| Cambio de turno | V3 | ○ |

### 2.8 Farmacia clínica

| Capacidad | Versión | Estado |
|-----------|---------|--------|
| Conciliación | V3 | ✓ `medication_reconciliation` |
| Duplicidades / interacciones | V3 | ◐ CDS + CDR demo |
| Ajuste renal/hepático | V3 | ◐ regla renal demo |
| Validación farmacéutica | V3 | ✓ blueprint demo |
| Intervenciones | V3 | ○ |

### 2.9 Documentos e interoperabilidad

| Capacidad | Versión | Estado actual |
|-----------|---------|---------------|
| Importación PDF/TXT/imagen | V1 | ○ EPIS2-11 plan |
| OCR | V1 | ○ |
| Búsqueda semántica (RAG) | V1/V5 | ◐ RAG con citas demo (sin pgvector) |
| Export PDF / impresión | V1 | ○ |
| FHIR R4 export | V1 | ✓ frontera `packages/fhir-export` |
| HL7 v2 | V4 | ✓ cuarentena + mapping + writeback borrador (MF-180…182) |
| Staging importación externa | V4 | ◐ lectura staging demo |

### 2.10 Localización chilena

| Capacidad | Versión | Estado |
|-----------|---------|--------|
| RUT demo | V0+ | ✓ |
| CIE-10 | V1+ | ○ |
| FONASA / ISAPRE / GES | V1+ | ○ |
| SNRE / LME / DEIS | futuro | — |
| Formatos receta / epicrisis | V1+ | ○ copy + blueprints |

### 2.11 Seguridad clínica y alertas

| Capacidad | Modo | Estado actual |
|-----------|------|---------------|
| CDS (alergias, embarazo, renal) | Advisory | ✓ `clinicalSafety` |
| CDR (EPIONE) | Advisory | ✓ `clinicalDecisionRules` |
| Alertas en comando / ficha / formulario | UI | ✓ |
| Bloqueo automático de aprobación | — | **Rechazado** (solo humano) |

### 2.12 Inteligencia local (Ollama)

| Capacidad | V0 | V1+ | Estado |
|-----------|----|-----|--------|
| Intent / slots (futuro) | ◐ | ✓ | ◐ assist borrador |
| Borrador asistido por blueprint | ✓ | ✓ | ✓ |
| Resumen 24 h / hospitalización | — | V5 | ✓ slice suggest/summary |
| RAG con fuentes | — | V1/V5 | ✓ slice `/api/ai/rag/query` |
| Sin escritura clínica final | ✓ | ✓ | ✓ gates |

### 2.13 Modo tablero

| Vista | Versión | Estado |
|-------|---------|--------|
| Mi trabajo | V0 | ✓ EPIS2-12 |
| Tablero del paciente | V1 | ✓ slice demo |
| Tablero del servicio | V2 | ✓ |
| Calidad / administración | V4 | ✓ tablero calidad + consola admin demo |

---

## 3. Paquetes canónicos (destino)

| Dominio | Paquete / área | Rol |
|---------|----------------|-----|
| Comandos | `packages/command-registry` | Intents, aliases, routing |
| Formularios | `packages/clinical-forms` | Blueprints y validación (**18** en registry) |
| Widgets | `packages/epis2-widgets` | Registry contextual (WIDGET-00) |
| Permisos | `packages/clinical-domain` (RBAC) | Matriz rol → permiso |
| Acciones clínicas | `packages/clinical-actions` *(futuro)* | Catálogo declarativo EPIONE |
| Contratos | `packages/contracts` | API + UI + IA |
| Datos clínicos | PostgreSQL + Drizzle en `apps/api` | SoT |
| Borradores | API `drafts` | Estados separados |
| IA | `services/local-ai` | Ollama, schemas, prompts |
| FHIR | `packages/fhir-export` | Frontera export |
| Fixtures | `packages/test-fixtures` | Casos DEMO |

---

## 4. Relación con fases de implementación

| Fase repo | Entregable principal |
|-----------|----------------------|
| EPIS2-00 … 12 | MVP command-first + Modo tablero (V0 ✓) |
| WIDGET-00 | Fundación widgets contextuales |
| Plan A | Estabilización UX + sync docs |
| WIDGET-01 / V1+ | **Siguiente** — ver `reports/epis2-audit-and-dev-plans-2026-06-05.md` |

---

## 5. Referencias

- [EPIS2_RELEASE_ROADMAP.md](./EPIS2_RELEASE_ROADMAP.md)
- [EPIS2_DASHBOARD_MODE.md](./EPIS2_DASHBOARD_MODE.md)
- [../architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md](../architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md)
- [../legacy/EPIS_EPIDOS_EPIONE_CAPABILITY_REUSE_MATRIX.md](../legacy/EPIS_EPIDOS_EPIONE_CAPABILITY_REUSE_MATRIX.md)
