# EPIS2 — Guía para agentes (Cursor)

> Los errores de EPIS no son recuerdos: son gates de EPIS2.

## Antes de modificar código

1. Leer `docs/PRODUCT_CANON.md` y `docs/product/PRODUCT_INVARIANTS.md`.
2. Leer `docs/legacy/EPIS_POSTMORTEM.md` si tocas integración o migración.
3. **Declarar alcance** (fase, archivos permitidos/prohibidos).
4. No importar desde `../Epis` sin entrada en `legacy-import-manifest.json`.

## Gates obligatorios al cerrar

```bash
npm run check
npm run test
npm run db:validate
```

Reporte en `reports/` con decisiones, riesgos y próximo paso exacto.

## Detenerse si

- `architecture:validate` falla.
- La tarea contradice invariantes o allowlist.
- Se pide segundo Command/Form Registry «temporal».
- Aparece OpenMRS, Carbon o dashboard como home.

## Fases

```text
EPIS2-00 ✓  EPIS2-01 ✓  gobierno EPIS ✓  EPIS2-02 ✓
EPIS2-03     (auth + RBAC API)
```

## Memoria legacy

| Documento | Uso |
|-----------|-----|
| `docs/legacy/EPIS_POSTMORTEM.md` | Errores → gates |
| `docs/legacy/EPIS_REJECTED_PATTERNS.md` | Patrones prohibidos |
| `docs/legacy/EPIS_DONOR_ALLOWLIST.md` | Qué puede portarse |
| `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` | Gate producto final |

## Prohibido

OpenMRS, O3, Carbon, overlays EPIS, dashboard home, auto-aprobación, PHI real, carpetas completas desde EPIS.
