# EPIS2 — Catálogo completo de pantallas

**Versión:** 1.1 · **Fecha:** 2026-06-04  
**Estado:** Auditoría de brechas (sin implementación masiva)  
**Frase guía:** *EPIS2 debe mostrar únicamente la herramienta necesaria para completar la actividad clínica actual.*

---

## 1. Modelo de cinco experiencias raíz

| Experiencia | Ruta canónica (producto) | Ruta actual (código) | Estado |
|-------------|--------------------------|----------------------|--------|
| Login | `/ingresar` | `/login` | **PARTIAL** — funcional; nomenclatura distinta |
| Centro de Comando | `/comando` | `/comando` | **COMPLETE** |
| Paciente | `/pacientes/:patientId` | `/espacio/ficha?patientId=` | **PARTIAL** — hub sin ruta RESTful |
| Espacio clínico | `/trabajo/:activity` | `/espacio/*` | **PARTIAL** — 11 rutas blueprint; prefijo distinto |
| Modo tablero | `/tablero` | `/epis2/dashboard` | **PARTIAL** — secundario correcto; ruta distinta |

**Regla verificada:** home = Centro de Comando (`EPIS2_COMMAND_CENTER_HOME = '/comando'`). Modo tablero nunca es home.

**Anatomía común clínica:** `ClinicalShellLayout` implementa encabezado mínimo (marca, paciente, usuario, volver a comando). Paneles contextuales (IA, alertas) son invocables, no dominantes.

---

## 2. Leyenda de estados

| Estado | Significado |
|--------|-------------|
| **COMPLETE** | Pantalla/ruta operativa con estados básicos |
| **PARTIAL** | Existe pero incompleta, demo o sin todos los estados |
| **MISSING** | No existe en web |
| **DUPLICATED** | Dos rutas/pantallas compiten por la misma función |
| **LEGACY** | Patrón prohibido o heredado no usado |
| **BLOCKED** | Bloqueado por gate, permiso o dependencia |
| **DEFERRED** | Diseñado; fuera de alcance inmediato |

---

## 3. A. Acceso, sesión y experiencia global

| # | Pantalla | Ruta/pantalla actual | Estado | Acción |
|---|----------|----------------------|--------|--------|
| 1 | Login | `/login` → `LoginPage` | **COMPLETE** | Alinear nomenclatura a `/ingresar` (DEFERRED) |
| 2 | Recuperación de acceso | — | **MISSING** | Ola 9 hardening |
| 3 | Sesión expirada | Redirect implícito a `/login` | **PARTIAL** | Pantalla dedicada con mensaje seguro |
| 4 | Perfil sin acceso | Error 403 en comando/formulario | **PARTIAL** | Pantalla `forbidden` unificada |
| 5 | Selección de rol activo | Rol fijo en sesión demo | **MISSING** | Ola 9 (OIDC multi-rol) |
| 6 | Preferencias personales | — | **MISSING** | Ola 9 |
| 7 | Preferencias de apariencia | `/preferencias-apariencia` | **COMPLETE** | M3 + split screen |
| 8 | Ayuda contextual | — | **MISSING** | Ola 1 (ayuda comandos) |
| 9 | Centro de notificaciones | — | **MISSING** | Ola 4+ |
| 10 | Estado sin conexión | Errores locales en formularios | **PARTIAL** | Estado global offline |
| 11 | Página no encontrada | `NotFoundPage` (fallback router) | **COMPLETE** | — |
| 12 | Error seguro | Alertas `EpisAlert` por vista | **PARTIAL** | Página error genérica |

---

## 4. B. Centro de Comando (`/comando`)

