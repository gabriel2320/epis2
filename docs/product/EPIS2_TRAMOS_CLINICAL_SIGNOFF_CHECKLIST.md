# EPIS2 — Checklist signoff clínico institucional (Tramos A–K)

**Versión:** 1.1 · **Fecha:** 2026-06-07  
**Alcance:** Preparación humana post-cierre técnico — **no sustituye** aprobación institucional.

---

## Precondiciones técnicas (automatizables)

```bash
npm run quality:tramos-signoff-prep-gate
npm run quality:tramos-run-ak-closure-gates
npm run quality:tramos-hygiene-gate
npm run quality:tramos-clinical-signoff-gate
npm run quality:golden-journey
npm run dev:ai
npm run ai:evals:tramo-k
npm run ai:evals:closure
```

E2E tramos (con stack web+api):

```bash
npm run test:e2e:tramo-k
```

---

## Checklist por tramo

| Tramo | Cierre técnico | Gate closure | Signoff clínico humano |
|-------|----------------|--------------|------------------------|
| A | ✅ | `quality:tramo-a-closure-gate` | [ ] |
| B | ✅ | `quality:tramo-b-closure-gate` | [ ] |
| C | ✅ | `quality:tramo-c-closure-gate` | [ ] |
| D | ✅ | `quality:tramo-d-closure-gate` | [ ] |
| E | ✅ | `quality:tramo-e-closure-gate` | [ ] |
| F | ✅ | `quality:tramo-f-closure-gate` | [ ] |
| G | ✅ | `quality:tramo-g-closure-gate` | [ ] |
| H | ✅ | `quality:tramo-h-closure-gate` | [ ] |
| I | ✅ | `quality:tramo-i-closure-gate` | [ ] |
| J | ✅ | `quality:tramo-j-closure-gate` | [ ] |
| K | ✅ | `quality:tramo-k-closure-gate` | [ ] |

---

## Criterios institucionales (humano)

1. Flujos demo revisados en Centro de Comando (home ≠ dashboard).
2. Borradores IA nunca auto-aprobados — `requiresHumanReview` verificado en UI.
3. Permisos negativos probados por rol clínico.
4. Golden journey extremo a extremo con datos sintéticos DEMO-005.
5. Acta de signoff archivada fuera del repo (institución).

---

## Tras signoff A–K

Piloto institucional hospitalario — ver [`EPIS2_TRAMOS_EXECUTION_MASTER.md`](./EPIS2_TRAMOS_EXECUTION_MASTER.md).

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
