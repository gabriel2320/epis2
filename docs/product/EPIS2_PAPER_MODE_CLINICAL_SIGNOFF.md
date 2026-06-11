# EPIS2 — Signoff clínico PROG-PAPER-MODE

**Programa:** PROG-PAPER-MODE · **Roadmap:** EPIS2-PM-03 · **Fecha:** 2026-06-11  
**Predecesor:** PROG-DUAL-CHART (cerrado)  
**Canon:** [EPIS2_DUAL_CHART_VISUAL_CANON.md](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md) §5

---

## Alcance cerrado (MF-PAPER-00…09)

| MF | Entrega | Gate |
|----|---------|------|
| 00 | Recon + gap | — |
| 01 | Tokens marfil + print CSS grilla 6mm | `paper-mode-tokens-gate` |
| 02 | Campos papel nativos | `paper-mode-fields-gate` |
| 03 | Metadatos IA + validación firma | `paper-mode-ai-meta-gate` |
| 04 | Navigator I–VII | `paper-mode-nav-gate` |
| 05 | Toolbar guardar/firmar/PDF | `paper-mode-toolbar-gate` |
| 06 | Paginación N/M | `paper-mode-pagination-gate` |
| 07 | Puente A5/Carta | `paper-mode-doc-bridge-gate` |
| 08 | Comandos IA paper | `paper-mode-ai-commands-gate` |
| 09 | Auditoría visual + signoff | `paper-mode-signoff-gate` |

---

## Criterios clínicos verificados

1. **Documento institucional** — hoja Carta noble; A5 solo auxiliar (receta, lab, certificado).
2. **SoT PostgreSQL** — `paper_chart` JSONB; borrador → humano → firma; IA no firma.
3. **IA fuera del área imprimible** — Ctrl+K + panel contexto; borradores `ai_draft` confirmables.
4. **Impresión limpia** — `@media print` oculta shell; footer N/M dinámico.
5. **Puente documental** — receta, epicrisis, lab, certificado, imagen desde ficha papel.
6. **Comandos contextuales** — 6 intents paper en command-registry.
7. **Auditoría visual** — `PaperVisualAudit` score ≥ 0.92.

---

## Riesgos residuales

- **C-4** — flag dual ficha en staging/prod operador pendiente.
- **Motor espejo** classic↔paper — PROG-PAPER-MIRROR post signoff (ADR-004 propuesto).
- **Capturas humanas** — complementar E2E con signoff visual en demo.

---

## Aprobación

| Rol | Estado | Fecha |
|-----|--------|-------|
| Producto / arquitectura | Signoff técnico MF-PAPER-09 | 2026-06-11 |

---

*El papel es el lenguaje del modo paper; no reemplaza la ficha electrónica.*
