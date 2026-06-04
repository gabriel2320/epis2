# Informe — Plan maestro EMR EPIS2

**Fecha:** 2026-06-04  
**Alcance:** Producto y arquitectura funcional (sin implementación clínica productiva nueva)  
**Frase guía:** *EPIS2 incorpora la experiencia acumulada, pero conserva una arquitectura limpia y una sola verdad.*

---

## 1. Resumen ejecutivo

EPIS2 puede evolucionar hacia una ficha clínica moderna y completa **sin alterar** su arquitectura canónica (React/MUI, Fastify, PostgreSQL, Ollama desacoplado, Centro de Comando como home). El repositorio ya completó las fases técnicas **EPIS2-00 … EPIS2-11**, que cubren el núcleo de **V0** salvo **Modo tablero** (EPIS2-12).

Este informe consolida:

- mapa de capacidades;
- roadmap V0–V5;
- diseño Modo tablero;
- dominios y fuentes de verdad únicas;
- plan Ollama;
- matriz de reutilización EPIS / EPIDOS / EPIONE;
- journeys dorados ampliados;
- actualización del manifiesto legacy.

---

## 2. Documentos creados

| # | Documento |
|---|-----------|
| 1 | [docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md](../docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md) |
| 2 | [docs/product/EPIS2_RELEASE_ROADMAP.md](../docs/product/EPIS2_RELEASE_ROADMAP.md) |
| 3 | [docs/product/EPIS2_DASHBOARD_MODE.md](../docs/product/EPIS2_DASHBOARD_MODE.md) |
| 4 | [docs/architecture/EPIS2_DOMAIN_ARCHITECTURE.md](../docs/architecture/EPIS2_DOMAIN_ARCHITECTURE.md) |
| 5 | [docs/architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md](../docs/architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md) |
| 6 | [docs/intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md](../docs/intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md) |
| 7 | [docs/legacy/EPIS_EPIDOS_EPIONE_CAPABILITY_REUSE_MATRIX.md](../docs/legacy/EPIS_EPIDOS_EPIONE_CAPABILITY_REUSE_MATRIX.md) |
| 8 | [docs/quality/EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md) |
| 9 | [legacy-import-manifest.json](../legacy-import-manifest.json) (candidatos ampliados) |
| 10 | Este informe |

---

## 3. Funcionalidades por versión (síntesis)

| Versión | Foco | Gate |
|---------|------|------|
| **V0** | Comando, 5 formularios, borrador, IA opcional, alertas demo, FHIR mínimo | Journey dorado + **Modo tablero Mi trabajo** |
| **V1** | Longitudinal, documentos, OCR, RAG, timeline, tablero paciente | Revisión ambulatoria demo completa |
| **V2** | Hospitalización, órdenes, críticos, tablero servicio | Alta sintética con acuse |
| **V3** | Enfermería, farmacia, MAR | Multidisciplinario demo |
| **V4** | Interop, HL7, staging, operación | Piloto read-only |
| **V5** | IA avanzada trazable | Ollama off = producto OK |

---

## 4. Estado actual vs V0

| Capacidad V0 | Estado |
|--------------|--------|
| Login, RBAC, auditoría | ✓ |
| Centro de Comando | ✓ |
| Command registry + sinónimos + rank | ✓ |
| Pacientes DEMO-001…005 | ✓ |
| Resumen, evolución, epicrisis, receta, lab | ✓ |
| Borradores y aprobación | ✓ |
| Ollama assist | ✓ |
| Alertas CDS/CDR UI | ✓ |
| FHIR export frontera | ✓ |
| Journey dorado API/tests | ✓ |
| **Modo tablero** | ○ EPIS2-12 |

---

## 5. Candidatos legacy por prioridad

### P0 — Integrados

- Sinónimos EPIS, CDS EPIS, CDR EPIONE, MAU rank, AI gateway EPIDOS, prompts EPIS, RUT EPIDOS, FHIR golden EPIDOS.

### P1 — Siguiente ola

| ID | Acción |
|----|--------|
| `epione-worklist-dashboard-mode` | REWRITE → EPIS2-12 Modo tablero |
| `epis-demo-patients` | REWRITE → ampliar test-fixtures |
| `epidos-command-pipeline` | REJECT (mantener registry único) |

### P2 — V1

| ID | Acción |
|----|--------|
| `epis-document-intake-ocr` | REWRITE pipelines documentos |
| `epidos-document-import-pipeline` | Unificar con intake |
| `epidos-rag-pgvector` | REWRITE búsqueda semántica |
| `epis-blueprints-p3-p7` | REFERENCE → nuevos blueprints |

