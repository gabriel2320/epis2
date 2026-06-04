# EPIS2 — Aprendizaje de EPIS (capa de gobierno)

**ID:** epis2-learning-from-epis-foundation  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Objetivo

Convertir los errores de EPIS en **reglas ejecutables** (documentos, Cursor rules, validadores, journey dorado) sin implementar funciones clínicas nuevas.

---

## Errores EPIS → reglas EPIS2

| Error EPIS | Regla / gate |
|------------|--------------|
| OpenMRS/O3 condicionaron la UI | `no-legacy-dependencies` · allowlist |
| Carbon + Soft Carbon + MUI | Rechazo en patrones + MUI único |
| Home → dashboard | `command-center-home` |
| Múltiples registries | `single-command-registry` · `single-form-registry` |
| Doc ≠ código ≠ runtime | `ANTI_DRIFT_GATES` · reportes por fase |
| Microfases paralelas | Una fase/sesión · main canónico |
| Información no solicitada visible | Command-first canon |
| IA/infra en superficie | `ai-write-boundary` |
| Permisos wildcard | `explicit-permissions` |
| CI sin producto demostrable | `GOLDEN_CLINICAL_JOURNEY` |
| Copia masiva desde EPIS | `legacy-import-manifest.json` |

---

## Documentos creados

| Ruta |
|------|
| `docs/legacy/EPIS_POSTMORTEM.md` |
| `docs/legacy/EPIS_REJECTED_PATTERNS.md` |
| `docs/legacy/EPIS_DONOR_ALLOWLIST.md` |
| `docs/legacy/LEGACY_IMPORT_LEDGER.md` |
| `docs/quality/ANTI_DRIFT_GATES.md` |
| `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` |
| `docs/product/PRODUCT_INVARIANTS.md` |
| `legacy-import-manifest.json` |

---

## Validadores arquitectónicos

| Script |
|--------|
| `scripts/architecture/no-legacy-dependencies.mjs` |
| `scripts/architecture/single-command-registry.mjs` |
| `scripts/architecture/single-form-registry.mjs` |
| `scripts/architecture/command-center-home.mjs` |
| `scripts/architecture/spanish-visible-copy.mjs` |
| `scripts/architecture/explicit-permissions.mjs` |
| `scripts/architecture/ai-write-boundary.mjs` |
| `scripts/architecture/human-approval-required.mjs` |
| `scripts/architecture/main-product-invariants.mjs` |
| `scripts/architecture/validate-all.mjs` |

Ejecución: `npm run architecture:validate` (incluido en `npm run check`).

---

## Reglas Cursor

| Regla |
|-------|
| `00-product-canon.mdc` |
| `10-legacy-boundary.mdc` |
| `20-command-first.mdc` |
| `30-clinical-safety.mdc` |
| `40-single-source-of-truth.mdc` |
| `50-material-ui.mdc` |
| `60-ai-boundary.mdc` |
| `70-quality-gates.mdc` |
| `AGENTS.md` (actualizado) |

---

## Patrones prohibidos (resumen)

`@openmrs`, `openmrs-esm`, O3, `@carbon`, Soft Carbon, `/home/epis-clinical-panel`, dashboard como home, segundo registry, wildcards de permisos, IA escribiendo clínica final, import EPIS sin manifiesto.

---

## Estrategia donante

- EPIS = `LEGACY_REFERENCE` únicamente.
- Allowlist en `EPIS_DONOR_ALLOWLIST.md`.
- Manifiesto obligatorio: `legacy-import-manifest.json` (vacío hasta primer import).
- Ledger humano: `LEGACY_IMPORT_LEDGER.md`.

---

## Journey dorado

- Especificación: `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`
- Esqueleto: `tests/golden-clinical-journey.spec.ts` (`describe.skip` E2E hasta EPIS2-11)
- Comando: `npm run quality:golden-journey`

---

## Gates integrados

```json
"architecture:validate": "node scripts/architecture/validate-all.mjs",
"quality:golden-journey": "vitest run tests/golden-clinical-journey.spec.ts",
"check": "lint + typecheck + architecture:validate"
```

---

## Riesgos pendientes

| Riesgo | Mitigación |
|--------|------------|
| Validadores con falsos positivos al crecer el repo | Ajustar allowlists en scripts con PR documentado |
| Journey solo esqueleto | Habilitar E2E en EPIS2-11 |
| Bypass del manifiesto en PRs grandes | Revisión obligatoria + `10-legacy-boundary` |
| Menciones educativas de OpenMRS fuera de `docs/legacy/` | Mantener `docs/LEGACY_DONOR_MAP.md` como referencia histórica |

---

## Próximos pasos (sin ejecutar aquí)

1. **EPIS2-02** — shell MUI; validar `command-center-home` con rutas reales.
2. Al primer import EPIS — llenar `legacy-import-manifest.json` + ledger.
3. EPIS2-11 — des-skip journey dorado E2E.

---

## Criterios de aceptación

| # | Criterio | ✓ |
|---|----------|---|
| 1 | Postmortem EPIS | ✓ |
| 2 | Patrones rechazados | ✓ |
| 3 | Allowlist migración | ✓ |
| 4 | Reglas Cursor permanentes | ✓ |
| 5 | Validadores arquitectónicos | ✓ |
| 6 | Bloqueo OpenMRS/O3/Carbon accidental | ✓ |
| 7 | Bloqueo segundo registry | ✓ |
| 8 | Detección permisos ambiguos | ✓ |
| 9 | IA separada de escrituras finales | ✓ |
| 10 | Journey dorado especificado + esqueleto | ✓ |
| 11 | Español en docs/gates | ✓ |
| 12 | Sin funciones clínicas nuevas | ✓ |
| 13 | Sin copia carpetas EPIS | ✓ |
| 14 | No avanzó a otra fase clínica | ✓ |

---

## Commit sugerido

```text
chore(epis2): governance layer — learn from EPIS via executable gates

Add legacy memory docs, architecture validators, legacy import manifest,
golden journey skeleton, Cursor rules, and integrate architecture:validate into check.
```
