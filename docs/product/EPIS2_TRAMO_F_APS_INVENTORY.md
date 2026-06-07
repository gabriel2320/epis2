# EPIS2 — Inventario APS Tramo F (IDC 121–130)

**MF-TRAMO-F-001** · **Fecha:** 2026-06-07  
**Canon:** Ola 12 · workspace `ambulatory` · tablero `/epis2/dashboard?tab=aps`

---

## Alcance

Programas de medicina general y atención primaria (APS) Chile — scaffold demo post Tramos A–E.

| IDC | Nombre | Decisión | Estado matriz | Acción Tramo F |
|-----|--------|----------|---------------|----------------|
| 121 | Control salud cardiovascular | Build | Active | Panel PSCV demo |
| 122 | Calculadora Framingham | Build | Active | Riesgo CV demo |
| 123 | Examen medicina preventiva (EMP) | Build | Active | Checklist tamizaje |
| 124 | Pie diabético | Build | Active | Registro monofilamento |
| 125 | Tamizaje salud mental | Build | Active | PHQ-9 / GAD-7 demo |
| 126 | Control niño sano | Build | Active | Curvas crecimiento demo |
| 127 | Calendario inmunizaciones PNI | Build | Active | Esquema PNI demo |
| 128 | Control prenatal | Build | Active | EG / AU demo |
| 129 | Derivación programas ministeriales | Build | Active | Enrolamiento demo |
| 130 | Visita domiciliaria integral | Build | Active | Extensión ambulatorio demo |

**Invariante:** home canónico = Centro de Comando — tablero APS no es home.

---

## Relación con olas

- **Tramo A–E:** cerrados técnicamente.
- **Tramo F:** Ola 12 APS — tab `aps` en modo tablero bajo workspace ambulatorio.
- **UCI 131–140:** Future — fuera Tramo F.

---

## Evidencia

Gates: `quality:tramo-f-inventory-gate` · `quality:tramo-f-aps-gate` · `quality:tramo-f-scaffold-gate`

Plan: [`EPIS2_TRAMO_F_PLAN.md`](./EPIS2_TRAMO_F_PLAN.md)

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