| # | Pantalla / estado | Componente | Estado | Acción |
|---|-------------------|------------|--------|--------|
| 1 | Sin paciente | `CommandCenterPage` | **COMPLETE** | — |
| 2 | Con paciente | `ActivePatientBanner` + contexto | **COMPLETE** | — |
| 3 | Interpretación de comando | `EpisCommandResult` | **COMPLETE** | — |
| 4 | Selección intención ambigua | Mensaje en resultado | **PARTIAL** | UI dedicada desambiguación |
| 5 | Datos faltantes | `needs_patient` en resolve | **PARTIAL** | Flujo guiado explícito |
| 6 | Bloqueado por rol | `forbidden` + copy | **COMPLETE** | — |
| 7 | Bloqueado sin paciente | `needs_patient` | **COMPLETE** | — |
| 8 | Bloqueado por seguridad | CDS en alertas | **PARTIAL** | No bloquea aprobación (by design) |
| 9 | Historial de comandos | — | **MISSING** | Ola 1 |
| 10 | Ayuda de comandos | Chips sugeridos + `suggest` API | **PARTIAL** | Panel ayuda persistente |

**Elementos visibles auditados:** Power Bar ✓ · paciente actual ✓ · rol ✓ · sugerencias ✓ · acceso tablero ✓ · widgets **✓** (`ClinicalWidgetPanel` M3 en Comando y ficha).

---

> **Reconciliación MF-DOC-002 (2026-06-07):** secciones §5–§19 alineadas con matriz IDC (`EPIS2_IDC_EXECUTION_MATRIX.md`) y rutas en `router.tsx`.

## 5. C. Identidad y contexto del paciente

| # | Pantalla | Ruta actual | Estado | Acción |
|---|----------|-------------|--------|--------|
| 1 | Búsqueda de paciente | `/espacio/buscar-paciente` | **COMPLETE** | — |
| 2 | Resultados de búsqueda | Grid en misma página | **COMPLETE** | — |
| 3 | Selección segura (similares) | Lista simple | **PARTIAL** | Confirmación explícita |
| 4 | Creación de paciente | — | **MISSING** | Ola 3 |
| 5 | Verificación de identidad | — | **MISSING** | Ola 3 |
| 6 | Resumen longitudinal | `/espacio/resumen` | **PARTIAL** | Campos demo estáticos |
| 7 | Línea de tiempo | `PatientLongitudinalPanel` | **COMPLETE** | IDC 23 Done; E2E DEMO-001 |
| 8 | Encuentros previos | API longitudinal | **PARTIAL** | En timeline, sin pantalla dedicada |
| 9 | Problemas activos | `/espacio/problema` + contexto ficha | **PARTIAL** | IDC 29 Done |
| 10 | Diagnósticos históricos | — | **MISSING** | Ola 3 |
| — | Antecedentes quirúrgicos | `/espacio/problema` + sección ficha | **PARTIAL** | IDC 30 Done; prefijo `[Ant.Qx]` |
| 11 | Alergias | `/espacio/alergia` + CDS ficha | **PARTIAL** | IDC 27–28 Done |
| 12 | Medicamentos activos | Ficha longitudinal | **COMPLETE** | IDC 24 Done |
| 13 | Observaciones / signos | `LabObservationsGrid` ficha | **COMPLETE** | IDC 25 Done |
| 14 | Laboratorios recientes | CTA bandeja resultados | **PARTIAL** | Enlazado desde ficha |
| 15 | Imagenología reciente | — | **MISSING** | Ola 3 |
| 16 | Documentos | Árbol + búsqueda RAG | **PARTIAL** | Sin UI ingest |
| 17 | Equipo tratante | — | **MISSING** | Ola 3 |
| 18 | Alertas y banderas | `ClinicalAlertsPanel` en ficha | **COMPLETE** | IDC 22 Done |
| 19 | Consentimientos | — | **MISSING** | Ola 6 |
| 20 | Contactos y responsables | — | **MISSING** | Ola 3 |
| — | Curvas signos vitales | `PatientClinicalCharts` | **COMPLETE** | IDC 26 Done; DEMO-005 |

**Hub paciente:** `/espacio/ficha` → `PatientWorkspacePage` — **COMPLETE** (IDC 21 Done; E2E hub M3).

---

