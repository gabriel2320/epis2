# MF-OLA2-003 — Examen físico + CIE-10 (IDC 33–35)

**Fecha:** 2026-06-07  
**Alcance:** Consulta ambulatoria `outpatient_visit` — secciones scrollspy examen físico y diagnóstico CIE-10.

---

## IDC promovidos → Done

| IDC | Pantalla | Evidencia |
|-----|----------|-----------|
| 33 | Examen físico general | Sección `physical-general` accordion + scrollspy + E2E |
| 34 | Examen físico segmentario | Sección `physical-segment` accordion + E2E |
| 35 | Buscador diagnósticos CIE-10 | Campo `icd10Code` en sección `diagnosis` + E2E |

**IDC Done (Core):** 28 (+3)

---

## Cambios

- Tests unitarios Ola 2: scrollspy `physical-general`, `physical-segment`, `diagnosis` + texto CIE-10
- E2E `ola2-ambulatory-m3-ui.spec.ts`: journey IDC 33–35 (expand accordion + fill + CIE-10)
- Gate `validate-ola2-physical-exam-gate.mjs` + script npm `quality:ola2-physical-exam-gate`
- Matriz IDC: overrides 33–35 → Done
- Catálogo §6 actualizado

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | ✅ |
| `npm run test` | ✅ 421 |
| `npm run db:validate` | ✅ 32 migraciones |
| `quality:ola2-physical-exam-gate` | ✅ |

---

## Riesgos

- Plantillas de examen físico estructurado (legacy EPIS) siguen **Defer** — campos libres textarea por ahora.
- CIE-10 usa catálogo demo staging; integración terminológica completa pendiente post-core.

---

## Próximo paso

1. Tramo B — UI recepción (IDC 2–20 Planned; inventario ✅)
2. Ola 1C+ — tendencias resultados / bandeja órdenes extendida
3. IDC 38 — sub-sección ambulatoria pendiente en matriz
