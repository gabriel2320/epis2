# EPIS2 — UX-B.2b Historial longitudinal plano

**Fecha:** 2026-06-07 · **Alcance:** `apps/web` (panel historial bajo «Ver historial»)

---

## Objetivo

Extender LAYOUT-G12 al historial longitudinal — secciones planas sin `Paper outlined` anidado, coherente con ficha resumen y tableros.

---

## Cambios

| Componente | Mejora |
|------------|--------|
| `PatientLongitudinalPanel` | `Section` → `EpisWorkspaceSection` |
| `LongitudinalNavTree` | Sección plana |
| `PatientClinicalCharts` | Tendencias INR / signos vitales planas |
| `PatientClinicalAiPanel` | Sin marco duplicado (título en acordeón padre) |

**Conservado:** acordeón IA colapsado por defecto, todos los `data-testid`.

---

## Gate nuevo

```bash
npm run quality:ux-pilot
```

Ejecuta: `quality:ux-g02` (API/registry) + E2E UX-G02 + E2E login gateway.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — **508** tests |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
