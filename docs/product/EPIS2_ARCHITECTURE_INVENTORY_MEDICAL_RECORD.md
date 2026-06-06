# EPIS2 — Inventario maestro: ficha médica (IDC 1–200)

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Alcance:** Planificación arquitectónica — pantallas y formularios de ficha médica  
**Estado:** Trazabilidad; sin implementación masiva

---

## Documentos por bloque

| Bloque | IDC | Documento |
|--------|-----|-----------|
| Núcleo clínico y operaciones | **1–100** | [`EPIS2_ARCHITECTURE_INVENTORY_001_100.md`](./EPIS2_ARCHITECTURE_INVENTORY_001_100.md) |
| Especialidades y dominios avanzados | **101–200** | [`EPIS2_ARCHITECTURE_INVENTORY_101_200.md`](./EPIS2_ARCHITECTURE_INVENTORY_101_200.md) |

**Catálogos relacionados:** `EPIS2_COMPLETE_SCREEN_CATALOG.md` · `EPIS2_COMPLETE_FORM_CATALOG.md` · `EPIS2_COMPLETION_ROADMAP.md` · [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) · [`EPIS2_INVENTORY_WORKSPACE_MATRIX.md`](./EPIS2_INVENTORY_WORKSPACE_MATRIX.md) · [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](../architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md)

---

## EPIS2 Core (definición de terminado)

> **Core completado ≠ IDC 1–200 completados.** Ver [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) §1.

---

## Resumen consolidado (1–200)

| Métrica | IDC 1–100 | IDC 101–200 | Total |
|---------|-----------|-------------|-------|
| Ítems | 100 | 100 | **200** |
| **COMPLETE** | 6 | 1 | **7** |
| **PARTIAL** | 38 | 14 | **52** |
| **MISSING** | 44 | 78 | **122** |
| **DEFERRED** | 12 | 7 | **19** |
| Cobertura estimada | **~22 %** | **~6 %** | **~14 %** |

**COMPLETE hoy (7):** login (1), SOAP (37), receta (52), laboratorio (55), interconsulta (64), epicrisis vía alta clínica (110 parcial→ver 101–200), conciliación (165).

---

## Mapa de olas (1–200)

| Ola | IDC | Dominio | Doc detalle |
|-----|-----|---------|-------------|
| 0–1 | 1, 21–26, 37, 52, 55–58, 91–94 | MVP núcleo clínico + IA asistida | 001–100 §4 |
| 2–3 | 27–40, 61–64 | Ambulatorio + antecedentes + documentos | 001–100 §4 |
| 4 | 2–10 | Recepción y flujo | 001–100 §5.1 |
| 5 | 11–20 | Facturación Chile | **DEFERRED** |
| 6 | 61–70, 71–80 | Legales + epidemiología base | 001–100 §5.6–5.7 |
| 7 | 81–90 | Jefatura / admin | 001–100 §5.8 |
| 8 | 91–100 | IA clínica + telemedicina | 001–100 §5.9 |
| 9 | — | Hardening piloto | Roadmap |
| 10–20 | 101–200 | Urgencias → interop avanzada | 101–200 §4 |

**Secuencia post-MVP v1:** cerrar Ola 1 (IDC 21–26) → Ola 2 ambulatorio (31–40) → Ola 10 urgencias (101–102) → Ola 11 enfermería (111+).

---

## Reglas canon (todos los IDC)

- **Home** = Centro de Comando (`/comando`) — nunca recepción, facturación ni dashboard clínico.
- **Un Form Registry** + **un Command Registry** — sin duplicados.
- **Borrador ≠ aprobado** — PostgreSQL SoT tras aprobación humana.
- **IA no aprueba ni firma** — IDC 91–100 y 191–196 asisten solamente.
- **Command-first** — formularios clínicos entran por intent o ficha M3.
- **Workspaces por rol** — conciliar 200 ítems sin menú único; ver `docs/design/EPIS2_ROLE_WORKSPACES_M3.md`.

---

## Referencias

- Reporte revisión 101–200: `reports/epis2-architecture-inventory-101-200-review.md`
- Reporte revisión 001–100: `reports/epis2-architecture-inventory-001-100-review.md`
- Auditoría MVP UI: `reports/epis2-global-screen-form-audit.md`
