# PROG-CONSOLIDATE ola 2 — cierre

**Fecha:** 2026-06-16 · **HEAD:** `95a0d00` · **PR final:** [#12](https://github.com/gabriel2320/epis2/pull/12)

## Entregas ola 2

| PR | MF | Resumen |
|----|-----|---------|
| [#7](https://github.com/gabriel2320/epis2/pull/7) | MF-CON-02 | Freeze + gobierno docs |
| [#8](https://github.com/gabriel2320/epis2/pull/8) | MF-CON-04/05 | Config guards + demo auth killswitch |
| [#9](https://github.com/gabriel2320/epis2/pull/9) | MF-CON-06 | HTTP baseline CSP/HSTS/CORS |
| [#10](https://github.com/gabriel2320/epis2/pull/10) | MF-CON-07 | Rate limit Redis + fail-closed |
| [#11](https://github.com/gabriel2320/epis2/pull/11) | MF-CON-03/11 | Gobierno monorepo + CI tiers |
| [#12](https://github.com/gabriel2320/epis2/pull/12) | MF-CON-09/10 | Fixtures prod + legal raíz |

## MF-CON-09 (PR #12)

- `@epis2/test-fixtures` → `devDependencies` en `apps/api`
- Identificadores sintéticos en `@epis2/clinical-domain`
- `stableSimCaseUuids` en `@epis2/clinical-domain/node` (no barrel web)
- Gate `no-test-fixtures-in-prod`

## MF-CON-10 (PR #12)

- `LICENSE`, `SECURITY.md`, `DISCLAIMER.md`, `CONTRIBUTING.md`
- Validación en `monorepo-governance`

## CI

Run verde post-fix web build: [27585415223](https://github.com/gabriel2320/epis2/actions/runs/27585415223)

Fix incluido en #12: subpath `./node` para evitar `node:crypto` en bundle Vite.

## Pendiente humano

- Revisión legal de `DISCLAIMER.md` y `LICENSE` antes de uso público/comercial.

## Gates recomendados post-cierre

```bash
npm run tool:consolidate:verify-phase4
npm run quality:nightly   # paridad opcional
```

## Próximo paso producto

Congelamiento vigente ([`CONSOLIDATION_FREEZE.md`](../docs/CONSOLIDATION_FREEZE.md)). Sin MF-CON pendientes en plan ola 2. Esperar instrucción para nuevo programa o MF clínica autorizada.
