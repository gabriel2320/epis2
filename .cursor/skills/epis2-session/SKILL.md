---
name: epis2-session
description: >-
  Arranque de sesión EPIS2 (SDEPIS2): dev:session, tablero, microfase READY,
  declarar alcance antes de codear. Usar al empezar trabajo en el repo EPIS2.
---

# EPIS2 — Arranque de sesión

## Arranque obligatorio

1. Ejecutar `npm run dev:velocity` (o `npm run quality:microphase-next` + `npm run dev:session`).
2. Leer en contexto:
   - `@reports/dev-agent-brief.md`
   - `@docs/product/EPIS2_TABLERO.md`
   - `@docs/product/PRODUCT_INVARIANTS.md` si tocas clínica o datos
4. **Declarar alcance** en la respuesta:
   - Nivel SDEPIS2 (Ola / Hilo / Tramo / Microfase MF-*)
   - Archivos permitidos y prohibidos
   - Gates de cierre previstos

## Invariantes rápidos

- Home = **Centro de Comando** (nunca dashboard).
- PostgreSQL = SoT; borradores ≠ aprobados; IA no firma.
- Sin import desde `../Epis` sin `legacy-import-manifest.json`.

## Stack local (si aplica)

```bash
npm run stack:dev
npm run dev:ai   # solo si la tarea toca assist clínico
```

Guía completa: `docs/product/EPIS2_AI_ASSISTED_DEV.md`
