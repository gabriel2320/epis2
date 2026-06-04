# EPIS2 — Roadmap por versiones de producto

**Versión:** 1.0 · **Prioridad activa:** V0 (cerrar gates) → V1  
**Regla:** Cursor **no** avanza de fase sin cierre explícito (capacidad + contratos + API + permisos + auditoría + tests + reporte + commit).

---

## Resumen ejecutivo

| Versión | Objetivo | Gate principal |
|---------|----------|----------------|
| **V0** | Prueba del producto command-first | Journey dorado + Modo tablero «Mi trabajo» |
| **V1** | Ficha clínica longitudinal moderna | Uso ambulatorio demo completo |
| **V2** | Hospitalización operativa | Flujo hospitalario sintético |
| **V3** | Enfermería y farmacia | Flujo multidisciplinario |
| **V4** | Interoperabilidad y operación | Piloto interno read-only |
| **V5** | IA clínica avanzada segura | IA trazable y desconectable |

**Estado repo (2026-06):** EPIS2-00 … EPIS2-11 completadas ≈ **núcleo V0 casi cerrado**; falta **Modo tablero** (EPIS2-12) para gate V0 formal.

---

## V0 — Prueba del producto

### Alcance

- Login, Centro de Comando, búsqueda y paciente sintético.
- Command Registry, resolución de intents, permisos.
- Páginas: Resumen, Evolución, Epicrisis, Receta, Laboratorio.
- Borradores, aprobación humana, auditoría.
- Ollama: asistencia a borradores (opcional).
- Alertas CDS/CDR en modo informativo.
- Export FHIR mínimo (frontera).
- **Modo tablero básico:** vista «Mi trabajo» (no home).

### Dependencias

- PostgreSQL, auth, contratos compartidos.
- Integraciones legacy ya adaptadas (sinónimos, CDS, CDR advisory, prompts, FHIR golden).

### Candidatos legacy (prioridad)

| Prioridad | Candidato | Clasificación |
|-----------|-----------|---------------|
| P0 | Sinónimos EPIS, MAU EPIONE, CDS/ CDR | ADAPTED |
| P0 | AI Gateway EPIDOS, prompts EPIS | ADAPTED |
| P1 | Modo tablero (concepto EPIONE worklist) | REWRITE_FROM_CONCEPT |
| P2 | `epis-demo-patients` ampliación | REWRITE_FROM_CONCEPT |

### Riesgos

- Confundir MVP implementado (EPIS2-11) con V1 completo.
- Introducir dashboard como home.
- Segundo registry de comandos o formularios.

### Gate V0

```text
Journey dorado (login → comando → evolución → borrador → aprobación → auditoría)
+ abrir Modo tablero → ver tarea completada → volver al Centro de Comando
+ npm run check + architecture:validate
```

### Criterios de aceptación

1. Journey dorado API y checklist humano en verde.
2. Home sigue siendo Centro de Comando.
3. IA apagada no bloquea el flujo.
4. Modo tablero accesible solo bajo demanda.
5. Sin OpenMRS / Carbon / writeback.

### Fase de implementación

| Fase | Entregable |
|------|------------|
| EPIS2-12 | Modo tablero «Mi trabajo» + intents alias |

---

## V1 — Ficha clínica longitudinal moderna

### Alcance

- Problemas, alergias, medicamentos, observaciones estructurados.
- Documentos, timeline, encuentros.
- Interconsultas, imagenología, traslados.
- Impresión / PDF.
- Búsqueda semántica (RAG bajo contratos EPIS2 + pgvector).
- Tablero del paciente.
- FHIR export ampliado.

### Dependencias

- V0 cerrado.
- Modelo clínico extendido (migraciones Drizzle).
- EPIS2-11 documentos / OCR / RAG (planificado en tabla de fases).

### Candidatos legacy

| Candidato | Origen | Clasificación |
|-----------|--------|---------------|
| Document intake + OCR | EPIS / EPIDOS | REWRITE_FROM_CONCEPT |
| RAG | EPIS / EPIDOS | REWRITE_FROM_CONCEPT (no sidecar SoT) |
| Blueprints P3–P7 | EPIS | REFERENCE_ONLY → nuevos blueprints EPIS2 |
| Informes / PDF | EPIDOS | REWRITE_FROM_CONCEPT |

### Riesgos

- Duplicar registros clínicos (localStorage EPIONE, OpenMRS).
- RAG sin trazabilidad de fuentes.

### Gate V1