### V2+

| ID | Acción |
|----|--------|
| `epione-clinical-actions-executor` | REWRITE `packages/clinical-actions` |

---

## 6. Elementos rechazados (no negociable)

- OpenMRS, O3, Carbon, overlays, writeback OpenMRS.
- Dashboard / `EpioneMasterDashboard` como home.
- localStorage clínico EPIONE.
- UI completa EPIDOS (shadcn) o EPIONE (Radix).
- Regex command interpreter EPIDOS.
- RAG sidecar EPIS como núcleo V0.
- Catálogo 117 acciones EPIONE sin criba.
- IA con escritura directa a PostgreSQL.

---

## 7. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Deriva «hospital completo» antes de V0 gate | Priorizar EPIS2-12; no V1 masivo |
| Segundo registry comandos/formularios | Validadores architecture + SoT doc |
| Dashboard como home por conveniencia UX | `command-center-home` + canon |
| Copiar carpetas EPIONE/EPIS | Manifiesto + cuarentena obligatoria |
| RAG sin fuentes | Contrato citations V1 |
| Confundir alertas advisory con bloqueo | CDR/CDS no bloquean approve |

---

## 8. Gates permanentes

Ver [docs/quality/ANTI_DRIFT_GATES.md](../docs/quality/ANTI_DRIFT_GATES.md) y [docs/quality/EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md).

Fallo automático si aparece: OpenMRS/Carbon, dashboard home, segundo registry, permisos wildcard, IA write, dato final sin aprobación, blueprint sin ruta, legacy sin manifiesto.

---

## 9. Una sola fuente de verdad (recordatorio)

| Dominio | Paquete / sistema |
|---------|-------------------|
| Comandos | `packages/command-registry` |
| Formularios | `packages/clinical-forms` |
| Permisos | `packages/clinical-domain` |
| Acciones *(futuro)* | `packages/clinical-actions` |
| Contratos | `packages/contracts` |
| Clínica aprobada | PostgreSQL |
| IA | `services/local-ai` |

Detalle: [EPIS2_SINGLE_SOURCE_OF_TRUTH.md](../docs/architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md).

---

## 10. Modo tablero

- Ruta: `/epis2/dashboard`
- Nombre UI: **Modo tablero**
- Acceso: comando, alias, chip desde Centro de Comando
- V0: solo «Mi trabajo»
- Nunca home; siempre «Volver al Centro de Comando»

Detalle: [EPIS2_DASHBOARD_MODE.md](../docs/product/EPIS2_DASHBOARD_MODE.md).

---

## 11. IA Ollama

- Transversal; subordinada al flujo borrador → humano.
- Límites explícitos en [EPIS2_OLLAMA_CAPABILITY_PLAN.md](../docs/intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md).

---

## 12. Criterios de aceptación de esta tarea

| # | Criterio | Estado |
|---|----------|--------|
| 1 | Mapa completo de capacidades | ✓ |
| 2 | Roadmap por versiones | ✓ |
| 3 | Matriz reutilización tres donantes | ✓ |
| 4 | Legacy no cambia arquitectura | ✓ |
| 5 | SoT por dominio documentada | ✓ |
| 6 | Modo tablero opcional diseñado | ✓ |
| 7 | Límites Ollama explícitos | ✓ |
| 8 | Journeys dorados | ✓ |
| 9 | Gates anti-deriva referenciados | ✓ |
| 10 | Todo en español | ✓ |
| 11 | Sin funciones clínicas productivas nuevas | ✓ |
| 12 | Sin copiar carpetas completas | ✓ |
| 13 | Sin OpenMRS/O3/Carbon | ✓ |
| 14 | No se avanzó fase de implementación | ✓ |

---

## 13. Siguiente fase recomendada

**EPIS2-12 — Modo tablero básico («Mi trabajo»)**

Entregables esperados:

- Ruta `/epis2/dashboard` + intents `open_dashboard*`
- Widgets borradores / pacientes recientes
- Extensión journey dorado pasos 11–13
- Contratos `packages/contracts` para agregados tablero
- Tests + reporte `reports/epis2-12-dashboard-mode.md`
- Commit explícito (no automático)

**No iniciar** V1 longitudinal masivo hasta cerrar gate V0.

---

## 14. Referencia rápida comandos

```bash
npm run check
npm run test
npm run architecture:validate
npm run legacy:audit
```

---

*Fin del informe — plan maestro EMR EPIS2.*
