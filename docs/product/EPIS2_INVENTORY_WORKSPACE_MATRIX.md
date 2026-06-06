# EPIS2 — Matriz de conciliación: IDC 1–200 → Workspace MD3

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Canon:** [`EPIS2_ROLE_WORKSPACES_M3.md`](../design/EPIS2_ROLE_WORKSPACES_M3.md)

> Cada ítem del inventario se asigna a **un workspace primario** y **nivel MD3** dominante. Ítems transversales usan **cross-link** sin cambiar workspace.

---

## Leyenda de niveles

| N | Superficie MD3 |
|---|----------------|
| 0 | Navigation Rail (workspace switcher + ítems contextuales) |
| 1 | Banner paciente / filtros globales |
| 2 | Primary tabs |
| 3 | Formularios Scrollspy / Expandable Cards |
| 4 | FAB contextual |

---

## Resumen por workspace

| Workspace | IDC aprox. | % inventario | Estado EPIS2 hoy |
|-----------|------------|--------------|-------------------|
| `command` | — (home) | — | **COMPLETE** |
| `ambulatory` | 27–40, 52–57, 61–64 | ~35 % | **Partial** — consulta + certificado (Ola 2) |
| `emergency` | 101–110 | ~5 % | **Planned** — dominio propio; ≠ ambulatorio |
| `icu` | 41–50, 131–140 | ~10 % | **MISSING** (Ola 13) |
| `quality_iaas` | 71–80, 81–90, 161–170 | ~15 % | **PARTIAL** (tab calidad demo) |
| `admin_system` | 1, 91–93, 181–196, admin | ~12 % | **PARTIAL** (admin + forms studio) |
| **DEFERRED** | 11–20 facturación | ~10 % | Fuera de workspaces clínicos |
| **Recepción** | 2–10 | ~5 % | Ola 4 — tablero operativo paralelo |
| **Telemedicina** | 95–100, 191–196 | ~3 % | Ola 9 |

---

## Bloque IDC 1–100

| Rango IDC | Dominio | Workspace | N dominante | Ola |
|-----------|---------|-----------|-------------|-----|
| 1 | Login | `admin_system` | 0 | 0 |
| 2–10 | Recepción / flujo | *(tablero recepción)* | 0–2 | 4 |
| 11–20 | Facturación Chile | **DEFERRED** | — | 5 |
| 21–26 | Dashboard paciente / widgets | `ambulatory` | 1–2 | 1 |
| 27–30 | Antecedentes | `ambulatory` | 3 | 3 |
| 31–40 | Consulta ambulatoria | `ambulatory` | 2–3 | 2 |
| 41–50 | UCI *(duplica 131–140)* | `icu` | 2–3 | 13 |
| 51–57 | Órdenes / recetas / lab | `ambulatory` | 3 | 1 |
| 58 | Bandeja resultados | `ambulatory` | 2 | 1 |
| 61–64 | Documentos clínicos | `ambulatory` | 3 | 6 |
| 65–70 | Legales | `ambulatory` | 3 | 6 |
| 71–80 | Epidemiología / IAAS | `quality_iaas` | 2–3 | 7 |
| 81–90 | Jefatura | `quality_iaas` | 2 | 8 |
| 91–94 | IA asistida clínica | `ambulatory` + cross-link | 3 | 1 |
| 93 | Hardware IA | `admin_system` | 3 | 9 |
| 95–100 | Telemedicina | `ambulatory` | 2–3 | 9 |

---

## Bloque IDC 101–200

| Rango IDC | Dominio | Workspace | N dominante | Ola |
|-----------|---------|-----------|-------------|-----|
| 101–102 | Urgencias | **`emergency`** *(planificado)* | 2–3 | 10 |
| 111–120 | Hospitalización / enfermería | `inpatient` / `nursing` | 3 | 11 |
| 121–130 | Quirófano / anestesia | `ambulatory` | 3 | 12 |
| 131–140 | UCI avanzada | `icu` | 2–3 | 13 |
| 141–150 | Neonatología / pediatría | `icu` / `ambulatory` | 2–3 | 14 |
| 151–160 | Salud mental | `ambulatory` | 3 | 15 |
| 161–170 | IAAS avanzado | `quality_iaas` | 2–3 | 16 |
| 171–180 | Rehab / fisiatría | `ambulatory` | 3 | 17 |
| 181–190 | Interoperabilidad | `admin_system` | 2–3 | 18 |
| 191–200 | IA autónoma / agentes | `admin_system` | 3 | 19–20 |

---

## Cross-links canónicos (sin cambio de workspace)

| Origen | Destino inline | IDC |
|--------|----------------|-----|
| Evolución UCI (`icu` N3) | Notificación IAAS | 71–80 |
| Receta retenida | Alerta farmacia | 54 |
| Ingreso hospitalario | Checklist IAAS CVC | 165 |
| SOAP ambulatorio | Solicitud lab / imagen | 55–56 |

Implementación: Expandable Card + intent secundario en SoT; ver reglas en `EPIS2_ROLE_WORKSPACES_M3.md`.

---

## Rutas EPIS2 actuales por workspace

| Workspace | Rutas habilitadas hoy |
|-----------|----------------------|
| `command` | `/comando` |
| `ambulatory` | `/epis2/dashboard?tab=work`, `/espacio/buscar-paciente`, `/espacio/ficha`, formularios `/espacio/*` |
| `icu` | *(rail disabled — Ola 13)* |
| `quality_iaas` | `/epis2/dashboard?tab=quality`, `?tab=service` |
| `admin_system` | `/espacio/admin?tab=ops|users|forms` |

---

**Canon ejecución:** [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md)

---

## Próximo paso producto (Tramo A)

1. **Ola 3** — antecedentes IDC 27–30 + timeline.
2. **Ola 6A** — motor documental e impresión (receta, certificado, interconsulta).
3. Signoff clínico Ola 2 antes de declarar **Done** (métricas canon §11).
