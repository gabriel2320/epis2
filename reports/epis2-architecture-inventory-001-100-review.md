# EPIS2 — Revisión planificación IDC 001–100

**Fecha:** 2026-06-04  
**Alcance:** Documentación — complemento a revisión 101–200

---

## Entregables

| Artefacto | Acción |
|-----------|--------|
| `docs/product/EPIS2_ARCHITECTURE_INVENTORY_001_100.md` | **Nuevo** — 100 ítems recepción → IA |
| `docs/product/EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md` | **Nuevo** — índice consolidado 1–200 |
| Catálogos y roadmap | Referencias cruzadas actualizadas |

---

## Hallazgos IDC 1–100

| Estado | Cantidad | Ejemplos |
|--------|----------|----------|
| **COMPLETE** | 6 | Login (1), SOAP (37), receta (52), lab (55), interconsulta (64) |
| **PARTIAL** | 38 | Ficha/resumen (21–26), ambulatorio (31–36), resultados (58), IA (91, 94, 97) |
| **MISSING** | 44 | Recepción 2–10, antecedentes 27–30, PACS (59), legales 61–63 |
| **DEFERRED** | 12 | Facturación 11–20, UCI 41–50 (unificar con 131–140), telemedicina 99 |

**Cobertura bloque 1–100:** ~22 % — mayor que 101–200 (~6 %) por alineación con MVP V0–V5.

---

## Duplicidades inventario

- **UCI IDC 41–50** y **131–140** — una sola implementación futura (Ola 13).
- **Admisión IDC 5** (demografía recepción) ≠ **`admission_note`** (ingreso clínico hospitalario).

---

## Priorización

1. Ola 2: IDC **31–40** (consulta ambulatoria completa).  
2. Ola 3: IDC **27–30** + enriquecer **21–26** (longitudinal).  
3. Ola 4: IDC **5** demografía antes de recepción completa (2–10).

---

## Referencia

Índice maestro: `docs/product/EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`
