# CICA-L — 05 Ficha clásica / Indicaciones

**ID:** CICA-L-05 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-04

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?chartMode=traditional` · tab Indicaciones |
| Intención clínica | Revisar indicaciones médicas vigentes del paciente |
| Usuario principal | Médico demo |
| Acción primaria | **Nueva indicación** → `/espacio/laboratorio` (demo) |
| Acciones secundarias | Modo papel · Evolución (quiet) |
| Estados visibles | Grid órdenes demo · DEMO badge |
| Componentes actuales | `TraditionalOrdersSection` · `TraditionalDenseSectionGrid` · `TraditionalSectionMirrorStrip` · barra con primaria fija «Evolución» |
| Problemas visuales | Primaria incorrecta en tab Indicaciones · mirror strip denso · grid vacío sin mensaje |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-BLOCKER | Barra de acciones siempre «Nueva evolución» aunque tab = Indicaciones |
| UX-MAJOR | Mirror batch strip compite con grid en lectura |
| UX-MINOR | Sin empty state cuando no hay filas demo |

---

## Fase B — Reducción de intención

```text
Intención única: leer indicaciones vigentes
Acción primaria única: Nueva indicación (resolveCicaTabLayoutActions orders)
Ocultar: mirror strip · primaria evolución en este tab
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL]                                          │
├────────────────────────────────────────────────────────────┤
│ Identidad paciente · context strip                          │
├────────────────────────────────────────────────────────────┤
│ Resumen | Evoluciones | Indicaciones | Exámenes | Docs | Más│
├────────────────────────────────────────────────────────────┤
│ ┌─ Indicación ──────── Detalle ───────── Estado ──────────┐ │
│ │ Control              PA ambulatoria 7d    Programada    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│              [Indicación]  [Modo papel]  [Evolución ▾ quiet]│
└────────────────────────────────────────────────────────────┘
```

---

## Fase E — Cambios aplicados

- `resolveCicaTabLayoutActions()` — primaria contextual por tab
- `TraditionalEhrMode` usa acciones CICA (handlers desde DualChartPatientPage)
- `TraditionalOrdersSection` · `data-cica-composition="classic"` + empty state
- Sin `TraditionalSectionMirrorStrip` en modo cica-classic para navOrders

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | shell |
| Retorno seguro | ✓ | shell + tabs |
| 1 acción primaria | ✓ | Indicación en tab orders |
| Estado demo | ✓ | chips |
| ≤3 acciones visibles | ✓ | order + paper + evolution quiet |
| Sin overflow horizontal | ✓ | E2E |
| Intención única | ✓ | grid lectura |

**Score:** 93/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha médica clásica clara y usable?
Humano: pendiente PR-AEST-04 signoff
```

---

## Próximo paso

```text
CICA-L-05 cerrado — ver reports/cica-l/06-examenes.md (activo)
```
