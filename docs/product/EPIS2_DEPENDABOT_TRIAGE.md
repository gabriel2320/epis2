# EPIS2 — Triage Dependabot (PROG-DEPS-HYGIENE)

**Versión:** 1.0 · **Programa:** PROG-POST-RC3 Tramo 4 · **Tag base:** `v0.1-demo-rc3`  
**Gate:** `quality:deps-hygiene-gate` · **dependency-review CI:** report-only (RH-04)

> Decisiones de triage — no merge automático de majors sin sesión dedicada.

---

## 1. PRs abiertos (2026-06-11)

| PR | Dependencia | Decisión | Motivo |
|----|-------------|----------|--------|
| [#5](https://github.com/gabriel2320/epis2/pull/5) | zod 3 → **4.4.3** | **IGNORE major** | `PROG-ZOD4-MIGRATION` · invariante RH · `@dependabot ignore` |
| [#13](https://github.com/gabriel2320/epis2/pull/13) | actions/checkout 5 → **6** | **Defer** | Evaluar tras stack Actions v5 estable · Tramo 5 RH |
| [#17](https://github.com/gabriel2320/epis2/pull/17) | @types/node 22 → **25** | **IGNORE major** | `engines.node`: `>=20 <25` — typings 25 fuera de rango |
| [#1](https://github.com/gabriel2320/epis2/pull/1) | globals 16 → 17 | **Defer** | Major devDep · sesión dedicada + `quality:required` |
| [#2](https://github.com/gabriel2320/epis2/pull/2) | @vitejs/plugin-react 4 → 6 | **Defer** | Major devDep · impacto Vitest/Vite |
| [#3](https://github.com/gabriel2320/epis2/pull/3) | jsdom 26 → 29 | **Defer** | Major devDep · impacto tests DOM |

---

## 2. Reglas persistentes (`.github/dependabot.yml`)

| Dependencia | Regla |
|-------------|-------|
| `zod` | `ignore` semver-major → programa `PROG-ZOD4-MIGRATION` |
| `@types/node` | `ignore` versiones ≥ 25 |
| `actions/checkout` | `ignore` semver-major hasta evaluación RH |

---

## 3. Programas relacionados

| Programa | Alcance |
|----------|---------|
| **PROG-ZOD4-MIGRATION** | Migración Zod 3 → 4 en monorepo · **diferido** |
| **PROG-SECURITY-PROMOTE** (Tramo 5) | RH-09 Gitleaks blocking · RH-11 dependency-review alinear |

Referencias: [`epis2-audit-plan-post-rc3-2026.md`](../../reports/epis2-audit-plan-post-rc3-2026.md) · [`EPIS2_RELEASE_HARDENING_PLAN.md`](EPIS2_RELEASE_HARDENING_PLAN.md)

---

## 4. Verificación

```bash
npm run quality:deps-hygiene-gate
npm run quality:fast
```

---

## 5. Próximo batch devDeps (fuera de este tramo)

Cuando se autorice sesión devDeps:

1. `npm run quality:required` verde en Linux CI.
2. Merge uno a uno: globals → plugin-react → jsdom.
3. Re-ejecutar `quality:required` tras cada merge.
