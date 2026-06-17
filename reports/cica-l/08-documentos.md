# CICA-L — 08 Ficha clásica / Documentos

**ID:** CICA-L-08 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-05

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?chartMode=traditional` · tab Documentos |
| Intención clínica | Revisar documentos clínicos indexados del paciente |
| Usuario principal | Médico demo |
| Acción primaria | **Documentos** → `/espacio/epicrisis` (demo alta/epicrisis) |
| Acciones secundarias | Modo papel |
| Estados visibles | Tabla demo consentimientos/informes |
| Componentes actuales | `TraditionalDemoSection` genérico · subnav 5 secciones · sin primaria contextual |
| Problemas visuales | Consultas/epicrisis/procedimientos en subnav · sin cap filas · primaria evolución |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | Subnav 5 secciones documentales satura tab |
| UX-MAJOR | Sin acción primaria «Documentos» en tab |
| UX-MINOR | Demo section genérica sin empty state CICA |

---

## Fase B — Reducción de intención

```text
Intención única: leer documentos indexados
Acción primaria única: Documentos / epicrisis demo
Ocultar: subnav consultas · epicrisis · procedimientos · auditoría (fases posteriores)
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL]                                          │
├────────────────────────────────────────────────────────────┤
│ Resumen | … | Documentos | Más                              │
├────────────────────────────────────────────────────────────┤
│ ┌─ Documento ────────── Detalle ──────────────────────────┐ │
│ │ Consentimiento        Firmado — demo (demo)             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                  [Documentos]  [Modo papel]                 │
└────────────────────────────────────────────────────────────┘
```

Máx. **5 filas**. Solo `navDocuments`.

---

## Fase E — Cambios aplicados

- `TraditionalDocumentsSection` · CICA cap 5 · empty state · `data-cica-composition`
- `resolveCicaTabLayoutActions('documents')` · primaria Documentos
- `onOpenDocuments` → epicrisis demo en DualChartPatientPage

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | shell |
| Retorno seguro | ✓ | tabs |
| 1 acción primaria | ✓ | Documentos |
| Estado demo | ✓ | chips |
| ≤3 acciones visibles | ✓ | docs + paper |
| Sin overflow horizontal | ✓ | E2E |
| ≤5 filas | ✓ | cap |

**Score:** 93/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece ficha médica clásica clara y usable?
Humano: pendiente PR-AEST-05 signoff
```

---

## Próximo paso

```text
CICA-L-09 Alta / epicrisis — reports/cica-l/09-alta.md ✓
CICA-L-10 Modo papel — reports/cica-l/10-modo-papel.md
```
