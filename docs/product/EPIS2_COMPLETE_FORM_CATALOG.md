# EPIS2 — Catálogo completo de formularios

**Versión:** 1.1 · **Fecha:** 2026-06-07  
**Estado:** Sincronizado con registry (Ciclo A post MF-182)  
**Registry único:** `packages/clinical-forms/src/registry.ts`

---

## 1. Reglas de validación

| Regla | Estado |
|-------|--------|
| Un blueprint por formulario clínico | ✓ **19 blueprints** |
| Cada blueprint con `routePath` | ✓ |
| Sin Form Registry paralelo | ✓ gate arquitectónico |
| Toda acción draft con aprobación humana | ✓ `POST /api/drafts/:id/approve` |
| IA solo en blueprints con `draftType` | ✓ `BLUEPRINT_DRAFT_TYPES` |
| Auditoría en aprobación | ✓ |

---

## 2. Formularios implementados (19)

| Formulario | Blueprint | Ruta | Roles | Validaciones | IA | Aprobación | Estado |
|------------|-----------|------|-------|--------------|-----|------------|--------|
| Búsqueda paciente | `patient_search` | `/espacio/buscar-paciente` | physician, nurse, admin, auditor | Campos opcionales | No | N/A | **COMPLETE** |
| Resumen clínico | `patient_summary` | `/espacio/resumen` | physician, nurse, admin, auditor | Solo lectura | No (panel IA aparte) | N/A | **PARTIAL** |
| Evolución SOAP | `evolution_note` | `/espacio/evolucion` | physician, nurse | assessment*, plan* | Sí | Sí | **COMPLETE** |
| Epicrisis | `discharge_summary` | `/espacio/epicrisis` | physician | 7 campos requeridos | Sí | Sí | **COMPLETE** |
| Receta médica | `prescription` | `/espacio/receta` | physician, pharmacist | medication*, dose*, etc. | Sí | Sí | **COMPLETE** |
| Solicitud laboratorio | `lab_request` | `/espacio/laboratorio` | physician, nurse | labTests*, clinicalReason* | Sí | Sí | **PARTIAL** |
| Interconsulta | `referral` | `/espacio/interconsulta` | physician, nurse | specialty*, clinicalSummary* | Sí | Sí | **COMPLETE** |
| Imagenología | `imaging_request` | `/espacio/imagenologia` | physician, nurse | modality*, studyDescription* | Sí | Sí | **PARTIAL** |
| Nota enfermería | `nursing_note` | `/espacio/enfermeria` | nurse, physician | careProvided* | Sí | Sí | **COMPLETE** |
| Administración MAR | `medication_administration` | `/espacio/mar` | nurse, physician | medication*, dose*, route* | Sí | Sí | **PARTIAL** |
| Validación farmacéutica | `pharmacy_validation` | `/espacio/farmacia` | pharmacist, physician | medicationReviewed*, intervention* | Sí | Sí | **PARTIAL** |
| Ingreso hospitalario | `admission_note` | `/espacio/ingreso` | physician, nurse | motivo*, servicio* | Sí | Sí | **COMPLETE** |
| Registro alergia | `allergy_entry` | `/espacio/alergia` | physician, nurse | substance*, severity* | No | Sí | **COMPLETE** |
| Problema clínico | `clinical_problem_entry` | `/espacio/problema` | physician, nurse | problem*, status* | No | Sí | **COMPLETE** |
| Conciliación medicamentosa | `medication_reconciliation` | `/espacio/conciliacion` | pharmacist, physician | home*, inpatient*, discrepancies* | No | Sí | **COMPLETE** |
| Nota de traslado | `transfer_note` | `/espacio/traslado` | physician, nurse | destino*, motivo* | Sí | Sí | **COMPLETE** |
| Consulta ambulatoria | `outpatient_visit` | `/espacio/ambulatorio` | physician, nurse | chiefComplaint*, assessment*, plan* | No | Sí | **COMPLETE** |
| Informe interconsulta | `referral_report` | `/espacio/informe-interconsulta` | physician | context*, assessment*, recommendations* | No | Sí | **COMPLETE** |
| Certificado médico | `medical_certificate` | `/espacio/certificado` | physician | certificateType*, reason* | No | Sí | **COMPLETE** |

