# EPIS2 — CICA-L

**Clinical Intent Composition Loop**  
**CICA-L = CICA + Layout Loop**  
**Versión:** 1.0 · **Fecha:** 2026-06-16  
**Programa:** PROG-AESTHETIC-RESET · **Modo:** Clásico exclusivamente

**Canon base:** [`EPIS2_CICA.md`](./EPIS2_CICA.md) · [`EPIS2_CICA_SCREEN_GOVERNOR.md`](./EPIS2_CICA_SCREEN_GOVERNOR.md) · [`EPIS2_CLINICAL_SCREEN_MAP.md`](./EPIS2_CLINICAL_SCREEN_MAP.md)

> **Frase guía:** No rediseñar para que se vea moderno; rediseñar para que un médico entienda, navegue y actúe sin esfuerzo.

---

## Objetivo

Fábrica repetible por pantalla:

```text
Inventariar → Reducir intención → Rediagramar → Implementar → Medir → Criticar → Cerrar
```

Una pantalla por iteración. Sin PR gigante.

---

## Las 7 preguntas (obligatorias)

```text
1. ¿Qué intención clínica resuelve?
2. ¿Cuál es la acción principal?
3. ¿Qué debe ver el médico primero?
4. ¿Qué debe quedar oculto en «Más»?
5. ¿Cómo vuelve atrás?
6. ¿Cómo se ve ordenada, alineada y calmada?
7. ¿Cómo se verifica que no volvió a saturarse?
```

---

## Fases del loop

| Fase | Nombre | Entregable | Gate |
|------|--------|------------|------|
| **A** | Inventario | `reports/cica-l/NN-*.md` § Inventario | `quality:cica-screen-inventory-gate` |
| **B** | Reducción intención | 1 intención + 1 acción primaria | Checklist CICA |
| **C** | Wireframe textual | ASCII en mismo reporte | `quality:cica-screen-inventory-gate` |
| **D** | Layout Engine | `ClinicalScreen`, `ClinicalSection`, etc. | `quality:aesthetic-layout-gate` |
| **E** | Implementación mínima | Diff composicional only | PROG prohibiciones |
| **F** | Medición | CICA Screen Score ≥ 90 | `auditCicaScreen()` |
| **G** | Crítica humana | ¿Parece ficha médica? | UX-LAB / walkthrough |

**Sin wireframe aprobado (Fase C), no hay implementación (Fase E).**

---

## Pantallas en orden

| ID | Pantalla | Archivo ledger | Estado |
|----|----------|----------------|--------|
| CICA-L-01 | Censo | `01-censo.md` | Pendiente |
| CICA-L-02 | Ficha / Resumen | `02-ficha-resumen.md` | **Hecho** |
| CICA-L-03 | Evoluciones | `03-evoluciones.md` | **Hecho** |
| CICA-L-04 | Nueva evolución | `04-nueva-evolucion.md` | **Hecho** |
| CICA-L-05 | Indicaciones | `05-indicaciones.md` | **Hecho** |
| CICA-L-06 | Exámenes | `06-examenes.md` | **Hecho** |
| CICA-L-07 | Medicamentos / receta | `07-medicamentos.md` | **Hecho** |
| CICA-L-08 | Documentos | `08-documentos.md` | **Hecho** |
| CICA-L-09 | Alta / epicrisis | `09-alta.md` | **Hecho** |
| CICA-L-10 | Modo papel | `10-modo-papel.md` | **Hecho** |
| CICA-L-11 | Auditoría | `11-auditoria.md` | **Hecho** |

**Loop clásico L-02…L-11 cerrado** en **PR-AEST-07** (2026-06-11). CICA-L-01 Censo queda en PROG-UX-LAB.  
Cierre: [`reports/epis2-pr-aest-07-cica-l-close.md`](../../reports/epis2-pr-aest-07-cica-l-close.md) · Gate: `quality:pr-aest-07-close`

---

## CICA Screen Score (unificado)

Base 100. Función: `auditCicaScreen()` en `@epis2/epis2-ui/layout/clinical`.

| Penalización | Puntos |
|--------------|--------|
| >1 botón primario | −20 |
| Scroll horizontal | −15 |
| Falta identidad paciente | −15 |
| Falta estado demo/borrador/IA | −15 |
| >3 acciones visibles totales | −10 |
| Cards anidadas profundas (>2) | −10 |
| Mezcla de intenciones | −10 |
| >7 elementos nav visibles | −10 |
| Sin barra comando transversal | −10 |
| >5 bloques principales (resumen) | −10 |
| Mala alineación / texto cortado | −5 |

| Score | Veredicto |
|-------|-----------|
| 90–100 | **GO** |
| 80–89 | **PASS WITH FIXES** |
| <80 | **NO-GO** |

Helper: `resolveCicaVerdict(score)`.

---

## Componentes canónicos (Fase D)

```text
ClinicalScreen · ClinicalSection · ClinicalFieldGrid
ClinicalLayoutActionBar · ClinicalOverflowMenu
PatientIdentityBand · ClinicalContextStrip · ClassicChartTabs
ClinicalIntentBreadcrumb · ClinicalTransversalCommandDock
```

Reglas duras: 1 primaria · 2 secundarias · resto «Más» · grilla 8px · sin scroll horizontal.

---

## Prohibiciones (Fase E)

```text
NO features clínicas · NO schemas · NO migraciones
NO aprobación/firma · NO frontera IA · NO scripts root
```

---

## Gates del loop

| Gate | Cuándo |
|------|--------|
| `quality:cica-screen-inventory-gate` | Cada pantalla activa |
| `quality:aesthetic-reset-close` | Cada iteración |
| `quality:cica-loop-close` | Cierre tramo / PR |
| `quality:no-horizontal-overflow-gate` | E2E clásico |
| `quality:ux-lab-close` | Solo PR-AEST-07 / rc4 |

---

## Secuencia PRs

```text
PR-AEST-01  Engine + gates base        ✓
PR-AEST-02  Censo + resumen            ← CICA-L-01/02
PR-AEST-03  Evoluciones                CICA-L-03/04
PR-AEST-04  Indicaciones + exámenes     CICA-L-05/06
PR-AEST-05  Meds + documentos          CICA-L-07/08
PR-AEST-06  Papel polish               CICA-L-10        ✓
PR-AEST-07  Cierre + screenshots       cica-loop-close  ✓
```

---

## Loop operativo

```text
FOR pantalla activa en cica-l-active.json:
  1. Completar inventario + wireframe en reports/cica-l/
  2. Aprobar wireframe (humano)
  3. Aplicar Layout Engine
  4. Implementar diff mínimo
  5. npm run quality:gate -- quality:cica-screen-inventory-gate
  6. npm run quality:gate -- quality:aesthetic-reset-close
  7. E2E + auditCicaScreen
  8. Reporte veredicto en ledger
  9. Si score < 90 → repetir desde wireframe
  10. Avanzar cica-l-active.json a siguiente pantalla
```

---

*CICA-L alimenta PROG-AESTHETIC-RESET; no lo reemplaza.*
