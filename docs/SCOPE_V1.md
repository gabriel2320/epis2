# EPIS2 — Alcance MVP v1

**Fase:** EPIS2-00 · **Estado:** Aprobado para implementación futura

El MVP v1 demuestra el **flujo command-first completo** con actividades clínicas acotadas. No pretende ser una ficha hospitalaria ni un HIS.

---

## Incluido en v1

| # | Capacidad | Descripción breve |
|---|-----------|-------------------|
| 1 | **Login** | Sesión segura; usuarios sintéticos en demo |
| 2 | **Centro de Comando** | Home; power bar; una acción principal |
| 3 | **Búsqueda de paciente** | Encontrar y fijar contexto de paciente |
| 4 | **Resumen clínico** | Vista mínima longitudinal sintética |
| 5 | **Evolución médica** | Nota de evolución con borrador y aprobación |
| 6 | **Epicrisis** | Resumen de alta / epicrisis |
| 7 | **Receta** | Prescripción con revisión humana |
| 8 | **Solicitud de laboratorio** | Service request laboratorio |
| 9 | **Borradores** | Estados draft → editing → ready_for_review |
| 10 | **Aprobación humana** | Sin auto-aprobación; rol explícito |
| 11 | **Auditoría básica** | Login, cambios, aprobaciones (append-only) |
| 12 | **IA local** | Clasificación intent, slots, borrador asistido; schema-validado |

---

## Comandos iniciales (v1)

```text
buscar paciente
resume al paciente
evoluciona al paciente
haz epicrisis
prepara receta
solicita laboratorio
```

---

## Formularios / páginas generadas (v1)

Máximo **6** páginas clínicas + búsqueda:

1. Patient Search  
2. Patient Summary  
3. Evolution Note  
4. Discharge Summary (epicrisis)  
5. Prescription  
6. Lab Request  

Cada una deriva de un **blueprint declarativo** compartido (contratos + registry).

---

## Roles iniciales

```text
physician
nurse
pharmacist
admin
auditor
```

Permisos explícitos por acción; sin wildcards ambiguos.

---

## Datos

- **Solo sintéticos** — cinco casos clínicos demo (fase EPIS2-09).
- Etiqueta visible **DEMO / SINTÉTICO** en pacientes.
- Sin identificadores reales ni integración con producción hospitalaria.

---

## Gate de producto (EPIS2-11)

Flujo demo obligatorio:

```text
login → buscar paciente → resumen → evolución
  → guardar borrador → aprobar → volver al comando
```

Resultado humano: `GO DEMO` | `PASS WITH FIXES` | `BLOCKED` | `NO GO`.

---

## Límite explícito

Máximo **8 actividades clínicas** en el MVP (las 6 páginas + búsqueda + comando/resumen cuentan dentro del límite operativo del canon). No añadir módulos hospitalarios sin revisión de alcance.
