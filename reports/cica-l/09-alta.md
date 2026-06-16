# CICA-L — 09 Alta / epicrisis

**ID:** CICA-L-09 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-05

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/epicrisis?patientId=` |
| Intención clínica | Redactar / guardar epicrisis de alta hospitalaria |
| Usuario principal | Médico demo |
| Acción primaria | **Guardar** borrador (`epis2-form-save`) |
| Acciones secundarias | Firmar · Sugerir IA (overflow) |
| Estados visibles | Borrador · IA degradada · chips paciente demo |
| Componentes actuales | `EpisClinicalTwoPaneLayout` · footer nav+acciones · `EpisClinicalSoapHints` · sin shell CICA |
| Problemas visuales | Mismo patrón pre-L-04 evolución · breadcrumb en footer · hints SOAP compiten con scrollspy |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Sin shell CICA dedicado (`epis2-cica-epicrisis-form`) |
| UX-MAJOR | `ClinicalPageNav` en footer lejos del flujo visual |
| UX-MINOR | SoapHints redundantes con scrollspy secciones alta |

---

## Fase B — Reducción de intención

```text
Intención única: escribir epicrisis / alta
Acción primaria única: Guardar (ClinicalLayoutActionBar arriba)
Ocultar: SoapHints · footer nav duplicado · tabs ficha
Retorno: breadcrumb Censo → Paciente → Epicrisis (arriba)
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL]                                          │
├────────────────────────────────────────────────────────────┤
│ Censo › Paciente › Epicrisis                                │
│ [Volver a ficha]  [Volver al censo]                         │
├────────────────────────────────────────────────────────────┤
│ Epicrisis / Alta                                            │
│ ┌─ Hospitalización ──────────────────────────────────────┐ │
│ │ Fecha alta · Resumen · Evolución                       │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌─ Alta ─────────────────────────────────────────────────┐ │
│ │ Medicamentos · Indicaciones · Seguimiento              │ │
│ └────────────────────────────────────────────────────────┘ │
│                  [Guardar]  [⋯ overflow]                    │
└────────────────────────────────────────────────────────────┘
```

Sin ficha tabulada embebida. Una primaria Guardar.

---

## Fase E — Cambios aplicados

- `isCicaDedicatedForm` + `epis2-cica-epicrisis-form` en `GeneratedClinicalFormPage`
- `resolveIntentFromBlueprint` — primaria Guardar para `discharge_summary`
- `ClinicalPageNav` arriba · acciones arriba · sin SoapHints · sin footer duplicado

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | app bar + breadcrumb |
| Retorno seguro | ✓ | nav ficha + censo |
| 1 acción primaria | ✓ | Guardar |
| Estado demo | ✓ | chips |
| ≤3 acciones visibles | ✓ | save + overflow |
| Sin overflow horizontal | ✓ | E2E |
| Sin ficha embebida | ✓ | sin classic-chart-tabs |

**Score:** 94/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece formulario de alta clásico claro y usable?
Humano: pendiente PR-AEST-05 signoff
```

---

## Próximo paso

```text
CICA-L-10 Modo papel — reports/cica-l/10-modo-papel.md
```
