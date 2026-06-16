# PROG-RELEASE-HARDENING — RH-01…08 (tramo 1)

**Fecha:** 2026-06-16 · **Rama:** `chore/prog-release-hardening-rh01-08` · **Base:** `v0.1-demo-rc2`

## Alcance PR #13

| MF | Entrega |
|----|---------|
| RH-01 | `actions/checkout@v5`, `setup-node@v5`, Node 24 — ci.yml, nightly, experimental |
| RH-02 | CodeQL report-only workflow |
| RH-03 | Gitleaks + `.gitleaks.toml` |
| RH-04 | dependency-review + npm audit JSON artifact |
| RH-05 | CycloneDX SBOM on tags/schedule |
| RH-07 | `AUTH_MODE=demo` y hybrid sin `SERVICE_API_KEY` fail-closed en deployed |
| RH-08 | `tools/gates/release.json` + `npm run quality:release` |

## Fuera de alcance (PR #14)

- **RH-06** — 14 imports web `@epis2/test-fixtures` → bridge dinámico

## Gates

```bash
npm run quality:fast
npx vitest run apps/api/src/config.test.ts
node tools/gates/run-gate.mjs --dry-run release
```

## Riesgos

- Node 24 en CI — validado localmente en ola 2; requiere CI verde post-merge
- RH workflows report-only — no bloquean merge; revisar Security tab / artifacts

## Próximo paso

PR #14 RH-06 · promoción selectiva de RH-02/03 a blocking tras baseline
