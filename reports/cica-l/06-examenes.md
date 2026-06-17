# CICA-L — 06 Ficha clásica / Exámenes

**ID:** CICA-L-06 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-04

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?chartMode=traditional` · tab Exámenes |
| Intención clínica | Revisar resultados de laboratorio / exámenes clave |
| Usuario principal | Médico demo |
| Acción primaria | **Laboratorio** → `/espacio/resultados` |
| Acciones secundarias | Modo papel |
| Estados visibles | Tabla labs demo o highlights longitudinal |
| Componentes actuales | `TraditionalLabsSection` · subnav Imagenología · mirror strip · primaria fija evolución |
| Problemas visuales | Subnav labs+imagen mezcla intención · >5 filas · sin empty state · primaria incorrecta fuera de tab |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Subnav Imagenología compite con tab Exámenes (solo labs en CICA) |
| UX-MAJOR | Primaria «Evolución» en tab Exámenes (resuelto vía resolveCicaTabLayoutActions) |
| UX-MINOR | Mirror strip en navLabs |
| UX-MINOR | Sin mensaje vacío si no hay labs |

---

## Fase B — Reducción de intención

```text
Intención única: leer resultados de laboratorio
Acción primaria única: Laboratorio / bandeja resultados
Ocultar: subnav imagenología · mirror strip · >5 filas
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
│ (sin subnav — solo laboratorio)                             │
│ ┌─ Examen ──────────── Resultado · fecha ─────────────────┐ │
│ │ Hemoglobina          12.1 g/dL · 10/06/2026             │ │
│ │ Creatinina           1.0 mg/dL · 10/06/2026             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                    [Laboratorio]  [Modo papel]              │
└────────────────────────────────────────────────────────────┘
```

Máximo **5 filas** de labs. Imagenología en fase posterior / comando.

---

## Fase E — Cambios aplicados

- `TraditionalLabsSection` · `compositionMode: 'cica-classic'` · max 5 filas · empty state
- `data-cica-composition="classic"` en sección labs
- Subnav imagen oculto (CICA_CLASSIC_TAB_PRIMARY_SECTION exams → navLabs)
- Primaria tab: `resolveCicaTabLayoutActions('exams')` → Laboratorio

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | shell |
| Retorno seguro | ✓ | tabs + shell |
| 1 acción primaria | ✓ | Laboratorio |
| Estado demo | ✓ | chips |
| ≤3 acciones visibles | ✓ | labs + paper |
| Sin overflow horizontal | ✓ | E2E |
| ≤5 bloques/filas | ✓ | cap labs |

**Score:** 94/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha médica clásica clara y usable?
Humano: pendiente PR-AEST-04 signoff
```

---

## Próximo paso

```text
CICA-L-06 cerrado — ver reports/cica-l/07-medicamentos.md (activo)
```
