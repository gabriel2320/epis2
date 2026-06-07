# EPIS2 — Inventario urgencias Tramo C (IDC 101–110)

**MF-TRAMO-C-001** · **Fecha:** 2026-06-07  
**Workspace:** `emergency` — **≠** `ambulatory`

---

## Alcance

Hospitalización general + urgencias según canon Tramo C. Este inventario cubre **IDC 101–110** (Ola 10).

| IDC | Nombre | Decisión | Estado | Evidencia MF-TRAMO-C-002 |
|-----|--------|----------|--------|--------------------------|
| 101 | Triaje urgencias | Build | Active | EmergencyDashboardTab + API |
| 102 | Box urgencias | Build | Active | Panel IDC chips |
| 103 | Reanimación (Clave Azul) | Build | Active | Panel demo |
| 104 | Trauma / FAST | Build | Active | Planned en panel |
| 105 | Hoja observación corta | Build | Active | Métricas observación |
| 106–110 | Alta · derivación · procedimientos · consent · epicrisis | Build | Planned | Post-core Tramo C+ |

---

## Invariantes

- Home = `/comando` — urgencias nunca home.
- Workspace `emergency` en Navigation Rail.
- Tablero: `/epis2/dashboard?tab=emergency`.

---

## Gate

`npm run quality:tramo-c-emergency-gate`

---

## Plan extendido

Ver [`EPIS2_TRAMO_C_PLAN.md`](./EPIS2_TRAMO_C_PLAN.md).