**Archivos blueprint:** `packages/clinical-forms/src/blueprints/*.ts`

---

## 3. Mapeo draftType → persistencia

| draftType | Blueprint(s) | API enum | Estado |
|-----------|--------------|----------|--------|
| `evolution_note` | evolution_note | ✓ | **COMPLETE** |
| `discharge_summary` | discharge_summary | ✓ | **COMPLETE** |
| `prescription` | prescription | ✓ | **COMPLETE** |
| `lab_request` | lab_request | ✓ | **COMPLETE** |
| `referral` | referral | ✓ | **COMPLETE** |
| `imaging_request` | imaging_request | ✓ | **COMPLETE** |
| `nursing_note` | nursing_note | ✓ | **COMPLETE** |
| `medication_administration` | medication_administration | ✓ | **COMPLETE** |
| `pharmacy_validation` | pharmacy_validation | ✓ | **COMPLETE** |
| `admission_note` | admission_note | ✓ | **COMPLETE** |
| `allergy_entry` | allergy_entry | ✓ | **COMPLETE** |
| `clinical_problem_entry` | clinical_problem_entry | ✓ | **COMPLETE** |
| `medication_reconciliation` | medication_reconciliation | ✓ | **COMPLETE** |
| `transfer_note` | transfer_note | ✓ | **COMPLETE** |
| `outpatient_visit` | outpatient_visit | ✓ | **COMPLETE** |
| `referral_report` | referral_report | ✓ | **COMPLETE** |
| `medical_certificate` | medical_certificate | ✓ | **COMPLETE** |

---

## 4. Formularios del catálogo producto — MISSING

### A. Acceso y sesión

| Formulario | Blueprint | Estado |
|------------|-----------|--------|
| Inicio de sesión | — (UI `LoginPage`) | **COMPLETE** |
| Cambio contraseña | — | **MISSING** |
| Preferencias apariencia | — (`AppearancePreferencesPage`) | **COMPLETE** |
| Preferencias notificación | — | **MISSING** |
| Selección rol / unidad | — | **MISSING** |

### C. Paciente

| Formulario | Estado |
|------------|--------|
| Registro demográfico | **MISSING** |
| Identificadores | **MISSING** |
| Contactos | **MISSING** |
| Cobertura/seguro | **MISSING** |
| Consentimientos | **MISSING** |
| Alergia / reacción adversa | `allergy_entry` | **COMPLETE** |
| Problema / diagnóstico | `clinical_problem_entry` | **COMPLETE** |
| Alerta clínica | **MISSING** |
| Equipo tratante | **MISSING** |

### D. Atención ambulatoria

| Formulario | Estado |
|------------|--------|
| Consulta ambulatoria | `outpatient_visit` | **COMPLETE** |
| Evolución libre estructurada | **MISSING** (SOAP ✓) |
| Plan terapéutico | **MISSING** |
| Certificado | **MISSING** |
| Indicaciones al paciente | **MISSING** |
| Cierre encuentro | **MISSING** |
| Solicitud procedimiento | **MISSING** |

### E. Documentación médica

| Formulario | Estado |
|------------|--------|
| Ingreso hospitalario | `admission_note` | **COMPLETE** |
| Nota procedimiento | **MISSING** |
| Nota traslado | `transfer_note` | **COMPLETE** |
| Alta (formulario) | **MISSING** |
| Nota fallecimiento | **DEFERRED** |

### F. Órdenes (adicionales)

| Formulario | Estado |
|------------|--------|
| Terapia, monitoreo, transfusión | **MISSING** |
| Dieta, cuidados, restricciones | **MISSING** |
| Orden traslado / alta | **MISSING** |

### G. Resultados

| Formulario | Estado |
|------------|--------|
| Acuse crítico (UI) | **MISSING** |
| Comentario clínico | **MISSING** |
| Marcar revisado | **MISSING** |

### H. Medicamentos

| Formulario | Estado |
|------------|--------|
| Conciliación | `medication_reconciliation` | **COMPLETE** |
| Suspensión medicamento | **MISSING** |
| Reacción adversa | **MISSING** |
| Administración futura (programación) | **PARTIAL** (MAR schedule DB) |

### I–K. Hospitalización, enfermería, farmacia

