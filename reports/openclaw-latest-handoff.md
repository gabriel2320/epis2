# OpenClaw EPIS2 Handoff

## Microfase
MF-OPENCLAW

## Modo
read-only-reviewer · EPIS2-native

## Agentes ejecutados
- Security/PHI Reviewer (`security`)
- Architecture/Legacy Reviewer (`architecture`)

## Generado
2026-06-11T12:03:24.985Z

## Archivos revisados
- `.env.example`
- `docs/product/PRODUCT_INVARIANTS.md`
- `scripts/legacy-audit/detect-duplicate-registries.mjs`
- `scripts/legacy-audit/detect-forbidden-dependencies.mjs`
- `scripts/legacy-audit/detect-legacy-routes.mjs`
- `scripts/legacy-audit/detect-secrets-and-sensitive-data.mjs`
- `scripts/legacy-audit/paths.mjs`
- `scripts/legacy-audit/scan-donor-repositories.mjs`
- `scripts/legacy-audit/validate-import-manifest.mjs`
- `scripts/legacy-audit/validate-quarantine.mjs`
- `docs/legacy/EPIS_POSTMORTEM.md`
- `docs/PRODUCT_CANON.md`
- `legacy-import-manifest.json`
- `docs/legacy/LEGACY_IMPORT_LEDGER.md`
- `scripts/architecture/ai-write-boundary.mjs`
- `scripts/architecture/command-center-home.mjs`
- `scripts/architecture/dev-catalog-gates.mjs`
- `scripts/architecture/explicit-permissions.mjs`
- `scripts/architecture/fhir-export-boundary.mjs`
- `scripts/architecture/human-approval-required.mjs`
- `scripts/architecture/layout-g12-gate.mjs`
- `scripts/architecture/lib/paths.mjs`
- `scripts/architecture/lib/report.mjs`
- `scripts/architecture/lib/scan-sources.mjs`

## Hallazgos críticos
- [Evolab high] admission-discharge-001-m8rs-001: 50df1d69aac96d12 (4 runs)
- [Evolab high] discharge-critical-pending-001-m8pp-006: bebd14371350f384
- [Evolab high] admission-double-booking-001-m8cx-004: f0afe0d70dada190 (3 runs)
- [Evolab high] discharge-critical-pending-001: 47934da9328984b6 (2 runs)
- [Evolab high] admission-discharge-001-m8cx-008: 36f99e24a9f862a5
- [Evolab high] admission-double-booking-001-m8cx-004: 303642d4786fe652
- [Evolab high] admission-double-booking-001-m8cx-004: 9915da53fd892db6
- [Evolab critical] admission-double-booking-001-m8cx-004: 25cfbfe37b34dcd3

## Hallazgos medios
- [Evolab medium] admission-discharge-001-m8rs-001: 68c457a21613e462 (4 runs)
- [Evolab medium] admission-discharge-001-m8cx-008: 39cf42cbd4461e5e
- [Evolab medium] role-evolution-sign-001: dd399ef1fab7dc52 (2 runs)

## Hallazgos menores
- Ninguno registrado

## Invariantes violados
- Ninguno detectado

## Comandos sugeridos
```bash
npm run check
npm run test
npm run architecture:validate
npm run check
npm run legacy:audit
npm run db:validate
npm run architecture:validate
npm run legacy:validate-manifest
npm run evolab:findings
npm run dev:evolab:sync
npm run dev:agent:ollama
```

## Prompt recomendado para Cursor
Revisa el handoff OpenClaw EPIS2 para MF-OPENCLAW. Evolab: 14 hallazgos únicos (24 registros). Ollama: Continuar con la consolidación visual y mejorar la experiencia de usuario para los formularios clínicos.. Aplica correcciones en Cursor bajo supervisión humana. No commits automáticos ni auto-aprobación clínica.

## Recomendación
Atender hallazgos Evolab críticos antes de cerrar tramo

---
*Handoff generado por `scripts/dev-agent/openclaw-handoff.mjs`. No contiene secretos cargados desde .env.*
