# CICA-L — 04 Nueva evolución

**ID:** CICA-L-04 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-03

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/evolucion?patientId=` |
| Intención clínica | Escribir / guardar evolución clínica del paciente |
| Usuario principal | Médico demo |
| Acción primaria | **Guardar** borrador (`epis2-form-save`) |
| Acciones secundarias | Firmar · Sugerir IA (overflow) |
| Estados visibles | Borrador · IA degradada · chips paciente demo |
| Componentes actuales | `TraditionalEhrMode` embebido · `EpisClinicalTwoPaneLayout` · footer duplicado nav+acciones · `EpisClinicalSoapHints` |
| Problemas visuales | Ficha tabulada dentro del formulario · breadcrumb en footer · acciones duplicadas · hints SOAP compiten con scrollspy |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-BLOCKER | `TraditionalEhrMode` envolvía el formulario — mezcla lectura ficha + escritura |
| UX-MAJOR | `ClinicalPageNav` en footer lejos del flujo visual |
| UX-MAJOR | Acciones en footer + shell compiten |
| UX-MINOR | SoapHints redundantes con scrollspy SOAP |

---

## Fase B — Reducción de intención

```text
Intención única: escribir evolución
Acción primaria única: Guardar (ClinicalLayoutActionBar arriba)
Ocultar: ficha tabulada embebida · SoapHints · footer nav duplicado
Retorno: breadcrumb Censo → Paciente → Evolución (arriba)
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL — transversal /espacio/*]                 │
├────────────────────────────────────────────────────────────┤
│ Censo › Juan Pérez › Evolución        [Volver ficha] [Censo]│
├────────────────────────────────────────────────────────────┤
│ [Guardar]  [Firmar]  [Más ▾ IA]                             │
├────────────────────────────────────────────────────────────┤
│ Evolución clínica                                           │
│ [SOAP scrollspy] · campos · panel contexto opcional         │
│                                                             │
│ estado borrador / alertas clínicas                          │
└────────────────────────────────────────────────────────────┘
```

Sin tabs de ficha. Sin `TraditionalEhrMode`.

---

## Fase E — Cambios aplicados

- Eliminado `TraditionalEhrMode` en `evolution_note`
- `isCicaEvolutionForm` + `data-cica-composition="classic"` (`epis2-cica-evolution-form`)
- `ClinicalPageNav` + `ClinicalLayoutActionBar` arriba del formulario
- Footer two-pane sin nav/acciones duplicadas en CICA
- Ocultos `EpisClinicalSoapHints` en CICA evolución
- `resolveIntentFromBlueprint` — primaria `copy.forms.save` para evolution_note

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | appBar two-pane |
| Retorno seguro | ✓ | ClinicalPageNav arriba |
| 1 acción primaria | ✓ | Guardar |
| Estado borrador/IA | ✓ | chips + status |
| ≤3 acciones visibles | ✓ | save + sign + overflow IA |
| Sin overflow horizontal | ✓ | E2E |
| Intención única | ✓ | sin ficha embebida |

**Score:** 95/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece formulario clínico clásico claro y usable?
Humano: pendiente PR-AEST-03 signoff
```

---

## Próximo paso

```text
CICA-L-04 cerrado — ver reports/cica-l/05-indicaciones.md (activo)
```