| Formulario | Estado |
|------------|--------|
| Ingreso hospitalario | `admission_note` | **COMPLETE** |
| Evolución diaria (hosp.) | **MISSING** | IDC 105 / Ola 10 |
| Entrega turno | **PARTIAL** | IDC 111 · `nursing_note` |
| Evaluación inicial enfermería | **PARTIAL** | IDC 112–113 · Ola 11 |
| Balance hídrico, heridas, riesgos | **MISSING** | IDC 114–115 · Ola 11 |
| Conciliación farmacéutica (form) | `medication_reconciliation` | **COMPLETE** |

### M. Documentos

| Formulario | Estado |
|------------|--------|
| Importación | **PARTIAL** (API) |
| Clasificación / OCR / etiquetas | **MISSING** UI |
| Aprobación documento | **MISSING** |

---

## 5. Duplicidades y conflictos

| Verificación | Resultado |
|--------------|-----------|
| Dos blueprints misma ruta | ✓ Ninguno |
| Dos rutas mismo blueprint | ✓ Ninguno |
| Formulario fuera de registry | ✓ Ninguno en producción |
| `GeneratedClinicalFormPage` duplica lógica por blueprint | ✓ Un solo renderer |

---

## 6. IA por formulario

| Blueprint | `POST /api/ai/assist/draft` | Schema assist | Fallback sin Ollama |
|-----------|----------------------------|---------------|---------------------|
| evolution_note | ✓ | ✓ Zod | ✓ manual |
| discharge_summary | ✓ | ✓ | ✓ |
| prescription | ✓ | ✓ | ✓ |
| lab_request | ✓ | ✓ | ✓ |
| referral | ✓ | ✓ | ✓ |
| imaging_request | ✓ | ✓ | ✓ |
| nursing_note | ✓ | ✓ | ✓ |
| medication_administration | ✓ | ✓ | ✓ |
| pharmacy_validation | ✓ | ✓ | ✓ |
| patient_search | N/A | — | — |
| patient_summary | N/A | — | — |

**Registro ejecuciones:** `ai_runs` + `GET /api/ai/runs` — **COMPLETE**.

---

## 7. Permisos por formulario

| Acción | Permiso |
|--------|---------|
| Abrir formulario (comando) | `command.execute` |
| Guardar borrador | `draft.write` |
| Leer borrador | `draft.read` |
| Aprobar | `draft.approve` |
| Asistencia IA | `draft.write` (assist) + `ai.read` (panel) |

Validación rol por blueprint: `blueprint.allowedRoles` en `GeneratedClinicalFormPage` — **COMPLETE**.

---

## 8. Resumen cuantitativo

| Métrica | Valor |
|---------|-------|
| Blueprints implementados | **19** |
| Formularios catálogo producto (estimado) | ~95 |
| Cobertura formularios | **~19 %** |
| Formularios COMPLETE en MVP+olas | 13 |
| Formularios PARTIAL | 5 |
| Cadenas blueprint→ruta→permiso completas | 19/19 |

---

## 9. Inventario extendido (IDC 1–200)

**Índice maestro:** [`EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`](./EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md)

| Bloque | Documento | COMPLETE | PARTIAL |
|--------|-----------|----------|---------|
| 1–100 | [`EPIS2_ARCHITECTURE_INVENTORY_001_100.md`](./EPIS2_ARCHITECTURE_INVENTORY_001_100.md) | 6 (login, SOAP, receta, lab, interconsulta + epicrisis*) | 38 |
| 101–200 | [`EPIS2_ARCHITECTURE_INVENTORY_101_200.md`](./EPIS2_ARCHITECTURE_INVENTORY_101_200.md) | 1 (conciliación 165) | 14 |

\*Epicrisis es blueprint MVP adicional (`discharge_summary`), no IDC numerado en 1–100.

**Próxima ola sugerida (1–100):** Ola 2 — consulta ambulatoria IDC **31–40**.  
**Próxima ola sugerida (101–200):** Ola 10 — triage ESI **102** + tablero urgencias **101**.

---

## Referencias

- Registry: `packages/clinical-forms/src/registry.ts`
- Validación: `packages/clinical-forms/src/validate.ts`
- Renderer: `apps/web/src/pages/GeneratedClinicalFormPage.tsx`
- Draft API: `apps/api/src/clinical/routes.ts`
