# EPIS2 — Inventario recepción Tramo B (IDC 2–20)

**MF-TRAMO-B-001** · **Fecha:** 2026-06-07  
**Canon:** Home = `/comando` — recepción y facturación **nunca** son home.

---

## Alcance

Conciliación explícita del bloque pre-clínico (recepción + facturación) con la matriz IDC y el canon de olas **Tramo B — Piloto institucional ambulatorio**.

| Bloque | IDC | Workspace | Decisión | Horizonte | Nota |
|--------|-----|-----------|----------|-----------|------|
| Recepción operativa | 2–10 | `reception` | **Build** | Post-core | Flujo paralelo pre-clínico; tablero futuro `/epis2/dashboard` |
| Facturación / caja | 11–20 | `billing` | **Defer** | Future | Fuera MVP clínico; integraciones Isapre/Fonasa deferidas |

---

## IDC 2–10 — Recepción (Build, Planned)

| IDC | Nombre | Decisión | Estado matriz | Acción Tramo B |
|-----|--------|----------|---------------|----------------|
| 2 | Dashboard recepción | Build | Planned | Tablero recepción — no home |
| 3 | Agenda diaria profesional | Build | Planned | Integrar con comando calendario |
| 4 | Calendario mensual centro | Build | Planned | Admin / recepción |
| 5 | Formulario admisión | Build | Planned | Distinto de `admission_note` clínico |
| 6 | Biometría / firma | Build | Planned | Custodia Tramo B+ |
| 7 | Sala de espera virtual | Build | Planned | Display externo |
| 8 | Gestión sobrecupos | Build | Planned | — |
| 9 | Registro acompañantes | Build | Planned | — |
| 10 | Panel llamado (tótem) | Integrate | Planned | IoT / display externo |

**Invariante:** IDC 2 (dashboard recepción) **Exclude** como home — home canónico = Centro de Comando.

---

## IDC 11–20 — Facturación (Defer)

| IDC | Nombre | Decisión | Estado matriz | Nota |
|-----|--------|----------|---------------|------|
| 11 | Presupuesto médico | Defer | Planned | — |
| 12 | Cobro consulta | Defer | Planned | — |
| 13 | Boleta / factura | Defer | Planned | — |
| 14 | Integración aseguradoras | Integrate | Planned | Isapre/Fonasa Future |
| 15 | Conciliación diaria caja | Defer | Planned | — |
| 16 | Cuentas por cobrar | Defer | Planned | — |
| 17 | Reembolsos / anulaciones | Defer | Planned | — |
| 18 | Honorarios médicos | Defer | Planned | — |
| 19 | Liquidación profesionales | Defer | Planned | — |
| 20 | Reporte ingresos mensuales | Defer | Planned | — |

---

## Relación con olas

- **Tramo A (actual):** flujo clínico comando → ficha → formularios (IDC 21+).
- **Tramo B:** habilita recepción 2–10 sin sustituir home ni duplicar Clinical Form Registry.
- **Tramo C:** urgencias IDC 101+ (workspace `emergency` planificado Ola 10).

---

## Evidencia

Gate: `npm run quality:tramo-b-reception-gate`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
