# EPIS2 — Cierre Tramo B (recepción ambulatoria)

**MF-TRAMO-B-CLOSURE** · **Fecha:** 2026-06-07  
**Canon:** [`EPIS2_TRAMO_B_RECEPTION_INVENTORY.md`](./EPIS2_TRAMO_B_RECEPTION_INVENTORY.md) · [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) §9 Tramo B

---

## Resultado declarado

```text
Workspace reception → tablero recepción → agenda · admisión admin · sala espera · panel llamado demo
```

**Estado:** ✅ **Cerrado técnicamente** (UI demo IDC 2–10). Signoff clínico institucional pendiente.

**Invariante:** home canónico = Centro de Comando (`/comando`) — recepción nunca es home.

---

## IDC Tramo B (2–10)

| IDC | Nombre | Estado matriz | Nota |
|-----|--------|---------------|------|
| 2 | Dashboard recepción | Done | Tablero + E2E |
| 3 | Agenda diaria | Done | Panel demo |
| 4 | Calendario mensual | Done | Panel demo |
| 5 | Admisión admin | Done | ≠ `admission_note` clínico |
| 6 | Biometría / firma | Active | Tramo B+ |
| 7 | Sala espera virtual | Done | Panel demo |
| 8 | Sobrecupos | Done | Métrica demo |
| 9 | Acompañantes | Done | Métrica demo |
| 10 | Panel llamado | Active | Demo; IoT Future |

**IDC 11–20:** Defer — facturación fuera MVP clínico.

---

## Gates obligatorios Tramo B

| Gate | Evidencia |
|------|-----------|
| `quality:tramo-b-reception-gate` | Inventario IDC 2–20 |
| `quality:tramo-b-ui-gate` | Workspace + API + E2E |
| `quality:tramo-b-closure-gate` | Este documento |

---

## Métricas (2026-06-07)

```text
IDC Done Tramo B clave:  2–5 · 7–9 (+ 6 · 10 Active)
Journeys demo:           tablero recepción · agenda · panel llamado
Gates técnicos:          check · test · db:validate · gates tramo-b
Signoff clínico:         pendiente institucional
Estado real:             Done técnico Tramo B (UI demo)
```

---

## Próximo tramo global

**Tramo C** cerrado técnicamente — ver `EPIS2_TRAMO_C_CLOSURE.md`.  
Cadena A–E completa: signoff clínico institucional · `quality:golden-journey`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