Revisión longitudinal demo: problema → encuentro → nota → documento → export FHIR, todo con aprobación humana.

### Fase de implementación

EPIS2-11 (docs/OCR/RAG), extensiones post-12 en modelo + blueprints.

---

## V2 — Hospitalización operativa

### Alcance

- Censo, camas, ingreso, traslados.
- Evolución diaria, órdenes, resultados, críticos con acuse.
- Pendientes, preparación de alta, epicrisis operativa.
- Tablero del servicio.
- Worklist clínico (modo tablero).

### Candidatos legacy

| Candidato | Origen |
|-----------|--------|
| Clinical Action Engine | EPIONE → `packages/clinical-actions` |
| Catálogo acciones (subconjunto) | EPIONE REWRITE |
| Reglas de alta | EPIONE CDR (ampliar) |

### Gate V2

Flujo sintético: ingreso → órdenes → crítico → acuse → epicrisis → alta, con auditoría.

### Fase

EPIS2-13 Hospitalización.

---

## V3 — Enfermería y farmacia

### Alcance

- Notas de enfermería, signos, balance, cuidados, MAR.
- Conciliación, validación farmacéutica, intervenciones.
- Tableros por rol (enfermería / farmacia).

### Gate V3

Administración medicamento demo con doble chequeo y borrador, sin auto-aprobación.

### Fase

EPIS2-14.

---

## V4 — Interoperabilidad y operación

### Alcance

- FHIR import/export completo, HL7 v2 (frontera).
- Staging importaciones, catálogos clínicos.
- Administración, reportes, backups, observabilidad.
- Auditoría avanzada.

### Gate V4

Piloto interno **read-only** contra datos sintéticos + export validado.

### Fase

EPIS2-15, EPIS2-16 hardening.

---

## V5 — IA clínica avanzada segura

### Alcance

- Resúmenes longitudinal, tendencias de laboratorio.
- Copiloto documental, extracción estructurada, codificación sugerida.
- Worklist asistido, completitud documental.
- Biblioteca de prompts versionados, evals sintéticas.

### Límites (no negociables)

- Sin SQL, sin escritura PostgreSQL, sin aprobación automática.
- Salida siempre → borrador → humano.

### Gate V5

IA desconectada = producto usable; con IA = trazabilidad `ai_runs` + fuentes citadas.

---

## Tabla de fases de implementación (Cursor)

| Fase | Entregable | Versión |
|------|------------|---------|
| EPIS2-00 | Canon, scope, postmortem, gates | — |
| EPIS2-01 | Monorepo y CI | — |
| EPIS2-02 | PostgreSQL modelo base | V0 prep |
| EPIS2-03 | Login, RBAC, auditoría | V0 |
| EPIS2-04 | Centro de Comando | V0 |
| EPIS2-05 | Registry, router, slots | V0 |
| EPIS2-06 | Pacientes y encuentros *(parcial)* | V0 |
| EPIS2-07 | Borradores, versiones, aprobación | V0 |
| EPIS2-08 | Resumen y evolución | V0 |
| EPIS2-09 | Epicrisis, receta, laboratorio | V0 |
| EPIS2-10 | Servicio Ollama | V0 |
| EPIS2-11 | Documentos, OCR y RAG *(plan)* | V1 prep |
| **EPIS2-12** | **Modo tablero básico** | **V0 gate** |
| EPIS2-13 | Hospitalización | V2 |
| EPIS2-14 | Enfermería y farmacia | V3 |
| EPIS2-15 | FHIR e interoperabilidad | V4 |
| EPIS2-16 | Hardening y piloto demo | V4 |

---

## Siguiente fase recomendada

**EPIS2-12 — Modo tablero básico («Mi trabajo»)**

Motivo: es el único hueco explícito del gate V0 respecto al código ya entregado en EPIS2-00…11.

No iniciar V1 longitudinal masivo hasta:

1. Journey dorado estable con y sin Ollama.
2. Modo tablero navegable y reversible.
3. `npm run check` verde.

---

## Referencias

- [EPIS2_COMPLETE_CAPABILITY_MAP.md](./EPIS2_COMPLETE_CAPABILITY_MAP.md)
- [EPIS2_DASHBOARD_MODE.md](./EPIS2_DASHBOARD_MODE.md)
- [../ROADMAP.md](../ROADMAP.md) — fases técnicas EPIS2-NN
- [../../reports/epis2-complete-emr-product-plan.md](../../reports/epis2-complete-emr-product-plan.md)
