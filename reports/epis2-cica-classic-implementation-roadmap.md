# EPIS2 — Roadmap implementación CICA ficha clásica

**Fecha:** 2026-06-17 · **Estado producto:** CICA NO-GO · **Home activo:** `/espacio/*`

**Documentación maestra:**

- Árbol completo: [`docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md`](../docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md)
- Layout tradicional: [`docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md`](../docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md)
- Wireframe P0 censo: [`reports/cica-l/01-censo-reform.md`](cica-l/01-censo-reform.md)

---

## Resumen ejecutivo

Construir la ficha clásica completa **sin big-bang**: una pantalla por CICA-L, layout tradicional (header · sidebar · pie · grilla 12), tres centros (longitudinal · episodio · carta).

**No activar** `VITE_ENABLE_CICA_UI` por defecto hasta P0 GO.

---

## Fases

| Fase | Alcance | MFs | Gate |
|------|---------|-----|------|
| **R0** | Guardrails NO-GO · legacy home | hecho | `quality:fast` |
| **P0** | Núcleo golden journey (11 pantallas) | CICA-L-01…11 reform | `quality:golden-journey` |
| **P1** | Hospital + mi-trabajo real | +12 rutas plan | `quality:clinical` |
| **P2** | Ambulatorio + papel extendido | namespace ambulatorio | idem |
| **P3** | Admin · cirugía · integraciones | fuera demo | signoff |

---

## P0 — orden de implementación

| Orden | Pantalla | Wireframe | Registry | UI |
|-------|----------|-----------|----------|-----|
| 1 | Censo + Buscar | `01-censo-reform.md` | ✓ | reformular |
| 2 | Resumen | `02-resumen-reform.md` | ✓ | reformular |
| 3 | Evoluciones lista | L-03 | ✓ | ajustar grid |
| 4 | Nueva evolución carta | L-04 | ✓ | LetterPageShell |
| 5 | Indicaciones | L-05 | ✓ | grid |
| 6 | Exámenes | L-06 | ✓ | grid |
| 7 | Medicamentos | L-07 | ✓ | stub→real |
| 8 | Documentos | L-08 | ✓ | grid |
| 9 | Papel día | L-10 | ✓ | pod toolbar |
| 10 | Auditoría | L-11 | ✓ | stub→real |
| 11 | Libro evoluciones | L-03 | ✓ | pager |

Cada fila = **1 PR** · score ≥ 90 · sin mezclar pantallas.

---

## Sidebar — cambio planificado (MF-CICA-NAV-01)

Reorganizar `cicaSidebarNav.ts` según árbol §3 del master tree:

- L1: Buscar · Censo · Agenda · Mi trabajo · Recientes
- L2 visible: Resumen · Evoluciones · Indicaciones · Exámenes · Medicamentos · Documentos · Papel
- Overflow «Más»: Ingreso · Enfermería · Interconsultas · Procedimientos · Cirugía · UCI · Alta · Timeline · Auditoría

---

## Rutas — migración v1 → v2 (P1, no P0)

Mantener rutas planas actuales en P0. Introducir `/hospitalizacion/*` con redirects en P1:

```text
…/evoluciones  →  …/hospitalizacion/evoluciones  (301)
```

Una MF por grupo de redirects · actualizar registry + gates.

---

## IA — qué mantener vs podar

| Mantener (producto) | Lab / no clínico |
|---------------------|------------------|
| `clinicalTextBoxAssist` | `design-agents/*` |
| `useGeneratedFormAiAssist` | Ollama critics UI |
| `useAiStatusQuery` / chip degradado | Dashboard design agents |

---

## Checklist activación CICA home

- [ ] P0 completo con score ≥ 90 cada pantalla
- [ ] Golden journey `/app/*` verde
- [ ] Walkthrough institucional GO
- [ ] Cambiar `cicaUiEnv` default ON + `CICA_UI_PRODUCT_STATUS = 'go'`
- [ ] Actualizar `EPIS2_CLINICAL_HOME`

---

## Referencia rápida agente

```text
Antes de codear pantalla CICA:
1. Leer EPIS2_CICA_CLASSIC_MASTER_TREE.md (sección pantalla)
2. Completar wireframe en reports/cica-l/
3. Declarar MF · allowlist · gate
4. ClinicalScreen + grilla 12 · 1 primaria
5. auditCicaScreen() · quality:clinical
```
