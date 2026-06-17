# CICA-L — 02 Ficha clásica / Resumen

**ID:** CICA-L-02 · **Fecha:** 2026-06-16 · **Tramo:** PR-AEST-02

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?patientId=&chartMode=traditional` · tab Resumen |
| Intención clínica | Entender situación clínica del paciente en un vistazo |
| Usuario principal | Médico / enfermera demo |
| Acción primaria | **Nueva evolución** (`layoutActions` → `/espacio/evolucion`) |
| Acciones secundarias | Modo papel · Resultados labs |
| Estados visibles | DEMO badge · IA degradada · borrador abierto · alergias banner |
| Componentes actuales | `ClinicalShell` · `ClassicChartTabs` · `PatientClinicalSummaryGrid` · `ClinicalContextDenseStrip` · panel contexto colapsado |
| Problemas visuales | >5 bloques cards · `ClinicalProbableActionsPanel` compite con primaria · fila quick actions duplica acciones · filtros timeline densos |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Resumen muestra >5 bloques + chips probables + quick actions |
| UX-MAJOR | Mezcla lectura situacional + atajos de acción múltiple |
| UX-MINOR | Timeline con 6 filtros chip en resumen (pertenece a tab Evoluciones) |
| UX-MINOR | Medicamentos en 3 zonas (active/prn/suspended) en resumen |

---

## Fase B — Reducción de intención

```text
Intención única: entender situación clínica (lectura)
Acción primaria única: Nueva evolución (ClinicalLayoutActionBar / layoutActions)
Ocultar en «Más»: chips probables · quick actions footer · meds prn/suspended · timeline filters
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL — transversal]                            │
├────────────────────────────────────────────────────────────┤
│ EPIS2 demo · Juan Pérez · 68a · Cama 402 · IA off · DEMO    │
├────────────────────────────────────────────────────────────┤
│ Resumen | Evoluciones | Indicaciones | Exámenes | Docs | Más│
├────────────────────────────────────────────────────────────┤
│ ClinicalContextStrip (problemas · meds · último encuentro)  │
├────────────────────────────────────────────────────────────┤
│ [Banner alergias / críticos si aplica]                      │
│                                                             │
│ ┌─ Problemas activos ─────┐ ┌─ Última evolución / actividad│
│ └─────────────────────────┘ └──────────────────────────────│
│ ┌─ Indicaciones vigentes ─┐ ┌─ Exámenes clave ─────────────│
│ └─────────────────────────┘ └──────────────────────────────│
│ ┌─ Medicación activa (1 card) ─────────────────────────────│
│ └───────────────────────────────────────────────────────────│
│                                                             │
│                    [Nueva evolución]  [Modo papel]  [Más ▾] │
└────────────────────────────────────────────────────────────┘
```

Máximo **5 bloques** de contenido + banner. Sin `ClinicalProbableActionsPanel`. Sin fila «Acciones rápidas».

---

## Fase E — Cambios aplicados

- `PatientClinicalSummaryGrid` · prop `compositionMode: 'cica-classic'` — presupuesto 5 bloques
- Oculta chips probables, quick actions, filtros timeline, zonas meds prn/suspended
- `TraditionalEhrMode` pasa `compositionMode="cica-classic"` en tab resumen
- Acción primaria permanece en `layoutActions` (DualChartPatientPage)

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | `PatientIdentityBand` |
| Retorno seguro | ✓ | Breadcrumb vía shell |
| 1 acción primaria | ✓ | `layoutActions` |
| Estado demo/borrador/IA | ✓ | chips shell |
| ≤3 acciones visibles barra | ◐ | layout + shell |
| Sin overflow horizontal | ✓ | E2E |
| ≤5 bloques resumen | ✓ | post cica-classic |

**Score:** 92/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha médica clásica clara y usable?
Humano: pendiente PR-AEST-02 signoff
```

---

## Próximo paso

```text
CICA-L-02 cerrado — ver reports/cica-l/03-evoluciones.md (activo)
```
