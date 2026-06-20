# EPIS2 — UX-B: arquitectura de información

**Fecha:** 2026-06-04 · **Estado:** Contrato aprobado · implementación pendiente  
**Precede:** UX-A (command-first, shell, AppBar, demos narrativos)  
**Canon:** `docs/PRODUCT_CANON.md` · `docs/product/PRODUCT_INVARIANTS.md`

---

## Principio rector

> Si Gmail ocultara «Redactar», dejaría de ser Gmail.  
> Si EPIS2 muestra 19 acciones, deja de ser command-first.

Antes de agregar una Card, preguntar: **¿puede resolverse con tipografía y espacio?**

---

## Gates UX-G (piloto)

| ID | Gate | Criterio de aprobación |
|----|------|------------------------|
| **UX-G01** | Home comando | Power Bar + ≤4 bloques (recientes, tareas, borradores, alertas); sin widget grid expandido por defecto |
| **UX-G02** | Ficha resumen | Tab Resumen = summary + alertas; longitudinal bajo «Ver historial»; Power Bar contextual |
| **UX-G03** | Formulario | Máx. 3 acciones visibles: Guardar · Firmar · ⋯ (aprobación humana siempre accesible) |
| **UX-G04** | Rail N0 | ≤5 destinos mentales visibles en Comando (Comando, Pacientes, Trabajo, Hospitalización, Admin) |
| **UX-G05** | Frames | Ninguna pantalla con >1 marco visual anidado (extensión LAYOUT-G12) |

### Prueba del 40%

Por pantalla, antes de merge:

> Si elimino el 40% de elementos visuales, ¿la tarea clínica sigue funcionando?

Si la respuesta es sí, eliminar ese 40%.

---

## Alcance UX-B (implementación)

### B.1 — Home Gmail-like (`CommandCenterPage`)

**Objetivo:** Centro de Comando = Power Bar + bloques escaneables.

```text
Power Bar
Pacientes recientes
Tareas pendientes
Borradores
Alertas
```

**Fuera de vista principal:** panel paciente expandido por defecto, widget grid, botón tablero duplicado.

### B.2 — Ficha compacta (`PatientWorkspacePage`)

**Objetivo:** una tarea por pantalla en Resumen.

```text
Paciente + contexto (1 línea)
Resumen clínico
Alertas
Actividad reciente (≤8 eventos)
Power Bar contextual
Ver historial → longitudinal completo
```

**Fuera de vista principal:** widgets redundantes con summary, notas/borradores en tab secundario (UX-B.2b opcional).

---

## Explícitamente fuera de UX-B

- Rediseño del árbol de 39 superficies → 5 nodos definitivos.
- Eliminación masiva de tabs dashboard (12 → N).
- Refactor Quality/ICU (24/22 Papers) — **UX-C**.
- Cambios en Command Registry o formularios clínicos (solo presentación).
- Nuevas migraciones demo (salvo curación API longitudinal — fase posterior).

---

## Orden de ejecución recomendado

```text
UX-A.4 ✅ demos narrativos
UX-B.1     home CICA `/app/buscar` compacto
UX-B.2     ficha resumen compacta
UX-C       dashboards → métrica + tabla
UX-D       formularios → Guardar · Firmar · ⋯
```

---

## Navegación mental objetivo (no implementar aún)

```text
Comando · Pacientes · Trabajo · Hospitalización · Administración
```

Validar con piloto antes de fijar registry.

---

## Referencias

- Acta UX-A: `reports/archive/2026-06/epis2-ux-ui-audit-2026-06-04.md`
- Progreso: `reports/archive/2026-06/epis2-ux-a-progress-2026-06-04.md`
- Demos narrativos: `packages/test-fixtures/src/demoNarratives.ts`
- Golden journey: `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
