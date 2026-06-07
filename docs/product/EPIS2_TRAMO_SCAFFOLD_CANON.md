# EPIS2 — Canon scaffold tramos (Semana 2)

**Versión:** 1.0 · **Fecha:** 2026-06-07

---

## Fórmula obligatoria

```text
1 IDC = 1 panel UI = 1 data-testid = 1 MF-TRAMO-X-00N
```

| Artefacto | Convención | Ejemplo Tramo J |
|-----------|------------|-----------------|
| IDC | Número en matriz + chip | `161` |
| Panel UI | `*DashboardTab` Paper | `epis2-pharmacy-ysite` |
| Chip IDC | `epis2-{tab}-idc-{N}` | `epis2-pharmacy-idc-161` |
| MF matriz | `MF-TRAMO-J-002` … `J-011` | `nota: 'Y-Site demo MF-TRAMO-J-002'` |
| Gate primer IDC | `validate-tramo-j-pharmacy-gate.mjs` | IDC 161 + API + E2E |
| Gate resto | `validate-tramo-j-scaffold-gate.mjs` | 162–170 + MF tags |
| E2E | `e2e/tramo-j-pharmacy.spec.ts` | primer IDC + scaffold |
| npm E2E | `test:e2e:tramo-j` | Playwright |

---

## Registro E2E por tramo (B–J)

| Tramo | Spec | npm script |
|-------|------|------------|
| B | `e2e/tramo-b-reception.spec.ts` | `test:e2e:tramo-b` |
| C | `e2e/tramo-c-emergency.spec.ts` | `test:e2e:tramo-c` |
| D | `e2e/tramo-d-icu.spec.ts` | `test:e2e:tramo-d` |
| E | `e2e/tramo-e-or.spec.ts` | `test:e2e:tramo-e` |
| F | `e2e/tramo-f-aps.spec.ts` | `test:e2e:tramo-f` |
| G | `e2e/tramo-g-icu.spec.ts` | `test:e2e:tramo-g` |
| H | `e2e/tramo-h-iaas.spec.ts` | `test:e2e:tramo-h` |
| I | `e2e/tramo-i-specialty.spec.ts` | `test:e2e:tramo-i` |
| J | `e2e/tramo-j-pharmacy.spec.ts` | `test:e2e:tramo-j` |
| K | `e2e/tramo-k-quality.spec.ts` | `test:e2e:tramo-k` |

Tramo C adicional: `tramo-c-admission`, `tramo-c-mar`, `tramo-c-trends`.

---

## Bucle acelerado (post-scaffold)

```bash
npm run stack:dev
npm run quality:tramo-scaffold-canon-gate
npm run quality:tramo-e2e-registry-gate
npm run test:e2e:tramo-j   # último tramo cerrado
npm run quality:week2-gate
```

Cursor: regla `.cursor/rules/80-tramo-scaffold.mdc`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
