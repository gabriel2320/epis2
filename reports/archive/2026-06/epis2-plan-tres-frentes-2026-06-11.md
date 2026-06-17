# EPIS2 — Reorden plan desarrollo: tres frentes

**Fecha:** 2026-06-11  
**Decisión:** Experiencia visual + comando inteligente + IA integrada **antes** de fortalecimiento técnico, Chile backlog e interop.

---

## Documentos creados/actualizados

| Artefacto | Rol |
|-----------|-----|
| [`docs/product/EPIS2_TRES_FRENTES_DEV_PLAN.md`](../docs/product/EPIS2_TRES_FRENTES_DEV_PLAN.md) | Plan canónico |
| [`docs/quality/tres-frentes-ledger.json`](../docs/quality/tres-frentes-ledger.json) | 24 MF + signoff global |
| [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) | Tablero reordenado |
| `npm run quality:tres-frentes-next` | Consulta READY por frente |

---

## Tres frentes — brecha principal

### A · Papel (8 MF)

Scaffold completo (MF-PAPER-01…09). Falta: planner mensual/print, paginación real, secciones VIII–XIV, mirror SoT, signoff visual.

### B · Ficha electrónica (8 MF)

Nav **17 secciones** pero **solo resumen** tiene contenido; 16 muestran placeholder. Falta: poblar secciones por olas, C-4 staging, tema clinical-calm, supporting pane, signoff.

### C · Barra comando + IA (8 MF)

Barra NL existe en ficha; Ctrl+K es lista estática (no NL libre). Falta: unificar superficies, integrar assist-route/Ollama, contexto sección/modo, panel IA útil, assist borrador desde barra.

---

## Ola 1 — empezar aquí (3 MF READY)

| Frente | MF | Sesión sugerida |
|--------|-----|-----------------|
| A | **MF-PA-01** | Planner mensual + markers |
| B | **MF-TE-01** | Activar dual chart staging (C-4) |
| C | **MF-CM-01** | Barra NL unificada censo+ficha+papel |

Una sesión = un frente.

---

## Pausado

- PROG-STRENGTHEN-2026
- PROG-CHILE registro/RNPI
- PROG-MEDIA-FUTURE (voz/OCR)
- PROG-AUTO-DEV-6H

**Desbloqueo:** `SIGNOFF-EXPERIENCIA-CORE` (MF-PA-08 + MF-TE-08 + MF-CM-08).

---

## Comando arranque

```bash
npm run quality:tres-frentes-next
```
