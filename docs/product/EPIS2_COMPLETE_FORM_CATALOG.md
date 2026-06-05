# EPIS2 — Catálogo completo de formularios

**Versión:** 1.0 · **Fecha:** 2026-06-05  
**Estado:** Auditoría de brechas  
**Registry único:** `packages/clinical-forms/src/registry.ts`

---

## 1. Reglas de validación

| Regla | Estado |
|-------|--------|
| Un blueprint por formulario clínico | ✓ 11 blueprints |
| Cada blueprint con `routePath` | ✓ |
| Sin Form Registry paralelo | ✓ gate arquitectónico |
| Toda acción draft con aprobación humana | ✓ `POST /api/drafts/:id/approve` |
| IA solo en blueprints con `draftType` | ✓ `BLUEPRINT_DRAFT_TYPES` |
| Auditoría en aprobación | ✓ |

---

## 2. Formularios implementados (11)

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

---

## 4. Formularios del catálogo producto — MISSING

### A. Acceso y sesión

| Formulario | Blueprint | Estado |
|------------|-----------|--------|
| Inicio de sesión | — (UI `LoginPage`) | **COMPLETE** |
| Cambio contraseña | — | **MISSING** |
| Preferencias apariencia | — | **MISSING** |
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
| Alergia / reacción adversa | **MISSING** |
| Problema / diagnóstico | **MISSING** |
| Alerta clínica | **MISSING** |
| Equipo tratante | **MISSING** |

### D. Atención ambulatoria

| Formulario | Estado |
|------------|--------|
| Consulta ambulatoria | **MISSING** |
| Evolución libre estructurada | **MISSING** (SOAP ✓) |
| Plan terapéutico | **MISSING** |
| Certificado | **MISSING** |
| Indicaciones al paciente | **MISSING** |
| Cierre encuentro | **MISSING** |
| Solicitud procedimiento | **MISSING** |

### E. Documentación médica

| Formulario | Estado |
|------------|--------|
| Ingreso hospitalario | **MISSING** |
| Nota procedimiento | **MISSING** |
| Nota traslado | **MISSING** |
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
| Conciliación | **MISSING** |
| Suspensión medicamento | **MISSING** |
| Reacción adversa | **MISSING** |
| Administración futura (programación) | **PARTIAL** (MAR schedule DB) |

### I–K. Hospitalización, enfermería, farmacia

| Formulario | Estado |
|------------|--------|
| Ingreso hospitalario | **MISSING** |
| Evolución diaria (hosp.) | **MISSING** |
| Entrega turno | **MISSING** |
| Evaluación inicial enfermería | **MISSING** |
| Balance hídrico, heridas, riesgos | **MISSING** |
| Conciliación farmacéutica (form) | **MISSING** |

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
| Blueprints implementados | 11 |
| Formularios catálogo producto (estimado) | ~95 |
| Cobertura formularios | **~12 %** |
| Formularios COMPLETE en MVP | 5 |
| Formularios PARTIAL | 6 |
| Cadenas blueprint→ruta→permiso completas | 11/11 |

---

## Referencias

- Registry: `packages/clinical-forms/src/registry.ts`
- Validación: `packages/clinical-forms/src/validate.ts`
- Renderer: `apps/web/src/pages/GeneratedClinicalFormPage.tsx`
- Draft API: `apps/api/src/clinical/routes.ts`
