# CICA-L — 10 Modo papel

**ID:** CICA-L-10 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-06

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha/papel?patientId=&chartMode=paper` |
| Intención clínica | Leer ficha clínica en formato papel / navegar por día |
| Usuario principal | Médico demo |
| Acción primaria | Navegación día (anterior · hoy · siguiente) — lectura |
| Acciones secundarias | Volver a ficha · Volver al censo |
| Estados visibles | Documento papel · demo badge · barra comando |
| Componentes actuales | `StandalonePaperChartPage` · `PaperChartMode` · `PaperDayNavBar` · back duplicado |
| Problemas visuales | Back en toolbar + sin `ClinicalPageNav` CICA · sin `data-cica-composition` |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Retorno duplicado (toolbar back + sin nav CICA estándar) |
| UX-MINOR | Falta marcador composición CICA clásica |
| UX-MINOR | Breadcrumb sin botones retorno Ley 5 |

---

## Fase B — Reducción de intención

```text
Intención única: leer ficha papel del día
Acción primaria única: navegación temporal (día)
Ocultar: action bar clínica · tabs ficha
Retorno: ClinicalPageNav — ficha clásica + censo
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ Censo › Paciente › Ficha clínica — modo papel               │
│ [Volver a ficha]  [Volver al censo]                         │
│ [Barra comando NL]                                          │
├────────────────────────────────────────────────────────────┤
│ Ficha clínica — modo papel                                  │
│ [← Día anterior]  [Hoy]  [Día siguiente →]        [Demo]   │
├────────────────────────────────────────────────────────────┤
│ ┌─ Documento papel ──────────────────────────────────────┐ │
│ │ Carátula · Evolución · Indicaciones · …                │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

Sin tabs ficha. Sin action bar clínica. `data-cica-composition="classic"`.

---

## Fase E — Cambios aplicados

- `data-cica-composition="classic"` en `epis2-paper-standalone-page`
- `ClinicalPageNav` reemplaza breadcrumb suelto + elimina back duplicado en `PaperDayNavBar`
- Barra comando transversal conservada

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | strip papel |
| Retorno seguro | ✓ | ClinicalPageNav |
| 1 intención | ✓ | lectura día |
| Estado demo | ✓ | badge |
| Sin tabs ficha | ✓ | standalone |
| Sin overflow horizontal | ✓ | E2E |
| Composición CICA | ✓ | data attribute |

**Score:** 95/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha papel clásica legible con retorno claro?
Humano: pendiente PR-AEST-06 signoff
```

---

## Próximo paso

```text
CICA-L-11 Auditoría — reports/cica-l/11-auditoria.md ✓
Cierre loop CICA-L — PR-AEST-07
```