## 6. D. Atención ambulatoria y consulta clínica

| # | Pantalla | Blueprint / ruta | Estado | Acción |
|---|----------|------------------|--------|--------|
| 1 | Consulta ambulatoria M3 | `outpatient_visit` `/espacio/ambulatorio` | **COMPLETE** | Scrollspy Ola 2 (IDC 31–36); examen físico + CIE-10 IDC 33–35 Done MF-OLA2-003 |
| 2–16 | Flujo consulta extendido | Secciones scrollspy | **PARTIAL** | Sub-secciones según matriz (33–35 Done) |
| — | Certificado médico | `medical_certificate` `/espacio/certificado` | **COMPLETE** | Ola 2 |
| — | Vista impresión A5 | `/espacio/certificado/imprimir` | **COMPLETE** | MF-OLA6A-002; IDC 40 Done |
| — | Evolución SOAP | `evolution_note` `/espacio/evolucion` | **COMPLETE** | Golden V0 |
| — | Receta | `prescription` `/espacio/receta` | **COMPLETE** | — |
| — | Laboratorio (orden) | `lab_request` `/espacio/laboratorio` | **PARTIAL** | Solo orden |
| — | Imagenología (orden) | `imaging_request` `/espacio/imagenologia` | **PARTIAL** | Solo orden |
| — | Interconsulta | `referral` `/espacio/interconsulta` | **COMPLETE** | — |

---

## 7. E. Documentación clínica médica

| # | Pantalla | Ruta | Estado | Acción |
|---|----------|------|--------|--------|
| 1 | Resumen clínico | `/espacio/resumen` | **PARTIAL** | — |
| 2 | Evolución médica | `/espacio/evolucion` | **COMPLETE** | — |
| 3 | Ingreso hospitalario | `/espacio/ingreso` | **COMPLETE** | MF-TRAMO-C-003; blueprint `admission_note` |
| 4 | Nota procedimiento | — | **MISSING** | Ola 2 |
| 5 | Nota interconsulta | `/espacio/interconsulta` | **PARTIAL** | Orden, no nota |
| 6 | Nota traslado | `/espacio/traslado` | **COMPLETE** | MF-TRAMO-C-003; blueprint `transfer_note` |
| 7 | Epicrisis | `/espacio/epicrisis` | **COMPLETE** | — |
| 8 | Certificado médico | `/espacio/certificado` | **COMPLETE** | Ola 2 |
| 9 | Impresión certificado A5 | `/espacio/certificado/imprimir` | **COMPLETE** | E2E MF-OLA6A-002; IDC 40 Done |
| 10 | Alta | API discharge | **PARTIAL** | Sin formulario |
| 11 | Nota fallecimiento | — | **DEFERRED** | — |
| 12 | Revisión y aprobación | `/espacio/borrador/$draftId` | **COMPLETE** | — |
| 13 | Versiones anteriores | En `DraftReviewPage` | **PARTIAL** | — |
| 14 | Comparación versiones | — | **MISSING** | Ola 1 |

---

## 8. F. Órdenes y solicitudes

| Capacidad | Estado | Notas |
|-----------|--------|-------|
| Crear orden (lab, imagen, interconsulta) | **PARTIAL** | Blueprints draft; sin bandeja órdenes |
| Revisar órdenes activas | **PARTIAL** | Tablero servicio + CTA ficha MF-TRAMO-C-004 |
| Pendientes / completadas / canceladas | **MISSING** | Ola 4 |
| Resultado crítico en orden | **PARTIAL** | Ack API inpatient |
| Revisión antes de envío | **PARTIAL** | Flujo borrador |
| Historial orden | **MISSING** | Ola 3 |

---

## 9. G. Resultados clínicos

