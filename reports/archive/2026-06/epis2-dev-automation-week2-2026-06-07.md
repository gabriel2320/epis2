# EPIS2 — Semana 2 bucle tramo acelerado

**Fecha:** 2026-06-07 · **Tramo referencia:** J (farmacia 161–170)

---

## Entregables

| Item | Evidencia |
|------|-----------|
| Canon scaffold | `docs/product/EPIS2_TRAMO_SCAFFOLD_CANON.md` |
| Regla Cursor | `.cursor/rules/80-tramo-scaffold.mdc` |
| Gate canon | `quality:tramo-scaffold-canon-gate` |
| Gate E2E B–J | `quality:tramo-e2e-registry-gate` |
| E2E último tramo | `npm run test:e2e:tramo-j` |

---

## Fórmula

```text
1 IDC = 1 panel UI = 1 data-testid = 1 MF-TRAMO-X-00N
```

---

## Gates

```bash
npm run quality:tramo-scaffold-canon-gate
npm run quality:tramo-e2e-registry-gate
npm run quality:week2-gate
npm run test:e2e:tramo-j
```

Opcional en local-ci: `EPIS2_LOCAL_CI_TRAMO_E2E=1` → ejecuta E2E tramo J.

---

## Próximo paso — Semana 3

Evals Ollama por blueprint del tramo activo · signoff clínico A–J · tramo K (171–180).

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
