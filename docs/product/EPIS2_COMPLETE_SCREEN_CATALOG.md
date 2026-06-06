# EPIS2 — Catálogo completo de pantallas

**Versión:** 1.0 · **Fecha:** 2026-06-05  
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
| 7 | Preferencias de apariencia | `EpisThemeModeToggle` en shell | **PARTIAL** | Sin página dedicada |
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

## 5. C. Identidad y contexto del paciente

| # | Pantalla | Ruta actual | Estado | Acción |
|---|----------|-------------|--------|--------|
| 1 | Búsqueda de paciente | `/espacio/buscar-paciente` | **COMPLETE** | — |
| 2 | Resultados de búsqueda | Grid en misma página | **COMPLETE** | — |
| 3 | Selección segura (similares) | Lista simple | **PARTIAL** | Confirmación explícita |
| 4 | Creación de paciente | — | **MISSING** | Ola 3 |
| 5 | Verificación de identidad | — | **MISSING** | Ola 3 |
| 6 | Resumen longitudinal | `/espacio/resumen` | **PARTIAL** | Campos demo estáticos |
| 7 | Línea de tiempo | Panel en `PatientWorkspacePage` | **PARTIAL** | No ruta dedicada |
| 8 | Encuentros previos | API longitudinal | **PARTIAL** | Sin pantalla |
| 9 | Problemas activos | Contexto + resumen | **PARTIAL** | Sin CRUD |
| 10 | Diagnósticos históricos | — | **MISSING** | Ola 3 |
| 11 | Alergias | Tabla demo + CDS | **PARTIAL** | Sin formulario |
| 12 | Medicamentos activos | Contexto demo | **PARTIAL** | Sin pantalla dedicada |
| 13 | Observaciones / signos | Blueprint enfermería | **PARTIAL** | — |
| 14 | Laboratorios recientes | — | **MISSING** | Ola 3 |
| 15 | Imagenología reciente | — | **MISSING** | Ola 3 |
| 16 | Documentos | API search/intake | **PARTIAL** | Sin UI documentos |
| 17 | Equipo tratante | — | **MISSING** | Ola 3 |
| 18 | Alertas y banderas | `ClinicalAlertsPanel` | **PARTIAL** | — |
| 19 | Consentimientos | — | **MISSING** | Ola 6 |
| 20 | Contactos y responsables | — | **MISSING** | Ola 3 |

**Hub paciente:** `/espacio/ficha` → `PatientWorkspacePage` — **PARTIAL** (ficha mínima, no auto-abre todo el expediente ✓).

---

## 6. D. Atención ambulatoria y consulta clínica

| # | Pantalla | Blueprint / ruta | Estado | Acción |
|---|----------|------------------|--------|--------|
| 1 | Nueva consulta | — | **MISSING** | Ola 2 |
| 2–16 | Flujo consulta completo | — | **MISSING** | Ola 2 |
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
| 3 | Ingreso hospitalario | API only | **MISSING** | Blueprint Ola 2 |
| 4 | Nota procedimiento | — | **MISSING** | Ola 2 |
| 5 | Nota interconsulta | `/espacio/interconsulta` | **PARTIAL** | Orden, no nota |
| 6 | Nota traslado | API inpatient | **MISSING** | Ola 4 |
| 7 | Epicrisis | `/espacio/epicrisis` | **COMPLETE** | — |
| 8 | Alta | API discharge | **PARTIAL** | Sin formulario |
| 9 | Nota fallecimiento | — | **DEFERRED** | — |
| 10 | Revisión y aprobación | `/espacio/borrador/$draftId` | **COMPLETE** | — |
| 11 | Versiones anteriores | En `DraftReviewPage` | **PARTIAL** | — |
| 12 | Comparación versiones | — | **MISSING** | Ola 1 |

---

## 8. F. Órdenes y solicitudes

| Capacidad | Estado | Notas |
|-----------|--------|-------|
| Crear orden (lab, imagen, interconsulta) | **PARTIAL** | Blueprints draft; sin bandeja órdenes |
| Revisar órdenes activas | **MISSING** | `clinical_orders` demo en API |
| Pendientes / completadas / canceladas | **MISSING** | Ola 4 |
| Resultado crítico en orden | **PARTIAL** | Ack API inpatient |
| Revisión antes de envío | **PARTIAL** | Flujo borrador |
| Historial orden | **MISSING** | Ola 3 |

---

## 9. G. Resultados clínicos

Todas las pantallas del catálogo (bandeja, tendencia, crítico, microbiología, etc.): **MISSING** en web.  
Excepción API: `POST /api/inpatient/critical-results/:id/acknowledge` — **PARTIAL**.

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
| Impresión / exportación | **PARTIAL** (PDF resumen API) |

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
| `/dev/ui-catalog` | Dev (gated) |
| `/dev/scheduler-spike` | Dev (gated) |
| `*` | NotFound |

**Total rutas productivas:** 18 + fallback. **No hay** `/administracion`, `/auditoria` como SPA.

---

## 21. Duplicidades detectadas

| Hallazgo | Severidad |
|----------|-----------|
| Ningún segundo Command/Form Registry | ✓ OK |
| Dashboard no compite con Comando | ✓ OK |
| Resumen paciente: comando + ficha + blueprint | **PARTIAL** — misma función, rutas coherentes |
| Ingreso: comando dashboard + API sin formulario | **PARTIAL** — cadena incompleta |

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

**Cobertura global catálogo (ponderada): ~28 %** — coherente con MVP demo + slices V0–V5, no EHR completo.

---

## Referencias

- Router: `apps/web/src/routes/router.tsx`
- Layout clínico: `apps/web/src/layouts/ClinicalShellLayout.tsx`
- Canon: `docs/PRODUCT_CANON.md`
- Capability map previo: `docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md`
