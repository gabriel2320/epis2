# EPIS2 — Reglas de productividad y divulgación progresiva

**Versión:** 1.0 · **Fecha:** 2026-06-05  
**Principio:** Una pantalla, una tarea. Información no solicitada permanece oculta.

---

## 1. Reglas no negociables (canon)

| # | Regla | Fuente |
|---|-------|--------|
| 1 | Home = Centro de Comando, nunca tablero | `PRODUCT_CANON.md` |
| 2 | Máximo una acción primaria por pantalla | Invariante UX |
| 3 | IA asiste; no aprueba ni firma | `PRODUCT_INVARIANTS.md` |
| 4 | Borrador ≠ dato aprobado | Pipeline drafts |
| 5 | Paneles contextuales solo bajo demanda | Este documento |
| 6 | UI clínica 100 % español | `copy/es.ts` |
| 7 | Sin RAG/embeddings/chunks en microcopy clínico | Catálogo producto |

---

## 2. Anatomía obligatoria (auditoría por pantalla)

### 2.1 Centro de Comando (`CommandCenterPage`)

| Criterio | Evaluación | Notas |
|----------|------------|-------|
| Una acción primaria | ✓ | Enviar comando |
| Contexto mínimo | ✓ | Paciente colapsable en panel |
| Información progresiva | ✓ | Widgets/alertas bajo demanda |
| Retorno N/A (es home) | ✓ | — |
| IA no domina | ✓ | Hint en barra; no panel fijo |
| Estados carga/error/permiso | ✓ | `isResolving`, `forbidden` |
| Offline | ◐ | Error API genérico |
| Responsive | ✓ | M3 layout |
| Accesibilidad | ◐ | Chips multilínea revisados post-M3 |

**Problemas:** historial comandos ausente; WIDGET-01 no montado (riesgo sobrecarga futura si se montan todos a la vez).

### 2.2 Espacio clínico (`GeneratedClinicalFormPage`)

| Criterio | Evaluación | Notas |
|----------|------------|-------|
| Una actividad | ✓ | Un blueprint por ruta |
| Acción primaria | ✓ | Guardar borrador |
| Acciones secundarias discretas | ✓ | IA outlined, cancelar |
| Contexto mínimo | ✓ | Sin dashboard embebido |
| Historial bajo demanda | ✓ | **LAYOUT-01** — two-pane Enfoque/Contexto (placeholder contexto) |
| Paneles colapsados | ◐ | `EpisAiDisclosure` visible si draft |
| Retorno comando | ✓ | `ClinicalPageNav` |
| Paciente actual | ✓ | `ActivePatientBanner` |
| IA contextual | ✓ | Botón «Sugerir con IA» |
| IA no domina | ✓ | Formulario siempre visible |
| Permiso | ✓ | `forbidden` alert |
| Offline | ◐ | Test mock offline |

**Problema microcopy:** `copy.ai.statusOn` dice «Ollama disponible» — **viola** regla de no exponer Ollama en UI clínica.

### 2.3 Ficha paciente (`PatientWorkspacePage`)

| Criterio | Evaluación | Notas |
|----------|------------|-------|
| No abre expediente completo | ✓ | Resumen + links |
| Una acción primaria | ◐ | Múltiples chips navegación |
| Panel IA | ◐ | `PatientClinicalAiPanel` expandido |
| Timeline | ◐ | Sección visible (no invocable) |

**Riesgo:** panel IA + timeline + alertas pueden competir — mantener colapsado por defecto en Ola 1.

### 2.4 Revisión borrador (`DraftReviewPage`)

| Criterio | Evaluación |
|----------|------------|
| Una acción primaria (aprobar) | ✓ |
| Estado borrador visible | ✓ |
| Sin edición masiva | ✓ |

### 2.5 Modo tablero (`DashboardModeContent`)