| Pantalla | Ruta / API | Estado | Notas |
|----------|------------|--------|-------|
| Bandeja resultados | `/espacio/resultados` | **COMPLETE** | IDC 58 Done; MF-OLA1C-001 |
| Orden laboratorio | `/espacio/laboratorio` | **COMPLETE** | IDC 55 Done |
| Orden imagenología | `/espacio/imagenologia` | **COMPLETE** | IDC 56 Done |
| Acuse resultado crítico | Bandeja + API ack | **PARTIAL** | DEMO-004 E2E MF-OLA1C-002 |
| Tendencia, microbiología, adjuntos… | — | **MISSING** | Ola 4+ |

Excepción API legacy: `POST /api/inpatient/critical-results/:id/acknowledge` — **PARTIAL**.

---

## 10. H. Medicamentos y receta

| # | Pantalla | Estado | Acción |
|---|----------|--------|--------|
| 1–3 | Activos / historial / conciliación | **MISSING** / **PARTIAL** | Dashboard farmacia lista pendientes |
| 4 | Preparar receta | **COMPLETE** | `/espacio/receta` |
| 5–12 | Revisión, interacciones, MAR, etc. | **PARTIAL** | MAR + validación farmacia |

---

## 11. I. Hospitalización

| # | Pantalla | Estado | Acción |
|---|----------|--------|--------|
| 1 | Censo | **PARTIAL** | Tablero servicio |
| 2–18 | Resto catálogo | **MISSING** / **PARTIAL** | API admit/transfer/discharge; sin UI dedicada |

Comando `admit_patient_hospital` → tablero servicio (sin blueprint): **PARTIAL**.

---

## 12. J. Enfermería

| Pantalla | Ruta | Estado |
|----------|------|--------|
| Nota enfermería | `/espacio/enfermeria` | **COMPLETE** |
| MAR | `/espacio/mar` | **PARTIAL** |
| Tablero enfermería | `/epis2/dashboard?tab=nursing` | **PARTIAL** |
| Resto (balance, heridas, turno…) | — | **MISSING** |

---

## 13. K. Farmacia clínica

| Pantalla | Ruta | Estado |
|----------|------|--------|
| Validación farmacéutica | `/espacio/farmacia` | **PARTIAL** |
| Tablero farmacia | `/epis2/dashboard?tab=pharmacy` | **PARTIAL** |
| Cola, conciliación, duplicidades | — | **MISSING** |

---

## 14. L. Otras disciplinas

**DEFERRED** — sin módulos nutrición, kinesiología, etc.

---

## 15. M. Documentos, OCR y búsqueda

| Pantalla | Estado |
|----------|--------|
| UI documentos paciente | **MISSING** |
| Importar / OCR / clasificar | **PARTIAL** (API) |
| Búsqueda clínica UI | **PARTIAL** (`PatientClinicalAiPanel` RAG) |
| Impresión / exportación | **PARTIAL** | Print A5 certificado (`/espacio/certificado/imprimir`); PDF resumen API |

---

## 16. N. IA local (experiencias clínicas)

| Experiencia | Estado | Ubicación |
|-------------|--------|-----------|
| Asistencia borrador | **COMPLETE** | `GeneratedClinicalFormPage` |
| Resumen 24 h | **PARTIAL** | `PatientClinicalAiPanel` |
| RAG con fuentes | **PARTIAL** | Mismo panel |
| Interpretación NL comando | **PARTIAL** | Registry determinista + `suggest` |
| Pantallas técnicas IA | **MISSING** | Solo `/api/ai/*` |

---

## 17. O. Modo tablero (`/epis2/dashboard`)

| Vista | Tab | Estado |
|-------|-----|--------|
| Mi trabajo | `work` | **COMPLETE** |
| Tablero paciente | `patient` | **PARTIAL** |
| Tablero servicio | `service` | **PARTIAL** |
| Enfermería | `nursing` | **PARTIAL** |
| Farmacia | `pharmacy` | **PARTIAL** |
| Calidad / auditoría | `quality` | **PARTIAL** |
| Borradores dedicados | — | **MISSING** (incluido en work) |
| Críticos widget | — | **PARTIAL** (servicio/nursing) |

