# ADR-004 — Motor espejo clínico + PDF Bridge (PROPUESTO)

**Estado:** Propuesto · **Fecha:** 2026-06-11  
**Decisores:** pendiente producto + arquitectura  
**Prerequisito:** PROG-PAPER-MODE MF-PAPER-09 DONE · Entrega C-4  
**Conciliación:** [EPIS2_PAPER_MIRROR_RECONCILIATION.md](../product/EPIS2_PAPER_MIRROR_RECONCILIATION.md)

---

## Contexto

Tras PROG-DUAL-CHART y PROG-PAPER-MODE, EPIS2 tiene dos modos de ficha (`traditional`, `paper`) con SoT parcialmente alineado (`paper_chart` 7 secciones). El prompt «Paper Clinical OS» pide un **motor espejo**: mismo contrato clínico, dos renderizadores, sincronización auditada, PDF como plantilla/salida — **sin** duplicar sistemas.

---

## Decisión propuesta

Adoptar **PROG-PAPER-MIRROR** como programa posterior a signoff papel, con:

1. **ClinicalFieldBinding** en `packages/clinical-forms` (único registry, invariante #10).
2. **ClinicalMirrorEvent** append-only; resolución conflictos por `fieldVersion`.
3. **PdfBridge** extendiendo `documentIntake` — AcroForm first; flat PDF overlay second; XFA no canónico.
4. **PaperExpansion** manual P0→P3 (no generador automático de rutas).
5. **PaperQualityGate** score ≥0.92 (≥0.97 P0) en MF-PAPER-09 ampliado.

---

## Rechazos explícitos

| Propuesta externa | Veredicto |
|-------------------|-----------|
| `apps/web/src/paper-mode/` raíz | Rechazado |
| `PaperCommandAgent` lateral | Rechazado — Ctrl+K + panel |
| PDF como SoT | Rechazado |
| XFA canónico | Rechazado |
| Editor rico (Tiptap) sin ADR seguridad | Diferido |

---

## Consecuencias

### Positivas

- Edición clásica reflejada en documento imprimible sin re-escribir.
- Formularios PDF institucionales reutilizables como plantillas.
- Crecimiento controlado a módulos P0 clínicos.

### Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Scope mirror antes de paginación PM-06 | Secuencia ledger |
| Binding fino prematuro | MVP 7 secciones coarse-grained primero |
| pdf-lib en API sin gate | MF-MIRROR-PDF-01 isolated |

---

## Plan de microfases (borrador)

| ID | Entrega | Depende |
|----|---------|---------|
| MF-MIRROR-00 | ADR aceptado + tipos binding scaffold | PM-09 |
| MF-MIRROR-01 | `applyMirrorEvent` paper ↔ draft types | MIRROR-00 |
| MF-MIRROR-02 | Split debug view (dev flag) | MIRROR-01 |
| MF-MIRROR-PDF-01 | AcroForm inspect + profile store | PM-09 |
| MF-MIRROR-PDF-02 | Flat PDF overlay editor | PDF-01 |
| MF-MIRROR-03 | PaperQualityGate + mirror sync tests | PM-09 |

---

## Aprobación pendiente

- [ ] Signoff PROG-PAPER-MODE
- [ ] Producto confirma P0 lista expansión
- [ ] Security review PDF upload/fill
- [ ] `architecture:validate` allowlist mirror paths

**Frase guía:** *Un contrato clínico, dos renderizadores; PostgreSQL decide, el papel impresiona.*
