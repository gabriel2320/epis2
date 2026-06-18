# MF-LX-04 — Diccionario laboratorio CL demo

**Fecha:** 2026-06-18 · **Rama:** `feat/mf-lx-01-clinical-action-manifest`  
**Programa:** PROG-EPIS2-LEXICON-CORE · **Gate:** `quality:lab-dictionary-gate`

---

## Alcance

Paquete **`@epis2/lab-dictionary`** — 25 exámenes demo con rangos referenciales y umbrales críticos.

| Entregable | Ruta |
|------------|------|
| Seed ES-CL | `labSeedEsCl.ts` |
| Búsqueda | `searchLabsEsCl()` |
| Críticos | `assessLabValue()` |
| Parser token | `parseLabToken('K 6.4')` |
| Gate | `validate-lab-dictionary-gate.mjs` |

Exámenes obligatorios: **K, Na, Hb, PCR** + hemograma, renal, hepático, coagulación, gasometría.

---

## API

```typescript
import { assessLabValue, parseLabToken, searchLabsEsCl } from '@epis2/lab-dictionary';

parseLabToken('K 6.4');
// { id: 'potasio', value: 6.4 }

assessLabValue('potasio', 6.4);
// flag: 'critical_high'
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| vitest | ✓ 6/6 |
| `quality:lab-dictionary-gate` | ✓ |

---

## Próximo paso

**MF-LX-05** — `@epis2/clinical-rules` (5 reglas blocking demo: alergia, K crítico, receta sin dosis, etc.).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