**Hallazgo:** `router.tsx` `validateSearch` no incluye `nursing`/`pharmacy` — deep-link puede degradar a `work`.

---

## 18. P. Administración y operación

Todas las pantallas listadas (usuarios, roles, Command Registry UI, etc.): **MISSING**.  
Excepciones: tablero calidad (lectura), `/dev/*` (gated), `GET /api/ops/status`.

---

## 19. Q. Adaptación chilena

| Ítem | Estado |
|------|--------|
| RUT sintético demo | **COMPLETE** (`clinical-domain/chile`) |
| FONASA/ISAPRE, GES, SNRE, LME, DEIS | **DEFERRED** |

---

## 20. Rutas registradas (inventario técnico)

**Fuente:** `apps/web/src/routes/router.tsx`

| Ruta | Página |
|------|--------|
| `/` | redirect → `/comando` o `/login` |
| `/login` | Login |
| `/comando` | Centro de Comando |
| `/epis2/dashboard` | Modo tablero |
| `/espacio/ficha` | Ficha paciente |
| `/espacio/borrador/$draftId` | Revisión borrador |
| `/espacio/buscar-paciente` | Búsqueda |
| `/espacio/resumen` | Resumen |
| `/espacio/evolucion` | Evolución |
| `/espacio/epicrisis` | Epicrisis |
| `/espacio/receta` | Receta |
| `/espacio/laboratorio` | Laboratorio |
| `/espacio/interconsulta` | Interconsulta |
| `/espacio/imagenologia` | Imagenología |
| `/espacio/enfermeria` | Enfermería |
| `/espacio/mar` | MAR |
| `/espacio/farmacia` | Farmacia |
| `/espacio/ingreso` | Ingreso |
| `/espacio/alergia` | Alergia |
| `/espacio/problema` | Problema clínico |
| `/espacio/conciliacion` | Conciliación |
| `/espacio/traslado` | Traslado |
| `/espacio/ambulatorio` | Ambulatorio |
| `/espacio/certificado` | Certificado médico (Ola 2) |
| `/espacio/certificado/imprimir` | Vista impresión A5 certificado (Ola 6A) |
| `/espacio/informe-interconsulta` | Informe interconsulta |
| `/espacio/resultados` | Bandeja resultados |
| `/espacio/admin` | Admin |
| `/sin-acceso` | Sin permiso (403) |
| `/sesion-expirada` | Sesión expirada |
| `/preferencias-apariencia` | Preferencias M3 |
| `/desarrollo/catalogo-visual` | Catálogo visual M3 (gated) |
| `/dev/ui-catalog` | Dev (gated) |
| `/dev/scheduler-spike` | Dev (gated) |
| `*` | NotFound |

**Total rutas productivas:** 28 + fallback + dev/gated. Admin y preferencias fuera de shell clínico estricto.

---

## 23. Inventario extendido — Ficha médica (IDC 1–200)

**Índice maestro:** [`EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`](./EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md)

| Bloque | Documento | Ítems | Cobertura |
|--------|-----------|-------|-----------|
| **1–100** | [`EPIS2_ARCHITECTURE_INVENTORY_001_100.md`](./EPIS2_ARCHITECTURE_INVENTORY_001_100.md) | Recepción, resumen, ambulatorio, órdenes, legales, IA | **~22 %** |
| **101–200** | [`EPIS2_ARCHITECTURE_INVENTORY_101_200.md`](./EPIS2_ARCHITECTURE_INVENTORY_101_200.md) | Urgencias, enfermería, APS, UCI, IAAS, pabellón… | **~6 %** |
| **Total** | — | **200** | **~14 %** |

### Resumen por módulo (IDC 1–100)

