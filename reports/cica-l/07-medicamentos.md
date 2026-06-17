# CICA-L — 07 Medicamentos / tab Más

**ID:** CICA-L-07 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-05

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?chartMode=traditional` · tab **Más** → `navMeds` |
| Intención clínica | Revisar medicación activa del paciente |
| Usuario principal | Médico demo |
| Acción primaria | **Medicamentos** → `/espacio/receta` |
| Acciones secundarias | Modo papel |
| Estados visibles | Grid MAR demo · zonas active/prn/suspended |
| Componentes actuales | `TraditionalMedsSection` · 3 zonas meds · mirror strip · primaria evolución fija |
| Problemas visuales | PRN/suspendidas en tab Más saturan · >5 filas · primaria incorrecta |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Primaria «Evolución» en tab Más (resuelto resolveCicaTabLayoutActions) |
| UX-MAJOR | Tres zonas MAR (active/prn/suspended) compiten en lectura rápida |
| UX-MINOR | Mirror strip navMeds |
| UX-MINOR | Sin empty state |

---

## Fase B — Reducción de intención

```text
Intención única: leer medicación activa
Acción primaria única: Receta / Medicamentos
Ocultar: zonas PRN y suspendida · mirror strip · >5 filas
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL]                                          │
├────────────────────────────────────────────────────────────┤
│ Resumen | Evoluciones | Indicaciones | Exámenes | Docs | Más│
├────────────────────────────────────────────────────────────┤
│ ┌─ Medicamento ─────── Detalle ───────── Zona ─────────────┐ │
│ │ Metformina           850 mg c/12h      Activa            │ │
│ │ Enalapril            10 mg c/24h       Activa            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                  [Medicamentos]  [Modo papel]               │
└────────────────────────────────────────────────────────────┘
```

Solo **meds activas**. Máx. **5 filas**.

---

## Fase E — Cambios aplicados

- `TraditionalMedsSection` · `compositionMode: 'cica-classic'` · solo zona activa · cap 5
- `data-cica-composition="classic"` · empty state
- Primaria tab Más: `resolveCicaTabLayoutActions('more')` → Medicamentos/receta

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | shell |
| Retorno seguro | ✓ | tabs |
| 1 acción primaria | ✓ | Medicamentos |
| Estado demo | ✓ | chips |
| ≤3 acciones visibles | ✓ | meds + paper |
| Sin overflow horizontal | ✓ | E2E |
| ≤5 filas | ✓ | cap meds |

**Score:** 94/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha médica clásica clara y usable?
Humano: pendiente PR-AEST-05 signoff
```

---

## Próximo paso

```text
CICA-L-07 cerrado — ver reports/cica-l/08-documentos.md (activo)
```
