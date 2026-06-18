# MF-LX-01 — Clinical Action Manifest derivado

**Fecha:** 2026-06-18 · **Rama:** `feat/mf-lx-01-clinical-action-manifest`  
**Programa:** PROG-EPIS2-LEXICON-CORE · **Gate:** `quality:clinical-action-manifest-gate`

---

## Alcance

Manifest clínico **derivado** del command-registry existente (invariante #9 — sin segundo registry).

| Entregable | Ruta |
|------------|------|
| Tipos + builder | `packages/command-registry/src/clinical-action-manifest.ts` |
| Mapa intent → CICA | `INTENT_CICA_SCREEN_IDS` |
| Flujo dorado | `GOLDEN_CICA_INTENTS` |
| Export público | `packages/command-registry/src/index.ts` |
| Tests | `clinical-action-manifest.test.ts` |
| Gate anti-drift | `scripts/quality/validate-clinical-action-manifest-gate.mjs` |

---

## Decisiones

- **No** `clinicalActions.manifest.ts` en raíz — gate lo prohíbe.
- `CLINICAL_ACTION_MANIFEST` se genera desde `EPIS2_COMMAND_DEFINITIONS` en load time.
- `aiRequired: false` para todas las acciones (IA-last MF-LX-06).
- `cicaScreenId` opcional; dashboard sin pantalla CICA.
- `formId` legacy del command-registry; enlace a blueprints vía `intentId` en tests.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `vitest` manifest tests | ✓ 6/6 |
| `quality:clinical-action-manifest-gate` | ✓ |

---

## Próximo paso

**MF-LX-02** — `@epis2/clinical-lexicon-es-cl` (extraer sinónimos ES-CL del manifest + colloquial rules).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
