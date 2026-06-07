# EPIS2 — Cierre Tramo A (producto clínico demostrable)

**MF-TRAMO-A-CLOSURE** · **Fecha:** 2026-06-07  
**Canon:** [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) §9 Tramo A

---

## Resultado declarado

```text
Ola 0 → 1A–1D → 2 → 3 → 6A parcial → FHIR export mínima
```

**Estado:** ✅ **Cerrado técnicamente** (gates + E2E demo). Signoff clínico institucional pendiente.

---

## IDC Done Tramo A (Core 21–40)

| Bloque | IDC Done | Excepción |
|--------|----------|-----------|
| Ficha / antecedentes | 21–30 | — |
| Consulta ambulatoria | 31–37, 39–40 | **38 Defer** (macros/plantillas EPIS) |
| Login | 1 | — |
| Órdenes base | 52, 55, 56, 58 | Partial en bandeja |
| Legales demo | 62, 64 | — |
| IA assist | 91 | — |
| Conciliación | 165 | — |

**IDC 38:** `Defer` Post-core — consulta ambulatoria usa textarea libre; plantillas estructuradas EPIS fuera de Tramo A.

---

## Gates obligatorios Tramo A

| Gate | Evidencia |
|------|-----------|
| `quality:ola2-m3-ui-gate` | Scrollspy ambulatorio |
| `quality:ola2-physical-exam-gate` | IDC 33–35 |
| `quality:ola3-*` | Ficha 21–30 |
| `quality:ola6a-print-gate` | Print A5 IDC 40 |
| `quality:tramo-a-closure-gate` | Este documento + matriz |

---

## Métricas canon §11 (2026-06-07)

```text
Cobertura IDC Tramo A:  27/28 comprometidos Done (+ 1 Defer 38)
Journeys demo:          ambulatorio · ficha · certificado · print · borrador
Gates técnicos:         check · test · db:validate · gates ola
Signoff clínico:        pendiente institucional
Estado real:            Done técnico Tramo A
```

---

## Próximo tramo global

Cadena **A–E** cerrada técnicamente — ver [`EPIS2_TRAMOS_EXECUTION_MASTER.md`](./EPIS2_TRAMOS_EXECUTION_MASTER.md).  
Signoff clínico institucional · `quality:golden-journey`.