| IDC | Módulo | COMPLETE | PARTIAL | MISSING | DEFERRED |
|-----|--------|----------|---------|---------|----------|
| 1–10 | Recepción y flujo | 1 | 0 | 9 | 0 |
| 11–20 | Facturación | 0 | 0 | 0 | 10 |
| 21–30 | Resumen clínico | 0 | 6 | 4 | 0 |
| 31–40 | Consulta ambulatoria | 1 | 4 | 5 | 0 |
| 41–50 | UCI (duplica 131–140) | 0 | 0 | 0 | 10 |
| 51–60 | Prescripción y órdenes | 2 | 5 | 3 | 0 |
| 61–70 | Documentos legales | 1 | 1 | 6 | 2 |
| 71–80 | Epidemiología / IAAS | 0 | 2 | 8 | 0 |
| 81–90 | Jefatura / admin | 0 | 5 | 5 | 0 |
| 91–100 | IA y herramientas | 1 | 4 | 3 | 2 |

### Resumen por módulo (IDC 101–200)
|------------|--------|-------|-----------------|---------------|
| 101–110 | Urgencias y triage | 10 | 0 COMPLETE · 2 PARTIAL | Ola 10 |
| 111–120 | Enfermería ampliada | 10 | 0 · 3 PARTIAL | Ola 11 |
| 121–130 | Medicina general / APS | 10 | 0 · 1 PARTIAL | Ola 12 |
| 131–140 | UCI | 10 | DEFERRED | Ola 13 |
| 141–150 | IAAS avanzada | 10 | 0 · 1 PARTIAL | Ola 14 |
| 151–160 | Pabellón / anestesia | 10 | MISSING | Ola 15 |
| 161–170 | Farmacia clínica | 10 | 1 COMPLETE · 1 PARTIAL | Ola 16 |
| 171–180 | Calidad y auditoría | 10 | 0 · 2 PARTIAL | Ola 17 |
| 181–190 | Especialidades | 10 | DEFERRED | Ola 18 |
| 191–196 | IA / hardware local | 6 | 0 · 3 PARTIAL | Ola 19 |
| 197–198 | IoT | 2 | DEFERRED | — |
| 199–200 | Interoperabilidad | 2 | 0 · 2 PARTIAL | Ola 20 |

**Regla:** ningún ítem 101–200 compite con Centro de Comando como home; tableros clínicos usan Modo tablero o widgets M3.

---

## 21. Duplicidades detectadas

| Hallazgo | Severidad |
|----------|-----------|
| Ningún segundo Command/Form Registry | ✓ OK |
| Dashboard no compite con Comando | ✓ OK |
| Resumen paciente: comando + ficha + blueprint | **PARTIAL** — misma función, rutas coherentes |
| Ingreso: blueprint + API + comando | **COMPLETE** (MF-157) |

---

## 22. Cobertura estimada por dominio

| Dominio | Cobertura |
|---------|-----------|
| Acceso y sesión | 22 % |
| Centro de Comando | 58 % |
| Paciente | 28 % |
| Atención médica | 42 % |
| Documentación clínica | 38 % |
| Órdenes | 18 % |
| Resultados | 8 % |
| Medicamentos | 32 % |
| Hospitalización | 35 % |
| Enfermería | 33 % |
| Farmacia | 28 % |
| Documentos / búsqueda | 22 % |
| IA local (UI clínica) | 48 % |
| Modo tablero | 52 % |
| Administración | 5 % |
| Interoperabilidad / Chile | 30 % |

**Cobertura global catálogo IDC 1–100 (ponderada): ~28 %** — MVP demo + slices V0–V5.

**Cobertura IDC 101–200:** ~6 % — ver [`EPIS2_ARCHITECTURE_INVENTORY_101_200.md`](./EPIS2_ARCHITECTURE_INVENTORY_101_200.md).

---

## Referencias

- Router: `apps/web/src/routes/router.tsx`
- Layout clínico: `apps/web/src/layouts/ClinicalShellLayout.tsx`
- Inventario 101–200: `docs/product/EPIS2_ARCHITECTURE_INVENTORY_101_200.md`
- Canon: `docs/PRODUCT_CANON.md`
- Capability map previo: `docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md`
