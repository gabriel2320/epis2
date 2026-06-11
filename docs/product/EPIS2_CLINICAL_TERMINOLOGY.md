# EPIS2 — Terminología clínica unificada

**Versión:** 1.0 · **Programa:** PROG-AUTO-DEV-6H · **Alcance:** UI visible + barra de comandos

> Una sola palabra por concepto en copy y diccionario de comandos. Evitar mezclar «ficha», «chart», «expediente» en la misma superficie.

---

## Superficie paciente

| Término canónico | Usar | No usar |
|------------------|------|---------|
| **Ficha clínica** | Pantalla principal del paciente | Chart, expediente, registro |
| **Ficha electrónica** | `chartMode=traditional` | EMR, modo clásico, dashboard |
| **Ficha papel** | `chartMode=paper` | PDF mode, documento Word |
| **Borrador** | Contenido no firmado | Draft (visible), temporal |
| **Firmar / validar** | Acción humana auditada | Aprobar automático, publicar |

---

## Navegación

| Término canónico | Ruta / uso |
|------------------|------------|
| **Censo / buscar paciente** | `/espacio/buscar-paciente`, launcher delgado |
| **Barra clínica** | Comando + acciones en `ClinicalActionBar` |
| **Centro de Comando** | `/comando` — launcher census-first (no home dashboard) |

---

## Acciones clínicas (barra)

| Acción UI | Intent registry | Sinónimos comando (muestra) |
|-----------|-----------------|------------------------------|
| Evolución | `create_evolution_draft` | evolucionar, nota evolución, evolución diaria |
| Indicación | `request_procedure` / órdenes | indicar, orden médica, prescripción hospitalaria |
| Laboratorio | `request_laboratory` | lab, analítica, hemograma, estudios |
| Receta | `prepare_prescription` | receta, prescripción ambulatoria, medicamento |
| Diagnóstico / problema | `register_problem` | diagnóstico, problema activo, CIE-10, comorbilidad |
| Alergia | `register_allergy` | alergia, reacción adversa, hipersensibilidad |

---

## Modos legacy (congelados)

| Término | Estado |
|---------|--------|
| Modo Command Center (hero) | Deprecado → launcher delgado |
| Modo Clásico MD3 | Deprecado → `chartMode=traditional` |
| Modo Dashboard home | Deprecado → panel contextual |

---

## Referencias

- `packages/command-registry/src/clinical-command-dictionary.ts`
- `docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md`
- `copy.chartModes.*` en `packages/design-system/src/copy/es.ts`
