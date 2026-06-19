# MF-LX-03 — Diccionario farmacológico CL demo

**Fecha:** 2026-06-18 · **Rama:** `feat/mf-lx-01-clinical-action-manifest`  
**Programa:** PROG-EPIS2-LEXICON-CORE · **Gate:** `quality:drug-dictionary-cl-gate`

---

## Alcance

Paquete **`@epis2/drug-dictionary-cl`** — 70 fármacos demo hospitalario/ambulatorio (sintético, no vademécum).

| Entregable | Ruta |
|------------|------|
| Seed ES-CL | `drugSeedEsCl.ts` |
| Búsqueda prefix | `searchDrugsEsCl()` |
| Invariantes | `assertDrugDictionaryClInvariants()` |
| Gate | `validate-drug-dictionary-cl-gate.mjs` |

**Nota:** `services/drug-intel` sigue como lab/staging; este paquete es **core determinista** para autocomplete y futuras reglas (MF-LX-05).

---

## API

```typescript
import { searchDrugsEsCl, getDrugById } from '@epis2/drug-dictionary-cl';

searchDrugsEsCl('cef');
// ceftriaxona, cefazolina, cefalexina…

getDrugById('ceftriaxona')?.usualOrders[0];
// "ceftriaxona 1 g EV cada 24 h"
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| vitest | ✓ 5/5 |
| `quality:drug-dictionary-cl-gate` | ✓ (70 entradas) |

---

## Próximo paso

**MF-LX-04** — `lab-dictionary` mínimo (K, Na, Hb, PCR + umbrales críticos).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
