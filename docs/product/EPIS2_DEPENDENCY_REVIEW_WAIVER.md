# EPIS2 — Dependency review policy (RH-11)

**Versión:** 1.0 · **Programa:** PROG-POST-RC3 Tramo 5 · **Workflow:** `.github/workflows/ci-rh04-deps.yml`

> Política alineada con RH-04 report-only → **RH-11 blocking** en PRs. Waiver explícito para lo que sigue report-only.

---

## 1. Enforcement (blocking)

| Check | Alcance | Umbral |
|-------|---------|--------|
| **dependency-review** | Solo `pull_request` | `fail-on-severity: critical` |
| Job name CI | `dependency-review (blocking)` | Falla PR si introduce vuln **critical** |

**Branch protection (operador):** añadir `dependency-review (blocking)` junto a RH-09/RH-10.

---

## 2. Report-only (waiver documentado)

| Job | Motivo waiver |
|-----|----------------|
| **npm-audit-report** | Artefacto JSON para auditoría · `continue-on-error: true` · no bloquea merge |
| **RH-05 SBOM** | CycloneDX informativo · sin gate merge |

`npm audit --omit=dev` puede reportar advisories high/moderate conocidos; el **bloqueo de merge** en PRs lo hace dependency-review solo en **critical** introducidas en el diff.

---

## 3. Triage acoplado (Tramo 4)

Major bumps diferidos no pasan por dependency-review hasta abrir PR:

- Zod 4 → `PROG-ZOD4-MIGRATION` · ignore en dependabot.yml
- devDeps majors (#1–3) → sesión dedicada · [`EPIS2_DEPENDABOT_TRIAGE.md`](EPIS2_DEPENDABOT_TRIAGE.md)

---

## 4. Licencias

MIT en raíz · dependency-review **no** configura `allow-licenses` (SPDX desconocido no falla). Revisión institucional aparte si repo público amplía distribución.

---

## 5. Verificación

```bash
npm run quality:security-promote-gate
npm run tool:consolidate:verify-phase4
npm run quality:fast
```

Referencias: [`EPIS2_RELEASE_HARDENING_PLAN.md`](EPIS2_RELEASE_HARDENING_PLAN.md) · [`epis2-prog-security-promote-tramo5-rh11.md`](../../reports/epis2-prog-security-promote-tramo5-rh11.md)
