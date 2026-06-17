# CICA-L — 03 Ficha clásica / Evoluciones

**ID:** CICA-L-03 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-03

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?patientId=&chartMode=traditional` · tab Evoluciones |
| Intención clínica | Revisar historial clínico cronológico (evoluciones y eventos) |
| Usuario principal | Médico / enfermera demo |
| Acción primaria | **Nueva evolución** (`layoutActions` → `/espacio/evolucion`) |
| Acciones secundarias | Modo papel · Resultados labs |
| Estados visibles | DEMO badge · borrador abierto en timeline · IA degradada |
| Componentes actuales | `ClassicChartTabs` · `ClassicChartSubNav` (4 subsecciones) · `TraditionalEvolutionSection` · `ClinicalFilterableTimeline` · botón texto duplicado |
| Problemas visuales | Subnav 4 ítems compite con tab · botón «Evolución» duplica primaria · 5 filtros chip densos · anamnesis/examen físico mezclan intención |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Botón texto «Nueva evolución» duplica acción primaria de `ClinicalLayoutActionBar` |
| UX-MAJOR | Subnav 4 secciones (evolución + anamnesis + examen + antecedentes) satura tab Evoluciones |
| UX-MINOR | 5 filtros timeline cuando intención es evoluciones |
| UX-MINOR | Filtros labs/hospitalizaciones pertenecen a otros tabs |

---

## Fase B — Reducción de intención

```text
Intención única: leer historial clínico / evoluciones
Acción primaria única: Nueva evolución (layoutActions — sin botón inline)
Ocultar en «Más» / fases posteriores: anamnesis · examen físico · antecedentes (subnav)
Filtros: Todos + Evoluciones (resto vía otros tabs)
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
│ (sin subnav — tab Evoluciones = una sola sección)           │
├────────────────────────────────────────────────────────────┤
│ [Todos] [Evoluciones]                                       │
│                                                             │
│ Hoy                                                         │
│   · Evolución médica — 10:30                                │
│ Hace 3 meses                                                │
│   · Nota de ingreso — …                                     │
│                                                             │
│                    [Nueva evolución]  [Modo papel]  [Más ▾] │
└────────────────────────────────────────────────────────────┘
```

Sin subnav. Sin botón inline. Timeline agrupado temporalmente.

---

## Fase E — Cambios aplicados

- `visibleSectionsForCicaClassicTab` — una sección primaria por tab (evolutions → `navEvolution`)
- `TraditionalEvolutionSection` · `compositionMode: 'cica-classic'` · sin botón duplicado
- `ClinicalFilterableTimeline` · filtros reducidos (`all` + `evolutions`) en cica-classic
- `TraditionalEhrMode` pasa `compositionMode` a secciones + subnav CICA

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | shell |
| Retorno seguro | ✓ | breadcrumb shell |
| 1 acción primaria | ✓ | layoutActions only |
| Estado demo/borrador/IA | ✓ | chips shell + drafts timeline |
| ≤3 acciones visibles barra | ✓ | layout + shell |
| Sin overflow horizontal | ✓ | E2E |
| Intención única | ✓ | timeline lectura |

**Score:** 94/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha médica clásica clara y usable?
Humano: pendiente PR-AEST-03 signoff
```

---

## Próximo paso

```text
CICA-L-03 cerrado — ver reports/cica-l/04-nueva-evolucion.md (activo)
```