| Criterio | Evaluación | Notas |
|----------|------------|-------|
| No es home | ✓ | — |
| Volver a comando | ✓ | Nav explícita |
| Widget → actividad | ✓ | Links a espacio |
| Sin aprobación masiva | ✓ | — |
| Carga por rol | ◐ | Tabs nursing/pharmacy por rol |
| No infraestructura | ✓ | — |
| Parece dashboard | ◐ | Aceptable como modo secundario |

**Problema:** 6 tabs — riesgo cognitivo moderado; mitigado al no ser home.

### 2.6 Login (`LoginPage`)

| Criterio | Evaluación |
|----------|------------|
| Una acción primaria | ✓ |
| Sin información clínica | ✓ |

---

## 3. Paneles que deben abrirse solo bajo demanda

| Panel | Estado actual | Acción requerida |
|-------|---------------|------------------|
| Asistencia IA | Botón en formulario; panel en ficha | Colapsar panel ficha por defecto |
| Fuentes (RAG) | En panel IA ficha | ✓ bajo demanda |
| Historia relevante | Timeline en ficha | Colapsar o invocable |
| Datos faltantes | Mensaje comando | ✓ |
| Auditoría | Tablero calidad / API | ✓ restringido |
| Medicamentos completos | No mostrado | ✓ |
| Resultados completos | No mostrado | ✓ |
| Detalles técnicos | Solo `/dev/*` | ✓ |

---

## 4. Anti-patrones detectados

| Anti-patrón | ¿Presente? | Ubicación |
|-------------|------------|-----------|
| Múltiples acciones primarias | No crítico | Ficha: varios chips (secundarios) |
| Dashboard como home | No | — |
| IA reemplaza formulario | No | — |
| Segundo registry | No | — |
| OpenMRS / Carbon | No | — |
| «Ollama» en UI clínica | **Sí** | `packages/design-system/src/copy/es.ts` |
| «RAG» en UI clínica | No | Usa «fuentes» / «citas» |
| Expediente completo al seleccionar paciente | No | Regresa contexto mínimo |

---

## 5. Checklist para nuevas pantallas

Antes de mergear cualquier pantalla nueva:

- [ ] ¿Una sola actividad clínica?
- [ ] ¿Una acción primaria visible?
- [ ] ¿Contexto mínimo por defecto?
- [ ] ¿Paneles IA/fuentes/auditoría invocables?
- [ ] ¿Volver al Centro de Comando?
- [ ] ¿Paciente actual visible o explícitamente no requerido?
- [ ] ¿Estados: carga, vacío, error, prohibido, offline?
- [ ] ¿Blueprint + permiso + auditoría en cadena?
- [ ] ¿Sin microcopy técnico (Ollama, pgvector, embeddings)?
- [ ] ¿Prueba en journey dorado relevante?

---

## 6. Divulgación progresiva — matriz por dominio

| Dominio | Mostrar por defecto | Mantener colapsado |
|---------|---------------------|-------------------|
| Evolución | Formulario SOAP, estado borrador | Fuentes, historial completo |
| Receta | Campos receta, alertas CDS | Historial farmacológico |
| Resumen | Campos resumen blueprint | Labs/imágenes completos |
| Comando | Barra, sugerencias | Historial, ayuda extendida |
| Ficha | Identidad, accesos rápidos | Timeline, IA, documentos |
| Tablero | Tab activo según rol | Otros tabs |

---

## 7. Acciones primarias canónicas por tipo

| Tipo pantalla | Acción primaria |
|---------------|-----------------|
| Formulario draft | Guardar borrador |
| Revisión | Aprobar documento |
| Búsqueda paciente | Seleccionar paciente |
| Comando | Ejecutar instrucción |
| Orden | Preparar solicitud |
| Resultado crítico | Acusar recepción |
| Solo lectura | Volver / siguiente acción |

---

## Referencias

- Layout: `apps/web/src/layouts/ClinicalShellLayout.tsx`
- Copy: `packages/design-system/src/copy/es.ts`
- Widgets visibility: `packages/epis2-widgets` (WIDGET-00)
- Invariantes: `docs/product/PRODUCT_INVARIANTS.md`
