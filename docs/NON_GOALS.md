# EPIS2 — No objetivos (v1 y congelamiento)

**Estado:** Vinculante para EPIS2-00 … EPIS2-11 salvo ADR explícito en `DECISIONS.md`.

---

## Plataforma y legacy rechazados

| Elemento | Estado | Motivo |
|----------|--------|--------|
| OpenMRS como UI o runtime visible | **REJECT** | Dependencia que EPIS2 abandona |
| OpenMRS O3 / microfrontends ESM | **REJECT** | Arquitectura overlay incompatible |
| Carbon Design System | **REJECT** | Identidad y deuda visual legacy |
| Soft Carbon / shells Carbon-like | **REJECT** | Experiencia intermedia ya descartada |
| Overlays `esm-epis-*` | **REJECT** | Acoplamiento SPA OpenMRS |
| Rutas y bridges OpenMRS (`epis-route-bridge`, etc.) | **REJECT** | Navegación legacy |
| Scripts build/overlay OpenMRS | **REJECT** | Operación específica de EPIS |
| Dashboards como home | **REJECT** | Contradice command-first |
| KPIs, gráficos complejos, BI clínico | **REJECT** | Fuera de MVP |
| `@epis/openmrs-adapter` y writeback OpenMRS | **REJECT** | Fuente de verdad pasa a PostgreSQL |

---

## Funcionalidad clínica fuera de v1

| Capacidad | Estado |
|-----------|--------|
| Ficha hospitalaria completa | **NO** |
| Enfermería avanzada / kardex completo | **NO** |
| Farmacia avanzada / dispensación | **NO** |
| Admisión hospitalaria completa | **NO** (salvo notas mínimas en epicrisis) |
| Imagenología / interconsulta / traslados (blueprints extra EPIS) | **NO** en v1 |
| HL7 v2 en producción | **NO** |
| Integración multi-hospital | **NO** |
| Pacientes reales o PHI de producción | **NO** |
| FHIR como modelo de UI principal | **NO** |
| Importación masiva FHIR en v1 | **NO** (solo export frontera en EPIS2-10) |

---

## IA y automatización prohibidas

| Comportamiento | Estado |
|----------------|--------|
| Aprobación automática | **PROHIBIDO** |
| Firma automática | **PROHIBIDO** |
| Escritura directa en tablas clínicas finales por IA | **PROHIBIDO** |
| Ejecución SQL por IA | **PROHIBIDO** |
| Inventar datos clínicos no presentes en contexto | **PROHIBIDO** |
| Panel permanente de estado Ollama en home | **PROHIBIDO** |

---

## Proceso y documentación

| Práctica | Estado |
|----------|--------|
| Copiar carpetas completas desde EPIS | **PROHIBIDO** |
| Migrar cientos de microfases EPIS como gobierno | **PROHIBIDO** |
| Implementar EPIS2-NN+1 en la misma sesión sin gate | **PROHIBIDO** |
| «Construir EPIS2 completo» en un solo prompt | **PROHIBIDO** |

---

## Decisiones diferidas (spike, no v1)

- Backend FHIR headless (p. ej. Medplum) vs backend propio — ver `DECISIONS.md` ADR-001.
- Row-Level Security PostgreSQL en producción — diseño en EPIS2-04+, activación según entorno.
- Autenticación para uso clínico real — requiere revisión de seguridad especializada post-demo.
